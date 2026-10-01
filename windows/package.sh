#!/usr/bin/env bash
# windows/package.sh -- assemble the distributable zips:
#   dist/windows/BDONImmersiveHome-win-x64.zip
#   dist/windows/BDONImmersiveHome-win-arm64.zip
# Each zip = BDONImmersiveHome.exe + data/ (spots, thumbs, bands) + README-ko.txt,
# with BDONImmersiveHome-win-<arch>.version beside it ("2026.09.29 (5786b63)",
# from build.sh) so tools/release.sh can tell which commit it holds.
#
# Run windows/build.sh first. Temp staging goes under build-tmp.

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
DATA="$REPO/data"
BANDS="$REPO/assets/bands"
DIST="$REPO/dist/windows"
STAGE="$HERE/build-tmp/pkg"

mkdir -p "$DIST"

package_arch() {
  local arch="$1"
  local exe="$HERE/out/$arch/BDONImmersiveHome.exe"
  local version="$HERE/out/$arch/version.txt"
  if [ ! -f "$exe" ] || [ ! -f "$version" ]; then echo "missing $exe or its version.txt -- run build.sh first"; return 1; fi

  local root="$STAGE/$arch/BDONImmersiveHome"
  rm -rf "$STAGE/$arch"
  mkdir -p "$root/data"

  cp "$exe" "$root/BDONImmersiveHome.exe"
  cp "$HERE/README-ko.txt" "$root/README-ko.txt"

  # data/: spots, thumbs, bands (copied verbatim, never modified).
  cp -R "$DATA/spots" "$root/data/spots"
  cp -R "$DATA/thumbs" "$root/data/thumbs"
  cp -R "$BANDS" "$root/data/bands"

  # Drop macOS cruft that scatters into copies.
  find "$root" -name ".DS_Store" -delete 2>/dev/null || true

  local zip="$DIST/BDONImmersiveHome-win-$arch.zip"
  rm -f "$zip" "${zip%.zip}.version"
  ( cd "$STAGE/$arch" && zip -qr -X "$zip" "BDONImmersiveHome" )
  cp "$version" "${zip%.zip}.version"
  echo "packaged $zip ($(du -h "$zip" | cut -f1), $(cat "$version"))"
}

WHICH="${1:-both}"
if [ "$WHICH" = "x64" ] || [ "$WHICH" = "both" ]; then package_arch x64; fi
if [ "$WHICH" = "arm64" ] || [ "$WHICH" = "both" ]; then package_arch arm64; fi

# The staging trees hold a full copy of data/ each (~650MB); remove them.
rm -rf "$STAGE"
echo "done."
