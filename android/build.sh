#!/usr/bin/env bash
# android/build.sh -- Gradle-free build of BDONImmersiveHome-android.apk.
#
# Pipeline: NDK clang -> libbdon.so (arm64-v8a) ; javac -> d8 -> classes.dex ;
# aapt2 compile+link -> base APK (manifest + res) ; add dex + native libs +
# assets (spot data, stored uncompressed) ; zipalign ; apksigner.
#
# Output: dist/android/BDONImmersiveHome-android.apk
# Usage:  android/build.sh
#
# Pinned toolchain (edit here to bump):
NDK_VERSION="27.2.12479018"
BUILD_TOOLS="36.1.0"
PLATFORM="android-36.1"
ABI="arm64-v8a"
API="26"                       # minSdk / native target API

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"

SDK="${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}"
NDK="$SDK/ndk/$NDK_VERSION"
BT="$SDK/build-tools/$BUILD_TOOLS"
ANDROID_JAR="$SDK/platforms/$PLATFORM/android.jar"
JAVA_HOME="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
JAVAC="$JAVA_HOME/bin/javac"
# d8 and apksigner run plain `java`; macOS' /usr/bin/java is a stub without a JRE.
export JAVA_HOME PATH="$JAVA_HOME/bin:$PATH"

TC="$NDK/toolchains/llvm/prebuilt/darwin-x86_64"
CLANGXX="$TC/bin/aarch64-linux-android${API}-clang++"
CLANG="$TC/bin/aarch64-linux-android${API}-clang"

SPINE="$REPO/vendor/spine-runtimes/spine-c/spine-c"
BRIDGE="$REPO/Sources/SpineBridge"
WINSRC="$REPO/windows/native/src"          # shared headers: onp_math.h, onp_spot.h, onp_room.h
THIRD="$REPO/windows/native/third_party"   # json.hpp, stb_image.h, stb_image_write.h
CPP="$HERE/app/src/main/cpp"
DATA="$REPO/Resources/web/spots"           # spot data packaged as assets

OUT="$HERE/build-tmp"
DIST="$REPO/dist/android"
KS="$REPO/work/android-keystore"

for tool in "$CLANGXX" "$JAVAC" "$BT/aapt2" "$BT/d8" "$BT/zipalign" "$BT/apksigner"; do
  [ -x "$tool" ] || { echo "missing tool: $tool"; exit 1; }
done
[ -d "$DATA" ] || { echo "missing spot data: $DATA"; exit 1; }

rm -rf "$OUT"
mkdir -p "$OUT/obj" "$OUT/lib/$ABI" "$OUT/classes" "$OUT/apk" "$OUT/res-compiled" "$DIST"

# --- stage the cpp third_party headers where the sources expect them ---
mkdir -p "$CPP/third_party"
cp "$THIRD/stb_image.h" "$THIRD/stb_image_write.h" "$CPP/third_party/"

# ---------------------------------------------------------------------------
# 1. Native library
# ---------------------------------------------------------------------------
echo "=== compiling native (libbdon.so, $ABI api$API) ==="

CFLAGS=(-O2 -fPIC -DNDEBUG -w -ffunction-sections -fdata-sections)
CXXFLAGS=(-std=c++17 -O2 -fPIC -fexceptions -frtti
          -ffunction-sections -fdata-sections
          -Wno-nullability-completeness)
# No logging unless DEBUG=1 (SPEC: no logging unless a debug flag).
if [ "${DEBUG:-0}" = "1" ]; then CXXFLAGS+=(-DBDON_DEBUG); else CXXFLAGS+=(-DNDEBUG); fi
INCLUDES=(-I "$BRIDGE/include" -I "$SPINE/include" -I "$WINSRC" -I "$THIRD" -I "$CPP")

OBJS=()

# spine-c (C).
for f in "$SPINE"/src/spine/*.c; do
  o="$OUT/obj/spine_$(basename "$f").o"
  "$CLANG" "${CFLAGS[@]}" -I "$SPINE/include" -c "$f" -o "$o"
  OBJS+=("$o")
done
# spine bridge (C).
"$CLANG" "${CFLAGS[@]}" -I "$BRIDGE/include" -I "$SPINE/include" \
    -c "$BRIDGE/spine_bridge.c" -o "$OUT/obj/spine_bridge.o"
OBJS+=("$OUT/obj/spine_bridge.o")

# C++ (renderer, stage, texture, jni).
for f in "$CPP/gl_texture.cpp" "$CPP/gl_stage.cpp" "$CPP/gl_renderer.cpp" "$CPP/jni_bridge.cpp"; do
  o="$OUT/obj/$(basename "$f").o"
  "$CLANGXX" "${CXXFLAGS[@]}" "${INCLUDES[@]}" -c "$f" -o "$o"
  OBJS+=("$o")
done

# Link the shared object. libc++_shared is copied beside it into the APK.
# -z max-page-size=16384: 16 KB-align LOAD segments so the .so loads on devices
# with 16 KB memory pages (Pixel 8+, and the ps16k emulator image), not just 4 KB.
"$CLANGXX" -shared -o "$OUT/lib/$ABI/libbdon.so" "${OBJS[@]}" \
    -lEGL -lGLESv3 -landroid -llog -static-libstdc++ \
    -Wl,-z,max-page-size=16384 -Wl,--gc-sections
# libc++_shared.so ships alongside (we did NOT static-link the STL because
# -fexceptions across a shared boundary is cleanest with the shared runtime).
cp "$TC/sysroot/usr/lib/aarch64-linux-android/libc++_shared.so" "$OUT/lib/$ABI/"
echo "libbdon.so: $(wc -c < "$OUT/lib/$ABI/libbdon.so") bytes"

# ---------------------------------------------------------------------------
# 2. Java -> classes.dex
# ---------------------------------------------------------------------------
echo "=== compiling java ==="
# R.java is produced by aapt2 link (step 3) BEFORE javac needs it, so link first
# to a temp then compile. We run aapt2 link here to emit R.java, then javac.
GEN="$OUT/gen"
mkdir -p "$GEN"

# Generated build flags (never a tracked file). DEBUG mirrors the native
# BDON_DEBUG convention: DEBUG=1 in the environment enables the QA hooks
# (qa_prefs / qa_snapshot). A plain release build ships them disabled.
GENPKG="$GEN/com/bdon/immersivehome"
mkdir -p "$GENPKG"
if [ "${DEBUG:-0}" = "1" ]; then BF_DEBUG=true; else BF_DEBUG=false; fi
printf 'package com.bdon.immersivehome;\nfinal class BuildFlags {\n    static final boolean DEBUG = %s;\n    private BuildFlags() {}\n}\n' \
  "$BF_DEBUG" > "$GENPKG/BuildFlags.java"

# Generate the About-tab version string "YYYY.MM.DD (hash)" into a throwaway
# res dir (never a tracked file). Commit hash falls back to "dev".
BUILD_DATE="$(date +%Y.%m.%d)"
COMMIT="$(cd "$REPO" && git rev-parse --short HEAD 2>/dev/null || echo dev)"
# versionCode = commit count, same build number the Mac/Windows releases use
# (tag b<count>), so each release installs over the previous one.
BUILD_NO="$(cd "$REPO" && git rev-list --count HEAD 2>/dev/null || echo 1)"
GENRES="$OUT/genres/values"
mkdir -p "$GENRES"
printf '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <string name="build_version">%s (%s)</string>\n</resources>\n' \
  "$BUILD_DATE" "$COMMIT" > "$GENRES/generated.xml"

# aapt2 compile resources (project res + generated).
find "$HERE/app/src/main/res" "$OUT/genres" -type f | while read -r r; do
  "$BT/aapt2" compile "$r" -o "$OUT/res-compiled" >/dev/null
done

# aapt2 link -> resources.apk (+ R.java), pins min/target sdk.
"$BT/aapt2" link \
  -o "$OUT/apk/base.apk" \
  -I "$ANDROID_JAR" \
  --manifest "$HERE/app/src/main/AndroidManifest.xml" \
  --java "$GEN" \
  --min-sdk-version "$API" --target-sdk-version 36 \
  --version-code "$BUILD_NO" --version-name "$BUILD_DATE ($COMMIT)" \
  "$OUT"/res-compiled/*.flat

# javac.
JAVA_SRCS=$(find "$HERE/app/src/main/java" "$GEN" -name '*.java')
"$JAVAC" -source 17 -target 17 -encoding UTF-8 \
  -classpath "$ANDROID_JAR" \
  -d "$OUT/classes" $JAVA_SRCS

# d8 -> classes.dex (bundled into the base apk).
"$BT/d8" --release --min-api "$API" --lib "$ANDROID_JAR" \
  --output "$OUT/apk" \
  $(find "$OUT/classes" -name '*.class')

# ---------------------------------------------------------------------------
# 3. Assemble the APK
# ---------------------------------------------------------------------------
echo "=== assembling apk ==="
cd "$OUT/apk"
# base.apk already holds manifest + resources; add dex, native libs, assets.
# classes.dex (compressed is fine).
"$JAVA_HOME/bin/jar" -uf base.apk classes.dex 2>/dev/null || \
  ( mkdir -p _add && cp classes.dex _add/ && cd _add && zip -q ../base.apk classes.dex && cd .. && rm -rf _add )

# Native libs under lib/<abi>/. STORE (uncompressed) so zipalign can place them
# on 16 KB page boundaries and the loader can mmap them directly.
( cd "$OUT" && zip -qr -0 "$OUT/apk/base.apk" "lib/$ABI/libbdon.so" "lib/$ABI/libc++_shared.so" )

# Assets: spot data. STORE (no compression) so the extractor streams fast and
# the APK stays a container of already-compressed PNG/JPEG/GLB.
STAGE="$OUT/assetstage"
mkdir -p "$STAGE/assets"
cp -R "$DATA" "$STAGE/assets/spots"

# Settings-UI images (not extracted to disk -- read from the APK on the UI thread):
#   assets/thumbs/<id>.jpg  -- scene cards, downsampled from Resources/web/thumbs
#                              (1280x720) to 400px-wide JPEG q80 to keep APK growth small
#   assets/bands/<name>.png -- band chip logos (already ~3 KB each)
THUMB_SRC="$REPO/Resources/web/thumbs"
BAND_SRC="$REPO/Resources/web/bands"
if [ -d "$THUMB_SRC" ]; then
  mkdir -p "$STAGE/assets/thumbs"
  for f in "$THUMB_SRC"/*.jpg; do
    base="$(basename "$f")"
    case "$base" in *_bg.jpg) continue;; esac   # ship only the with-characters thumb
    # sips resize longest edge to 400px + re-encode JPEG q80 (both host tools)
    sips -Z 400 -s format jpeg -s formatOptions 80 "$f" --out "$STAGE/assets/thumbs/$base" >/dev/null 2>&1
  done
fi
if [ -d "$BAND_SRC" ]; then
  mkdir -p "$STAGE/assets/bands"
  cp "$BAND_SRC"/*.png "$STAGE/assets/bands/" 2>/dev/null || true
fi

find "$STAGE" -name ".DS_Store" -delete 2>/dev/null || true
( cd "$STAGE" && zip -qr -0 "$OUT/apk/base.apk" assets )

# ---------------------------------------------------------------------------
# 4. Align + sign
# ---------------------------------------------------------------------------
echo "=== zipalign + sign ==="
"$BT/zipalign" -f -P 16 4 "$OUT/apk/base.apk" "$OUT/apk/aligned.apk"

PASS="$(tr -d '\n' < "$KS/keystore.pass")"
"$BT/apksigner" sign \
  --ks "$KS/bdon.keystore" --ks-key-alias bdon \
  --ks-pass pass:"$PASS" --key-pass pass:"$PASS" \
  --out "$DIST/BDONImmersiveHome-android.apk" \
  "$OUT/apk/aligned.apk"
unset PASS

"$BT/apksigner" verify --verbose "$DIST/BDONImmersiveHome-android.apk" >/dev/null && echo "signature OK"
echo "APK: $DIST/BDONImmersiveHome-android.apk ($(du -h "$DIST/BDONImmersiveHome-android.apk" | cut -f1))"
