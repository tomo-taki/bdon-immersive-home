#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/work/update-tests"
mkdir -p "$OUT"
python3 "$ROOT/macos/tests/update_policy_test.py"
python3 "$ROOT/macos/tests/signing_test.py"
swiftc "$ROOT/macos/Sources/UpdateFailure.swift" "$ROOT/macos/tests/update_test.swift" -o "$OUT/update_test"
"$OUT/update_test" "$ROOT/macos/app-id.txt"
