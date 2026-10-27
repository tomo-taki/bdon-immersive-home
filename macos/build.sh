#!/bin/bash
# Build "BDON Immersive Home.app" into dist/ (Command Line Tools only, no Xcode).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="BDON Immersive Home"
BUNDLE_ID="$(cat "$ROOT/macos/app-id.txt")"
# dist/ holds a dev build ("<id>.dev"); macos/make_dmg.sh puts the release id
# back for the DMG. A build left here must never stand in for the installed
# app: LaunchServices launches the highest version among apps sharing an id.
DEV_BUNDLE_ID="$BUNDLE_ID.dev"
APP="$ROOT/dist/$APP_NAME.app"

cd "$ROOT"

# Spot data (room.glb, spot.json, Spine 4.2 skeletons) exported from the
# game's own files: the Home Spots of the Ournotes asset service's catalog
# (Docker), with bundles and master data from the region's Bilibili CDN
# (tools/spots/export_spot.py, data/venv). The exports are listed in
# data/source/spot_ids.txt; a newer list rebuilds the index.
SPOT_IDS=data/source/spot_ids.txt
if [ ! -f "$SPOT_IDS" ]; then
    data/venv/bin/python tools/spots/export_spot.py --all
fi
if [ ! -f data/spots/index.json ] || [ "$SPOT_IDS" -nt data/spots/index.json ]; then
    python3 tools/spots/build_spot.py data/spots "$SPOT_IDS" data/source
fi

# Renderer: native Metal (macos/Sources/Render + shared/spine-bridge over
# vendor/spine-runtimes spine-c 4.2).
swift build -c release --disable-sandbox

# Edge zoom per Spot (cover.json), measured by the app itself: new Spots, or
# all of them with RECOVER=1 after a renderer or camera change.
missing="$(for d in data/spots/*/*/; do [ -f "$d/cover.json" ] || basename "$d"; done)"
if [ "${RECOVER:-0}" = 1 ]; then
    .build/release/BDONImmersiveHome --coverage
elif [ -n "$missing" ]; then
    # shellcheck disable=SC2086
    .build/release/BDONImmersiveHome --coverage $missing
fi
# Settings thumbnails (with and without characters), rendered by the app itself:
# Spots without them, or all of them with REBUILD_THUMBS=1.
spot_ids="$(python3 -c "import json; print(' '.join(s['id'] for s in json.load(open('data/spots/index.json'))))")"
no_thumbs="$(for id in $spot_ids; do [ -f "data/thumbs/${id}_bg.jpg" ] || echo "$id"; done)"
if [ "${REBUILD_THUMBS:-0}" = 1 ]; then
    tools/spots/thumbs.sh .build/release/BDONImmersiveHome
elif [ -n "$no_thumbs" ]; then
    # shellcheck disable=SC2086
    tools/spots/thumbs.sh .build/release/BDONImmersiveHome $no_thumbs
fi

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/data"
cp ".build/release/BDONImmersiveHome" "$APP/Contents/MacOS/BDONImmersiveHome"
# Spot data, thumbnails and band logos (SpotCatalog reads Resources/data).
cp -R data/spots data/thumbs assets/bands "$APP/Contents/Resources/data/"

# App icon (Takamatsu Tomori) and the monochrome menu-bar template icon.
cp macos/Resources/AppIcon.icns "$APP/Contents/Resources/AppIcon.icns"
cp macos/Resources/menubar.png macos/Resources/menubar@2x.png "$APP/Contents/Resources/"

# Version shown in 설정 > 정보: build date and the short commit hash the
# build was made from ("dev" when the tree is not a git repository).
# CFBundleVersion stays the commit count, since macOS compares it as a number.
BUILD_DATE="$(date +%Y.%m.%d)"
BUILD_NUMBER="$(git -C "$ROOT" rev-list --count HEAD 2>/dev/null || echo dev)"
BUILD_COMMIT="$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo dev)"

cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key><string>$APP_NAME</string>
    <key>CFBundleDisplayName</key><string>$APP_NAME</string>
    <key>CFBundleIdentifier</key><string>$DEV_BUNDLE_ID</string>
    <key>CFBundleExecutable</key><string>BDONImmersiveHome</string>
    <key>CFBundlePackageType</key><string>APPL</string>
    <key>CFBundleIconFile</key><string>AppIcon</string>
    <key>CFBundleShortVersionString</key><string>$BUILD_DATE</string>
    <key>CFBundleVersion</key><string>$BUILD_NUMBER</string>
    <key>BDONCommit</key><string>$BUILD_COMMIT</string>
    <key>LSMinimumSystemVersion</key><string>14.0</string>
    <key>LSUIElement</key><true/>
    <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
PLIST

# Ad-hoc signature so macOS will launch it locally.
python3 "$ROOT/macos/sign_app.py" "$APP"
echo "Built: $APP"
