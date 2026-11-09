#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/work/mac-tests"
mkdir -p "$OUT"
python3 "$ROOT/macos/tests/update_policy_test.py"
python3 "$ROOT/macos/tests/signing_test.py"
python3 "$ROOT/tools/spots/tests/copy_assets_test.py"
swiftc "$ROOT/macos/Sources/UpdateFailure.swift" "$ROOT/macos/tests/update_test.swift" -o "$OUT/update_test"
"$OUT/update_test" "$ROOT/macos/app-id.txt"
swiftc -O "$ROOT/macos/Sources/LockScreenCache.swift" "$ROOT/macos/tests/lock_screen_cache_test.swift" -o "$OUT/lock_screen_cache_test"
"$OUT/lock_screen_cache_test"
swiftc "$ROOT/macos/Sources/LockScreenLink.swift" "$ROOT/macos/Sources/EventLog.swift" \
    "$ROOT/macos/tests/lock_screen_link_test.swift" -o "$OUT/lock_screen_link_test"
"$OUT/lock_screen_link_test"
swiftc -parse-as-library "$ROOT/macos/WallpaperExtension/NativeMode.swift" \
    "$ROOT/macos/tests/native_mode_test.swift" -o "$OUT/native_mode_test"
"$OUT/native_mode_test"
swiftc -parse-as-library "$ROOT/macos/Sources/CursorSupport.swift" \
    "$ROOT/macos/tests/cursor_support_test.swift" -o "$OUT/cursor_support_test"
"$OUT/cursor_support_test"
swiftc -parse-as-library "$ROOT/macos/Sources/NativeScene.swift" "$ROOT/macos/Sources/NativeSceneChannel.swift" \
    "$ROOT/macos/tests/native_channel_test.swift" -o "$OUT/native_channel_test"
"$OUT/native_channel_test"
swiftc -parse-as-library "$ROOT/macos/Sources/NativeScene.swift" "$ROOT/macos/Sources/SpotCatalog.swift" \
    "$ROOT/macos/Sources/CursorSupport.swift" \
    "$ROOT/macos/Sources/EventLog.swift" "$ROOT/macos/WallpaperExtension/NativePicker.swift" \
    "$ROOT/macos/tests/native_picker_test.swift" -o "$OUT/native_picker_test"
(cd "$ROOT" && "$OUT/native_picker_test")
BIN="$(cd "$ROOT" && swift build -c release --show-bin-path)"
if [ ! -f "$BIN/PaperSaverKit.o" ]; then
    (cd "$ROOT" && swift build -c release --disable-sandbox)
fi
swiftc -parse-as-library -I "$BIN" -I "$BIN/Modules" "$BIN/PaperSaverKit.o" \
    "$ROOT/macos/Sources/NativeRestore.swift" "$ROOT/macos/tests/native_restore_test.swift" -o "$OUT/native_restore_test"
"$OUT/native_restore_test"
