// room_dump.cpp -- prints the baked room of a Spot (vertex count, bbox, first
// vertices) so it can be diffed against the Swift app's `--dump-room`.
// Usage: room_dump <spots-dir> <room>/<spotId>
#include <math.h>
#include <cstdio>
#include <string>

#include "../src/onp_spot.h"
#include "../src/onp_room.h"

using namespace onp;

int main(int argc, char** argv) {
    std::string spots = argv[1], dir = argv[2];
    SpotData data = loadSpotData(spots + "/" + dir + "/spot.json");
    std::string roomDir = dir.substr(0, dir.find('/'));
    Room room = loadRoom(spots + "/" + roomDir + "/room.glb", roomMatrix(data), data.roomNodes);
    Vec3 lo{1e9f, 1e9f, 1e9f}, hi{-1e9f, -1e9f, -1e9f};
    for (const auto& v : room.vertices) {
        lo = {fminf(lo.x, v.position.x), fminf(lo.y, v.position.y), fminf(lo.z, v.position.z)};
        hi = {fmaxf(hi.x, v.position.x), fmaxf(hi.y, v.position.y), fmaxf(hi.z, v.position.z)};
    }
    std::printf("vertices %zu indices %zu meshes %zu\n", room.vertices.size(), room.indices.size(), room.meshes.size());
    std::printf("bbox %.4f %.4f %.4f  %.4f %.4f %.4f\n", lo.x, lo.y, lo.z, hi.x, hi.y, hi.z);
    for (size_t i = 0; i < 3 && i < room.vertices.size(); ++i) {
        const auto& v = room.vertices[i];
        std::printf("v%zu %.4f %.4f %.4f uv %.4f %.4f\n", i, v.position.x, v.position.y, v.position.z, v.uv.x, v.uv.y);
    }
}
