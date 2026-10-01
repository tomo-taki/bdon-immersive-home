#!/usr/bin/env bash
# tools/release.sh -- publish the current build as a GitHub Release that the
# apps' self-update reads (macos/Sources/ReleaseFeed.swift, windows/src/onp_release.h).
#
#   tag    b<commit count>          apps compare it with their own build number
#   title  2026.09.29 (5786b63)
#   body   the update summary, written by the human (shown in 설정 > 정보)
#   assets BDONImmersiveHome.dmg                  mac      install and self-update
#          BDONImmersiveHome-win-x64.zip          windows
#          BDONImmersiveHome-win-arm64.zip        windows
#          BDONImmersiveHome-android.apk          android  sideload install
#          SHA256SUMS.txt                         checked before applying
#
# --platforms publishes some platforms only (e.g. a Windows-only fix): the
# apps take the newest release holding their own package, so the others are
# not offered it. Only a release with every platform is marked Latest:
# installs up to b21 read releases/latest alone, and a partial Latest would
# show them a new version without their package.
#
# Usage: tools/release.sh [--platforms mac,windows,android] [--notes FILE] [--dry-run]
#   --notes defaults to dist/release-notes.md, removed once published.
# Build first: macos/build.sh && macos/make_dmg.sh && windows/build.sh both
#              && windows/package.sh both && android/build.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${BDON_REPO:-tomo-taki/bdon-immersive-home}"
ALL_PLATFORMS="mac windows android"
DEFAULT_NOTES="dist/release-notes.md"
OUT="work/release"
USAGE="usage: tools/release.sh [--platforms mac,windows,android] [--notes FILE] [--dry-run]"

PLATFORMS="$ALL_PLATFORMS"
NOTES="$DEFAULT_NOTES"
DRY=0
while [ $# -gt 0 ]; do
  case "$1" in
    --platforms) PLATFORMS="$(tr ',' ' ' <<< "${2:?$USAGE}")"; shift 2 ;;
    --notes)     NOTES="${2:?$USAGE}"; shift 2 ;;
    --dry-run)   DRY=1; shift ;;
    *)           echo "$USAGE"; exit 2 ;;
  esac
done
selected() { [[ " $PLATFORMS " == *" $1 "* ]]; }
[ -n "${PLATFORMS// /}" ] || { echo "$USAGE"; exit 2; }
for p in $PLATFORMS; do
  [[ " $ALL_PLATFORMS " == *" $p "* ]] || { echo "unknown platform: $p"; exit 2; }
done

# The summary is the human's own words, verbatim (AGENTS.md): never write it here.
grep -q '[^[:space:]]' "$NOTES" 2>/dev/null || {
  echo "no update summary in $NOTES: ask the human for it, save their words there verbatim"
  exit 1
}

# The release must match HEAD, or the tag would lie about what it contains.
[ -z "$(git status --porcelain --untracked-files=no)" ] || { echo "commit first: tree is dirty"; exit 1; }
COUNT="$(git rev-list --count HEAD)"
COMMIT="$(git rev-parse --short HEAD)"
TITLE=""

rm -rf "$OUT" && mkdir -p "$OUT"

# Each stage_* checks its packages were built from HEAD, copies them to $OUT
# and offers its version ("2026.09.29 (5786b63)") as the title.
fail() { echo "$1"; exit 1; }
title() { [ -n "$TITLE" ] || TITLE="$1"; }

stage_mac() {
  local plist="dist/BDON Immersive Home.app/Contents/Info.plist" dmg="dist/BDONImmersiveHome.dmg"
  local built date
  built="$(/usr/libexec/PlistBuddy -c 'Print :BDONCommit' "$plist")"
  [ "$built" = "$COMMIT" ] || fail "mac app was built from $built, HEAD is $COMMIT: rebuild"
  [ "$dmg" -nt "$plist" ] || fail "$dmg is older than the app: run macos/make_dmg.sh"
  date="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleShortVersionString' "$plist")"
  cp "$dmg" "$OUT/"
  title "$date ($COMMIT)"
}

stage_windows() {
  local arch zip version
  for arch in x64 arm64; do
    zip="dist/windows/BDONImmersiveHome-win-$arch.zip"
    version="$(cat "dist/windows/BDONImmersiveHome-win-$arch.version" 2>/dev/null || true)"   # windows/package.sh
    [[ "$version" == *"($COMMIT)" ]] || fail "$zip was not built from $COMMIT: rebuild and package"
    cp "$zip" "$OUT/"
  done
  title "$version"
}

stage_android() {
  local apk="dist/android/BDONImmersiveHome-android.apk" aapt2 version
  aapt2="$(ls -d "$HOME"/Library/Android/sdk/build-tools/*/aapt2 | tail -1)"
  version="$("$aapt2" dump badging "$apk" | sed -n "s/.*versionName='\([^']*\)'.*/\1/p")"
  [[ "$version" == *"($COMMIT)" ]] || fail "$apk was not built from $COMMIT: rebuild"
  cp "$apk" "$OUT/"
  title "$version"
}

LATEST=--latest
for p in $ALL_PLATFORMS; do
  if selected "$p"; then "stage_$p"; else LATEST=--latest=false; fi
done
(cd "$OUT" && shasum -a 256 BDONImmersiveHome* > SHA256SUMS.txt)
cat "$OUT/SHA256SUMS.txt"

echo "b$COUNT \"$TITLE\" [$PLATFORMS] $LATEST"
echo "--- update summary ($NOTES) ---"
cat "$NOTES"
echo "---"
if [ "$DRY" = 1 ]; then
  echo "dry run: nothing published to $REPO"
  exit 0
fi
gh release create "b$COUNT" "$OUT"/* --repo "$REPO" --target "$(git rev-parse HEAD)" \
  --title "$TITLE" --notes-file "$NOTES" "$LATEST"

# One summary per release: the next one must be asked for again.
if [ "$NOTES" = "$DEFAULT_NOTES" ]; then rm -f "$NOTES"; fi
