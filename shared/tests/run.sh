#!/usr/bin/env bash
# shared/tests/run.sh -- host-side verification (no Direct3D, no VM):
#   1. swift_reference.swift prints the Swift ground truth for Spot 30001.
#   2. host_test.cpp (native build) re-derives the same values from the C++
#      ports (shared/scene) and compares them, plus the Windows update pick.
#
# Builds host_test with clang++ (Apple's, working libc++). zig c++ native also
# works for the app targets, but zig 0.16 rebuilds libc++ from source on the
# host and hits an unrelated INFINITY macro bug in that build; clang++ is the
# spec-sanctioned native alternative for the host test.

set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
SPOTS="$REPO/data/spots"
TMP="$REPO/work/host-test"
mkdir -p "$TMP"

CXX="${CXX:-clang++}"

REF="$(swift "$HERE/swift_reference.swift" "$SPOTS" 2>/dev/null | tail -1)"
echo "swift reference: $REF"

"$CXX" -std=c++17 -O2 -I "$REPO/shared/third_party" -o "$TMP/host_test" "$HERE/host_test.cpp"
"$TMP/host_test" "$SPOTS" "$REF"

# Check the shipping Swift camera and its shared Windows/Android port.
swiftc "$REPO/macos/Sources/Render/Math.swift" "$REPO/macos/Sources/Render/Spot.swift" \
    "$HERE/camera_test.swift" -o "$TMP/swift_camera_test"
"$TMP/swift_camera_test" "$SPOTS" "$TMP/camera-poses.json"

"$CXX" -std=c++17 -O2 -I "$REPO/shared/third_party" \
    "$HERE/camera_test.cpp" -o "$TMP/camera_test"
"$TMP/camera_test" "$SPOTS" "$TMP/camera-poses.json"
