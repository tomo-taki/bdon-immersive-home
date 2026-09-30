// gl_texture.cpp -- see gl_texture.h. Port of onp_texture.cpp to GLES3.
#include "gl_texture.h"

#include <algorithm>
#include <utility>

#define STB_IMAGE_IMPLEMENTATION
#define STBI_ONLY_PNG
#define STBI_ONLY_JPEG
#include "third_party/stb_image.h"

namespace onp {

// Straight alpha -> premultiplied (CoreGraphics premultipliedLast), byte-for-byte
// identical to onp_texture.cpp so residents/room look the same as every build.
static void premultiplyInto(const unsigned char* pixels, int w, int h,
                            std::vector<uint8_t>& out) {
    out.resize((size_t)w * h * 4);
    for (size_t i = 0; i < (size_t)w * h; ++i) {
        uint32_t a = pixels[i * 4 + 3];
        out[i * 4 + 0] = (uint8_t)((pixels[i * 4 + 0] * a + 127) / 255);
        out[i * 4 + 1] = (uint8_t)((pixels[i * 4 + 1] * a + 127) / 255);
        out[i * 4 + 2] = (uint8_t)((pixels[i * 4 + 2] * a + 127) / 255);
        out[i * 4 + 3] = (uint8_t)a;
    }
}

bool decodePremultiplied(const uint8_t* bytes, int byteCount,
                         std::vector<uint8_t>& outRgba, int& outW, int& outH) {
    int w = 0, h = 0, comp = 0;
    unsigned char* pixels = stbi_load_from_memory(bytes, byteCount, &w, &h, &comp, 4);
    if (!pixels) return false;
    outW = w;
    outH = h;
    premultiplyInto(pixels, w, h, outRgba);
    stbi_image_free(pixels);
    return true;
}

GLuint createTexture(const uint8_t* rgba, int w, int h, bool mipmapped) {
    // Build the mip chain on the CPU with the same 2x2 box filter as the D3D
    // path (a premultiplied-space average). glGenerateMipmap would also work,
    // but the explicit chain keeps the exact filtering across all builds.
    std::vector<std::vector<uint8_t>> levels;
    std::vector<std::pair<int, int>> sizes;
    levels.emplace_back(rgba, rgba + (size_t)w * h * 4);
    sizes.emplace_back(w, h);
    while (mipmapped && (sizes.back().first > 1 || sizes.back().second > 1)) {
        const auto& src = levels.back();
        int sw = sizes.back().first, sh = sizes.back().second;
        int dw = std::max(1, sw / 2), dh = std::max(1, sh / 2);
        std::vector<uint8_t> dst((size_t)dw * dh * 4);
        for (int y = 0; y < dh; ++y) {
            for (int x = 0; x < dw; ++x) {
                int x0 = std::min(sw - 1, x * 2), x1 = std::min(sw - 1, x * 2 + 1);
                int y0 = std::min(sh - 1, y * 2), y1 = std::min(sh - 1, y * 2 + 1);
                for (int c = 0; c < 4; ++c) {
                    unsigned sum = src[((size_t)y0 * sw + x0) * 4 + c] + src[((size_t)y0 * sw + x1) * 4 + c]
                                 + src[((size_t)y1 * sw + x0) * 4 + c] + src[((size_t)y1 * sw + x1) * 4 + c];
                    dst[((size_t)y * dw + x) * 4 + c] = (uint8_t)((sum + 2) / 4);
                }
            }
        }
        levels.push_back(std::move(dst));
        sizes.emplace_back(dw, dh);
    }

    GLuint tex = 0;
    glGenTextures(1, &tex);
    if (!tex) return 0;
    glBindTexture(GL_TEXTURE_2D, tex);
    glPixelStorei(GL_UNPACK_ALIGNMENT, 4);

    // Plain RGBA8 (not SRGB8_ALPHA8): blending and the CSS filter run on the
    // stored sRGB-encoded values, exactly like the Metal rgba8Unorm / WebGL
    // builds. An sRGB sampler would linearise and darken every texel.
    for (size_t i = 0; i < levels.size(); ++i) {
        glTexImage2D(GL_TEXTURE_2D, (GLint)i, GL_RGBA8, sizes[i].first, sizes[i].second,
                     0, GL_RGBA, GL_UNSIGNED_BYTE, levels[i].data());
    }
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAX_LEVEL, (GLint)levels.size() - 1);

    if (mipmapped) {
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    } else {
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    }
    glBindTexture(GL_TEXTURE_2D, 0);
    return tex;
}

GLuint texFromBytes(const uint8_t* bytes, int byteCount, bool mipmapped) {
    std::vector<uint8_t> rgba;
    int w = 0, h = 0;
    if (!decodePremultiplied(bytes, byteCount, rgba, w, h)) return 0;
    return createTexture(rgba.data(), w, h, mipmapped);
}

GLuint texFromFile(const char* path, bool mipmapped, int* outW, int* outH) {
    int w = 0, h = 0, comp = 0;
    unsigned char* pixels = stbi_load(path, &w, &h, &comp, 4);
    if (!pixels) return 0;
    std::vector<uint8_t> rgba;
    premultiplyInto(pixels, w, h, rgba);
    stbi_image_free(pixels);
    if (outW) *outW = w;
    if (outH) *outH = h;
    return createTexture(rgba.data(), w, h, mipmapped);
}

} // namespace onp
