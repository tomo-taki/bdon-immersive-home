#!/usr/bin/env bash
# tools/release.sh -- publish the current build as a GitHub Release that the
# apps' self-update reads (Updater.swift, windows/native/src/onp_update.cpp).
#
#   tag    b<commit count>          apps compare it with their own build number
#   title  2026.09.29 (5786b63)
#   assets BDONImmersiveHome.dmg                  (install and self-update)
#          BDONImmersiveHome-win-x64.zip
#          BDONImmersiveHome-win-arm64.zip
#          BDONImmersiveHome-android.apk          (sideload install)
#          SHA256SUMS.txt                         (checked before applying)
#
# Usage: tools/release.sh [--dry-run]    (needs `gh auth login`)
# Build first: ./build.sh && tools/make_dmg.sh && windows/native/build.sh both
#              && windows/native/package.sh both && android/build.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${BDON_REPO:-tomo-taki/bdon-immersive-home}"
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
cp dist/BDONImmersiveHome.dmg "$OUT/"
cp dist/windows/BDONImmersiveHome-win-x64.zip dist/windows/BDONImmersiveHome-win-arm64.zip "$OUT/"

# The APK must come from HEAD too (its versionName carries the commit).
APK="dist/android/BDONImmersiveHome-android.apk"
AAPT2="$(ls -d "$HOME"/Library/Android/sdk/build-tools/*/aapt2 | tail -1)"
BADGING="$("$AAPT2" dump badging "$APK")"
[[ "$BADGING" == *"versionName='"*"($COMMIT)'"* ]] \
  || { echo "$APK was not built from $COMMIT: rebuild"; exit 1; }
cp "$APK" "$OUT/"
(cd "$OUT" && shasum -a 256 BDONImmersiveHome* > SHA256SUMS.txt)
cat "$OUT/SHA256SUMS.txt"

if [ "$DRY" = "--dry-run" ]; then
  echo "dry run: would publish b$COUNT \"$TITLE\" to $REPO"
  exit 0
fi
gh release create "b$COUNT" "$OUT"/* --repo "$REPO" --target "$(git rev-parse HEAD)" \
  --title "$TITLE" --notes "BDON Immersive Home $TITLE"
