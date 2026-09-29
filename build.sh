#!/bin/bash
# Build "Yumemita Wallpaper.app" into dist/ (Command Line Tools only, no Xcode).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="BDON Immersive Home"
BUNDLE_ID="moe.local.yumemita-wallpaper"
APP="$ROOT/dist/$APP_NAME.app"

cd "$ROOT"

# Spot data (room.glb, spot.json, Spine 4.2 skeletons) from the moenotes
# Home Talk exports: one Talk per Home Spot (see tools/list_spots.py).
if [ ! -f Resources/web/spots/index.json ]; then
    python3 tools/list_spots.py spot-src
    awk '{print $2}' spot-src/spot_ids.txt | xargs -P 8 -I{} sh -c \
        '[ -f spot-src/{}/host.json ] || python3 tools/fetch_spot.py {} spot-src/{}'
    python3 tools/build_spot.py Resources/web/spots spot-src/spot_ids.txt spot-src
fi

# Renderer: native Metal (Sources/YumemitaWallpaper/Render + Sources/SpineBridge
# over vendor/spine-runtimes spine-c 4.2). The WebKit renderer (web/) is no
# longer bundled; its Swift side is in legacy/webkit.
swift build -c release --disable-sandbox

# Settings thumbnails (with and without characters), rendered by the app itself.
if [ ! -f Resources/web/thumbs/30001_bg.jpg ] || [ "${REBUILD_THUMBS:-0}" = 1 ]; then
    tools/thumbs.sh .build/release/YumemitaWallpaper
fi

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/web"
cp ".build/release/YumemitaWallpaper" "$APP/Contents/MacOS/YumemitaWallpaper"
# Spot data, thumbnails and band logos only (no web renderer).
cp -R Resources/web/spots Resources/web/thumbs Resources/web/bands "$APP/Contents/Resources/web/"

# App icon: Takamatsu Tomori (icon/tomori.png -> tools/make_icon.py).
[ -f icon/AppIcon.icns ] || python3 tools/make_icon.py
cp icon/AppIcon.icns "$APP/Contents/Resources/AppIcon.icns"
# Menu-bar template icon (monochrome Tomori, tools/make_menu_icon.py).
[ -f icon/menubar@2x.png ] || python3 tools/make_menu_icon.py
cp icon/menubar.png icon/menubar@2x.png "$APP/Contents/Resources/"

# Version shown in 설정 > 정보: build date, build number = commit count
# ("dev" when the tree is not a git repository).
BUILD_DATE="$(date +%Y.%m.%d)"
BUILD_NUMBER="$(git -C "$ROOT" rev-list --count HEAD 2>/dev/null || echo dev)"

cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key><string>$APP_NAME</string>
    <key>CFBundleDisplayName</key><string>$APP_NAME</string>
    <key>CFBundleIdentifier</key><string>$BUNDLE_ID</string>
    <key>CFBundleExecutable</key><string>YumemitaWallpaper</string>
    <key>CFBundlePackageType</key><string>APPL</string>
    <key>CFBundleIconFile</key><string>AppIcon</string>
    <key>CFBundleShortVersionString</key><string>$BUILD_DATE</string>
    <key>CFBundleVersion</key><string>$BUILD_NUMBER</string>
    <key>LSMinimumSystemVersion</key><string>14.0</string>
    <key>LSUIElement</key><true/>
    <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
PLIST

# Ad-hoc signature so macOS will launch it locally.
codesign --force --deep --sign - "$APP"
echo "Built: $APP"
