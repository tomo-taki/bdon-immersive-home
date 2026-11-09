#!/usr/bin/env bash
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
JDK="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
OUT="$REPO/work/android-tests"
mkdir -p "$OUT"
"$JDK/bin/javac" -d "$OUT" \
  "$REPO/android/app/src/main/java/com/bdon/immersivehome/ShuffleTimer.java" \
  "$REPO/android/tests/ShuffleTimerTest.java"
"$JDK/bin/java" -cp "$OUT" com.bdon.immersivehome.ShuffleTimerTest
