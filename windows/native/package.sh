#!/usr/bin/env bash
# windows/native/package.sh -- assemble the distributable zips:
#   dist/windows/OurNotesWallpaper-Native-win-x64.zip
#   dist/windows/OurNotesWallpaper-Native-win-arm64.zip
# Each zip = OurNotesWallpaper.exe + data/ (spots, thumbs, bands) + README-ko.txt.
#
# Run windows/native/build.sh first. Temp staging goes under build-tmp.

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
WEB="$REPO/Resources/web"
DIST="$REPO/dist/windows"
STAGE="$HERE/build-tmp/pkg"

mkdir -p "$DIST"

package_arch() {
  local arch="$1"
  local exe="$HERE/out/$arch/OurNotesWallpaper.exe"
  if [ ! -f "$exe" ]; then echo "missing $exe -- run build.sh first"; return 1; fi

  local root="$STAGE/$arch/OurNotesWallpaper"
  rm -rf "$STAGE/$arch"
  mkdir -p "$root/data"

  cp "$exe" "$root/OurNotesWallpaper.exe"
  cp "$HERE/README-ko.txt" "$root/README-ko.txt"

  # data/: spots, thumbs, bands (copied verbatim, never modified).
  cp -R "$WEB/spots" "$root/data/spots"
  cp -R "$WEB/thumbs" "$root/data/thumbs"
  cp -R "$WEB/bands" "$root/data/bands"

  # Drop macOS cruft that scatters into copies.
  find "$root" -name ".DS_Store" -delete 2>/dev/null || true

  local zip="$DIST/OurNotesWallpaper-Native-win-$arch.zip"
  rm -f "$zip"
  ( cd "$STAGE/$arch" && zip -qr -X "$zip" "OurNotesWallpaper" )
  echo "packaged $zip ($(du -h "$zip" | cut -f1))"
}

WHICH="${1:-both}"
if [ "$WHICH" = "x64" ] || [ "$WHICH" = "both" ]; then package_arch x64; fi
if [ "$WHICH" = "arm64" ] || [ "$WHICH" = "both" ]; then package_arch arm64; fi

# The staging trees hold a full copy of data/ each (~650MB); remove them.
rm -rf "$STAGE"
echo "done."
