// settings_window.cpp -- custom-painted dark settings window (Win32 + GDI+),
// port of SettingsView.swift. Scrollable band sections with 4-column 16:9
// thumbnails (_bg when characters off), current spot gets an accent border +
// check badge, click selects (or toggles pool membership in shuffle mode).
// Fixed footer: 캐릭터 표시 / 커서 따라 시점 이동 / 장면 셔플 toggles, 변경 주기
// dropdown (enabled only in shuffle), "현재: <name>" on the right. Easter egg:
// layout-independent VK_A..VK_Z typed here toggle 토모타키 / 아논소요 modes.

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <windowsx.h>
#include <objidl.h>
#include <gdiplus.h>

#include <algorithm>
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

ULONG_PTR g_gdiplusToken = 0;
HWND g_settingsHwnd = nullptr;
int g_scroll = 0;                 // vertical scroll offset (logical px)
int g_contentHeight = 0;
// Logical px -> window px: DPI scale, reduced further so the whole window
// (thumbnail grid AND the footer) fits a small screen (a 1024x768 VM).
float g_uiScale = 1;
const int kLogicalW = 4 * 220 + 24 * 2 + 3 * 16;
const int kLogicalH = 760;

RECT logicalClient(HWND hwnd) {
    RECT c;
    GetClientRect(hwnd, &c);
    c.right = (LONG)(c.right / g_uiScale);
    c.bottom = (LONG)(c.bottom / g_uiScale);
    return c;
}

// Easter-egg typed buffer (layout-independent, VK_A..VK_Z).
std::string g_eggBuffer;

// Layout constants (logical px; window is Per-Monitor DPI aware v2 -> we scale).
const int kMargin = 24;
const int kCols = 4;
const int kGap = 16;
const int kFooterH = 120;
const int kBandHeader = 44;

std::wstring toW(const std::string& s) {
    int n = MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), nullptr, 0);
    std::wstring w(n, 0);
    MultiByteToWideChar(CP_UTF8, 0, s.c_str(), (int)s.size(), w.data(), n);
    return w;
}

// Thumbnail cache (id-characters -> Image*).
std::map<std::string, Image*> g_thumbCache;

Image* thumbnail(const std::string& id, bool chars) {
    std::string key = id + (chars ? "-1" : "-0");
    auto it = g_thumbCache.find(key);
    if (it != g_thumbCache.end()) return it->second;
    std::string base = dataRoot() + "\\thumbs\\";
    std::string file = base + id + (chars ? ".jpg" : "_bg.jpg");
    Image* img = Image::FromFile(toW(file).c_str());
    if (!img || img->GetLastStatus() != Ok) {
        delete img;
        img = Image::FromFile(toW(base + id + ".jpg").c_str());  // fallback
    }
    g_thumbCache[key] = img;
    return img;
}

// Hit-test records built during paint, reused on click.
struct Hit { RECT rect; std::string spotId; };
std::vector<Hit> g_hits;

const char* bandIconName(const std::string& band) {
    if (band == "MyGO!!!!!") return "mygo";
    if (band == "Ave Mujica") return "avemujica";
    if (band == "\xe5\xa4\xa2\xe9\x99\x90\xe5\xa4\xa7\xe3\x81\xbf\xe3\x82\x85\xe3\x83\xbc\xe3\x81\x9f\xe3\x81\x84\xe3\x81\xb7") return "yumemita";
    if (band == "millsage") return "millsage";
    return "ikka";
}

std::string currentSpotName() {
    for (const auto& e : g_catalog) if (e.id == g_settings.spotId) return e.name;
    return g_settings.spotId;
}

void paint(HDC hdc, RECT client) {
    Graphics g(hdc);
    g.SetSmoothingMode(SmoothingModeAntiAlias);
    g.SetInterpolationMode(InterpolationModeHighQualityBicubic);
    g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);
    // Everything below is laid out in logical px; `client` is logical too.
    g.ScaleTransform(g_uiScale, g_uiScale);

    // Dark background.
    SolidBrush bg(Color(255, 24, 24, 28));
    g.FillRectangle(&bg, 0, 0, client.right, client.bottom);

    int width = client.right;
    int gridW = width - kMargin * 2;
    int cellW = (gridW - kGap * (kCols - 1)) / kCols;
    int cellH = cellW * 9 / 16;

    g_hits.clear();
    int y = kMargin - g_scroll;

    FontFamily ff(L"Segoe UI");
    Font header(&ff, 18, FontStyleBold, UnitPixel);
    Font nameFont(&ff, 12, FontStyleRegular, UnitPixel);
    SolidBrush white(Color(255, 235, 235, 240));
    SolidBrush dim(Color(255, 140, 140, 150));

    // Group spots by band, in catalog order.
    std::vector<std::string> bandOrder;
    std::map<std::string, std::vector<const SpotIndexEntry*>> groups;
    for (const auto& e : g_catalog) {
        if (!groups.count(e.band)) bandOrder.push_back(e.band);
        groups[e.band].push_back(&e);
    }

    for (const auto& band : bandOrder) {
        // Band header (logo + name).
        StringFormat sf;
        g.DrawString(toW(band).c_str(), -1, &header, PointF((float)kMargin, (float)y), &white);
        y += kBandHeader;

        int col = 0;
        int rowX = kMargin;
        for (const SpotIndexEntry* e : groups[band]) {
            int x = kMargin + col * (cellW + kGap);
            RECT cell{x, y, x + cellW, y + cellH};

            // Thumbnail.
            Image* img = thumbnail(e->id, g_settings.showCharacters);
            if (img && img->GetLastStatus() == Ok)
                g.DrawImage(img, x, y, cellW, cellH);
            else {
                SolidBrush ph(Color(255, 40, 40, 46));
                g.FillRectangle(&ph, x, y, cellW, cellH);
            }

            bool isCurrent = (e->id == g_settings.spotId);
            bool pooled = g_settings.shufflePool.count(e->id) > 0;

            // Shuffle mode: unpooled thumbnails dimmed.
            if (g_settings.shuffle && !pooled) {
                SolidBrush veil(Color(150, 24, 24, 28));
                g.FillRectangle(&veil, x, y, cellW, cellH);
            }

            // Current spot: accent border + check badge.
            if (isCurrent) {
                Pen accent(Color(255, 90, 170, 255), 3);
                g.DrawRectangle(&accent, x, y, cellW - 1, cellH - 1);
                SolidBrush badge(Color(255, 90, 170, 255));
                g.FillEllipse(&badge, x + cellW - 26, y + 6, 20, 20);
                Font check(&ff, 12, FontStyleBold, UnitPixel);
                SolidBrush chk(Color(255, 255, 255, 255));
                g.DrawString(L"\u2713", -1, &check, PointF((float)(x + cellW - 22), (float)(y + 6)), &chk);
            }

            // Name below.
            g.DrawString(toW(e->name).c_str(), -1, &nameFont,
                         PointF((float)x, (float)(y + cellH + 2)), isCurrent ? &white : &dim);

            g_hits.push_back({cell, e->id});
            if (++col == kCols) { col = 0; y += cellH + 28; }
        }
        if (col != 0) y += cellH + 28;
        y += 12;
    }
    g_contentHeight = y + g_scroll;

    // Footer (fixed).
    int fy = client.bottom - kFooterH;
    SolidBrush footerBg(Color(255, 18, 18, 22));
    g.FillRectangle(&footerBg, 0, fy, width, kFooterH);
    Pen line(Color(255, 50, 50, 58), 1);
    g.DrawLine(&line, 0, fy, width, fy);

    Font footFont(&ff, 13, FontStyleRegular, UnitPixel);
    auto checkbox = [&](int x, int yy, bool on, const char* label) {
        Pen box(Color(255, 150, 150, 160), 2);
        g.DrawRectangle(&box, x, yy, 16, 16);
        if (on) {
            SolidBrush fill(Color(255, 90, 170, 255));
            g.FillRectangle(&fill, x + 2, yy + 2, 13, 13);
        }
        g.DrawString(toW(label).c_str(), -1, &footFont, PointF((float)(x + 24), (float)(yy - 1)), &white);
    };
    checkbox(kMargin, fy + 20, g_settings.showCharacters, "\xec\xba\x90\xeb\xa6\xad\xed\x84\xb0 \xed\x91\x9c\xec\x8b\x9c");            // 캐릭터 표시
    checkbox(kMargin, fy + 50, g_settings.cursorParallax, "\xec\xbb\xa4\xec\x84\x9c \xeb\x94\xb0\xeb\x9d\xbc \xec\x8b\x9c\xec\xa0\x90 \xec\x9d\xb4\xeb\x8f\x99"); // 커서 따라 시점 이동
    checkbox(kMargin, fy + 80, g_settings.shuffle, "\xec\x9e\xa5\xeb\xa9\xb4 \xec\x85\x94\xed\x94\x8c");            // 장면 셔플

    // 변경 주기 dropdown (drawn as a labelled box; enabled only in shuffle).
    int ddX = kMargin + 220;
    SolidBrush ddText(g_settings.shuffle ? Color(255, 235, 235, 240) : Color(255, 110, 110, 120));
    std::string interval = std::string("\xeb\xb3\x80\xea\xb2\xbd \xec\xa3\xbc\xea\xb8\xb0: ") + shuffleIntervalLabel(g_settings.shuffleInterval); // 변경 주기:
    g.DrawString(toW(interval).c_str(), -1, &footFont, PointF((float)ddX, (float)(fy + 80)), &ddText);

    // "현재: <name>" on the right.
    std::string cur = std::string("\xed\x98\x84\xec\x9e\xac: ") + currentSpotName(); // 현재:
    RectF layout(0, (float)(fy + 20), (float)(width - kMargin), 20);
    StringFormat right; right.SetAlignment(StringAlignmentFar);
    g.DrawString(toW(cur).c_str(), -1, &footFont, layout, &right, &white);

    // Easter-egg label, if any.
    if (const char* egg = easterEggLabel(g_settings.easterEgg)) {
        RectF eggLayout(0, (float)(fy + 50), (float)(width - kMargin), 20);
        SolidBrush pink(Color(255, 255, 150, 200));
        g.DrawString(toW(egg).c_str(), -1, &footFont, eggLayout, &right, &pink);
    }
}

// Virtual-key (VK_A..VK_Z) -> lowercase letter, layout independent.
char vkLetter(WPARAM vk) {
    if (vk >= 'A' && vk <= 'Z') return (char)('a' + (vk - 'A'));
    return 0;
}

void handleEggKey(char letter) {
    g_eggBuffer.push_back(letter);
    if (g_eggBuffer.size() > 16) g_eggBuffer.erase(0, g_eggBuffer.size() - 16);
    // Codes from EasterEgg.swift (physical QWERTY, so 두벌식 typing matches).
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

void onClick(int mx, int my, RECT client) {
    int fy = client.bottom - kFooterH;
    if (my >= fy) {
        // Footer hit-testing.
        if (mx >= kMargin && mx <= kMargin + 200) {
            if (my >= fy + 18 && my <= fy + 40) { g_settings.showCharacters = !g_settings.showCharacters; }
            else if (my >= fy + 48 && my <= fy + 70) { g_settings.cursorParallax = !g_settings.cursorParallax; }
            else if (my >= fy + 78 && my <= fy + 100) { g_settings.shuffle = !g_settings.shuffle; }
            onSettingsChanged();
            InvalidateRect(g_settingsHwnd, nullptr, FALSE);
        } else if (g_settings.shuffle && mx >= kMargin + 220 && my >= fy + 78 && my <= fy + 100) {
            // Cycle the interval.
            int v = (int)g_settings.shuffleInterval;
            g_settings.shuffleInterval = (ShuffleInterval)((v + 1) % 5);
            onSettingsChanged();
            InvalidateRect(g_settingsHwnd, nullptr, FALSE);
        }
        return;
    }
    for (const auto& h : g_hits) {
        if (mx >= h.rect.left && mx <= h.rect.right && my >= h.rect.top && my <= h.rect.bottom) {
            if (g_settings.shuffle) {
                // Toggle pool membership.
                if (g_settings.shufflePool.count(h.spotId)) g_settings.shufflePool.erase(h.spotId);
                else g_settings.shufflePool.insert(h.spotId);
            } else {
                g_settings.spotId = h.spotId;
                requestSpotChangeFromSettings();
            }
            onSettingsChanged();
            InvalidateRect(g_settingsHwnd, nullptr, FALSE);
            return;
        }
    }
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
            int delta = GET_WHEEL_DELTA_WPARAM(wparam);
            g_scroll -= delta / 2;
            if (g_scroll < 0) g_scroll = 0;
            InvalidateRect(hwnd, nullptr, FALSE);
            return 0;
        }
        case WM_LBUTTONUP: {
            onClick((int)(GET_X_LPARAM(lparam) / g_uiScale), (int)(GET_Y_LPARAM(lparam) / g_uiScale), logicalClient(hwnd));
            return 0;
        }
        case WM_ERASEBKGND:
            return 1;   // painted fully in WM_PAINT
        case WM_PAINT: {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hwnd, &ps);
            RECT c; GetClientRect(hwnd, &c);
            // Double-buffer to avoid flicker.
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
    if (g_settingsHwnd) { SetForegroundWindow(g_settingsHwnd); return; }
    if (!g_gdiplusToken) {
        GdiplusStartupInput in;
        GdiplusStartup(&g_gdiplusToken, &in, nullptr);
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
    // Fit the window into the work area of the monitor under the cursor:
    // DPI scale first, then shrink the whole layout if it would not fit.
    POINT cursor;
    GetCursorPos(&cursor);
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
    g_settingsHwnd = CreateWindowExW(0, cls, L"\uBC30\uACBD \uC124\uC815", // 배경 설정
                                     style, x, y, w, h,
                                     nullptr, nullptr, hinst, nullptr);
    ShowWindow(g_settingsHwnd, SW_SHOW);
    SetForegroundWindow(g_settingsHwnd);
}
