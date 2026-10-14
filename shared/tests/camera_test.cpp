#include "../scene/onp_spot.h"

#include <cstdio>

namespace {

constexpr float kTolerance = 0.00002f;
constexpr float kNearClip = 0.3f;
constexpr float kFarClip = 1000;
constexpr float kViewHeight = 1080;
enum class Verdict { Pass, Fail };
int failures = 0;

void check(Verdict result, const char* label) {
    if (result == Verdict::Pass) {
        return;
    }

    ++failures;
    std::fprintf(stderr, "FAIL: %s\n", label);
}

onp::Vec2 projected(const onp::Vec3& point, const onp::SpotPose& pose) {
    const auto eye = onp::rightHanded(pose.position);
    const auto view = onp::lookAt(eye, eye + onp::rightHanded(onp::lookDirection(pose)));
    const auto projection = onp::perspective(pose.fov, 1, kNearClip, kFarClip);
    const auto clip = onp::mul(projection * view, {onp::rightHanded(point), 1});
    return {clip.x / clip.w, clip.y / clip.w};
}

void checkDepth() {
    // Equal screen bearings must separate when the camera orbits.
    onp::SpotSituation s;
    s.originalOffset = {0, 0, 5};
    s.orbitRatio = 1;
    s.maxLeftShift = s.maxRightShift = s.maxUpShift = s.maxDownShift = 5;
    const auto base = onp::defaultPose(s, s.fieldOfView);
    for (const auto& pointer : {onp::Vec2{1, 0}, onp::Vec2{0, 1}}) {
        const auto pose = onp::shiftedPose(base, pointer.x, pointer.y, s, 1);
        const auto near = projected({0, 0, 1}, pose);
        const auto far = projected({0, 0, 8}, pose);
        check(std::hypot(near.x - far.x, near.y - far.y) > 0.01f ? Verdict::Pass : Verdict::Fail,
              "depth separation");
    }
}

} // namespace

int main(int argc, char** argv) {
    check(argc == 3 ? Verdict::Pass : Verdict::Fail, "spots and Swift poses required");
    if (argc != 3) {
        return 1;
    }

    checkDepth();

    const auto rows = onp::json::parse(onp::readFile(argv[2]));
    for (const auto& row : rows) {
        const auto path = std::string(argv[1]) + "/" + row.at("dir").get<std::string>();
        const auto data = onp::loadSpotData(path + "/spot.json");
        const auto& s = data.situation;
        const float aspect = row.at("aspect");
        const float px = row.at("px"), py = row.at("py");
        const auto base = onp::defaultPose(s, onp::fitFov(s, aspect * kViewHeight, kViewHeight));
        const auto pose = onp::shiftedPose(base, px, py, s, aspect);
        const auto direction = onp::lookDirection(pose);
        check(onp::length(pose.position + direction * s.orbitRatio - s.defaultPositionOffset) < kTolerance
                  ? Verdict::Pass : Verdict::Fail,
              "signed orbit pivot");

        const auto position = row.at("position");
        const auto forward = row.at("forward");
        check(onp::length(pose.position - onp::Vec3{position[0], position[1], position[2]}) < kTolerance
                  ? Verdict::Pass : Verdict::Fail,
              "Swift position parity");
        check(onp::length(direction - onp::Vec3{forward[0], forward[1], forward[2]}) < kTolerance
                  ? Verdict::Pass : Verdict::Fail,
              "Swift direction parity");
        check(std::fabs(pose.yaw - row.at("yaw").get<float>()) < kTolerance
                  ? Verdict::Pass : Verdict::Fail, "Swift yaw parity");
        check(std::fabs(pose.pitch - row.at("pitch").get<float>()) < kTolerance
                  ? Verdict::Pass : Verdict::Fail, "Swift pitch parity");

        // Orbit changes the rendered view, while layer sorting stays centered.
        const auto cam = onp::spotCamera(data, aspect * kViewHeight, kViewHeight, px, py);
        const auto centered = onp::spotCamera(data, aspect * kViewHeight, kViewHeight);
        for (size_t i = 0; i < cam.sortViewProjection.c.size(); ++i) {
            for (int j = 0; j < 4; ++j) {
                check(std::fabs(cam.sortViewProjection.c[i][j] - centered.sortViewProjection.c[i][j]) < kTolerance
                          ? Verdict::Pass : Verdict::Fail,
                      "stable layer sort");
            }
        }
    }

    std::printf("C++ camera: %zu poses, %d failures\n", rows.size(), failures);
    return failures == 0 ? 0 : 1;
}
