#!/usr/bin/env bash
# windows/native/build.sh -- cross-compile BDONImmersiveHome.exe for
# x86_64-windows-gnu and aarch64-windows-gnu with zig, on macOS. No wine.
#
# Output: windows/native/out/{x64,arm64}/BDONImmersiveHome.exe
# Usage:  windows/native/build.sh [x64|arm64|both]   (default both)

set -euo pipefail

ZIG="${ZIG:-$HOME/.local/bin/zig}"
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
SPINE="$REPO/vendor/spine-runtimes/spine-c/spine-c"
BRIDGE="$REPO/Sources/SpineBridge"
TMP="$HERE/build-tmp"
export TMPDIR="$TMP"
mkdir -p "$TMP"

WHICH="${1:-both}"

# C++ / C sources.
CPP_SRC=(
  "$HERE/src/main.cpp"
  "$HERE/src/onp_d3d.cpp"
  "$HERE/src/onp_stage.cpp"
  "$HERE/src/onp_texture.cpp"
  "$HERE/src/onp_settings.cpp"
  "$HERE/src/onp_png.cpp"
  "$HERE/src/settings_window.cpp"
  "$HERE/src/onp_install.cpp"
  "$HERE/src/onp_update.cpp"
)
BRIDGE_SRC="$BRIDGE/spine_bridge.c"
SPINE_SRC=("$SPINE"/src/spine/*.c)

INCLUDES=(-I "$BRIDGE/include" -I "$SPINE/include" -I "$HERE/src" -I "$HERE/third_party")

# System import libraries (all shipped with Windows).
LIBS=(-ld3d11 -ldxgi -ld3dcompiler_47 -lgdiplus -lgdi32 -lshell32 -lshlwapi
      -luser32 -lole32 -lwtsapi32 -lpsapi -luuid -ladvapi32 -lwinhttp -lbcrypt)

# Version stamp injected into the 정보 tab (AboutView parity): build date and
# the commit it was built from. Fall back to "dev" when git is unavailable.
BUILD_DATE="$(date +%Y.%m.%d)"
COMMIT="$(cd "$REPO" && git rev-parse --short HEAD 2>/dev/null || echo dev)"
# Commit count: compared with the b<count> release tag by the self-update.
BUILD_NUMBER="$(cd "$REPO" && git rev-list --count HEAD 2>/dev/null || echo 0)"

CXXFLAGS=(-std=c++17 -O2 -DNDEBUG -DUNICODE -D_UNICODE
          -DBDON_BUILD_DATE="\"$BUILD_DATE\"" -DBDON_COMMIT="\"$COMMIT\"" -DBDON_BUILD_NUMBER="$BUILD_NUMBER"
          -Wno-nullability-completeness -Wno-macro-redefined)
CFLAGS=(-O2 -w -DNDEBUG)
LDFLAGS=(-Wl,--subsystem,windows -municode -static)

build_target() {
  local arch="$1" triple="$2" outdir="$3"
  echo "=== building $arch ($triple) ==="
  mkdir -p "$outdir" "$TMP/$arch/obj"

  # Icon resource (.res, architecture-neutral). Embedded when present, else the
  # app falls back to LoadIcon at runtime.
  local RES=""
  if [ -f "$HERE/res/app.rc" ]; then
    "$ZIG" rc /fo "$TMP/$arch/app.res" "$HERE/res/app.rc" >/dev/null 2>&1 && RES="$TMP/$arch/app.res" || RES=""
  fi

  # spine-c + bridge (C).
  local objs=()
  "$ZIG" cc -target "$triple" -c "${CFLAGS[@]}" -I "$BRIDGE/include" -I "$SPINE/include" \
      "$BRIDGE_SRC" -o "$TMP/$arch/obj/spine_bridge.o"
  objs+=("$TMP/$arch/obj/spine_bridge.o")
  for f in "${SPINE_SRC[@]}"; do
    local o="$TMP/$arch/obj/$(basename "$f").o"
    "$ZIG" cc -target "$triple" -c "${CFLAGS[@]}" -I "$SPINE/include" "$f" -o "$o"
    objs+=("$o")
  done

  # C++ sources -> objects.
  for f in "${CPP_SRC[@]}"; do
    local o="$TMP/$arch/obj/$(basename "$f").o"
    "$ZIG" c++ -target "$triple" -c "${CXXFLAGS[@]}" "${INCLUDES[@]}" "$f" -o "$o"
    objs+=("$o")
  done

  # Link (icon .res included when it built).
  "$ZIG" c++ -target "$triple" "${LDFLAGS[@]}" "${objs[@]}" $RES "${LIBS[@]}" \
      -o "$outdir/BDONImmersiveHome.exe"
  # The version the exe shows; package.sh puts it beside the zip for tools/release.sh.
  echo "$BUILD_DATE ($COMMIT)" > "$outdir/version.txt"
  echo "built $outdir/BDONImmersiveHome.exe ($(wc -c < "$outdir/BDONImmersiveHome.exe") bytes)"
}

if [ "$WHICH" = "x64" ] || [ "$WHICH" = "both" ]; then
  build_target x64 x86_64-windows-gnu "$HERE/out/x64"
fi
if [ "$WHICH" = "arm64" ] || [ "$WHICH" = "both" ]; then
  build_target arm64 aarch64-windows-gnu "$HERE/out/arm64"
fi
echo "done."
