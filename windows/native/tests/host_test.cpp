// host_test.cpp -- verifies the C++ ports (onp_math/onp_spot/onp_room) against
// the Swift ground truth, with NO Direct3D. Built native (zig c++) on the Mac.
//
// Usage: host_test <spots-dir> <swift-reference-json>
//   spots-dir             e.g. Resources/web/spots
//   swift-reference-json  the single JSON line swift_reference.swift printed
//
// Checks (from SPEC.md "Verify here"):
//   1. Spot 30001 parses with 3 residents.
//   2. glb mesh count matches Room.swift logic (total + transparent).
//   3. Camera matrices for 30001 at 1920x1080 equal the Swift ones.
// Plus: cover.json zoom, every Spot in index.json parses ("animation": null
// slots), and the update pick from the releases list (onp_release.h).

#include <math.h>   // ensure the INFINITY macro is defined before libc++ internals
#include <cmath>
#include <cstdio>
#include <string>

#include "../src/onp_release.h"
#include "../src/onp_spot.h"
#include "../src/onp_room.h"

using namespace onp;
using json = nlohmann::json;

static int g_failures = 0;

static void checkInt(const char* label, long got, long want) {
    bool ok = got == want;
    std::printf("  %-28s got=%ld want=%ld  %s\n", label, got, want, ok ? "PASS" : "FAIL");
    if (!ok) ++g_failures;
}

static void checkText(const char* label, const std::string& got, const std::string& want) {
    bool ok = got == want;
    std::printf("  %-28s %s\n", label, ok ? "PASS" : "FAIL");
    if (!ok) {
        ++g_failures;
        std::printf("    got : %s\n    want: %s\n", got.c_str(), want.c_str());
    }
}

static void checkFloat(const char* label, double got, double want, double tol) {
    double diff = std::fabs(got - want);
    bool ok = diff <= tol;
    std::printf("  %-28s got=%.7g want=%.7g diff=%.3g  %s\n", label, got, want, diff, ok ? "PASS" : "FAIL");
    if (!ok) ++g_failures;
}

static void checkMatrix(const char* label, const Mat4& got, const std::vector<float>& want, double tol) {
    const float* g = &got.c[0].x;
    double maxDiff = 0;
    for (int i = 0; i < 16; ++i) maxDiff = std::fmax(maxDiff, std::fabs(g[i] - want[i]));
    bool ok = maxDiff <= tol;
    std::printf("  %-28s maxDiff=%.3g  %s\n", label, maxDiff, ok ? "PASS" : "FAIL");
    if (!ok) {
        ++g_failures;
        std::printf("    got : ");
        for (int i = 0; i < 16; ++i) std::printf("%.5g ", g[i]);
        std::printf("\n    want: ");
        for (int i = 0; i < 16; ++i) std::printf("%.5g ", want[i]);
        std::printf("\n");
    }
}

int main(int argc, char** argv) {
    std::string spotsDir = argc > 1 ? argv[1] : "Resources/web/spots";
    std::string refJson = argc > 2 ? argv[2] : "";

    json ref = refJson.empty() ? json::object() : json::parse(refJson);

    std::string spotDir = spotsDir + "/home_003_yumemita_01_vrfloor_03/30001";
    std::string glb = spotsDir + "/home_003_yumemita_01_vrfloor_03/room.glb";

    std::printf("== Spot 30001 host tests ==\n");

    // 1. Parse.
    SpotData data = loadSpotData(spotDir + "/spot.json");
    checkInt("residents", (long)data.characters.size(), ref.value("residents", 3L));
    // spot-check first resident's fields against index/spot.json.
    checkInt("first resident order", data.characters.empty() ? -1 : data.characters[0].order, 10);

    // 2. glb mesh count.
    Room room = loadRoom(glb, roomMatrix(data), data.roomNodes);
    long transparent = 0;
    for (const auto& m : room.meshes) if (m.transparent) ++transparent;
    checkInt("glb meshes", (long)room.meshes.size(), ref.value("meshes", 21L));
    checkInt("glb transparent meshes", transparent, ref.value("transparentMeshes", 10L));

    // 3. Camera matrices at 1920x1080.
    CameraMatrices cam = spotCamera(data, 1920.0f, 1080.0f, 0, 0);
    if (ref.contains("fov")) checkFloat("fov", cam.fov, ref["fov"].get<double>(), 1e-4);
    if (ref.contains("view"))
        checkMatrix("view matrix", cam.view, ref["view"].get<std::vector<float>>(), 2e-5);
    if (ref.contains("projection"))
        checkMatrix("projection matrix", cam.projection, ref["projection"].get<std::vector<float>>(), 2e-5);

    // 4. cover.json zoom: bracketing minimum, clamped at the ends, and the
    //    projection narrows by exactly that factor (tan(fov/2) * zoom).
    CoverTable cover;
    cover.aspects = {1.0f, 1.5f, 2.0f};
    cover.zoom = {0.8f, 0.9f, 1.0f};
    checkFloat("cover below range", cover.zoomFor(0.5f), 0.8, 1e-6);
    checkFloat("cover between samples", cover.zoomFor(1.7f), 0.9, 1e-6);
    checkFloat("cover on a sample", cover.zoomFor(1.5f), 0.8, 1e-6);
    checkFloat("cover above range", cover.zoomFor(3.0f), 1.0, 1e-6);
    SpotData zoomed = data;
    zoomed.cover = cover;
    CameraMatrices zc = spotCamera(zoomed, 1200.0f, 1000.0f, 0, 0);   // aspect 1.2 -> 0.8
    CameraMatrices uc = spotCamera(data, 1200.0f, 1000.0f, 0, 0);
    checkFloat("zoomed projection y", zc.projection.c[1].y, uc.projection.c[1].y / 0.8, 1e-4);
    checkMatrix("zoom keeps view", zc.view,
                std::vector<float>(&uc.view.c[0].x, &uc.view.c[0].x + 16), 1e-6);

    // 5. Every Spot parses, including slots exported with "animation": null.
    std::printf("\n== Spot index ==\n");
    long parsed = 0, total = 0;
    for (const auto& entry : loadSpotIndex(spotsDir + "/index.json")) {
        ++total;
        try {
            loadSpotData(spotsDir + "/" + entry.dir + "/spot.json");
            ++parsed;
        } catch (const std::exception& e) {
            std::printf("  %s: %s\n", entry.id.c_str(), e.what());
        }
    }
    checkInt("spots parsed", parsed, total);
    SpotData nulls = parseSpotData(json::parse(readFile(spotDir + "/spot.json")));
    json withNull = json::parse(readFile(spotDir + "/spot.json"));
    withNull["characters"][0]["animation"] = nullptr;
    withNull["characters"][0]["order"] = nullptr;
    nulls = parseSpotData(withNull);
    checkText("null animation -> none", nulls.characters[0].animation, "");
    checkInt("null order -> 0", nulls.characters[0].order, 0);

    // 6. Update pick: the newest release carrying our package, every newer
    //    summary (ReleaseFeed.swift parity).
    std::printf("\n== Update pick ==\n");
    auto release = [](const char* tag, json name, json body, std::vector<const char*> assets,
                      bool draft = false, bool prerelease = false) {
        json r = {{"tag_name", tag}, {"name", name}, {"body", body}, {"draft", draft},
                  {"prerelease", prerelease}, {"assets", json::array()}};
        for (const char* a : assets)
            r["assets"].push_back({{"name", a}, {"browser_download_url", std::string("https://x/") + tag + "/" + a}});
        return r;
    };
    const char* dmg = "BDONImmersiveHome.dmg";
    const char* win = "BDONImmersiveHome-win-x64.zip";
    const char* sums = "SHA256SUMS.txt";
    json feed = json::array({
        release("b30", "2026.10.09 (c30)", "Windows fix", {win, sums}),
        release("b29", "draft", "draft", {dmg, win, sums}, true),
        release("b28", "2026.10.07 (c28)", "- mac 1\r\n- mac 2\r\n", {dmg, sums}),
        release("b27", "pre", "pre", {dmg, win, sums}, false, true),
        release("b26", "2026.10.05 (c26)", "no checksums", {win}),
        release("b25", "2026.10.03 (c25)", "  all platforms  ", {dmg, win, sums}),
        release("b23", "2026.10.02 (c23)", "BDON Immersive Home 2026.10.02 (c23)", {dmg, win, sums}),
        release("b22", nullptr, nullptr, {dmg, win, sums}),
        release("v9", "odd tag", "odd", {dmg, win, sums}),
    });
    auto pick = [&](int current, const char* package) { return pickUpdate(feed, current, package); };

    auto w = pick(21, win);
    checkInt("win: newest with zip", w ? w->build : -1, 30);
    checkText("win: title", w ? w->title : "", "2026.10.09 (c30)");
    checkText("win: package url", w ? w->packageUrl : "", "https://x/b30/BDONImmersiveHome-win-x64.zip");
    checkText("win: checksum url", w ? w->checksumUrl : "", "https://x/b30/SHA256SUMS.txt");
    checkText("win: summaries", w ? w->notes : "", "2026.10.09 (c30)\nWindows fix\n\n2026.10.03 (c25)\nall platforms");

    auto m = pick(21, dmg);
    checkInt("mac: skips windows-only", m ? m->build : -1, 28);
    checkText("mac: summaries", m ? m->notes : "", "2026.10.07 (c28)\n- mac 1\n- mac 2\n\n2026.10.03 (c25)\nall platforms");
    auto one = pick(25, dmg);
    checkText("one summary, no title", one ? one->notes : "", "- mac 1\n- mac 2");
    checkInt("up to date", pick(30, win) ? 1 : 0, 0);
    checkInt("mac after windows-only", pick(28, dmg) ? 1 : 0, 0);
    auto bare = pick(21, "BDONImmersiveHome-win-arm64.zip");
    checkInt("no package anywhere", bare ? 1 : 0, 0);
    auto legacy = pickUpdate(json::array({release("b22", nullptr, nullptr, {dmg, sums})}), 21, dmg);
    checkText("null name -> tag", legacy ? legacy->title : "", "b22");
    checkText("null body -> no notes", legacy ? legacy->notes : "x", "");
    checkInt("not a list", pickUpdate(json::object(), 0, dmg) ? 1 : 0, 0);
    checkInt("tag b42", releaseBuild("b42"), 42);
    checkInt("tag v42", releaseBuild("v42"), -1);
    checkInt("tag b4x", releaseBuild("b4x"), -1);
    checkInt("tag b", releaseBuild("b"), -1);
    checkInt("tag 10 digits", releaseBuild("b1234567890"), -1);

    std::printf("\n%s (%d failure%s)\n", g_failures == 0 ? "ALL PASS" : "FAILURES",
                g_failures, g_failures == 1 ? "" : "s");
    return g_failures == 0 ? 0 : 1;
}
