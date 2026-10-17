#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/work/mac-tests"
mkdir -p "$OUT"
python3 "$ROOT/macos/tests/update_policy_test.py"
python3 "$ROOT/macos/tests/signing_test.py"
swiftc "$ROOT/macos/Sources/UpdateFailure.swift" "$ROOT/macos/tests/update_test.swift" -o "$OUT/update_test"
"$OUT/update_test" "$ROOT/macos/app-id.txt"
swiftc -O "$ROOT/macos/Sources/LockScreenCache.swift" "$ROOT/macos/tests/lock_screen_cache_test.swift" -o "$OUT/lock_screen_cache_test"
"$OUT/lock_screen_cache_test"
