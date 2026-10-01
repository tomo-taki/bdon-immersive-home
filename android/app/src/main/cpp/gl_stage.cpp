// gl_stage.cpp -- see gl_stage.h. Port of onp_stage.cpp to GLES3. The SlotNames
// rules and the advance()/applyVisibility() bodies are copied verbatim from the
// D3D build; only the GPU-resource handling (buffers, textures, bridge) is GL.
#include "gl_stage.h"

#include <cstring>
#include <regex>
#include <random>
#include <stdexcept>

#include "gl_texture.h"

namespace onp {

// ---- SlotNames (Stage.swift), ECMAScript regex -- copied verbatim ----

namespace SlotNames {

static const std::vector<std::pair<std::string, std::vector<std::string>>> kMemberTokens = {
    {"anon", {"anon", "\xe6\x84\x9b\xe9\x9f\xb3"}},   // 愛音
    {"rana", {"rana", "\xe6\xa5\xbd\xe5\xa5\x88"}},   // 楽奈
    {"soyo", {"soyo", "\xe3\x81\x9d\xe3\x82\x88"}},   // そよ
    {"taki", {"taki", "\xe7\xab\x8b\xe5\xb8\x8c"}},   // 立希
    {"tomori", {"tomori", "\xe7\x87\x88"}},           // 燈
};

static std::string lower(const std::string& s) {
    std::string o = s;
    for (auto& ch : o) if (ch >= 'A' && ch <= 'Z') ch = ch - 'A' + 'a';
    return o;
}

static bool containsAny(const std::string& hay, const std::vector<std::string>& needles) {
    for (const auto& n : needles) if (hay.find(n) != std::string::npos) return true;
    return false;
}

std::vector<std::string> members(const std::string& name) {
    std::string low = lower(name);
    std::vector<std::string> out;
    for (const auto& kv : kMemberTokens) if (containsAny(low, kv.second)) out.push_back(kv.first);
    return out;
}

static const std::vector<std::string> kPeople = {
    "tomori","taki","anon","soyo","rana","\xe7\x87\x88","\xe7\xab\x8b\xe5\xb8\x8c","\xe6\x84\x9b\xe9\x9f\xb3","\xe3\x81\x9d\xe3\x82\x88","\xe6\xa5\xbd\xe5\xa5\x88",
    "sakiko","uika","mutsumi","umiri","nyamu","\xe7\xa5\xa5\xe5\xad\x90","\xe5\x88\x9d\xe8\x8f\xaf","\xe7\x9d\xa6","\xe6\xb5\xb7\xe9\x88\xb4","\xe3\x81\xab\xe3\x82\x83\xe3\x82\x80",
    "nonoka","arare","miyako","yuno","ritsu","manager","marukun",
    "houka","hotaru","mahoro","natsume","nagi","kanata",
    "raika","chieri","yomogi","miku","shizuku",
};

static const std::regex kPropAlways(
    "chair|armrest|sofa|door|handrail|menu|coaster|teaset|komono|bucket|balcony|_item|(^|_)pc(_|$)");
static const std::regex kShadow("shadow|syadow|wipe");
static const std::regex kProp(
    "table(?!t)|stall|bench|stage|dish|(^|_)bg(\\d|_|$)|(^|_)ef_\\d|smoke");

static bool matches(const std::regex& re, const std::string& text) {
    return std::regex_search(text, re);
}

bool isPerson(const std::string& name) {
    std::string low = lower(name);
    for (const auto& p : kPeople) if (low.find(p) != std::string::npos) return true;
    return false;
}

bool isProp(const std::string& name) {
    std::string low = lower(name);
    return matches(kPropAlways, low) || (!matches(kShadow, low) && matches(kProp, low));
}

} // namespace SlotNames

// ---- Spine texture bridge (Stage.swift TextureBridge) ----
// A decoded atlas page becomes a GLuint texture id packed into the void* the
// bridge stores. Atlas pages are never mipmapped (mimics the D3D build).

void installSpineTextureBridge() {
    sb_texture_load = [](const char* path, int* w, int* h) -> void* {
        if (!path) return nullptr;
        int tw = 0, th = 0;
        GLuint tex = texFromFile(path, /*mipmapped=*/false, &tw, &th);
        if (!tex) return nullptr;
        if (w) *w = tw;
        if (h) *h = th;
        return (void*)(uintptr_t)tex;
    };
    sb_texture_release = [](void* tex) {
        GLuint id = (GLuint)(uintptr_t)tex;
        if (id) glDeleteTextures(1, &id);
    };
}

// ---- Resident helpers (verbatim from onp_stage.cpp) ----

static Resident makeResident(const SpotCharacter& ch, SBDrawable* drawable, const Mat4& model,
                             const std::string& animation) {
    Resident r;
    r.character = ch;
    r.drawable = drawable;
    r.model = model;
    r.animation = animation;
    int count = sb_slot_count(drawable);
    for (int i = 0; i < count; ++i) r.slotNames.push_back(sb_slot_name(drawable, i));

    bool person = SlotNames::isPerson(ch.name);
    if (!person) for (const auto& n : r.slotNames) if (SlotNames::isPerson(n)) { person = true; break; }
    if (person)
        for (int i = 0; i < count; ++i)
            if (!SlotNames::isProp(r.slotNames[i])) r.personSlots.push_back((int32_t)i);
    r.hasProps = (int)r.personSlots.size() < count;
    return r;
}

// ---- Stage ----

Stage::Stage(const std::string& spotsDir, const std::string& dir) : dir(dir) {
    std::string spotDir = spotsDir + "/" + dir;
    data = loadSpotData(spotDir + "/spot.json");
    data.cover = loadCoverTable(spotDir + "/cover.json");

    std::string roomFolder = dir.substr(0, dir.find('/'));
    std::string glb = spotsDir + "/" + roomFolder + "/room.glb";
    room = loadRoom(glb, roomMatrix(data), data.roomNodes);

    // Room GPU buffers (immutable-equivalent: STATIC_DRAW).
    glGenBuffers(1, &roomVBO);
    glBindBuffer(GL_ARRAY_BUFFER, roomVBO);
    glBufferData(GL_ARRAY_BUFFER,
                 (GLsizeiptr)std::max<size_t>(1, room.vertices.size()) * sizeof(RoomVertex),
                 room.vertices.empty() ? nullptr : room.vertices.data(), GL_STATIC_DRAW);

    glGenBuffers(1, &roomIBO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, roomIBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                 (GLsizeiptr)std::max<size_t>(1, room.indices.size()) * sizeof(uint32_t),
                 room.indices.empty() ? nullptr : room.indices.data(), GL_STATIC_DRAW);

    // Room textures (mipmapped), decoded from the GLB image blobs.
    for (const auto& img : room.images) {
        GLuint tex = texFromBytes(img.bytes.data(), (int)img.bytes.size(), /*mipmapped=*/true);
        roomTextures.push_back(tex);
    }
    if (roomTextures.empty()) roomTextures.push_back(0);

    // Dynamic spine buffers (re-uploaded per resident per frame).
    glGenBuffers(1, &spineVBO);
    glGenBuffers(1, &spineIBO);

    // Residents (verbatim from onp_stage.cpp).
    for (const auto& ch : data.characters) {
        SBAtlas* atlas = nullptr;
        auto found = atlases.find(ch.atlas);
        if (found == atlases.end()) {
            atlas = sb_atlas_load((spotDir + "/" + ch.atlas).c_str());
            atlases[ch.atlas] = atlas;
        } else {
            atlas = found->second;
        }
        if (!atlas) throw std::runtime_error("atlas " + ch.atlas);

        char error[256] = {0};
        SBDrawable* drawable = sb_create(atlas, (spotDir + "/" + ch.skeleton).c_str(),
                                         ch.scale, error, (int)sizeof(error));
        if (!drawable) throw std::runtime_error(ch.skeleton + ": " + error);

        std::string animation;
        if (!ch.animation.empty() && sb_set_animation(drawable, ch.animation.c_str(), ch.loop ? 1 : 0) == 1)
            animation = ch.animation;

        residents.push_back(makeResident(ch, drawable, unityMatrix(ch.world), animation));
    }
}

Stage::~Stage() {
    for (auto& r : residents) if (r.drawable) sb_dispose(r.drawable);
    residents.clear();
    for (auto& kv : atlases) if (kv.second) sb_atlas_dispose(kv.second);  // releases page textures
    for (GLuint tex : roomTextures) if (tex) glDeleteTextures(1, &tex);
    if (roomVBO) glDeleteBuffers(1, &roomVBO);
    if (roomIBO) glDeleteBuffers(1, &roomIBO);
    if (spineVBO) glDeleteBuffers(1, &spineVBO);
    if (spineIBO) glDeleteBuffers(1, &spineIBO);
}

void Stage::bindRoomArrays() {
    glBindBuffer(GL_ARRAY_BUFFER, roomVBO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, roomIBO);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(RoomVertex), (const void*)0);
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, sizeof(RoomVertex), (const void*)12);
    glDisableVertexAttribArray(2);
    glDisableVertexAttribArray(3);
}

void Stage::bindSpineArrays(const SBVertex* verts, int vc, const uint32_t* idx, int ic) {
    glBindBuffer(GL_ARRAY_BUFFER, spineVBO);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)vc * sizeof(SBVertex), verts, GL_STREAM_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, spineIBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizeiptr)ic * sizeof(uint32_t), idx, GL_STREAM_DRAW);
    // SBVertex: x,y (pos) @0, u,v @8, light rgba @16, dark rgb @32.
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, sizeof(SBVertex), (const void*)0);
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, sizeof(SBVertex), (const void*)8);
    glEnableVertexAttribArray(2);
    glVertexAttribPointer(2, 4, GL_FLOAT, GL_FALSE, sizeof(SBVertex), (const void*)16);
    glEnableVertexAttribArray(3);
    glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, sizeof(SBVertex), (const void*)32);
}

void Stage::setCharactersVisible(bool v) {
    charactersVisible = v;
    applyVisibility();
}

void Stage::setHiddenMembers(const std::set<std::string>& m) {
    hiddenMembers = m;
    applyVisibility();
}

// applyVisibility -- verbatim from onp_stage.cpp.
void Stage::applyVisibility() {
    settleUntil = clock + kSettle;
    for (auto& r : residents) {
        sb_setup_slots(r.drawable);

        auto named = SlotNames::members(r.character.name);
        bool wholeHidden = !named.empty();
        for (const auto& n : named) if (!hiddenMembers.count(n)) { wholeHidden = false; break; }

        std::set<int32_t> blank;
        bool anyNamedHidden = false;
        for (const auto& n : named) if (hiddenMembers.count(n)) { anyNamedHidden = true; break; }
        if (!named.empty() && !wholeHidden && anyNamedHidden) {
            for (size_t i = 0; i < r.slotNames.size(); ++i) {
                auto sm = SlotNames::members(r.slotNames[i]);
                if (!sm.empty()) {
                    bool all = true;
                    for (const auto& m : sm) if (!hiddenMembers.count(m)) { all = false; break; }
                    if (all) blank.insert((int32_t)i);
                }
            }
        }
        bool peopleOnly = !r.personSlots.empty() && !r.hasProps;
        if (!charactersVisible) blank.insert(r.personSlots.begin(), r.personSlots.end());
        r.visible = !(peopleOnly && !charactersVisible) && !wholeHidden;

        for (int32_t i : r.blanked) if (!blank.count(i)) sb_set_blank(r.drawable, i, 0);
        for (int32_t i : blank) if (!r.blanked.count(i)) sb_set_blank(r.drawable, i, 1);
        r.blanked = blank;
    }
}

// resetToStart -- rewind to the scene's first frame for a preloaded-stage swap.
// Sets the clock/replay timer back and re-arms each resident's entrance from t=0,
// then updates once with delta 0 so the very first drawn frame is the entrance's
// opening pose (not a mid-animation or settled frame).
void Stage::resetToStart() {
    clock = 0;
    replayAt = 1e300;
    settleUntil = kSettle;
    for (auto& r : residents) {
        if (!r.animation.empty())
            sb_set_animation(r.drawable, r.animation.c_str(), r.character.loop ? 1 : 0);
        sb_update(r.drawable, 0.0f);
        sb_take_completions(r.drawable);
    }
    applyVisibility();
}

// advance -- verbatim from onp_stage.cpp.
bool Stage::advance(double delta, bool cameraMoving) {
    clock += delta;
    bool replay = clock >= replayAt;
    if (replay) replayAt = 1e300;

    bool animating = false;
    for (auto& r : residents) {
        if (replay && !r.animation.empty()) sb_set_animation(r.drawable, r.animation.c_str(), 0);
        if (sb_is_animating(r.drawable) == 1) animating = true;
    }
    if (animating || replay) settleUntil = clock + kSettle;
    if (!(cameraMoving || clock <= settleUntil)) return false;

    bool completed = false;
    for (auto& r : residents) {
        sb_update(r.drawable, (float)delta);
        if (sb_take_completions(r.drawable) > 0) completed = true;
    }
    bool anyLoop = false;
    for (auto& r : residents) if (r.character.loop) { anyLoop = true; break; }
    if (completed && replayAt > 1e299 && !anyLoop) {
        static std::mt19937 rng{std::random_device{}()};
        std::uniform_real_distribution<double> dist(kReplayMin, kReplayMax);
        replayAt = clock + dist(rng);
    }
    return true;
}

} // namespace onp
