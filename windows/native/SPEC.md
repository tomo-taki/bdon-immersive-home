# Windows native track: spec (for the builder)

C++ / Direct3D 11 port of the macOS Swift + Metal app. Cross-compiled on the Mac with zig
(`~/.local/bin/zig` 0.16.0; `zig c++ -target x86_64-windows-gnu` / `aarch64-windows-gnu` link
d3d11, dxgi, d3dcompiler_47, gdiplus, shell32, user32, wtsapi32 fine). No wine here: the user tests in a
Windows 11 ARM64 VM (UTM, no GPU) -> try D3D_DRIVER_TYPE_HARDWARE, then WARP.

Ownership: only `windows/native/**` and `dist/windows/OurNotesWallpaper-Native-win-{x64,arm64}.zip`.
Everything else in the repo is read-only (the web track is built in parallel in `windows/web`).

## Read first
- Renderer: `Sources/YumemitaWallpaper/Render/{Math,Spot,Room,Shaders,Stage,Renderer}.swift`
- View / controller: `Sources/YumemitaWallpaper/{SpotMetalView,WallpaperController,WallpaperSettings,EasterEgg,SpotCatalog,SettingsView}.swift`
- Spine glue, reuse as is: `Sources/SpineBridge/spine_bridge.c` + `include/spine_bridge.h` over
  `vendor/spine-runtimes/spine-c/spine-c` (src + include, `-w`). The host sets `sb_texture_load` /
  `sb_texture_release` (PNG -> premultiplied RGBA8 SRV via stb_image; room texture gets mips, atlas pages none).
- Data (copy into package, never modify): `Resources/web/spots`, `Resources/web/thumbs` (`<id>.jpg`,
  `<id>_bg.jpg`), `Resources/web/bands/*.png`, `icon/tomori.png`, `icon/menubar@2x.png`.
- Third-party single headers may be downloaded with curl into `windows/native/third_party`
  (stb_image.h, stb_image_write.h, a JSON parser). No brew (its sandbox fails here).

## Behaviour
1. One wallpaper window per monitor behind the desktop icons (WorkerW: SendMessageTimeout(Progman,
   0x052C, 0xD, 0x1), find the WorkerW after SHELLDLL_DefView; on Win11 24H2+ the WorkerW can be a child
   of Progman, handle both). No focus / taskbar button (WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE), click-through.
   Re-attach on WM_DISPLAYCHANGE and on "TaskbarCreated" (Explorer restart). Per-monitor DPI aware v2.
2. D3D11 port of Renderer.swift, same passes and state: sky gradient; opaque room (cutout 0.5, depth write);
   transparent list sorted (order asc, NDC z far->near, id); residents depth-test, no write, 4 spine blend
   modes exactly as Renderer.swift; tint-black shader; 4x MSAA + resolve; filter pass (saturate 1.04,
   brightness 1.02, contrast 1.02). HLSL via D3DCompile at runtime. Keep the Swift math (column vectors,
   right-handed lookAt, depth 0..1): port fitFov, defaultPose, shiftedPose, lookDirection, rightHanded,
   roomMatrix, unityMatrix; transpose correctly for HLSL.
3. Stage.swift port: replay 18-40 s, settle 3 s, advance() false when idle (no Present); characters-off
   slot rules (SlotNames regexes via std::regex ECMAScript) and easter-egg members, sb_set_blank exactly as
   applyVisibility. Load Spots on one worker thread, swap on the UI thread, keep the old Spot until the new
   one is ready, retry a failed load twice after 5 s.
4. 30 fps while something moves, 5 fps after 30 idle frames. Cursor parallax: GetCursorPos at 20 Hz ->
   -1..1 per monitor, +y when the cursor is above the centre (like macOS); smooth += (t - smooth) * 0.06.
   Pause on session lock (WTSRegisterSessionNotification), display off (GUID_CONSOLE_DISPLAY_STATE), and
   fullscreen apps (SHQueryUserNotificationState busy / D3D fullscreen).
5. Tray icon instead of the menu bar. Left click or "배경 설정…" opens settings. Right-click menu:
   배경 설정… / 캐릭터 표시 (check) / 장면 셔플 (check) / separator / 종료. Single instance (named mutex).
6. Settings window (Win32 + GDI+, custom painted, dark, like the mac screenshot): scrollable bands (logo +
   name) with 4-column 16:9 thumbnails (`_bg` when characters are off) and names; current Spot has an
   accent border + check badge; click selects it; in shuffle mode click toggles pool membership (unpooled
   dimmed). Fixed footer: 캐릭터 표시 / 커서 따라 시점 이동 / 장면 셔플 toggles, 변경 주기 dropdown
   (1분마다 5분마다 10분마다 30분마다 1시간마다, disabled unless shuffle), "현재: <name>" on the right.
   Easter egg: layout-independent VK_A..VK_Z typed in the window, codes from EasterEgg.swift, toggles,
   shows "🐧 토모타키 모드" / "아논소요 모드". Settings JSON in %APPDATA%\OurNotesWallpaper\settings.json with
   WallpaperSettings.swift keys/defaults (spotId 30001, showCharacters, cursorParallax, shuffle,
   shufflePool, shuffleInterval minutes10, easterEgg none).
7. Log %LOCALAPPDATA%\OurNotesWallpaper\log.txt: spot loads, errors, HARDWARE/WARP, memory every 5 min.
8. `OurNotesWallpaper.exe --snapshot out.png W H spotId 0|1` offscreen QA render.

## Build / package
`windows/native/build.sh` -> `windows/native/out/{x64,arm64}/OurNotesWallpaper.exe` (GUI subsystem
`-Wl,--subsystem,windows`, static C++ runtime; imports must be system DLLs only, check the PE import table
with a short python script). Icon: `.ico` from tomori.png via PIL, embedded with `zig rc` if it works,
otherwise loaded at runtime. Zips: exe + `data/` (spots, thumbs, bands) + `README-ko.txt` (how to run,
settings/log paths, SmartScreen: 추가 정보 -> 실행).

## Verify here
Both targets compile and link with zero errors. Host-side test in `windows/native/tests` (clang++ or
zig c++ native, no D3D): parse Spot 30001 (3 residents), glb mesh count matching Room.swift logic, and
camera matrices for 30001 at 1920x1080 equal to the Swift ones (write a swift script that includes copies
of Math.swift + Spot.swift and prints them). Report: files, build command, exe sizes, import DLLs, what was
verified here vs needs the VM, known gaps.
