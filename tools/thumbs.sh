#!/bin/bash
# Settings thumbnails (Resources/web/thumbs/<id>.jpg and <id>_bg.jpg without
# characters), rendered offscreen by the app's own Metal renderer.
# Usage: tools/thumbs.sh [binary]   (default .build/release/YumemitaWallpaper)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIN="${1:-$ROOT/.build/release/YumemitaWallpaper}"
OUT="$ROOT/Resources/web/thumbs"
TMP="${TMPDIR:-/tmp}/ournotes-thumbs.$$"
mkdir -p "$OUT" "$TMP"
trap 'rm -rf "$TMP"' EXIT

cd "$ROOT"
ids=$(python3 -c "import json; print(' '.join(s['id'] for s in json.load(open('Resources/web/spots/index.json'))))")
for id in $ids; do
    "$BIN" --snapshot "$TMP/$id.png" 1280 720 "$id" 1 >/dev/null
    "$BIN" --snapshot "$TMP/${id}_bg.png" 1280 720 "$id" 0 >/dev/null
    for name in "$id" "${id}_bg"; do
        sips -s format jpeg -s formatOptions 82 "$TMP/$name.png" --out "$OUT/$name.jpg" >/dev/null
    done
done
echo "thumbnails: $(ls "$OUT" | wc -l | tr -d ' ') files in $OUT"
