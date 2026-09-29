// main.cpp -- OurNotesWallpaper native Windows entry point. Ports
// WallpaperController.swift / main.swift / AppDelegate.swift behaviour:
//   - one wallpaper window per monitor behind the desktop icons (WorkerW)
//   - tray icon + right-click menu (settings / characters / shuffle / quit)
//   - frame pacing (30 fps active, 5 fps idle), cursor parallax, shuffle timer
//   - pause on lock / display-off / fullscreen
//   - --snapshot offscreen QA render
//   - single instance (named mutex)
//
// The settings window lives in settings_window.cpp.

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <shellapi.h>
#include <wtsapi32.h>
#include <shlobj.h>

#include <algorithm>
#include <atomic>
#include <memory>
#include <mutex>
#include <set>
#include <string>
#include <thread>
#include <vector>

#include "onp_d3d.h"
#include "onp_stage.h"
#include "onp_settings.h"
#include "onp_spot.h"
#include "onp_texture.h"

using namespace onp;

// ---- globals ----

static const wchar_t* kWindowClass = L"OurNotesWallpaperWnd";
static const UINT WM_APP_TRAY = WM_APP + 1;
static const UINT kTrayId = 1;
// Tray menu command ids.
enum {
    kCmdSettings = 100, kCmdCharacters, kCmdShuffle, kCmdQuit,
};

D3DContext g_ctx;                       // shared device (also used by settings window)
Settings g_settings;
std::vector<SpotIndexEntry> g_catalog;

// Forward decls from settings_window.cpp.
void openSettingsWindow(HINSTANCE hinst);
void onSettingsChanged();               // called by settings window on any change

// ---- per-monitor window ----

struct MonitorWindow {
    HWND hwnd = nullptr;
    SwapTarget target;
    RECT rect{};
    float parallaxX = 0, parallaxY = 0;      // smoothed -1..1
};

static std::vector<MonitorWindow> g_windows;
static NOTIFYICONDATAW g_tray = {};
static UINT g_taskbarCreated = 0;

// Spot loading (background thread; swap on UI thread).
static std::mutex g_stageMutex;
static std::unique_ptr<Stage> g_stage;             // live
static std::atomic<bool> g_loadInFlight{false};
static std::string g_pendingDir;                   // requested load (guarded by g_pendingMutex)
static std::mutex g_pendingMutex;
static std::unique_ptr<Stage> g_readyStage;        // loaded, awaiting swap
static std::atomic<bool> g_hasReady{false};

// Runtime pause state.
static std::atomic<bool> g_sessionLocked{false};

static std::string dirForSpotId(const std::string& id) {
    for (const auto& e : g_catalog) if (e.id == id) return e.dir;
    return g_catalog.empty() ? std::string() : g_catalog.front().dir;
}

// EasterEgg.hiddenMembers: in MyGO!!!!! scenes where both kept members are
// present, leave the other pair out (Rana always stays).
static std::set<std::string> hiddenMembersFor(const std::string& dir) {
    std::set<std::string> hidden;
    if (g_settings.easterEgg == EasterEgg::none) return hidden;
    const SpotIndexEntry* spot = nullptr;
    for (const auto& e : g_catalog) if (e.dir == dir) spot = &e;
    if (!spot || spot->band != "MyGO!!!!!") return hidden;
    auto present = [&](const std::string& member) {
        for (auto name : spot->characters) {
            std::transform(name.begin(), name.end(), name.begin(), ::tolower);
            if (name.find(member) != std::string::npos) return true;
        }
        return false;
    };
    bool tomoTaki = g_settings.easterEgg == EasterEgg::tomoTaki;
    std::vector<std::string> kept = tomoTaki ? std::vector<std::string>{"tomori", "taki"}
                                             : std::vector<std::string>{"anon", "soyo"};
    std::vector<std::string> dropped = tomoTaki ? std::vector<std::string>{"anon", "soyo"}
                                                : std::vector<std::string>{"tomori", "taki"};
    for (const auto& m : kept) if (!present(m)) return hidden;
    for (const auto& m : dropped) if (present(m)) hidden.insert(m);
    return hidden;
}

// Load a spot on a worker thread, then hand it to the UI thread (retry twice).
static void requestSpot(const std::string& id) {
    std::string dir = dirForSpotId(id);
    if (dir.empty()) return;
    bool expected = false;
    if (!g_loadInFlight.compare_exchange_strong(expected, true)) {
        std::lock_guard<std::mutex> lock(g_pendingMutex);
        g_pendingDir = dir;   // coalesce: loaded when the current load finishes
        return;
    }
    std::thread([dir]() {
        std::unique_ptr<Stage> loaded;
        for (int attempt = 0; attempt < 3 && !loaded; ++attempt) {
            try {
                loaded = std::make_unique<Stage>(g_ctx, spotsDir(), dir);
            } catch (const std::exception& e) {
                logLine(std::string("spot load failed (attempt ") + std::to_string(attempt + 1) + "): " + e.what());
                if (attempt < 2) std::this_thread::sleep_for(std::chrono::seconds(5));
            }
        }
        if (loaded) {
            logLine("spot loaded: " + dir);
            g_readyStage = std::move(loaded);
            g_hasReady = true;
        }
        g_loadInFlight = false;
    }).detach();
}

// UI thread: take a loaded Spot (settings applied here, where the stage is
// rendered) and start a load that was requested while another one ran.
static void swapInLoadedSpot() {
    if (g_hasReady.exchange(false)) {
        std::lock_guard<std::mutex> lock(g_stageMutex);
        g_stage = std::move(g_readyStage);
        g_stage->setCharactersVisible(g_settings.showCharacters);
        g_stage->setHiddenMembers(hiddenMembersFor(g_stage->dir));
    }
    if (!g_loadInFlight) {
        std::string pending;
        {
            std::lock_guard<std::mutex> lock(g_pendingMutex);
            pending.swap(g_pendingDir);
        }
        if (!pending.empty() && (!g_stage || g_stage->dir != pending)) {
            for (const auto& e : g_catalog) {
                if (e.dir == pending) { requestSpot(e.id); break; }
            }
        }
    }
}

// ---- WorkerW attachment (behaviour 1) ----

static HWND g_workerW = nullptr;

static BOOL CALLBACK findWorkerW(HWND top, LPARAM) {
    HWND shell = FindWindowExW(top, nullptr, L"SHELLDLL_DefView", nullptr);
    if (shell) {
        // The WorkerW that hosts the wallpaper is the sibling AFTER this top window.
        HWND worker = FindWindowExW(nullptr, top, L"WorkerW", nullptr);
        if (worker) g_workerW = worker;
    }
    return TRUE;
}

static HWND resolveWorkerW() {
    HWND progman = FindWindowW(L"Progman", nullptr);
    if (progman) {
        // Ask Progman to spawn the WorkerW behind the icons.
        DWORD_PTR res = 0;
        SendMessageTimeoutW(progman, 0x052C, 0xD, 0x1, SMTO_NORMAL, 1000, &res);
        SendMessageTimeoutW(progman, 0x052C, 0, 0, SMTO_NORMAL, 1000, &res);
    }
    g_workerW = nullptr;
    EnumWindows(findWorkerW, 0);
    if (g_workerW) return g_workerW;
    // Win11 24H2+: the WorkerW/DefView can be a child of Progman.
    if (progman && FindWindowExW(progman, nullptr, L"SHELLDLL_DefView", nullptr))
        return progman;
    return progman;   // last resort: parent to Progman directly
}

// ---- monitor enumeration ----

static LRESULT CALLBACK wndProc(HWND, UINT, WPARAM, LPARAM);

static BOOL CALLBACK addMonitor(HMONITOR mon, HDC, LPRECT, LPARAM lparam) {
    MONITORINFO mi = {sizeof(mi)};
    GetMonitorInfoW(mon, &mi);
    auto* insts = reinterpret_cast<std::vector<RECT>*>(lparam);
    insts->push_back(mi.rcMonitor);
    return TRUE;
}

static void destroyWindows() {
    for (auto& w : g_windows) {
        w.target.release();
        if (w.hwnd) DestroyWindow(w.hwnd);
    }
    g_windows.clear();
}

static void createMonitorWindows(HINSTANCE hinst) {
    destroyWindows();
    HWND worker = resolveWorkerW();

    std::vector<RECT> rects;
    EnumDisplayMonitors(nullptr, nullptr, addMonitor, reinterpret_cast<LPARAM>(&rects));
    if (rects.empty()) { RECT r{0, 0, 1920, 1080}; rects.push_back(r); }

    for (const RECT& r : rects) {
        MonitorWindow mw;
        mw.rect = r;
        int w = r.right - r.left, h = r.bottom - r.top;
        // No focus / taskbar button. Behind the icon layer nothing can click it.
        // (No WS_EX_LAYERED: DXGI flip-model swap chains refuse layered windows.)
        HWND hwnd = CreateWindowExW(
            WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE | WS_EX_TRANSPARENT,
            kWindowClass, L"", WS_POPUP,
            r.left, r.top, w, h, nullptr, nullptr, hinst, nullptr);
        if (!hwnd) continue;
        // Parent into the WorkerW so we sit behind the desktop icons. As a
        // child its position is in WorkerW client coordinates, whose origin is
        // the virtual screen's top-left, not necessarily the primary monitor.
        if (worker) {
            SetWindowLongPtrW(hwnd, GWL_STYLE, (GetWindowLongPtrW(hwnd, GWL_STYLE) & ~WS_POPUP) | WS_CHILD);
            SetParent(hwnd, worker);
            POINT origin{r.left, r.top};
            ScreenToClient(worker, &origin);
            SetWindowPos(hwnd, nullptr, origin.x, origin.y, w, h, SWP_NOZORDER | SWP_NOACTIVATE);
        }
        ShowWindow(hwnd, SW_SHOWNOACTIVATE);

        mw.hwnd = hwnd;
        mw.target.createForWindow(g_ctx, hwnd, w, h);
        {
            RECT wc{};
            if (worker) GetClientRect(worker, &wc);
            char buf[200];
            std::snprintf(buf, sizeof(buf), "monitor %ld,%ld %dx%d dpi %u, workerW client %ldx%ld",
                          r.left, r.top, w, h, GetDpiForWindow(hwnd), wc.right, wc.bottom);
            logLine(buf);
        }
        g_windows.push_back(std::move(mw));
    }
    logLine("created " + std::to_string(g_windows.size()) + " wallpaper window(s)");
}

// ---- pause conditions (behaviour 4) ----

static bool fullscreenAppActive() {
    QUERY_USER_NOTIFICATION_STATE state;
    if (SUCCEEDED(SHQueryUserNotificationState(&state))) {
        // Busy / running D3D fullscreen / presentation -> pause.
        if (state == QUNS_BUSY || state == QUNS_RUNNING_D3D_FULL_SCREEN ||
            state == QUNS_PRESENTATION_MODE) return true;
    }
    return false;
}

static bool shouldPause() {
    return g_sessionLocked.load() || fullscreenAppActive();
}

// ---- cursor parallax (behaviour 4) ----

static void updateParallax() {
    POINT cursor;
    GetCursorPos(&cursor);
    for (auto& w : g_windows) {
        int cx = (w.rect.left + w.rect.right) / 2;
        int cy = (w.rect.top + w.rect.bottom) / 2;
        int halfW = (w.rect.right - w.rect.left) / 2;
        int halfH = (w.rect.bottom - w.rect.top) / 2;
        float tx = halfW ? (float)(cursor.x - cx) / halfW : 0;
        // +y when the cursor is above the centre (like macOS): screen y grows down.
        float ty = halfH ? (float)(cy - cursor.y) / halfH : 0;
        tx = tx < -1 ? -1 : (tx > 1 ? 1 : tx);
        ty = ty < -1 ? -1 : (ty > 1 ? 1 : ty);
        w.parallaxX += (tx - w.parallaxX) * 0.06f;
        w.parallaxY += (ty - w.parallaxY) * 0.06f;
    }
}

// ---- tray ----

static void addTray(HWND hwnd, HINSTANCE hinst) {
    g_tray = {};
    g_tray.cbSize = sizeof(g_tray);
    g_tray.hWnd = hwnd;
    g_tray.uID = kTrayId;
    g_tray.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    g_tray.uCallbackMessage = WM_APP_TRAY;
    g_tray.hIcon = (HICON)LoadImageW(hinst, MAKEINTRESOURCEW(1), IMAGE_ICON, 0, 0, LR_DEFAULTSIZE);
    if (!g_tray.hIcon) g_tray.hIcon = LoadIconW(nullptr, IDI_APPLICATION);
    wcscpy_s(g_tray.szTip, L"Our Notes Wallpaper");
    Shell_NotifyIconW(NIM_ADD, &g_tray);
}

static void showTrayMenu(HWND hwnd) {
    POINT p; GetCursorPos(&p);
    HMENU menu = CreatePopupMenu();
    AppendMenuW(menu, MF_STRING, kCmdSettings, L"\xb0\xf0\xacbd \xc124\xc815\xa6\x2026"); // placeholder
    // Use proper Korean strings.
    ModifyMenuW(menu, kCmdSettings, MF_BYCOMMAND | MF_STRING, kCmdSettings, L"\uBC30\uACBD \uC124\uC815\u2026"); // 배경 설정…
    AppendMenuW(menu, MF_STRING | (g_settings.showCharacters ? MF_CHECKED : 0), kCmdCharacters, L"\uCE90\uB9AD\uD130 \uD45C\uC2DC"); // 캐릭터 표시
    AppendMenuW(menu, MF_STRING | (g_settings.shuffle ? MF_CHECKED : 0), kCmdShuffle, L"\uC7A5\uBA74 \uC154\uD50C"); // 장면 셔플
    AppendMenuW(menu, MF_SEPARATOR, 0, nullptr);
    AppendMenuW(menu, MF_STRING, kCmdQuit, L"\uC885\uB8CC"); // 종료
    SetForegroundWindow(hwnd);
    TrackPopupMenu(menu, TPM_RIGHTBUTTON, p.x, p.y, 0, hwnd, nullptr);
    DestroyMenu(menu);
}

// ---- change application ----

void onSettingsChanged() {
    g_settings.save();
    {
        std::lock_guard<std::mutex> lock(g_stageMutex);
        if (g_stage) {
            g_stage->setCharactersVisible(g_settings.showCharacters);
            g_stage->setHiddenMembers(hiddenMembersFor(g_stage->dir));
        }
    }
}

static void applySpotChange() {
    requestSpot(g_settings.spotId);
}

// Called by the settings window when the user picks a new spot.
extern "C" void requestSpotChangeFromSettings() {
    requestSpot(g_settings.spotId);
}

// ---- render one frame across all monitors ----

static void renderFrame(bool cameraMoving) {
    std::lock_guard<std::mutex> lock(g_stageMutex);
    if (!g_stage) return;
    for (auto& w : g_windows) {
        if (!w.target.swap) continue;
        auto cam = spotCamera(g_stage->data, (float)w.target.width, (float)w.target.height,
                              g_settings.cursorParallax ? w.parallaxX : 0,
                              g_settings.cursorParallax ? w.parallaxY : 0);
        drawStage(g_ctx, w.target, *g_stage, cam.view, cam.projection, g_settings.showCharacters);
        w.target.swap->Present(1, 0);
    }
}

// ---- snapshot mode (behaviour 8) ----

static int runSnapshot(const std::string& outPath, int w, int h, const std::string& spotId, bool chars);

// ---- window proc ----

static LRESULT CALLBACK wndProc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lparam) {
    if (msg == g_taskbarCreated) {   // Explorer restarted
        addTray(hwnd, (HINSTANCE)GetWindowLongPtrW(hwnd, GWLP_HINSTANCE));
        createMonitorWindows((HINSTANCE)GetWindowLongPtrW(hwnd, GWLP_HINSTANCE));
        return 0;
    }
    switch (msg) {
        case WM_APP_TRAY:
            if (LOWORD(lparam) == WM_RBUTTONUP) showTrayMenu(hwnd);
            else if (LOWORD(lparam) == WM_LBUTTONUP) openSettingsWindow((HINSTANCE)GetWindowLongPtrW(hwnd, GWLP_HINSTANCE));
            return 0;
        case WM_COMMAND:
            switch (LOWORD(wparam)) {
                case kCmdSettings: openSettingsWindow((HINSTANCE)GetWindowLongPtrW(hwnd, GWLP_HINSTANCE)); break;
                case kCmdCharacters: g_settings.showCharacters = !g_settings.showCharacters; onSettingsChanged(); break;
                case kCmdShuffle: g_settings.shuffle = !g_settings.shuffle; g_settings.save(); break;
                case kCmdQuit: PostQuitMessage(0); break;
            }
            return 0;
        case WM_WTSSESSION_CHANGE:
            if (wparam == WTS_SESSION_LOCK) g_sessionLocked = true;
            else if (wparam == WTS_SESSION_UNLOCK) g_sessionLocked = false;
            return 0;
        case WM_DISPLAYCHANGE:
            createMonitorWindows((HINSTANCE)GetWindowLongPtrW(hwnd, GWLP_HINSTANCE));
            return 0;
        case WM_POWERBROADCAST:
            // Display on/off arrives via RegisterPowerSettingNotification (GUID_CONSOLE_DISPLAY_STATE).
            return TRUE;
        case WM_DESTROY:
            Shell_NotifyIconW(NIM_DELETE, &g_tray);
            return 0;
    }
    return DefWindowProcW(hwnd, msg, wparam, lparam);
}

// ---- entry ----

static void loadCatalog() {
    try {
        g_catalog = loadSpotIndex(spotsDir() + "\\index.json");
    } catch (...) {
        logLine("spot index missing");
    }
    // First run: pool = all ids.
    if (g_settings.shufflePool.empty())
        for (const auto& e : g_catalog) g_settings.shufflePool.insert(e.id);
}

int WINAPI wWinMain(HINSTANCE hinst, HINSTANCE, LPWSTR cmdLine, int) {
    SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
    CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED);
    logInit();

    // Snapshot mode: --snapshot out.png W H spotId 0|1
    int argc = 0;
    LPWSTR* argv = CommandLineToArgvW(cmdLine, &argc);
    if (argc >= 6 && wcscmp(argv[0], L"--snapshot") == 0) {
        auto toUtf8 = [](LPWSTR w) {
            int n = WideCharToMultiByte(CP_UTF8, 0, w, -1, nullptr, 0, nullptr, nullptr);
            std::string s(n, 0);
            WideCharToMultiByte(CP_UTF8, 0, w, -1, s.data(), n, nullptr, nullptr);
            if (!s.empty() && s.back() == '\0') s.pop_back();
            return s;
        };
        std::string out = toUtf8(argv[1]);
        int w = _wtoi(argv[2]), h = _wtoi(argv[3]);
        std::string spotId = toUtf8(argv[4]);
        bool chars = _wtoi(argv[5]) != 0;
        std::string err;
        if (!g_ctx.init(err)) { logLine("snapshot d3d init failed: " + err); return 2; }
        installSpineTextureBridge(&g_ctx);
        loadCatalog();
        int rc = runSnapshot(out, w, h, spotId, chars);
        g_ctx.shutdown();
        return rc;
    }

    // Single instance.
    HANDLE mutex = CreateMutexW(nullptr, TRUE, L"OurNotesWallpaper.SingleInstance");
    if (mutex && GetLastError() == ERROR_ALREADY_EXISTS) {
        logLine("another instance is running; exiting");
        return 0;
    }

    g_settings.load();
    loadCatalog();

    std::string err;
    if (!g_ctx.init(err)) { logLine("d3d init failed: " + err); return 2; }
    logLine(std::string("driver: ") + (g_ctx.driver == DriverKind::Hardware ? "HARDWARE" : "WARP"));
    installSpineTextureBridge(&g_ctx);

    // Hidden message-only-ish main window (owns tray + timers).
    WNDCLASSW wc = {};
    wc.lpfnWndProc = wndProc;
    wc.hInstance = hinst;
    wc.lpszClassName = kWindowClass;
    RegisterClassW(&wc);
    g_taskbarCreated = RegisterWindowMessageW(L"TaskbarCreated");

    // Hidden top-level main window (owns tray + timers). NOT message-only:
    // HWND_MESSAGE windows never get broadcasts such as WM_DISPLAYCHANGE or
    // "TaskbarCreated", which is why a resolution change left the wallpaper
    // at its old size. It is never shown.
    HWND main = CreateWindowExW(WS_EX_TOOLWINDOW, kWindowClass, L"OurNotesWallpaperMain", WS_POPUP, 0, 0, 0, 0,
                                nullptr, nullptr, hinst, nullptr);
    SetWindowLongPtrW(main, GWLP_HINSTANCE, (LONG_PTR)hinst);

    WTSRegisterSessionNotification(main, NOTIFY_FOR_THIS_SESSION);
    addTray(main, hinst);
    createMonitorWindows(hinst);

    // Load the initial spot.
    requestSpot(g_settings.spotId);

    // Frame loop: 30 fps active, 5 fps after 30 idle frames (behaviour 4).
    int idleFrames = 0;
    DWORD lastTick = GetTickCount();
    DWORD lastShuffle = GetTickCount();
    DWORD lastMemLog = GetTickCount();
    bool running = true;

    while (running) {
        MSG m;
        while (PeekMessageW(&m, nullptr, 0, 0, PM_REMOVE)) {
            if (m.message == WM_QUIT) { running = false; break; }
            TranslateMessage(&m);
            DispatchMessageW(&m);
        }
        if (!running) break;

        // Swap in a freshly loaded spot (UI thread), keeping the old one until ready.
        swapInLoadedSpot();

        // Safety net for display changes the broadcast missed (VM window
        // resize, DPI change, Explorer restart): once a second compare the
        // monitor layout and the WorkerW with what the windows were built for.
        static DWORD lastLayoutCheck = 0;
        if (GetTickCount() - lastLayoutCheck >= 1000) {
            lastLayoutCheck = GetTickCount();
            std::vector<RECT> rects;
            EnumDisplayMonitors(nullptr, nullptr, addMonitor, reinterpret_cast<LPARAM>(&rects));
            bool changed = rects.size() != g_windows.size() || (g_workerW && !IsWindow(g_workerW));
            for (size_t i = 0; !changed && i < rects.size(); ++i) {
                changed = !EqualRect(&rects[i], &g_windows[i].rect);
            }
            if (changed) {
                logLine("display layout changed; rebuilding wallpaper windows");
                createMonitorWindows(hinst);
            }
        }

        DWORD now = GetTickCount();
        double delta = (now - lastTick) / 1000.0;

        // Shuffle timer.
        if (g_settings.shuffle && now - lastShuffle >= (DWORD)shuffleIntervalSeconds(g_settings.shuffleInterval) * 1000) {
            lastShuffle = now;
            // Random pooled spot != current.
            std::vector<std::string> candidates;
            for (const auto& e : g_catalog)
                if (g_settings.shufflePool.count(e.id) && e.id != g_settings.spotId) candidates.push_back(e.id);
            if (!candidates.empty()) {
                g_settings.spotId = candidates[GetTickCount() % candidates.size()];
                g_settings.save();
                applySpotChange();
            }
        }

        if (now - lastMemLog >= 5 * 60 * 1000) { lastMemLog = now; logMemoryTick(); }

        bool paused = shouldPause();
        bool cameraMoving = false;
        if (!paused) {
            if (g_settings.cursorParallax) { updateParallax(); cameraMoving = true; }
            bool advanced = false;
            {
                std::lock_guard<std::mutex> lock(g_stageMutex);
                if (g_stage) advanced = g_stage->advance(delta, cameraMoving);
            }
            if (advanced || cameraMoving) {
                idleFrames = 0;
                renderFrame(cameraMoving);
            } else {
                idleFrames++;
            }
        }
        lastTick = now;

        // Pace: 30 fps active, 5 fps idle/paused.
        int targetMs = (paused || idleFrames > 30) ? 200 : 33;
        Sleep(targetMs);
    }

    destroyWindows();
    WTSUnRegisterSessionNotification(main);
    {
        std::lock_guard<std::mutex> lock(g_stageMutex);
        g_stage.reset();
    }
    g_ctx.shutdown();
    CoUninitialize();
    return 0;
}

// ---- snapshot implementation ----

bool savePngBGRA(const std::string& path, const uint8_t* bgra, int w, int h);

static int runSnapshot(const std::string& outPath, int w, int h, const std::string& spotId, bool chars) {
    std::string dir = dirForSpotId(spotId);
    if (dir.empty()) { logLine("snapshot: unknown spot " + spotId); return 3; }
    std::unique_ptr<Stage> stage;
    try {
        stage = std::make_unique<Stage>(g_ctx, spotsDir(), dir);
    } catch (const std::exception& e) {
        logLine(std::string("snapshot load failed: ") + e.what());
        return 4;
    }
    stage->setCharactersVisible(chars);
    // Advance a little so a non-looping intro settles into a pose.
    for (int i = 0; i < 120; ++i) stage->advance(1.0 / 60.0, false);

    SwapTarget target;
    if (!target.createOffscreen(g_ctx, w, h)) { logLine("snapshot: offscreen alloc failed"); return 5; }
    auto cam = spotCamera(stage->data, (float)w, (float)h, 0, 0);
    drawStage(g_ctx, target, *stage, cam.view, cam.projection, chars);

    // Read back the offscreen texture via a staging copy.
    D3D11_TEXTURE2D_DESC td = {};
    td.Width = w; td.Height = h; td.MipLevels = 1; td.ArraySize = 1;
    td.Format = DXGI_FORMAT_B8G8R8A8_UNORM; td.SampleDesc.Count = 1;
    td.Usage = D3D11_USAGE_STAGING; td.CPUAccessFlags = D3D11_CPU_ACCESS_READ;
    ID3D11Texture2D* staging = nullptr;
    if (FAILED(g_ctx.device->CreateTexture2D(&td, nullptr, &staging))) return 6;
    g_ctx.ctx->CopyResource(staging, target.offscreenTexture());

    D3D11_MAPPED_SUBRESOURCE mapped;
    int rc = 7;
    if (SUCCEEDED(g_ctx.ctx->Map(staging, 0, D3D11_MAP_READ, 0, &mapped))) {
        std::vector<uint8_t> bgra((size_t)w * h * 4);
        for (int y = 0; y < h; ++y)
            memcpy(bgra.data() + (size_t)y * w * 4, (uint8_t*)mapped.pData + (size_t)y * mapped.RowPitch, (size_t)w * 4);
        g_ctx.ctx->Unmap(staging, 0);
        rc = savePngBGRA(outPath, bgra.data(), w, h) ? 0 : 8;
        if (rc == 0) logLine("snapshot written: " + outPath);
    }
    staging->Release();
    target.release();
    return rc;
}
