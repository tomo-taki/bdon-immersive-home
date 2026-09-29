// onp_stage.h -- C++ port of Sources/YumemitaWallpaper/Render/Stage.swift.
// One Spot situation: room + residents, the animation clock and replay, the
// characters-off / easter-egg slot rules (SlotNames), and applyVisibility.
// Residents wrap SBDrawable from the spine bridge (spine_bridge.h).

#pragma once

#include <cstdint>
#include <set>
#include <string>
#include <unordered_map>
#include <vector>

#include <d3d11.h>

#include "onp_math.h"
#include "onp_spot.h"
#include "onp_room.h"

extern "C" {
#include "spine_bridge.h"
}

namespace onp {

struct D3DContext;

// Slot / resident name rules (Stage.swift SlotNames), std::regex ECMAScript.
namespace SlotNames {
    // Easter-egg member tokens a name refers to.
    std::vector<std::string> members(const std::string& name);
    bool isPerson(const std::string& name);
    bool isProp(const std::string& name);
}

struct Resident {
    SpotCharacter character;
    SBDrawable* drawable = nullptr;
    Mat4 model;
    std::string animation;         // empty == none
    std::vector<int32_t> personSlots;
    bool hasProps = false;
    std::vector<std::string> slotNames;
    bool visible = true;
    std::set<int32_t> blanked;
};

class Stage {
public:
    // Load a spot from spotsDir + dir ("<room>/<id>"). Throws std::runtime_error.
    Stage(D3DContext& c, const std::string& spotsDir, const std::string& dir);
    ~Stage();

    std::string dir;   // "<room>/<id>", for easter-egg lookups

    // Room GPU resources.
    ID3D11Buffer* roomVB = nullptr;
    ID3D11Buffer* roomIB = nullptr;
    std::vector<ID3D11ShaderResourceView*> roomTextures;
    Room room;
    SpotData data;

    std::vector<Resident> residents;

    void setCharactersVisible(bool v);
    void setHiddenMembers(const std::set<std::string>& m);
    bool charactersVisible = true;

    // Advance animations; false when nothing changed (skip the frame / no Present).
    bool advance(double delta, bool cameraMoving);
    double clock = 0;

private:
    void applyVisibility();
    std::unordered_map<std::string, SBAtlas*> atlases;
    double replayAt = 1e300;
    double settleUntil = 3.0;
    std::set<std::string> hiddenMembers;

    static constexpr double kReplayMin = 18, kReplayMax = 40, kSettle = 3;
};

// The spine bridge texture callbacks bind to this D3D device once at startup.
void installSpineTextureBridge(D3DContext* c);

} // namespace onp
