// settings_window.cpp -- custom-painted dark settings window (Win32 + GDI+),
// port of the redesigned SettingsView.swift + Theme.swift (the "Our Notes"
// game UI). Three columns: left tab slabs (배경 / 상세 / 정보; the selected one
// is a teal arrow slab that juts +12 into the middle column), a middle sub-tab
// column, and a right content pane:
//   배경  -> scene thumbnail grid with shuffle-pool behaviour (per band)
//   상세  -> 표시 / 셔플 sections of option pills (OFF/ON radios, interval
//            stepper, 셔플 대상 navigator) + "기본값으로 되돌리기"
//   정보  -> app icon, name, version, licence box, one bug-report button
// Easter egg: layout-independent VK_A..VK_Z typed here toggle 토모타키 / 아논소요.
//
// GDI+ approximations of SwiftUI are noted inline (search "APPROX").

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <windowsx.h>
#include <shellapi.h>
#include <objidl.h>
#include <gdiplus.h>

#include <algorithm>
#include <functional>
#include <map>
#include <string>
#include <vector>

#include "onp_settings.h"
#include "onp_spot.h"

using namespace onp;
using namespace Gdiplus;

// Shared globals from main.cpp.
extern Settings g_settings;
extern std::vector<SpotIndexEntry> g_catalog;
void onSettingsChanged();
extern "C" void requestSpotChangeFromSettings();

namespace {

// ---- Theme palette (Theme.swift, converted to 0..255 ARGB) ----
// SwiftUI Color(red:green:blue:) values * 255, rounded.
inline Color rgb(int r, int g, int b, int a = 255) { return Color((BYTE)a, (BYTE)r, (BYTE)g, (BYTE)b); }

namespace T {
    const Color navyTop     = rgb(28, 33, 84);
    const Color navyBottom  = rgb(38, 46, 102);
    const Color panel       = rgb(23, 26, 64);
    const Color tabTop      = rgb(92, 107, 217);
    const Color tabBottom   = rgb(61, 74, 176);
    const Color tabEdge     = rgb(158, 173, 247);
    const Color tealTop     = rgb(128, 222, 222);
    const Color tealBottom  = rgb(61, 163, 184);
    const Color teal        = rgb(77, 184, 199);
    const Color pill        = rgb(43, 51, 115);
    const Color pillEdge    = rgb(120, 135, 214);
    // pillOpen = Color(0.46,0.50,0.72).opacity(0.42)
    const Color pillOpen    = rgb(117, 128, 184, 107);
    const Color ink         = rgb(43, 48, 97);
    const Color magenta     = rgb(214, 92, 240);
    const Color lavTop      = rgb(240, 242, 252);
    const Color lavBottom   = rgb(196, 201, 230);
    const Color white       = rgb(255, 255, 255);
}

// ---- window / layout state ----

ULONG_PTR g_gdiplusToken = 0;
HWND g_settingsHwnd = nullptr;
HINSTANCE g_hinst = nullptr;

// Logical layout (SwiftUI points). The mac window is 980 wide; columns 236 +
// 196 leave 548 for the content pane. Height is flexible; we pick a base and
// scale to fit the monitor work area, like the old window did.
const int kSidebarW = 236;
const int kSubTabW  = 196;
const int kContentW = 548;
const int kLogicalW = kSidebarW + kSubTabW + kContentW;   // 980
const int kLogicalH = 700;

float g_uiScale = 1;    // logical px -> device px (DPI * fit)

// Navigation state (mirrors SettingsNav).
enum class Tab { Scene, Display, About };
enum class Section { Display, Shuffle };
enum class Option { None, Characters, Parallax, Shuffle, Interval };

Tab g_tab = Tab::Scene;
Section g_section = Section::Display;
Option g_expanded = Option::None;     // one pill open at a time
std::string g_band;                   // selected band in the 배경 tab
int g_sceneScroll = 0;                // scroll offset for the scene grid (logical px)
int g_sceneContentH = 0;              // measured grid content height
int g_detailScroll = 0;               // scroll offset for the 상세 pill list
int g_detailContentH = 0;

// Easter-egg typed buffer (layout-independent, VK_A..VK_Z).
std::string g_eggBuffer;

// ---- helpers ----

RECT logicalClient(HWND hwnd) {
    RECT c; GetClientRect(hwnd, &c);
    c.right  = (LONG)(c.right  / g_uiScale);
    c.bottom = (LONG)(c.bottom / g_uiScale);
    return c;
}

std::wstring toW(const std::string& s) {
    int n = MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), nullptr, 0);
    std::wstring w(n, 0);
    MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), w.data(), n);
    return w;
}

// Korean UI strings (UTF-8 byte literals so the source needs no BOM).
const char* kTitleSettings = "\xEC\x84\xA4\xEC\xA0\x95";                                    // 설정
const char* kTabScene   = "\xEB\xB0\xB0\xEA\xB2\xBD";                                       // 배경
const char* kTabDisplay = "\xEC\x83\x81\xEC\x84\xB8";                                       // 상세
const char* kTabAbout   = "\xEC\xA0\x95\xEB\xB3\xB4";                                       // 정보
const char* kSecDisplay = "\xED\x91\x9C\xEC\x8B\x9C";                                       // 표시
const char* kSecShuffle = "\xEC\x85\x94\xED\x94\x8C";                                       // 셔플
const char* kAppInfo    = "\xEC\x95\xB1 \xEC\xA0\x95\xEB\xB3\xB4";                          // 앱 정보
const char* kChars      = "\xEC\xBA\x90\xEB\xA6\xAD\xED\x84\xB0 \xED\x91\x9C\xEC\x8B\x9C";  // 캐릭터 표시
const char* kParallax   = "\xEC\xBB\xA4\xEC\x84\x9C \xEB\x94\xB0\xEB\x9D\xBC \xEC\x8B\x9C\xEC\xA0\x90 \xEC\x9D\xB4\xEB\x8F\x99"; // 커서 따라 시점 이동
const char* kShuffle    = "\xEC\x9E\xA5\xEB\xA9\xB4 \xEC\x85\x94\xED\x94\x8C";              // 장면 셔플
const char* kInterval   = "\xEB\xB3\x80\xEA\xB2\xBD \xEC\xA3\xBC\xEA\xB8\xB0";              // 변경 주기
const char* kShuffleTgt = "\xEC\x85\x94\xED\x94\x8C \xEB\x8C\x80\xEC\x83\x81";              // 셔플 대상
const char* kApplied    = "\xEC\xA0\x81\xEC\x9A\xA9 \xEC\xA4\x91";                          // 적용 중
const char* kResetSect  = "\xEA\xB8\xB0\xEB\xB3\xB8\xEA\xB0\x92\xEC\x9C\xBC\xEB\xA1\x9C \xEB\x90\x98\xEB\x8F\x8C\xEB\xA6\xAC\xEA\xB8\xB0"; // 기본값으로 되돌리기
const char* kOff = "OFF";
const char* kOn  = "ON";
const char* kInfoTitle  = "\xEC\xA0\x95\xEB\xB3\xB4";                                       // 정보
const char* kAppName    = "BDON Immersive Home";
const char* kLicense    = "\xEB\x9D\xBC\xEC\x9D\xB4\xEC\x84\xA0\xEC\x8A\xA4";                // 라이선스
// Licence body (identical wording to AboutView.swift).
const char* kLicBody1   = "\xEB\xB9\x84\xEA\xB3\xB5\xEC\x8B\x9D \xED\x8C\xAC \xEC\xA0\x9C\xEC\x9E\x91 \xEC\x95\xB1\xEC\x9E\x85\xEB\x8B\x88\xEB\x8B\xA4. \xEA\xB2\x8C\xEC\x9E\x84 \xEC\x97\x90\xEC\x85\x8B\xEC\x9D\x98 \xEA\xB6\x8C\xEB\xA6\xAC\xEB\x8A\x94 \xC2\xA9 BanG Dream! Project \xEB\xB0\x8F \xEA\xB0\x81 \xEA\xB6\x8C\xEB\xA6\xAC\xEC\x9E\x90\xEC\x97\x90 \xEC\x9E\x88\xEC\x8A\xB5\xEB\x8B\x88\xEB\x8B\xA4."; // 비공식 팬 제작 앱입니다. ...
const char* kLicBody2   = "Spine Runtimes (spine-c 4.2) \xC2\xA9 2013-2025 Esoteric Software LLC \xE2\x80\x94 Spine Runtimes License Agreement.";
const char* kBugReport  = "\xEB\xB2\x84\xEA\xB7\xB8 \xEB\xA6\xAC\xED\x8F\xAC\xED\x8A\xB8 \xEB\xB0\x8F \xEC\xA0\x9C\xEC\x95\x88"; // 버그 리포트 및 제안
const char* kVersionPfx = "\xEB\xB2\x84\xEC\xA0\x84 ";                                       // "버전 "
const char* kContact    = "tomo.taki@proton.me";

// ---- version string (build-time defines from build.sh) ----
#ifndef BDON_BUILD_DATE
#define BDON_BUILD_DATE "dev"
#endif
#ifndef BDON_COMMIT
#define BDON_COMMIT "dev"
#endif

std::string versionString() {
    // "버전 2026.09.29 (fa494c3)" -- date, then the commit it was built from,
    // matching AboutView.version. Both are injected by build.sh; "dev" fallback.
    std::string date = BDON_BUILD_DATE;
    std::string commit = BDON_COMMIT;
    if (commit == "dev" && date == "dev") return std::string(kVersionPfx) + "\xEA\xB0\x9C\xEB\xB0\x9C \xEB\xB9\x8C\xEB\x93\x9C"; // 개발 빌드
    return std::string(kVersionPfx) + date + " (" + commit + ")";
}

const char* bandIconName(const std::string& band) {
    if (band == "MyGO!!!!!") return "mygo";
    if (band == "Ave Mujica") return "avemujica";
    if (band == "\xe5\xa4\xa2\xe9\x99\x90\xe5\xa4\xa7\xe3\x81\xbf\xe3\x82\x85\xe3\x83\xbc\xe3\x81\x9f\xe3\x81\x84\xe3\x81\xb7") return "yumemita";
    if (band == "millsage") return "millsage";
    return "ikka";
}

// Ordered list of bands in catalog order.
std::vector<std::string> bandOrder() {
    std::vector<std::string> order;
    std::map<std::string, bool> seen;
    for (const auto& e : g_catalog) {
        if (!seen[e.band]) { seen[e.band] = true; order.push_back(e.band); }
    }
    return order;
}
std::vector<const SpotIndexEntry*> spotsForBand(const std::string& band) {
    std::vector<const SpotIndexEntry*> out;
    for (const auto& e : g_catalog) if (e.band == band) out.push_back(&e);
    return out;
}

// ---- image caches ----
std::map<std::string, Image*> g_thumbCache;
std::map<std::string, Image*> g_bandIconCache;

Image* thumbnail(const std::string& id, bool chars) {
    std::string key = id + (chars ? "-1" : "-0");
    auto it = g_thumbCache.find(key);
    if (it != g_thumbCache.end()) return it->second;
    std::string base = dataRoot() + "\\thumbs\\";
    std::string file = base + id + (chars ? ".jpg" : "_bg.jpg");
    Image* img = Image::FromFile(toW(file).c_str());
    if (!img || img->GetLastStatus() != Ok) {
        delete img;
        img = Image::FromFile(toW(base + id + ".jpg").c_str());   // fallback
    }
    g_thumbCache[key] = img;
    return img;
}

Image* bandIcon(const std::string& band) {
    std::string name = bandIconName(band);
    auto it = g_bandIconCache.find(name);
    if (it != g_bandIconCache.end()) return it->second;
    std::string file = dataRoot() + "\\bands\\" + name + ".png";
    Image* img = Image::FromFile(toW(file).c_str());
    if (img && img->GetLastStatus() != Ok) { delete img; img = nullptr; }
    g_bandIconCache[name] = img;
    return img;
}

// ---- hit records built during paint, reused on click ----
struct Hit {
    RECT rect;
    std::function<void()> action;
};
std::vector<Hit> g_hits;

void addHit(int x, int y, int w, int h, std::function<void()> fn) {
    g_hits.push_back({{x, y, x + w, y + h}, std::move(fn)});
}

// ---- shared paint primitives ----

// Rounded rectangle path (all four corners equal radius).
void roundRectPath(GraphicsPath& p, float x, float y, float w, float h, float r) {
    r = (std::min)(r, (std::min)(w, h) / 2);
    float d = r * 2;
    p.StartFigure();
    p.AddArc(x, y, d, d, 180, 90);
    p.AddArc(x + w - d, y, d, d, 270, 90);
    p.AddArc(x + w - d, y + h - d, d, d, 0, 90);
    p.AddArc(x, y + h - d, d, d, 90, 90);
    p.CloseFigure();
}

// Capsule (pill) path: fully rounded ends.
void capsulePath(GraphicsPath& p, float x, float y, float w, float h) {
    roundRectPath(p, x, y, w, h, h / 2);
}

// Vertical two-stop linear gradient brush over a rect.
void fillVGradient(Graphics& g, float x, float y, float w, float h, Color top, Color bottom) {
    if (w < 1) w = 1; if (h < 1) h = 1;
    LinearGradientBrush br(RectF(x, y - 0.5f, w, h + 1.0f), top, bottom, LinearGradientModeVertical);
    g.FillRectangle(&br, x, y, w, h);
}

void fillRect(Graphics& g, float x, float y, float w, float h, Color c) {
    SolidBrush br(c);
    g.FillRectangle(&br, x, y, w, h);
}

// Text helpers -----------------------------------------------------------
FontFamily* g_ff = nullptr;   // "Malgun Gothic" if present (Korean), else Segoe UI

const FontFamily& uiFamily() {
    if (!g_ff) {
        g_ff = new FontFamily(L"Malgun Gothic");
        if (!g_ff->IsAvailable()) { delete g_ff; g_ff = new FontFamily(L"Segoe UI"); }
    }
    return *g_ff;
}

void drawText(Graphics& g, const char* s, float x, float y, float size, Color c,
              bool bold = true, StringAlignment align = StringAlignmentNear, float wrapW = 0) {
    Font font(&uiFamily(), size, bold ? FontStyleBold : FontStyleRegular, UnitPixel);
    SolidBrush br(c);
    // Typographic format: no GDI+ side padding or extra tracking, so text
    // starts where it is placed and measures like SwiftUI's.
    StringFormat sf(StringFormat::GenericTypographic());
    sf.SetFormatFlags(sf.GetFormatFlags() | StringFormatFlagsMeasureTrailingSpaces);
    sf.SetAlignment(align);
    if (wrapW <= 0) sf.SetFormatFlags(sf.GetFormatFlags() | StringFormatFlagsNoWrap);
    RectF layout(x, y, wrapW > 0 ? wrapW : 4000.0f, 4000.0f);
    g.DrawString(toW(s).c_str(), -1, &font, layout, &sf, &br);
}

// Measured height of wrapped text (for the licence box layout).
float measureTextHeight(Graphics& g, const char* s, float size, float wrapW, bool bold) {
    Font font(&uiFamily(), size, bold ? FontStyleBold : FontStyleRegular, UnitPixel);
    StringFormat sf(StringFormat::GenericTypographic());
    RectF layout(0, 0, wrapW, 4000.0f), bounds;
    g.MeasureString(toW(s).c_str(), -1, &font, layout, &sf, &bounds);
    return bounds.Height;
}

// ---- GameRadio (Theme.swift concentric discs) --------------------------
// Sizes are fractions of the diameter; RGB values sampled from the capture,
// identical to Theme.GameRadio. Gradients are approximated (see APPROX).
void drawDisc(Graphics& g, float cx, float cy, float d, float frac, const Brush& br) {
    float s = d * frac;
    g.FillEllipse(&br, cx - s / 2, cy - s / 2, s, s);
}
void drawDiscSolid(Graphics& g, float cx, float cy, float d, float frac, Color c) {
    SolidBrush br(c); drawDisc(g, cx, cy, d, frac, br);
}
// Radial gradient disc: PathGradient centre->edge.
void drawDiscRadial(Graphics& g, float cx, float cy, float d, float frac, Color center, Color edge) {
    float s = d * frac;
    GraphicsPath path;
    path.AddEllipse(cx - s / 2, cy - s / 2, s, s);
    PathGradientBrush pg(&path);
    pg.SetCenterColor(center);
    Color surround[] = {edge};
    int n = 1;
    pg.SetSurroundColors(surround, &n);
    g.FillPath(&pg, &path);
}
// Vertical linear gradient disc.
void drawDiscVGrad(Graphics& g, float cx, float cy, float d, float frac, Color top, Color bottom) {
    float s = d * frac;
    LinearGradientBrush lg(RectF(cx - s / 2, cy - s / 2 - 0.5f, s, s + 1), top, bottom, LinearGradientModeVertical);
    GraphicsPath path;
    path.AddEllipse(cx - s / 2, cy - s / 2, s, s);
    g.FillPath(&lg, &path);
}

void drawGameRadio(Graphics& g, float x, float y, float d, bool selected) {
    float cx = x + d / 2, cy = y + d / 2;
    // Drop shadow disc (Color.black 0.35, offset y = d*0.03).
    drawDiscSolid(g, cx, cy + d * 0.03f, d, 1.0f, rgb(0, 0, 0, 89));
    if (selected) {
        drawDiscSolid(g, cx, cy, d, 1.0f, rgb(48, 72, 92));
        drawDiscVGrad(g, cx, cy, d, 0.92f, rgb(200, 236, 248), rgb(158, 190, 206));
        // 0.84 radial: (86,160,184)->(150,216,236) outward. APPROX: single stop.
        drawDiscRadial(g, cx, cy, d, 0.84f, rgb(104, 190, 216), rgb(150, 216, 236));
        drawDiscVGrad(g, cx, cy, d, 0.84f, rgb(255, 255, 255, 46), rgb(255, 255, 255, 0));
        drawDiscRadial(g, cx, cy, d, 0.60f, rgb(92, 150, 173), rgb(64, 110, 134));
        drawDiscSolid(g, cx, cy, d, 0.40f, rgb(255, 255, 255, 89));
        drawDiscSolid(g, cx, cy, d, 0.32f, rgb(255, 255, 255));
    } else {
        drawDiscSolid(g, cx, cy, d, 1.0f, rgb(50, 52, 95));
        drawDiscVGrad(g, cx, cy, d, 0.92f, rgb(160, 143, 201), rgb(100, 100, 166));
        drawDiscVGrad(g, cx, cy, d, 0.86f, rgb(64, 74, 124), rgb(78, 94, 164));
        drawDiscSolid(g, cx, cy, d, 0.62f, rgb(43, 45, 83));
        drawDiscVGrad(g, cx, cy, d, 0.58f, rgb(37, 36, 68), rgb(40, 41, 79));
    }
}

// ---- Backdrop (navy gradient + blurred scene). APPROX: no live blur; we tint
// the current thumbnail lightly, as GameBackdrop overlays a blurred scene at
// 0.45 with a navy gradient on top. ----
void paintBackdrop(Graphics& g, RECT client) {
    fillVGradient(g, 0, 0, (float)client.right, (float)client.bottom, T::navyTop, T::navyBottom);
    Image* thumb = thumbnail(g_settings.spotId, g_settings.showCharacters);
    if (thumb && thumb->GetLastStatus() == Ok) {
        // APPROX: GDI+ has no cheap gaussian blur; draw the thumbnail scaled to
        // fill at low opacity, then re-lay the navy gradient at ~0.6 over it so
        // it reads as a dim backdrop rather than a sharp picture.
        ImageAttributes attr;
        ColorMatrix cm = {};
        cm.m[0][0] = cm.m[1][1] = cm.m[2][2] = 1;
        cm.m[3][3] = 0.28f;   // ~0.45 * (gradient darkening)
        cm.m[4][4] = 1;
        attr.SetColorMatrix(&cm);
        int iw = thumb->GetWidth(), ih = thumb->GetHeight();
        float scale = (std::max)((float)client.right / iw, (float)client.bottom / ih);
        int dw = (int)(iw * scale), dh = (int)(ih * scale);
        int dx = (client.right - dw) / 2, dy = (client.bottom - dh) / 2;
        Rect dst(dx, dy, dw, dh);
        g.DrawImage(thumb, dst, 0, 0, iw, ih, UnitPixel, &attr);
        LinearGradientBrush veil(RectF(0, -0.5f, (float)client.right, client.bottom + 1.0f),
                                 rgb(28, 33, 84, 140), rgb(38, 46, 102, 191), LinearGradientModeVertical);
        g.FillRectangle(&veil, 0, 0, client.right, client.bottom);
    }
}

// ---- Arrow slab (ArrowSlab shape from Theme.swift) ----
void arrowSlabPath(GraphicsPath& p, float x, float y, float w, float h) {
    float tip = (std::min)(18.0f, h / 2);
    p.StartFigure();
    p.AddLine(x, y, x + w - tip, y);
    p.AddLine(x + w - tip, y, x + w, y + h / 2);
    p.AddLine(x + w, y + h / 2, x + w - tip, y + h);
    p.AddLine(x + w - tip, y + h, x, y + h);
    p.CloseFigure();
}

// =======================================================================
//  Left column: tab slabs (배경 / 상세 / 정보)
// =======================================================================
const int kTabH = 46;
const int kTabSpacing = 18;
const int kColumnTop = 18;
const int kSelectedShift = 12;   // selected slab juts into the middle column

// Returns the top y of tab index i (0-based) inside the sidebar.
int tabTop(int i) { return kColumnTop + i * (kTabH + kTabSpacing); }

void paintSidebar(Graphics& g, RECT client) {
    // Background gradient (tabBottom 0.55 -> navyTop 0.35).
    fillVGradient(g, 0, 0, (float)kSidebarW, (float)client.bottom,
                  rgb(61, 74, 176, 140), rgb(28, 33, 84, 89));

    struct TabDef { Tab tab; const char* title; };
    const TabDef tabs[] = {{Tab::Scene, kTabScene}, {Tab::Display, kTabDisplay}, {Tab::About, kTabAbout}};
    const int leftPad = 16;

    for (int i = 0; i < 3; ++i) {
        int y = tabTop(i);
        bool selected = g_tab == tabs[i].tab;
        Tab thisTab = tabs[i].tab;

        if (selected) {
            // Teal arrow slab, shifted +12 into the middle column.
            // Same width as the other slabs, offset +12: the arrow tip ends 12pt
            // into the middle column, just short of the sub-row text (x+16).
            float sx = (float)(leftPad + kSelectedShift);
            float sw = (float)(kSidebarW - leftPad);
            GraphicsPath slab;
            arrowSlabPath(slab, sx, (float)y, sw, (float)kTabH);
            LinearGradientBrush fill(RectF(sx, y - 0.5f, sw, kTabH + 1.0f), T::tealTop, T::tealBottom, LinearGradientModeVertical);
            g.FillPath(&fill, &slab);
            Pen edge(rgb(255, 255, 255, 191), 1.5f);
            g.DrawPath(&edge, &slab);
            // Title centred between the left edge and the sparkle, like the
            // mac HStack (Spacer, title, Spacer, sparkle + 20pt padding).
            drawText(g, tabs[i].title, sx, y + (kTabH - 16) / 2.0f - 1, 16, T::white, true,
                     StringAlignmentCenter, sw - 20 - 11 - 8);
            drawText(g, "\xE2\x9C\xA6", sx + sw - 20 - 11, y + (kTabH - 12) / 2.0f, 12, T::white, true);   // ✦
        } else {
            // Indigo slab with a light top edge, right padding 18.
            float sx = (float)leftPad;
            float sw = (float)(kSidebarW - leftPad - 18);
            fillVGradient(g, sx, (float)y, sw, (float)kTabH, T::tabTop, T::tabBottom);
            fillRect(g, sx, (float)y, sw, 1.5f, T::tabEdge);           // top edge
            Pen border(rgb(0, 0, 0, 64), 1);
            g.DrawRectangle(&border, sx, (float)y, sw, (float)kTabH);
            drawText(g, tabs[i].title, sx, y + (kTabH - 16) / 2.0f, 16, T::white, true,
                     StringAlignmentCenter, sw);
        }
        addHit(0, y - kTabSpacing / 2, kSidebarW, kTabH + kTabSpacing, [thisTab]() {
            g_tab = thisTab; g_expanded = Option::None;
        });
    }
}

// =======================================================================
//  Middle column: sub-tab rows
// =======================================================================
const int kSubRowH = 44;

// One middle-column row: optional band icon, title, optional magenta badge,
// teal fill when selected, a hairline under it.
void subTabRow(Graphics& g, int y, const std::string& title, Image* icon,
               bool selected, const char* badge, std::function<void()> onClick) {
    // The column starts right of the sidebar (drawing and hit rects alike).
    const float x = (float)kSidebarW, w = (float)kSubTabW;
    if (selected) {
        LinearGradientBrush fill(RectF(x, y - 0.5f, w, kSubRowH + 1.0f),
                                 rgb(77, 184, 199, 242), rgb(61, 163, 184, 204), LinearGradientModeVertical);
        g.FillRectangle(&fill, x, (float)y, w, (float)kSubRowH);
    }
    float tx = x + 16;
    if (icon && icon->GetLastStatus() == Ok) {
        g.DrawImage(icon, x + 16, (float)(y + (kSubRowH - 22) / 2), 22.0f, 22.0f);
        tx = x + 16 + 22 + 8;
    }
    drawText(g, title.c_str(), tx, y + (kSubRowH - 14) / 2.0f, 14, T::white, true);
    if (badge) {
        // Small magenta capsule badge to the right of the title (APPROX size).
        float bw = 46, bh = 16, bx = tx + 90, by = y + (kSubRowH - bh) / 2;
        GraphicsPath cap; capsulePath(cap, bx, by, bw, bh);
        SolidBrush m(T::magenta); g.FillPath(&m, &cap);
        drawText(g, badge, bx, by + 1, 10, T::white, true, StringAlignmentCenter, bw);
    }
    fillRect(g, x, (float)(y + kSubRowH - 1), w, 1, rgb(255, 255, 255, 71));   // hairline
    addHit(kSidebarW, y, kSubTabW, kSubRowH, std::move(onClick));
}

void paintSubTabs(Graphics& g, RECT client) {
    // Column background: panel at 0.72.
    fillRect(g, (float)kSidebarW, 0, (float)kSubTabW, (float)client.bottom, rgb(23, 26, 64, 184));

    int top = kColumnTop + 1;
    switch (g_tab) {
    case Tab::Scene: {
        // Band list, rows from the top (scrollable in the mac app; the list is
        // short here so we draw them all).
        int y = top;
        for (const auto& band : bandOrder()) {
            std::string b = band;
            subTabRow(g, y, band, bandIcon(band), g_band == band, nullptr,
                      [b]() { g_band = b; });
            y += kSubRowH;
        }
        break;
    }
    case Tab::Display: {
        // 표시 / 셔플 rows start level with the 상세 tab (index 1).
        int y = top + tabTop(1) - kColumnTop;
        subTabRow(g, y, kSecDisplay, nullptr, g_section == Section::Display, nullptr,
                  []() { g_section = Section::Display; g_expanded = Option::None; });
        subTabRow(g, y + kSubRowH, kSecShuffle, nullptr, g_section == Section::Shuffle, nullptr,
                  []() { g_section = Section::Shuffle; g_expanded = Option::None; });
        break;
    }
    case Tab::About: {
        // Single '앱 정보' row, level with the 정보 tab (index 2).
        int y = top + tabTop(2) - kColumnTop;
        subTabRow(g, y, kAppInfo, nullptr, true, nullptr, []() {});
        break;
    }
    }
}

// =======================================================================
//  Right column: scene grid (배경)
// =======================================================================
void paintSceneGrid(Graphics& g, RECT client) {
    const int ox = kSidebarW + kSubTabW;   // pane origin x
    const int padH = 26, padV = 20;
    int paneW = client.right - ox;
    int x0 = ox + padH;
    int contentW = paneW - padH * 2;

    // Header: band name + rule (+ 전체 선택/해제 in shuffle mode).
    int y = padV;
    drawText(g, g_band.c_str(), (float)x0, (float)y + 4, 20, T::white, true);
    auto spots = spotsForBand(g_band);
    if (g_settings.shuffle) {
        bool allIn = !spots.empty();
        for (auto* e : spots) if (!g_settings.shufflePool.count(e->id)) { allIn = false; break; }
        const char* label = allIn ? "\xEC\xA0\x84\xEC\xB2\xB4 \xED\x95\xB4\xEC\xA0\x9C"   // 전체 해제
                                   : "\xEC\xA0\x84\xEC\xB2\xB4 \xEC\x84\xA0\xED\x83\x9D"; // 전체 선택
        float bw = 96, bh = 34, bx = (float)(ox + paneW - padH - bw), by = (float)y;
        GraphicsPath cap; capsulePath(cap, bx, by, bw, bh);
        LinearGradientBrush fill(RectF(bx, by - 0.5f, bw, bh + 1), T::tabTop, T::tabBottom, LinearGradientModeVertical);
        g.FillPath(&fill, &cap);
        Pen edge(T::tabEdge, 1.5f); g.DrawPath(&edge, &cap);
        drawText(g, label, bx, by + (bh - 14) / 2, 14, T::white, true, StringAlignmentCenter, bw);
        std::vector<std::string> ids; for (auto* e : spots) ids.push_back(e->id);
        addHit((int)bx, (int)by, (int)bw, (int)bh, [ids, allIn]() {
            for (const auto& id : ids) {
                if (allIn) g_settings.shufflePool.erase(id);
                else g_settings.shufflePool.insert(id);
            }
            onSettingsChanged();
        });
    }
    y += 38;
    fillRect(g, (float)x0, (float)y, (float)contentW, 1, rgb(255, 255, 255, 178));   // rule
    y += 8;

    // Grid: 3 columns, 16:9 tiles, spacing 16/18 (SettingsView columns).
    const int cols = 3, gap = 16, rowGap = 18;
    int cellW = (contentW - gap * (cols - 1)) / cols;
    int cellH = cellW * 9 / 16;

    // Clip the scrolling region so tiles do not spill over the header/footer.
    int clipTop = y;
    int clipBottom = client.bottom - padV;
    Region oldClip; g.GetClip(&oldClip);
    g.SetClip(RectF((float)ox, (float)clipTop, (float)paneW, (float)(clipBottom - clipTop)));

    int gy = clipTop + 6 - g_sceneScroll;
    int col = 0;
    for (auto* e : spots) {
        int x = x0 + col * (cellW + gap);
        bool current = (e->id == g_settings.spotId);
        bool pooled = g_settings.shufflePool.count(e->id) > 0;
        bool unpooled = g_settings.shuffle && !pooled;

        // Thumbnail (rounded corners r=8), dimmed when unpooled.
        GraphicsPath clip; roundRectPath(clip, (float)x, (float)gy, (float)cellW, (float)cellH, 8);
        Region tileRegion(&clip);
        Region prev; g.GetClip(&prev);
        g.SetClip(&tileRegion, CombineModeIntersect);
        Image* img = thumbnail(e->id, g_settings.showCharacters);
        if (img && img->GetLastStatus() == Ok) {
            if (unpooled) {
                ImageAttributes attr; ColorMatrix cm = {};
                cm.m[0][0] = cm.m[1][1] = cm.m[2][2] = 1; cm.m[3][3] = 0.45f; cm.m[4][4] = 1;
                attr.SetColorMatrix(&cm);
                Rect dst(x, gy, cellW, cellH);
                g.DrawImage(img, dst, 0, 0, img->GetWidth(), img->GetHeight(), UnitPixel, &attr);
            } else {
                g.DrawImage(img, x, gy, cellW, cellH);
            }
        } else {
            fillRect(g, (float)x, (float)gy, (float)cellW, (float)cellH, rgb(40, 40, 46));
        }
        g.SetClip(&prev, CombineModeReplace);

        // Border: teal when selected/pooled, faint white otherwise.
        bool highlighted = current || (g_settings.shuffle && pooled);
        Pen border(highlighted ? T::tealTop : rgb(255, 255, 255, 89), highlighted ? 3.0f : 1.0f);
        GraphicsPath bp; roundRectPath(bp, (float)x, (float)gy, (float)cellW, (float)cellH, 8);
        g.DrawPath(&border, &bp);

        // Corner badge (top-right, padding 6).
        if (current || (g_settings.shuffle && pooled)) {
            float bd = 22, bx = x + cellW - bd - 6, by = gy + 6;
            SolidBrush white(T::white); g.FillEllipse(&white, bx, by, bd, bd);
            SolidBrush teal(T::tealTop); g.FillEllipse(&teal, bx + 2, by + 2, bd - 4, bd - 4);
            drawText(g, "\xE2\x9C\x93", bx, by + 1, 14, T::white, true, StringAlignmentCenter, bd);  // ✓
        } else if (unpooled) {
            float bd = 22, bx = x + cellW - bd - 6, by = gy + 6;
            Pen ring(T::white, 2); g.DrawEllipse(&ring, bx, by, bd, bd);
        }

        // Name under the tile.
        drawText(g, e->name.c_str(), (float)x, (float)(gy + cellH + 4), 13, T::white, highlighted);

        std::string id = e->id;
        addHit(x, gy, cellW, cellH + 22, [id]() {
            if (g_settings.shuffle) {
                if (g_settings.shufflePool.count(id)) g_settings.shufflePool.erase(id);
                else g_settings.shufflePool.insert(id);
            } else {
                g_settings.spotId = id;
                requestSpotChangeFromSettings();
            }
            onSettingsChanged();
        });

        if (++col == cols) { col = 0; gy += cellH + 22 + rowGap; }
    }
    if (col != 0) gy += cellH + 22 + rowGap;
    g_sceneContentH = (gy + g_sceneScroll) - (clipTop + 6);

    g.SetClip(&oldClip, CombineModeReplace);
}

// =======================================================================
//  Right column: option pill (상세)
// =======================================================================
const int kPillHeaderH = 64;
const int kPillRadius = 32;    // headerH / 2
const int kPillW = 430;        // SettingsView detail column width

// DropPanel: rect from header mid-height down, square top corners, bottom
// corners radius, MINUS the header capsule. We fill the whole region with
// pillOpen, then over-fill the header capsule with the pill colour so the
// panel is flush with the capsule's lower contour.
void paintOpenPanel(Graphics& g, float x, float y, float w, float totalH) {
    float top = kPillHeaderH / 2.0f;
    // Panel body: square top, rounded bottom (radius kPillRadius).
    GraphicsPath body;
    float by = y + top, bh = totalH - top, r = (float)kPillRadius;
    body.StartFigure();
    body.AddLine(x, by, x + w, by);
    body.AddArc(x + w - r * 2, by + bh - r * 2, r * 2, r * 2, 0, 90);
    body.AddArc(x, by + bh - r * 2, r * 2, r * 2, 90, 90);
    body.CloseFigure();
    // Subtract the header capsule.
    GraphicsPath header; capsulePath(header, x, y, w, (float)kPillHeaderH);
    Region region(&body);
    region.Exclude(&header);
    SolidBrush fill(T::pillOpen);
    g.FillRegion(&fill, &region);
}

// Draw one option pill; returns the total height it occupied.
// `drawDetail` paints the opened panel's inner content given its content-top y
// and returns its content height; only called when expanded.
int paintPill(Graphics& g, int x, int y, const char* title, const char* value,
              bool enabled, const char* badge, bool expanded, bool expandable,
              std::function<void()> onHeader,
              std::function<int(int detailY)> drawDetail) {
    // First measure the detail height (if open) to size the panel.
    int detailContentH = 0;
    int detailTop = y + kPillHeaderH + 14;   // .padding(.top, 14)
    if (expanded && drawDetail) {
        detailContentH = drawDetail(-1);      // measure pass (negative = measure)
    }
    int totalH = kPillHeaderH;
    if (expanded) totalH += 14 + detailContentH + 18;   // top+content+bottom padding

    // Opened panel behind everything.
    if (expanded) paintOpenPanel(g, (float)x, (float)y, (float)kPillW, (float)totalH);

    // Header capsule (pill @ 0.55; stroke hidden while open).
    GraphicsPath cap; capsulePath(cap, (float)x, (float)y, (float)kPillW, (float)kPillHeaderH);
    SolidBrush capFill(rgb(43, 51, 115, 140));   // pill.opacity(0.55)
    g.FillPath(&capFill, &cap);
    if (!expanded) {
        Pen edge(rgb(120, 135, 214, 204), 1);    // pillEdge 0.8
        g.DrawPath(&edge, &cap);
    }

    // Header content: title (+ badge), white hairline, value; triangle at right.
    float tx = x + 34;              // .padding(.leading, 34)
    float innerW = kPillW - 34 - 28 - 22 - 14;
    drawText(g, title, tx, y + 12, 13, T::white, true);
    if (badge) {
        float tw = 0;   // rough offset after the title
        Font f(&uiFamily(), 13, FontStyleBold, UnitPixel);
        RectF lay(0, 0, 1000, 100), b;
        g.MeasureString(toW(title).c_str(), -1, &f, lay, &b); tw = b.Width;
        float bw = 52, bh = 16, bx = tx + tw + 8, by = y + 11;
        GraphicsPath bc; capsulePath(bc, bx, by, bw, bh);
        SolidBrush m(T::magenta); g.FillPath(&m, &bc);
        drawText(g, badge, bx, by + 1, 10, T::white, true, StringAlignmentCenter, bw);
    }
    fillRect(g, tx, y + 12 + 20, innerW, 1, rgb(255, 255, 255, 217));   // white hairline
    drawText(g, value, tx, y + 12 + 20 + 6, 16, T::white, true);
    // Triangle: ▲ closed, ▼ open (open only when expandable).
    const char* tri = (expandable && expanded) ? "\xE2\x96\xBC" : "\xE2\x96\xB2";  // ▼ / ▲
    drawText(g, tri, x + kPillW - 34, y + (kPillHeaderH - 17) / 2.0f, 15, T::white, true,
             StringAlignmentCenter, 22);

    // Real detail paint.
    if (expanded && drawDetail) drawDetail(detailTop);

    // Header hit-target (opacity gates interaction).
    if (enabled) addHit(x, y, kPillW, kPillHeaderH, std::move(onHeader));
    return totalH;
}

// RadioChoice (164x42 capsule, radio at the left, teal when selected).
void radioChoice(Graphics& g, int x, int y, const char* title, bool selected,
                 std::function<void()> onClick) {
    const int w = 164, h = 42;
    GraphicsPath cap; capsulePath(cap, (float)x, (float)y, (float)w, (float)h);
    if (selected) {
        LinearGradientBrush fill(RectF((float)x, y - 0.5f, (float)w, h + 1.0f),
                                 T::teal, rgb(61, 163, 184, 217), LinearGradientModeVertical);
        g.FillPath(&fill, &cap);
    } else {
        SolidBrush fill(rgb(23, 26, 64, 115));   // panel 0.45
        g.FillPath(&fill, &cap);
    }
    // Radio (33x33), leading pad 4, spacing 14.
    drawGameRadio(g, (float)(x + 4), (float)(y + (h - 33) / 2), 33, selected);
    drawText(g, title, (float)(x + 4 + 33 + 14), (float)(y + (h - 14) / 2), 14, T::white, true);
    addHit(x, y, w, h, std::move(onClick));
}

// StepButton (46x46 rounded rect with a chevron).
void stepButton(Graphics& g, int x, int y, bool up, bool enabled, std::function<void()> onClick) {
    const int s = 46;
    GraphicsPath rr; roundRectPath(rr, (float)x, (float)y, (float)s, (float)s, 5);
    LinearGradientBrush fill(RectF((float)x, y - 0.5f, (float)s, s + 1.0f), T::tabTop, T::tabBottom, LinearGradientModeVertical);
    Region rg(&rr);
    // Manual opacity for disabled state via a translucent veil after fill.
    g.FillPath(&fill, &rr);
    Pen edge(rgb(255, 255, 255, 217), 1.5f); g.DrawPath(&edge, &rr);
    drawText(g, up ? "\xE2\x8C\x83" : "\xE2\x8C\x84", (float)x, (float)(y + (s - 17) / 2.0f - 2), 17,
             T::white, true, StringAlignmentCenter, (float)s);   // ⌃ / ⌄ chevrons
    if (!enabled) fillRect(g, (float)x, (float)y, (float)s, (float)s, rgb(24, 24, 28, 150));   // dim veil
    if (enabled) addHit(x, y, s, s, std::move(onClick));
}

// =======================================================================
//  Right column: 상세 (표시 / 셔플) pane
// =======================================================================
const char* intervalShort(ShuffleInterval iv) {
    switch (iv) {
        case ShuffleInterval::minute1:   return "1\xEB\xB6\x84";      // 1분
        case ShuffleInterval::minutes5:  return "5\xEB\xB6\x84";      // 5분
        case ShuffleInterval::minutes10: return "10\xEB\xB6\x84";     // 10분
        case ShuffleInterval::minutes30: return "30\xEB\xB6\x84";     // 30분
        case ShuffleInterval::hour1:     return "1\xEC\x8B\x9C\xEA\xB0\x84"; // 1시간
    }
    return "10\xEB\xB6\x84";
}

void resetSection() {
    if (g_section == Section::Display) {
        g_settings.showCharacters = true;
        g_settings.cursorParallax = true;
    } else {
        g_settings.shuffle = false;
        g_settings.shuffleInterval = ShuffleInterval::minutes10;
        for (const auto& e : g_catalog) g_settings.shufflePool.insert(e.id);
    }
    onSettingsChanged();
}

void paintDetailPane(Graphics& g, RECT client) {
    const int ox = kSidebarW + kSubTabW;
    const int padH = 30, padV = 20;
    int paneW = client.right - ox;
    // The pill column is right-aligned (topTrailing), width 430.
    int x = ox + paneW - padH - kPillW;

    // Clip the scrolling pill list (leave room for the reset button footer).
    int clipTop = padV;
    int resetH = 38 + 16;
    int clipBottom = client.bottom - padV - resetH;
    Region oldClip; g.GetClip(&oldClip);
    g.SetClip(RectF((float)ox, (float)clipTop, (float)paneW, (float)(clipBottom - clipTop)));

    int y = clipTop + 2 - g_detailScroll;

    auto onOffPill = [&](Option opt, const char* title, bool* value, const char* badge) {
        bool expanded = (g_expanded == opt);
        int used = paintPill(g, x, y, title, *value ? kOn : kOff, true, badge, expanded, true,
            [opt]() { g_expanded = (g_expanded == opt) ? Option::None : opt; },
            [&, value](int detailY) -> int {
                if (detailY < 0) return 42;   // measure: one row of radios
                int rx = x + 22;              // .padding(.horizontal, 22)
                radioChoice(g, rx, detailY, kOff, !*value, [value]() { *value = false; onSettingsChanged(); });
                radioChoice(g, rx + 164 + 16, detailY, kOn, *value, [value]() { *value = true; onSettingsChanged(); });
                return 42;
            });
        y += used + 14;   // VStack spacing 14
    };

    if (g_section == Section::Display) {
        onOffPill(Option::Characters, kChars, &g_settings.showCharacters, nullptr);
        onOffPill(Option::Parallax, kParallax, &g_settings.cursorParallax, nullptr);
        // NOTE: '잠금 화면에도 표시' is omitted -- the Windows app has no
        // desktop-picture / lock-screen mirror setting (SPEC: omit unless an
        // equivalent exists). See onp_settings.h Settings (no lockScreen field).
    } else {
        onOffPill(Option::Shuffle, kShuffle, &g_settings.shuffle,
                  g_settings.shuffle ? kApplied : nullptr);

        // Interval stepper pill (enabled only in shuffle).
        {
            const ShuffleInterval order[] = {ShuffleInterval::minute1, ShuffleInterval::minutes5,
                ShuffleInterval::minutes10, ShuffleInterval::minutes30, ShuffleInterval::hour1};
            int idx = 2;
            for (int i = 0; i < 5; ++i) if (order[i] == g_settings.shuffleInterval) idx = i;
            bool expanded = (g_expanded == Option::Interval && g_settings.shuffle);
            int used = paintPill(g, x, y, kInterval, intervalShort(g_settings.shuffleInterval),
                g_settings.shuffle, nullptr, expanded, true,
                []() { g_expanded = (g_expanded == Option::Interval) ? Option::None : Option::Interval; },
                [&, idx](int detailY) -> int {
                    if (detailY < 0) return 50;   // measure: stepper row (46) + top pad
                    int dy = detailY + 4;         // StepperField .padding(.top, 4)
                    int innerX = x + 22, innerW = kPillW - 44;
                    bool canDown = idx > 0, canUp = idx < 4;
                    stepButton(g, innerX, dy, false, canDown, [idx, order]() {
                        if (idx > 0) { g_settings.shuffleInterval = order[idx - 1]; onSettingsChanged(); }
                    });
                    stepButton(g, innerX + innerW - 46, dy, true, canUp, [idx, order]() {
                        if (idx < 4) { g_settings.shuffleInterval = order[idx + 1]; onSettingsChanged(); }
                    });
                    // Value field between the buttons.
                    int vx = innerX + 46 + 12, vw = innerW - (46 + 12) * 2;
                    GraphicsPath rr; roundRectPath(rr, (float)vx, (float)dy, (float)vw, 46, 6);
                    SolidBrush pf(rgb(23, 26, 64, 191)); g.FillPath(&pf, &rr);
                    drawText(g, intervalShort(g_settings.shuffleInterval), (float)vx, (float)(dy + (46 - 18) / 2.0f),
                             18, T::white, true, StringAlignmentCenter, (float)vw);
                    return 50;
                });
            y += used + 14;
        }

        // 셔플 대상 -> navigates to 배경 (no panel).
        {
            char valbuf[64];
            std::snprintf(valbuf, sizeof(valbuf), "%d\xEA\xB0\x9C \xEC\x9E\xA5\xEB\xA9\xB4",   // "N개 장면"
                          (int)g_settings.shufflePool.size());
            int used = paintPill(g, x, y, kShuffleTgt, valbuf, g_settings.shuffle, nullptr, false, false,
                []() { g_tab = Tab::Scene; g_expanded = Option::None; }, nullptr);
            y += used + 14;
        }
    }
    g_detailContentH = (y + g_detailScroll) - (clipTop + 2);

    g.SetClip(&oldClip, CombineModeReplace);

    // "기본값으로 되돌리기" (bottom-right of the pane), always visible.
    {
        const int bw = 180, bh = 38;
        int bx = ox + paneW - padH - bw;
        int by = client.bottom - padV - bh;
        GraphicsPath cap; capsulePath(cap, (float)bx, (float)by, (float)bw, (float)bh);
        LinearGradientBrush fill(RectF((float)bx, by - 0.5f, (float)bw, bh + 1.0f), T::tabTop, T::tabBottom, LinearGradientModeVertical);
        g.FillPath(&fill, &cap);
        Pen edge(T::tabEdge, 1.5f); g.DrawPath(&edge, &cap);
        drawText(g, kResetSect, (float)bx, (float)(by + (bh - 14) / 2), 14, T::white, true, StringAlignmentCenter, bw);
        addHit(bx, by, bw, bh, []() { resetSection(); });
    }
}

// =======================================================================
//  Right column: 정보 (About) pane
// =======================================================================
HICON g_appIcon = nullptr;

void paintAboutPane(Graphics& g, RECT client) {
    const int ox = kSidebarW + kSubTabW;
    const int padH = 26, padV = 20;
    int paneW = client.right - ox;
    int x0 = ox + padH;
    int contentW = paneW - padH * 2;
    int y = padV;

    // Title + rule.
    drawText(g, kInfoTitle, (float)x0, (float)(y + 4), 20, T::white, true);
    y += 38;
    fillRect(g, (float)x0, (float)y, (float)contentW, 1, rgb(255, 255, 255, 178));
    y += 6 + 6;

    // App icon (the exe's own icon, like NSApp.applicationIconImage) + name + version.
    int iconSize = 76;
    if (!g_appIcon) {
        g_appIcon = (HICON)LoadImageW(g_hinst, MAKEINTRESOURCEW(1), IMAGE_ICON, iconSize, iconSize, 0);
        if (!g_appIcon) g_appIcon = LoadIconW(nullptr, IDI_APPLICATION);
    }
    if (g_appIcon) {
        // Draw via GDI+ (Bitmap::FromHICON) so the world scale transform is
        // honoured. DrawIconEx over GetHDC() would ignore g.ScaleTransform and
        // land the icon at unscaled device coordinates.
        Bitmap* iconBmp = Bitmap::FromHICON(g_appIcon);
        if (iconBmp && iconBmp->GetLastStatus() == Ok)
            g.DrawImage(iconBmp, x0, y, iconSize, iconSize);
        delete iconBmp;
    }
    int tx = x0 + iconSize + 18;
    drawText(g, kAppName, (float)tx, (float)(y + 12), 22, T::white, true);
    drawText(g, versionString().c_str(), (float)tx, (float)(y + 44), 13, rgb(255, 255, 255, 204), true);
    y += iconSize + 6 + 6;

    // Licence box (black 0.22, rounded 6).
    int boxPad = 14;
    int textW = contentW - boxPad * 2;
    float h1 = measureTextHeight(g, kLicBody1, 11, (float)textW, false);
    float h2 = measureTextHeight(g, kLicBody2, 11, (float)textW, false);
    int boxH = boxPad + 20 + 8 + (int)h1 + 6 + (int)h2 + boxPad;
    GraphicsPath box; roundRectPath(box, (float)x0, (float)y, (float)contentW, (float)boxH, 6);
    SolidBrush boxBg(rgb(0, 0, 0, 56)); g.FillPath(&boxBg, &box);
    int ly = y + boxPad;
    drawText(g, kLicense, (float)(x0 + boxPad), (float)ly, 13, T::white, true);
    ly += 20;
    fillRect(g, (float)(x0 + boxPad), (float)ly, (float)textW, 1, rgb(255, 255, 255, 153));
    ly += 8;
    drawText(g, kLicBody1, (float)(x0 + boxPad), (float)ly, 11, rgb(255, 255, 255, 199), false, StringAlignmentNear, (float)textW);
    ly += (int)h1 + 6;
    drawText(g, kLicBody2, (float)(x0 + boxPad), (float)ly, 11, rgb(255, 255, 255, 199), false, StringAlignmentNear, (float)textW);
    y += boxH + 6 + 6;

    // Lavender bug-report button (280 wide), opens a mailto: via ShellExecuteW.
    {
        const int bw = 280, bh = 46;
        GraphicsPath rr; roundRectPath(rr, (float)x0, (float)y, (float)bw, (float)bh, 4);
        LinearGradientBrush fill(RectF((float)x0, y - 0.5f, (float)bw, bh + 1.0f), T::lavTop, T::lavBottom, LinearGradientModeVertical);
        g.FillPath(&fill, &rr);
        Pen edge(rgb(255, 255, 255, 230), 1); g.DrawPath(&edge, &rr);
        drawText(g, kBugReport, (float)x0, (float)(y + (bh - 15) / 2), 15, T::ink, true, StringAlignmentCenter, bw);
        addHit(x0, y, bw, bh, []() {
            // mailto: with a prefilled subject (URL-encoded). Opens the default
            // mail handler; ShellExecuteW picks whatever the user has set.
            std::string subject = "[BDON Immersive Home] \xEB\xB2\x84\xEA\xB7\xB8 \xEB\xA6\xAC\xED\x8F\xAC\xED\x8A\xB8 / \xEC\xA0\x9C\xEC\x95\x88"; // 버그 리포트 / 제안
            // Percent-encode the subject bytes.
            std::string enc;
            for (unsigned char ch : subject) {
                if (isalnum(ch) || ch == '-' || ch == '_' || ch == '.' || ch == '~') enc.push_back((char)ch);
                else { char b[4]; std::snprintf(b, sizeof(b), "%%%02X", ch); enc += b; }
            }
            std::string url = std::string("mailto:") + kContact + "?subject=" + enc;
            ShellExecuteW(nullptr, L"open", toW(url).c_str(), nullptr, nullptr, SW_SHOWNORMAL);
        });
    }
}

// =======================================================================
//  Paint entry point
// =======================================================================
void paint(HDC hdc, RECT client) {
    Graphics g(hdc);
    g.SetSmoothingMode(SmoothingModeAntiAlias);
    g.SetInterpolationMode(InterpolationModeHighQualityBicubic);
    g.SetTextRenderingHint(TextRenderingHintAntiAliasGridFit);
    g.ScaleTransform(g_uiScale, g_uiScale);   // everything below is logical px

    g_hits.clear();

    paintBackdrop(g, client);
    paintSubTabs(g, client);        // middle column first (selected slab overlaps it)

    switch (g_tab) {
        case Tab::Scene:   paintSceneGrid(g, client); break;
        case Tab::Display: paintDetailPane(g, client); break;
        case Tab::About:   paintAboutPane(g, client); break;
    }

    paintSidebar(g, client);        // last: selected arrow slab draws over the middle column
}

// ---- easter egg ----
char vkLetter(WPARAM vk) {
    if (vk >= 'A' && vk <= 'Z') return (char)('a' + (vk - 'A'));
    return 0;
}

void handleEggKey(char letter) {
    g_eggBuffer.push_back(letter);
    if (g_eggBuffer.size() > 16) g_eggBuffer.erase(0, g_eggBuffer.size() - 16);
    static const std::vector<std::pair<std::string, EasterEgg>> codes = {
        {"tmtk", EasterEgg::tomoTaki}, {"tktm", EasterEgg::tomoTaki},
        {"tomotaki", EasterEgg::tomoTaki}, {"takitomo", EasterEgg::tomoTaki},
        {"xhahxkzl", EasterEgg::tomoTaki}, {"xkzlxhah", EasterEgg::tomoTaki},
        {"ansy", EasterEgg::anonSoyo}, {"syan", EasterEgg::anonSoyo},
        {"anonsoyo", EasterEgg::anonSoyo}, {"soyoanon", EasterEgg::anonSoyo},
        {"dkshsthdy", EasterEgg::anonSoyo}, {"thdydkshs", EasterEgg::anonSoyo},
    };
    for (const auto& c : codes) {
        if (g_eggBuffer.size() >= c.first.size() &&
            g_eggBuffer.compare(g_eggBuffer.size() - c.first.size(), c.first.size(), c.first) == 0) {
            g_eggBuffer.clear();
            g_settings.easterEgg = (g_settings.easterEgg == c.second) ? EasterEgg::none : c.second;
            onSettingsChanged();
            InvalidateRect(g_settingsHwnd, nullptr, FALSE);
            return;
        }
    }
}

// ---- click dispatch: last-added hit under the point wins (top-most) ----
void onClick(int mx, int my) {
    for (auto it = g_hits.rbegin(); it != g_hits.rend(); ++it) {
        const RECT& r = it->rect;
        if (mx >= r.left && mx < r.right && my >= r.top && my < r.bottom) {
            it->action();
            InvalidateRect(g_settingsHwnd, nullptr, FALSE);
            return;
        }
    }
}

// Which scrollable region the cursor is over, for the wheel.
int* scrollTargetFor(int mx) {
    if (mx < kSidebarW + kSubTabW) return nullptr;
    if (g_tab == Tab::Scene) return &g_sceneScroll;
    if (g_tab == Tab::Display) return &g_detailScroll;
    return nullptr;
}

LRESULT CALLBACK settingsProc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lparam) {
    switch (msg) {
        case WM_KEYDOWN: {
            if (!(GetKeyState(VK_CONTROL) & 0x8000) && !(GetKeyState(VK_MENU) & 0x8000)) {
                char letter = vkLetter(wparam);
                if (letter) handleEggKey(letter);
            }
            return 0;
        }
        case WM_MOUSEWHEEL: {
            POINT pt{GET_X_LPARAM(lparam), GET_Y_LPARAM(lparam)};
            ScreenToClient(hwnd, &pt);
            int lx = (int)(pt.x / g_uiScale);
            int* target = scrollTargetFor(lx);
            if (target) {
                int delta = GET_WHEEL_DELTA_WPARAM(wparam);
                *target -= delta / 2;
                if (*target < 0) *target = 0;
                InvalidateRect(hwnd, nullptr, FALSE);
            }
            return 0;
        }
        case WM_LBUTTONUP: {
            onClick((int)(GET_X_LPARAM(lparam) / g_uiScale), (int)(GET_Y_LPARAM(lparam) / g_uiScale));
            return 0;
        }
        case WM_ERASEBKGND:
            return 1;   // painted fully in WM_PAINT
        case WM_PAINT: {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hwnd, &ps);
            RECT c; GetClientRect(hwnd, &c);
            HDC mem = CreateCompatibleDC(hdc);
            HBITMAP bmp = CreateCompatibleBitmap(hdc, c.right, c.bottom);
            HGDIOBJ old = SelectObject(mem, bmp);
            paint(mem, logicalClient(hwnd));
            BitBlt(hdc, 0, 0, c.right, c.bottom, mem, 0, 0, SRCCOPY);
            SelectObject(mem, old);
            DeleteObject(bmp);
            DeleteDC(mem);
            EndPaint(hwnd, &ps);
            return 0;
        }
        case WM_DESTROY:
            g_settingsHwnd = nullptr;
            return 0;
    }
    return DefWindowProcW(hwnd, msg, wparam, lparam);
}

} // namespace

void openSettingsWindow(HINSTANCE hinst) {
    g_hinst = hinst;
    if (g_settingsHwnd) { SetForegroundWindow(g_settingsHwnd); return; }
    if (!g_gdiplusToken) {
        GdiplusStartupInput in;
        GdiplusStartup(&g_gdiplusToken, &in, nullptr);
    }
    // First open: default band = current spot's band.
    if (g_band.empty()) {
        for (const auto& e : g_catalog) if (e.id == g_settings.spotId) { g_band = e.band; break; }
        if (g_band.empty() && !g_catalog.empty()) g_band = g_catalog.front().band;
    }
    static bool registered = false;
    const wchar_t* cls = L"BDONImmersiveHomeSettings";
    if (!registered) {
        WNDCLASSW wc = {};
        wc.lpfnWndProc = settingsProc;
        wc.hInstance = hinst;
        wc.lpszClassName = cls;
        wc.hCursor = LoadCursorW(nullptr, IDC_ARROW);
        RegisterClassW(&wc);
        registered = true;
    }
    // Fit into the work area of the monitor under the cursor.
    POINT cursor; GetCursorPos(&cursor);
    MONITORINFO mi = {sizeof(mi)};
    GetMonitorInfoW(MonitorFromPoint(cursor, MONITOR_DEFAULTTOPRIMARY), &mi);
    RECT work = mi.rcWork;
    UINT dpi = GetDpiForSystem();
    DWORD style = WS_OVERLAPPEDWINDOW & ~WS_MAXIMIZEBOX;
    RECT frame{0, 0, 0, 0};
    AdjustWindowRectExForDpi(&frame, style, FALSE, 0, dpi);
    int frameW = frame.right - frame.left, frameH = frame.bottom - frame.top;
    float dpiScale = dpi / 96.0f;
    float availW = (float)(work.right - work.left - frameW - 16);
    float availH = (float)(work.bottom - work.top - frameH - 16);
    float fit = (std::min)(1.0f, (std::min)(availW / (kLogicalW * dpiScale), availH / (kLogicalH * dpiScale)));
    g_uiScale = dpiScale * (std::max)(0.4f, fit);
    int w = (int)(kLogicalW * g_uiScale) + frameW, h = (int)(kLogicalH * g_uiScale) + frameH;
    int x = work.left + (std::max)(0L, ((work.right - work.left) - w) / 2);
    int y = work.top + (std::max)(0L, ((work.bottom - work.top) - h) / 2);
    g_settingsHwnd = CreateWindowExW(0, cls, toW(kTitleSettings).c_str(),   // 설정
                                     style, x, y, w, h,
                                     nullptr, nullptr, hinst, nullptr);
    ShowWindow(g_settingsHwnd, SW_SHOW);
    SetForegroundWindow(g_settingsHwnd);
}
