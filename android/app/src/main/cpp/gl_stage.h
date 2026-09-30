// gl_stage.h -- OpenGL ES 3.0 port of onp_stage.{h,cpp} (Stage.swift).
// One Spot situation: room geometry + textures as GL objects, the residents
// (spine drawables via spine_bridge), the animation clock/replay, and the
// characters-off / easter-egg slot rules -- the SlotNames rules and the
// advance()/applyVisibility() logic are copied byte-for-byte from onp_stage.cpp.

#pragma once

#include <cstdint>
#include <set>
#include <string>
#include <unordered_map>
#include <vector>

#include <GLES3/gl3.h>

#include "onp_math.h"
#include "onp_spot.h"
#include "onp_room.h"

extern "C" {
#include "spine_bridge.h"
}

namespace onp {

// Slot / resident name rules (Stage.swift SlotNames), std::regex ECMAScript.
namespace SlotNames {
    std::vector<std::string> members(const std::string& name);
    bool isPerson(const std::string& name);
    bool isProp(const std::string& name);
}

struct Resident {
    SpotCharacter character;
    SBDrawable* drawable = nullptr;
    Mat4 model;
    std::string animation;
    std::vector<int32_t> personSlots;
    bool hasProps = false;
    std::vector<std::string> slotNames;
    bool visible = true;
    std::set<int32_t> blanked;
};

// The spine bridge texture callbacks bind to GL once at startup: a decoded page
// becomes a GLuint texture id, packed into the SBAtlasPage rendererObject void*.
void installSpineTextureBridge();

class Stage {
public:
    // Load a spot from spotsDir + dir ("<room>/<id>"). Throws std::runtime_error.
    Stage(const std::string& spotsDir, const std::string& dir);
    ~Stage();

    std::string dir;

    Room room;
    SpotData data;
    std::vector<Resident> residents;

    // GL geometry.
    GLuint roomVBO = 0;
    GLuint roomIBO = 0;

    // Bind room VBO/IBO into the currently-bound VAO with the room attribute
    // layout (POSITION vec3 @0, TEXCOORD vec2 @12, stride sizeof(RoomVertex)).
    void bindRoomArrays();
    GLuint roomTexture(int index) const {
        return (index >= 0 && index < (int)roomTextures.size()) ? roomTextures[index] : 0;
    }

    // Upload one resident's dynamic geometry into the spine VBO/IBO and set the
    // SBVertex attribute layout (pos vec2 @0, uv vec2 @8, light vec4 @16, dark vec3 @32).
    void bindSpineArrays(const SBVertex* verts, int vc, const uint32_t* idx, int ic);

    void setCharactersVisible(bool v);
    void setHiddenMembers(const std::set<std::string>& m);
    bool charactersVisible = true;

    // Advance animations; false when nothing changed (skip Present).
    bool advance(double delta, bool cameraMoving);
    double clock = 0;

    // Rewind to the scene's first frame: reset the clock and replay timer and
    // re-arm every resident's entrance animation from t=0. Used when a pre-loaded
    // stage is swapped in at SCREEN_OFF so the entrance plays fresh on screen-on.
    void resetToStart();

private:
    void applyVisibility();
    std::vector<GLuint> roomTextures;
    GLuint spineVBO = 0;
    GLuint spineIBO = 0;
    std::unordered_map<std::string, SBAtlas*> atlases;
    double replayAt = 1e300;
    double settleUntil = 3.0;
    std::set<std::string> hiddenMembers;

    static constexpr double kReplayMin = 18, kReplayMax = 40, kSettle = 3;
};

} // namespace onp
