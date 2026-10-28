#!/bin/bash
# The app's Spot data after exports or removals: data/spots from data/source/spot_ids.txt (build_spot.py, when the
# list is newer than the index), then the edge zoom (cover.json) and the settings thumbnails (with and without
# characters) of every Spot that lacks them, both drawn by the app's own renderer. RECOVER=1 measures every cover
# again and REBUILD_THUMBS=1 draws every thumbnail again, after a renderer or camera change.
# Usage: tools/spots/finish_spots.sh [binary]   (default .build/release/BDONImmersiveHome, built when missing)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BIN="${1:-.build/release/BDONImmersiveHome}"
cd "$ROOT"

SPOT_IDS=data/source/spot_ids.txt
if [ ! -f data/spots/index.json ] || [ "$SPOT_IDS" -nt data/spots/index.json ]; then
    python3 tools/spots/build_spot.py data/spots "$SPOT_IDS" data/source
fi
# Renderer: native Metal (macos/Sources/Render + shared/spine-bridge over vendor/spine-runtimes spine-c 4.2).
[ -x "$BIN" ] || swift build -c release --disable-sandbox

missing="$(for d in data/spots/*/*/; do [ -f "$d/cover.json" ] || basename "$d"; done)"
if [ "${RECOVER:-0}" = 1 ]; then
    "$BIN" --coverage
elif [ -n "$missing" ]; then
    # shellcheck disable=SC2086
    "$BIN" --coverage $missing
fi
spot_ids="$(python3 -c "import json; print(' '.join(s['id'] for s in json.load(open('data/spots/index.json'))))")"
no_thumbs="$(for id in $spot_ids; do [ -f "data/thumbs/${id}_bg.jpg" ] || echo "$id"; done)"
if [ "${REBUILD_THUMBS:-0}" = 1 ]; then
    tools/spots/thumbs.sh "$BIN"
elif [ -n "$no_thumbs" ]; then
    # shellcheck disable=SC2086
    tools/spots/thumbs.sh "$BIN" $no_thumbs
fi
echo "Spot data: $(python3 -c "import json; print(len(json.load(open('data/spots/index.json'))))") Spots"
