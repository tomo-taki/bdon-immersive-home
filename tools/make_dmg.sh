#!/bin/bash
# dist/BDONImmersiveHome.dmg: the app with a large icon, an arrow to the
# Applications link and readme.txt (install steps), over a still of
# Yumemita Spot 30002. Build the app first (./build.sh).
#
# Uses dmgbuild (pinned, in work/venv-dmg) to write the Finder layout, so it
# needs no Finder automation permission.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/dist/BDON Immersive Home.app"
BIN="$APP/Contents/MacOS/YumemitaWallpaper"
DMG="$ROOT/dist/BDONImmersiveHome.dmg"
WORK="$ROOT/work/dmg-build"
VENV="$ROOT/work/venv-dmg"
SCENE_ID="${DMG_SCENE:-30002}"     # Yumemita, second background

[ -d "$APP" ] || { echo "build the app first: ./build.sh"; exit 1; }

if [ ! -x "$VENV/bin/dmgbuild" ]; then
    python3 -m venv "$VENV"
    "$VENV/bin/pip" install -q "dmgbuild==1.6.5" "pillow==11.3.0"
fi

rm -rf "$WORK"
mkdir -p "$WORK"
"$BIN" --snapshot "$WORK/scene.png" 1320 760 "$SCENE_ID" 1 >/dev/null
"$VENV/bin/python" "$ROOT/tools/dmg/make_background.py" "$WORK/scene.png" "$WORK"
tiffutil -cathidpicheck "$WORK/background.png" "$WORK/background@2x.png" -out "$WORK/background.tiff" 2>/dev/null

rm -f "$DMG"
"$VENV/bin/dmgbuild" -s "$ROOT/tools/dmg/settings.py" \
    -D app="$APP" -D dmg_dir="$ROOT/tools/dmg" -D root="$ROOT" -D background="$WORK/background.tiff" \
    "BDON Immersive Home" "$DMG"
rm -rf "$WORK"
echo "Built: $DMG ($(du -h "$DMG" | cut -f1))"
