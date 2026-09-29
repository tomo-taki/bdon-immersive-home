#!/usr/bin/env bash
# tools/release.sh -- publish the current build as a GitHub Release that the
# apps' self-update reads (Updater.swift, windows/native/src/onp_update.cpp).
#
#   tag    b<commit count>          apps compare it with their own build number
#   title  2026.09.29 (5786b63)
#   assets BDONImmersiveHome-mac.zip              (the .app, for self-update)
#          BDONImmersiveHome.dmg                  (first install)
#          BDONImmersiveHome-Native-win-x64.zip
#          BDONImmersiveHome-Native-win-arm64.zip
#          SHA256SUMS.txt                         (checked before applying)
#
# Usage: tools/release.sh [--dry-run]    (needs `gh auth login`)
# Build first: ./build.sh && tools/make_dmg.sh && windows/native/build.sh both
#              && windows/native/package.sh both

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${BDON_REPO:-zgghw2t4cd-blip/bdon-immersive-home}"
APP="dist/BDON Immersive Home.app"
OUT="work/release"
DRY="${1:-}"

# The release must match HEAD, or the tag would lie about what it contains.
[ -z "$(git status --porcelain --untracked-files=no)" ] || { echo "commit first: tree is dirty"; exit 1; }
COUNT="$(git rev-list --count HEAD)"
COMMIT="$(git rev-parse --short HEAD)"
BUILT="$(/usr/libexec/PlistBuddy -c 'Print :BDONCommit' "$APP/Contents/Info.plist")"
[ "$BUILT" = "$COMMIT" ] || { echo "app was built from $BUILT, HEAD is $COMMIT: rebuild"; exit 1; }
TITLE="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleShortVersionString' "$APP/Contents/Info.plist") ($COMMIT)"

rm -rf "$OUT" && mkdir -p "$OUT"
ditto -c -k --keepParent "$APP" "$OUT/BDONImmersiveHome-mac.zip"
cp dist/BDONImmersiveHome.dmg "$OUT/"
cp dist/windows/BDONImmersiveHome-Native-win-x64.zip dist/windows/BDONImmersiveHome-Native-win-arm64.zip "$OUT/"
(cd "$OUT" && shasum -a 256 BDONImmersiveHome* > SHA256SUMS.txt)
cat "$OUT/SHA256SUMS.txt"

if [ "$DRY" = "--dry-run" ]; then
  echo "dry run: would publish b$COUNT \"$TITLE\" to $REPO"
  exit 0
fi
gh release create "b$COUNT" "$OUT"/* --repo "$REPO" --target "$(git rev-parse HEAD)" \
  --title "$TITLE" --notes "BDON Immersive Home $TITLE"
