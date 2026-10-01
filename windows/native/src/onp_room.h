// onp_room.h -- C++ port of the glTF loader in Room.swift. Reads the Spot
// room.glb: KHR_materials_unlit, embedded images, float POSITION/TEXCOORD_0,
// u8/u16/u32 indices, node TRS or matrix. Vertices are baked into world space
// at load time (the room never moves), exactly as loadRoom() does.
//
// Texture decoding (stb_image) and GPU upload live in the D3D layer; this
// header produces the CPU-side geometry + per-mesh metadata, so the host test
// can count meshes with the identical traversal logic and no GPU.

#pragma once

#include <cmath>
#include <cstdint>
#include <cstring>
#include <fstream>
#include <functional>
#include <iterator>
#include <limits>
#include <stdexcept>
#include <string>
#include <vector>

#include "onp_math.h"
#include "../third_party/json.hpp"

namespace onp {

struct RoomVertex {
    Vec3 position;
    Vec2 uv;
};

struct RoomMesh {
    int firstIndex = 0;
    int indexCount = 0;
    bool transparent = false;
    int texture = 0;       // index into image list
    Vec3 center;           // world-space bounds centre (transparent sort)
};

// One decoded image page (raw compressed bytes, decoded later by the GPU layer).
struct RoomImageBlob {
    std::vector<uint8_t> bytes;  // PNG/JPEG bytes from the bufferView
};

struct Room {
    std::vector<RoomVertex> vertices;
    std::vector<uint32_t> indices;
    std::vector<RoomMesh> meshes;
    std::vector<RoomImageBlob> images;   // parallel to gltf images
};

// Reads little-endian u32 at byte offset.
inline uint32_t leU32(const uint8_t* p, size_t at) {
    uint32_t v;
    std::memcpy(&v, p + at, 4);
    return v;
}
inline uint16_t leU16(const uint8_t* p, size_t at) {
    uint16_t v;
    std::memcpy(&v, p + at, 2);
    return v;
}
inline float leF32(const uint8_t* p, size_t at) {
    float v;
    std::memcpy(&v, p + at, 4);
    return v;
}

// Parse GLB from raw bytes into a Room. `root` is the world root (roomMatrix),
// `visible` is data.roomNodes (a hidden node hides its whole subtree).
inline Room loadRoomFromBytes(const std::vector<uint8_t>& data, const Mat4& root,
                              const std::vector<bool>& visible) {
    using json = nlohmann::json;
    if (data.size() <= 20 || leU32(data.data(), 0) != 0x46546C67u)
        throw std::runtime_error("not glb");

    uint32_t jsonLength = leU32(data.data(), 12);
    size_t binStart = 20 + (size_t)jsonLength + 8;
    if (binStart > data.size()) throw std::runtime_error("glb truncated");
    std::string jsonText(reinterpret_cast<const char*>(data.data() + 20), jsonLength);
    json gltf = json::parse(jsonText);
    const uint8_t* bin = data.data() + binStart;
    size_t binLen = data.size() - binStart;

    // `count` elements of `size` bytes, `stride` apart from `base`, must lie
    // inside the BIN chunk: a damaged file throws instead of reading past it.
    auto checkRange = [&](size_t base, size_t count, size_t stride, size_t size) {
        if (count == 0) return;
        if (base > binLen || size > binLen - base ||
            (stride && count - 1 > (binLen - base - size) / stride))
            throw std::runtime_error("glb buffer out of range");
    };

    const json& bufferViews = gltf.at("bufferViews");
    const json& accessors = gltf.at("accessors");

    auto viewOffset = [&](int index) -> size_t {
        return bufferViews[index].value("byteOffset", 0);
    };
    auto viewLength = [&](int index) -> size_t {
        return bufferViews[index].at("byteLength").get<size_t>();
    };
    auto viewStride = [&](int index, int fallback) -> size_t {
        return bufferViews[index].value("byteStride", fallback);
    };

    // Read float accessor with `components` per element.
    auto floats = [&](int accessorIndex, int components) -> std::vector<float> {
        const json& acc = accessors[accessorIndex];
        int viewIndex = acc.at("bufferView").get<int>();
        size_t stride = viewStride(viewIndex, components * 4);
        size_t base = viewOffset(viewIndex) + acc.value("byteOffset", 0);
        size_t count = acc.at("count").get<size_t>();
        checkRange(base, count, stride, (size_t)components * 4);
        std::vector<float> out(count * components);
        for (size_t i = 0; i < count; ++i)
            for (int cc = 0; cc < components; ++cc)
                out[i * components + cc] = leF32(bin, base + i * stride + cc * 4);
        return out;
    };

    auto indexList = [&](int accessorIndex) -> std::vector<uint32_t> {
        const json& acc = accessors[accessorIndex];
        int viewIndex = acc.at("bufferView").get<int>();
        size_t base = viewOffset(viewIndex) + acc.value("byteOffset", 0);
        int componentType = acc.at("componentType").get<int>();
        size_t count = acc.at("count").get<size_t>();
        size_t size = componentType == 5121 ? 1 : componentType == 5123 ? 2 : 4;
        checkRange(base, count, size, size);
        std::vector<uint32_t> out(count);
        for (size_t i = 0; i < count; ++i) {
            switch (componentType) {
                case 5121: out[i] = bin[base + i]; break;               // u8
                case 5123: out[i] = leU16(bin, base + i * 2); break;    // u16
                default:   out[i] = leU32(bin, base + i * 4); break;    // u32
            }
        }
        return out;
    };

    Room room;

    // Images: keep raw bytes; the GPU layer decodes them with stb_image.
    if (gltf.contains("images")) {
        for (const auto& img : gltf.at("images")) {
            RoomImageBlob blob;
            if (img.contains("bufferView")) {
                int v = img.at("bufferView").get<int>();
                size_t off = viewOffset(v), len = viewLength(v);
                checkRange(off, 1, 0, len);
                blob.bytes.assign(bin + off, bin + off + len);
            } else {
                throw std::runtime_error("external image");
            }
            room.images.push_back(std::move(blob));
        }
    }

    const json& nodes = gltf.at("nodes");
    const json& meshes = gltf.at("meshes");
    const json* materials = gltf.contains("materials") ? &gltf.at("materials") : nullptr;
    const json* textures = gltf.contains("textures") ? &gltf.at("textures") : nullptr;

    auto localMatrix = [&](const json& node) -> Mat4 {
        if (node.contains("matrix")) {
            float m[16];
            for (int i = 0; i < 16; ++i) m[i] = node.at("matrix")[i].get<float>();
            return Mat4::columnMajor(m);
        }
        Vec3 t{0, 0, 0};
        if (node.contains("translation")) {
            const auto& a = node.at("translation");
            t = {a[0].get<float>(), a[1].get<float>(), a[2].get<float>()};
        }
        Quat r; // identity
        if (node.contains("rotation")) {
            const auto& a = node.at("rotation");
            r = {a[0].get<float>(), a[1].get<float>(), a[2].get<float>(), a[3].get<float>()};
        }
        Vec3 s{1, 1, 1};
        if (node.contains("scale")) {
            const auto& a = node.at("scale");
            s = {a[0].get<float>(), a[1].get<float>(), a[2].get<float>()};
        }
        return compose(t, r, s);
    };

    // Recursive visit. A hidden node hides its whole subtree.
    std::function<void(int, const Mat4&)> visit = [&](int index, const Mat4& parent) {
        if (index < (int)visible.size() && !visible[index]) return;
        const json& node = nodes[index];
        Mat4 world = parent * localMatrix(node);

        if (node.contains("mesh")) {
            int meshIndex = node.at("mesh").get<int>();
            for (const auto& prim : meshes[meshIndex].at("primitives")) {
                const json& attrs = prim.at("attributes");
                if (!attrs.contains("POSITION") || !attrs.contains("TEXCOORD_0")) continue;
                std::vector<float> positions = floats(attrs.at("POSITION").get<int>(), 3);
                std::vector<float> uvs = floats(attrs.at("TEXCOORD_0").get<int>(), 2);
                size_t count = positions.size() / 3;

                bool transparent = false;
                int textureRef = 0;
                if (prim.contains("material") && materials) {
                    const json& mat = (*materials)[prim.at("material").get<int>()];
                    if (mat.contains("name")) {
                        std::string name = mat.at("name").get<std::string>();
                        const std::string suffix = "_transparent";
                        transparent = name.size() >= suffix.size() &&
                                      name.compare(name.size() - suffix.size(), suffix.size(), suffix) == 0;
                    }
                    if (mat.contains("pbrMetallicRoughness")) {
                        const json& pbr = mat.at("pbrMetallicRoughness");
                        if (pbr.contains("baseColorTexture"))
                            textureRef = pbr.at("baseColorTexture").at("index").get<int>();
                    }
                }
                int image = 0;
                if (textures && textureRef < (int)textures->size() &&
                    (*textures)[textureRef].contains("source"))
                    image = (*textures)[textureRef].at("source").get<int>();

                Vec3 low{std::numeric_limits<float>::infinity(), std::numeric_limits<float>::infinity(), std::numeric_limits<float>::infinity()};
                Vec3 high{-std::numeric_limits<float>::infinity(), -std::numeric_limits<float>::infinity(), -std::numeric_limits<float>::infinity()};
                uint32_t base = (uint32_t)room.vertices.size();
                for (size_t i = 0; i < count; ++i) {
                    Vec3 p{positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]};
                    low = vmin(low, p);
                    high = vmax(high, p);
                    Vec4 w = mul(world, Vec4(p, 1));
                    room.vertices.push_back({{w.x, w.y, w.z}, {uvs[i * 2], uvs[i * 2 + 1]}});
                }
                std::vector<uint32_t> local;
                if (prim.contains("indices")) {
                    local = indexList(prim.at("indices").get<int>());
                } else {
                    local.resize(count);
                    for (size_t i = 0; i < count; ++i) local[i] = (uint32_t)i;
                }
                int first = (int)room.indices.size();
                for (uint32_t v : local) room.indices.push_back(v + base);
                Vec4 c = mul(world, Vec4((low + high) * 0.5f, 1));
                RoomMesh rm;
                rm.firstIndex = first;
                rm.indexCount = (int)local.size();
                rm.transparent = transparent;
                rm.texture = image;
                rm.center = {c.x, c.y, c.z};
                room.meshes.push_back(rm);
            }
        }
        if (node.contains("children"))
            for (const auto& ch : node.at("children"))
                visit(ch.get<int>(), world);
    };

    const json& scenes = gltf.at("scenes");
    int sceneIndex = gltf.value("scene", 0);
    if (scenes[sceneIndex].contains("nodes"))
        for (const auto& n : scenes[sceneIndex].at("nodes"))
            visit(n.get<int>(), root);

    return room;
}

inline std::vector<uint8_t> readFileBytes(const std::string& path) {
    std::ifstream f(path, std::ios::binary);
    return std::vector<uint8_t>((std::istreambuf_iterator<char>(f)),
                                std::istreambuf_iterator<char>());
}

inline Room loadRoom(const std::string& glbPath, const Mat4& root, const std::vector<bool>& visible) {
    return loadRoomFromBytes(readFileBytes(glbPath), root, visible);
}

} // namespace onp
