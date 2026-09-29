# Windows web track: spec (for the builder)

Electron app that reuses the existing three.js + spine-threejs renderer (`web/src`, bundle built by
`cd web && npm run build` into `Resources/web/app.js`; page `Resources/web/index.html`). Packaged on the
Mac for Windows x64 and arm64 (the user tests in a Windows 11 ARM64 VM under UTM, no GPU, so WebGL will run
on Chromium's software path — keep `app.disableHardwareAcceleration()` OFF but make sure SwiftShader/WARP
fallback is allowed, e.g. `--enable-unsafe-swiftshader` switch).

Ownership: only `windows/web/**` and `dist/windows/OurNotesWallpaper-Web-win32-{x64,arm64}.zip`.
Read-only: everything else (the native track is built in parallel in `windows/native`). If the page code
needs a change, copy `Resources/web/index.html` into the Electron app and adapt the copy; do not edit
`web/src` (the macOS WebKit build uses it). `web/src/main.ts` page API: `window.wallpaper.setPointer(x,y)`,
`setPaused(bool)`, `setSituation(dir)`, `setCharacters(bool)`, `setHidden([...])`, `step()`; URL params
`situation`, `chars`, `hide`, `fps`, `driver` (omit `driver=native` so the page drives itself with rAF;
set `backgroundThrottling: false`). Read `web/src/main.ts` to confirm.

## Behaviour (mirror the macOS app: `Sources/YumemitaWallpaper/{WallpaperController,WallpaperSettings,
EasterEgg,SettingsView,SpotCatalog}.swift` and legacy `legacy/webkit/SpotWebView.swift`)
1. One frameless, non-focusable, skipTaskbar BrowserWindow per display, placed BEHIND the desktop icons
   with the WorkerW technique via `koffi` FFI (user32: FindWindowW, SendMessageTimeoutW(Progman, 0x052C,
   0xD, 0x1), EnumWindows/FindWindowExW for SHELLDLL_DefView -> next WorkerW; Win11 24H2+ WorkerW may be a
   child of Progman; SetParent(hwnd from `getNativeWindowHandle()`), then SetWindowPos to the monitor rect
   in WorkerW client coordinates, physical pixels). Click-through (`setIgnoreMouseEvents(true)`). Handle
   display add/remove/metrics (`screen` events), re-attach after Explorer restart if feasible.
2. Cursor parallax: poll `screen.getCursorScreenPoint()` at 20 Hz, map to -1..1 per display (+y above
   centre, like macOS), call `wallpaper.setPointer` only when changed; center when the option is off.
3. Pause on `powerMonitor` lock-screen / suspend (resume on unlock / resume), like the mac pause reasons.
4. Tray (not menu bar): icon from `icon/menubar@2x.png` or `icon/tomori.png`; click or "배경 설정…" opens
   settings; menu: 배경 설정… / 캐릭터 표시 (checkbox) / 장면 셔플 (checkbox) / separator / 종료.
   Single instance (`requestSingleInstanceLock`).
5. Settings window as HTML (`settings.html`, dark, matching the mac SettingsView layout): bands with logo
   (`Resources/web/bands`) and 4-column 16:9 thumbnails (`Resources/web/thumbs/<id>.jpg`, `<id>_bg.jpg` when
   characters are off) + names; current Spot accent border + check badge; shuffle mode toggles pool
   membership (unpooled dimmed); footer toggles 캐릭터 표시 / 커서 따라 시점 이동 / 장면 셔플, 변경 주기
   select (1분마다 5분마다 10분마다 30분마다 1시간마다; disabled unless shuffle), "현재: <name>".
   Easter egg with `KeyboardEvent.code` (KeyA..KeyZ, layout independent), codes from EasterEgg.swift,
   toggles, label "🐧 토모타키 모드"/"아논소요 모드"; hidden members computed like
   EasterEgg.hiddenMembers. Settings JSON in `app.getPath('userData')/settings.json`, same keys/defaults as
   WallpaperSettings.swift. Use a preload + contextIsolation, no nodeIntegration.
6. Shuffle timer, load-error retry (page posts events; in Electron use a preload `ipcRenderer` bridge or
   console messages), log file in userData (`log.txt`) incl. memory every 5 min
   (`app.getAppMetrics()`).

## Build / package
`windows/web/build.sh`: `npm install` pinned exact versions (electron, @electron/packager, koffi), rebuild
the web bundle (`cd web && npm run build`), copy page + `Resources/web/{spots,thumbs,bands}` into the app,
package with @electron/packager for `win32` x64 and arm64 (no rcedit/wine: skip exe icon metadata if it
needs wine), zip to `dist/windows/OurNotesWallpaper-Web-win32-{x64,arm64}.zip` with a `README-ko.txt`
(run OurNotesWallpaper.exe, SmartScreen: 추가 정보 -> 실행, where settings/logs live). Check koffi's
prebuilt win32_x64 and win32_arm64 binaries are inside the package.

## Verify here
Run the Electron app on macOS (`npx electron .` with a `--dev-mac` switch that skips WorkerW and just
opens one normal window + the settings window) long enough to see the page report ready (wallpaper
`__wallpaperReady`), take a screenshot of each window with `webContents.capturePage()` into
`windows/web/qa/`, and quit. Report: files, versions, zip sizes, what was verified here vs needs the VM.
