// onp_spot.h -- C++ port of Sources/BDONImmersiveHome/Render/Spot.swift and the
// slice of SpotCatalog needed at runtime. Parses spot.json + spots/index.json
// via nlohmann/json and reproduces the Spot camera math exactly.

#pragma once

#include <cstdint>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

#include "onp_math.h"
#include "../third_party/json.hpp"

namespace onp {

using json = nlohmann::json;

struct SpotSituation {
    Vec3 originalOffset;
    Vec3 defaultPositionOffset;
    float orbitRatio = 1;
    float fieldOfView = 19;
    float maxLeftShift = 0, maxRightShift = 0, maxUpShift = 0, maxDownShift = 0;
    Vec3 backgroundPosition;
    Vec3 backgroundRotation;
    Vec3 backgroundScale{1, 1, 1};
};

struct UnityTransform {
    Vec3 localPosition;
    Quat localRotation;      // x,y,z,w
    Vec3 localScale{1, 1, 1};
};

struct SpotCharacter {
    std::string name;
    std::string skeleton;
    std::string atlas;
    float scale = 1;
    float world[16];         // column-major Unity matrix
    std::string animation;   // empty == none
    bool loop = false;
    int order = 0;
};

struct SpotCamera {
    float nearZ = 0.3f;
    float farZ = 1000.0f;
    float fieldOfView = 19.0f;
};

// Edge-coverage zoom per aspect (cover.json, Coverage.swift `--coverage`).
// Empty = no zoom.
struct CoverTable {
    std::vector<float> aspects;
    std::vector<float> zoom;

    // The smaller of the two bracketing samples (never less zoom than a neighbour).
    float zoomFor(float aspect) const {
        if (aspects.empty() || aspects.size() != zoom.size()) {
            return 1.0f;
        }
        if (aspect <= aspects.front()) {
            return zoom.front();
        }
        if (aspect >= aspects.back()) {
            return zoom.back();
        }
        size_t upper = 1;
        while (aspects[upper] < aspect) {
            ++upper;
        }
        return std::fmin(zoom[upper - 1], zoom[upper]);
    }
};

struct SpotData {
    std::string name;
    SpotSituation situation;
    SpotCamera camera;
    UnityTransform roomRoot;
    std::vector<bool> roomNodes;
    std::vector<SpotCharacter> characters;
    CoverTable cover;
};

// ---- JSON helpers ----

inline Vec3 readVec3(const json& j) {
    return {j.at("x").get<float>(), j.at("y").get<float>(), j.at("z").get<float>()};
}

inline std::string readFile(const std::string& path) {
    std::ifstream f(path, std::ios::binary);
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

inline SpotData parseSpotData(const json& j) {
    SpotData d;
    d.name = j.value("name", std::string());

    const json& s = j.at("situation");
    d.situation.originalOffset = readVec3(s.at("originalOffset"));
    d.situation.defaultPositionOffset = readVec3(s.at("defaultPositionOffset"));
    d.situation.orbitRatio = s.at("orbitRatio").get<float>();
    d.situation.fieldOfView = s.at("fieldOfView").get<float>();
    d.situation.maxLeftShift = s.at("maxLeftShift").get<float>();
    d.situation.maxRightShift = s.at("maxRightShift").get<float>();
    d.situation.maxUpShift = s.at("maxUpShift").get<float>();
    d.situation.maxDownShift = s.at("maxDownShift").get<float>();
    d.situation.backgroundPosition = readVec3(s.at("backgroundPosition"));
    d.situation.backgroundRotation = readVec3(s.at("backgroundRotation"));
    d.situation.backgroundScale = readVec3(s.at("backgroundScale"));

    const json& c = j.at("camera");
    d.camera.nearZ = c.at("near").get<float>();
    d.camera.farZ = c.at("far").get<float>();
    d.camera.fieldOfView = c.at("fieldOfView").get<float>();

    const json& r = j.at("roomRoot");
    d.roomRoot.localPosition = readVec3(r.at("localPosition"));
    const json& rq = r.at("localRotation");
    d.roomRoot.localRotation = {rq.at("x").get<float>(), rq.at("y").get<float>(),
                                rq.at("z").get<float>(), rq.at("w").get<float>()};
    d.roomRoot.localScale = readVec3(r.at("localScale"));

    for (const auto& b : j.at("roomNodes")) d.roomNodes.push_back(b.get<bool>());

    for (const auto& ch : j.at("characters")) {
        SpotCharacter sc;
        sc.name = ch.at("name").get<std::string>();
        sc.skeleton = ch.at("skeleton").get<std::string>();
        sc.atlas = ch.at("atlas").get<std::string>();
        sc.scale = ch.at("scale").get<float>();
        const auto& w = ch.at("world");
        for (int i = 0; i < 16; ++i) sc.world[i] = w[i].get<float>();
        sc.animation = ch.value("animation", std::string());
        sc.loop = ch.value("loop", false);
        sc.order = ch.value("order", 0);
        d.characters.push_back(std::move(sc));
    }
    return d;
}

inline SpotData loadSpotData(const std::string& spotJsonPath) {
    return parseSpotData(json::parse(readFile(spotJsonPath)));
}

// cover.json next to spot.json; a missing or malformed file means no zoom.
inline CoverTable loadCoverTable(const std::string& coverJsonPath) {
    CoverTable t;
    std::string text = readFile(coverJsonPath);
    if (text.empty()) {
        return t;
    }
    json j = json::parse(text, nullptr, false);
    if (j.is_discarded()) {
        return t;
    }
    for (const auto& a : j.value("aspects", json::array())) t.aspects.push_back(a.get<float>());
    for (const auto& z : j.value("zoom", json::array())) t.zoom.push_back(z.get<float>());
    return t;
}

// ---- roomMatrix (Spot.swift) ----

// SpotSceneRoot.SetObject: background matrix with the room file's baked root taken out.
inline Mat4 roomMatrix(const SpotData& data) {
    const SpotSituation& s = data.situation;
    Mat4 background = compose(s.backgroundPosition, eulerYXZ(s.backgroundRotation), s.backgroundScale);
    const UnityTransform& root = data.roomRoot;
    Mat4 baked = compose(root.localPosition, root.localRotation, root.localScale);
    Mat4 mz = mirrorZ();
    return mz * (background * inverse(baked)) * mz;
}

// ---- Camera (web/src/spot-camera.ts, via Spot.swift) ----

struct SpotPose {
    Vec3 position;     // Unity space
    Vec3 forward;
    float yaw = 0;
    float pitch = 0;
    float fov = 0;
};

constexpr float kWideAspect = 19.5f / 9.0f;
constexpr float kMaxFitFov = 32.0f;

inline float fitFov(const SpotSituation& s, float width, float height) {
    float half = std::tan(s.fieldOfView * kDeg / 2.0f) * kWideAspect * (height / std::fmax(width, 1.0f));
    return std::fmin(kMaxFitFov, std::fmax(s.fieldOfView, 2.0f * std::atan(half) / kDeg));
}

inline SpotPose defaultPose(const SpotSituation& s, float fov) {
    Vec3 forward = normalize(s.originalOffset - s.defaultPositionOffset);
    Vec3 position = s.defaultPositionOffset - forward * s.orbitRatio;
    SpotPose p;
    p.position = position;
    p.forward = forward;
    p.fov = fov;
    return p;
}

inline SpotPose shiftedPose(const SpotPose& base, float px, float py, const SpotSituation& s, float aspect) {
    float extraV = std::fmax(0.0f, (base.fov - s.fieldOfView) / 2.0f);
    auto halfH = [](float fov, float a) { return std::atan(std::tan(fov * kDeg / 2.0f) * a) / kDeg; };
    float extraH = std::fmax(0.0f, halfH(base.fov, aspect) - halfH(s.fieldOfView, kWideAspect));
    auto limit = [](float m, float e) { return std::fmax(0.0f, m - e); };
    SpotPose pose = base;
    pose.yaw = px >= 0 ? px * limit(s.maxRightShift, extraH) : px * limit(s.maxLeftShift, extraH);
    pose.pitch = py >= 0 ? py * limit(s.maxUpShift, extraV) : py * limit(s.maxDownShift, extraV);
    return pose;
}

inline Vec3 lookDirection(const SpotPose& pose) {
    Vec3 f = normalize(pose.forward);
    float yaw = std::atan2(f.x, f.z) + pose.yaw * kDeg;
    float pitch = std::asin(std::fmax(-1.0f, std::fmin(1.0f, f.y))) + pose.pitch * kDeg;
    return {std::sin(yaw) * std::cos(pitch), std::sin(pitch), std::cos(yaw) * std::cos(pitch)};
}

inline Vec3 rightHanded(const Vec3& v) { return {v.x, v.y, -v.z}; }

// Convenience: build the (view, projection) pair the renderer uses.
// Mirrors WallpaperController/Snapshot: camera position + look direction in RH
// space, RH lookAt, RH perspective at fitFov.
struct CameraMatrices {
    Mat4 view;
    Mat4 projection;
    Mat4 sortViewProjection;   // same camera without cursor parallax (transparent sort)
    float fov = 0;
};

inline CameraMatrices spotCamera(const SpotData& data, float width, float height,
                                 float px = 0, float py = 0) {
    const SpotSituation& s = data.situation;
    float fov = fitFov(s, width, height);
    SpotPose base = defaultPose(s, fov);
    float aspect = width / height;
    // Zoom in just enough that the frame edge never runs past the room. Only
    // the lens narrows: the cursor turn range stays the unzoomed one.
    float zoomedFov = 2.0f * std::atan(std::tan(fov * kDeg / 2.0f) * data.cover.zoomFor(aspect)) / kDeg;
    auto viewOf = [](const SpotPose& p) {
        Vec3 eye = rightHanded(p.position);
        Vec3 dir = rightHanded(lookDirection(p));
        return lookAt(eye, eye + dir);
    };

    CameraMatrices out;
    out.view = viewOf(shiftedPose(base, px, py, s, aspect));
    out.projection = perspective(zoomedFov, aspect, data.camera.nearZ, data.camera.farZ);
    out.sortViewProjection = out.projection * viewOf(shiftedPose(base, 0, 0, s, aspect));
    out.fov = zoomedFov;
    return out;
}

// ---- Spot catalog entry (spots/index.json) ----

struct SpotIndexEntry {
    std::string id;
    std::string name;   // Korean title
    std::string band;
    std::string room;
    std::string dir;    // "<room>/<id>"
    std::vector<std::string> characters;
};

inline std::vector<SpotIndexEntry> loadSpotIndex(const std::string& indexJsonPath) {
    json j = json::parse(readFile(indexJsonPath));
    std::vector<SpotIndexEntry> out;
    for (const auto& e : j) {
        SpotIndexEntry s;
        s.id = e.at("id").get<std::string>();
        s.name = e.value("name", std::string());
        s.band = e.value("band", std::string());
        s.room = e.value("room", std::string());
        s.dir = e.value("dir", std::string());
        for (const auto& c : e.value("characters", json::array()))
            s.characters.push_back(c.get<std::string>());
        out.push_back(std::move(s));
    }
    return out;
}

} // namespace onp
