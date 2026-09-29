#!/usr/bin/env bash
# build.sh — Build & package the Windows web track on macOS.
#
# Produces:
#   dist/windows/BDONImmersiveHome-Web-win32-x64.zip
#   dist/windows/BDONImmersiveHome-Web-win32-arm64.zip
#
# Steps: pin exact npm versions, fetch the Windows koffi native binaries (npm on
# macOS only installs the host one), rebuild the shared web bundle, stage the
# page + Spot data into the Electron app, package for both Windows arches with
# @electron/packager (no wine/rcedit), zip each with a Korean README, then check
# the koffi win32 binaries and the Spot data landed inside the asar.
#
# Everything writes under windows/web/** and dist/windows/**. The one outside
# effect is `cd web && npm run build`, which regenerates Resources/web/app.js.

set -euo pipefail

# --- Paths ------------------------------------------------------------------
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEBDIR="$REPO/windows/web"
APP="$WEBDIR/app"
TMP="$WEBDIR/build-tmp"
OUT="$WEBDIR/build-tmp/out"          # packager output (staging)
DIST="$REPO/dist/windows"
RES="$REPO/Resources/web"

# Pinned exact versions.
ELECTRON_VERSION="44.4.5"
PACKAGER_VERSION="20.3.0"
KOFFI_VERSION="3.3.2"

# Keep npm's temp under our build-tmp, not /tmp.
export TMPDIR="$TMP"
mkdir -p "$TMP" "$DIST"

echo "==> [1/6] Install pinned app dependencies + Windows koffi binaries"
cd "$APP"
npm install --save-exact --no-audit --no-fund \
  "electron@$ELECTRON_VERSION" \
  "@electron/packager@$PACKAGER_VERSION" \
  "koffi@$KOFFI_VERSION"

# koffi ships one native binary per platform as an optional dependency; npm on
# macOS installs only @koromix/koffi-darwin-*. Fetch the two Windows binaries
# via `npm pack` and drop them into node_modules/@koromix so packager bundles
# them. Done with pack (not a second `npm install`, which would prune whichever
# arch was not last on the command line).
mkdir -p "$TMP/koffi-bin" node_modules/@koromix
for TRIPLE in win32-x64 win32-arm64; do
  PKG="@koromix/koffi-$TRIPLE@$KOFFI_VERSION"
  DEST="node_modules/@koromix/koffi-$TRIPLE"
  if [ -f "$DEST"/*/koffi.node ] 2>/dev/null; then
    echo "    - koffi $TRIPLE already present"
    continue
  fi
  echo "    - fetching koffi $TRIPLE"
  ( cd "$TMP/koffi-bin" && npm pack "$PKG" --silent >/dev/null )
  TARBALL="$(ls -t "$TMP"/koffi-bin/koromix-koffi-"$TRIPLE"-*.tgz | head -1)"
  rm -rf "$DEST"
  mkdir -p "$DEST"
  tar -xzf "$TARBALL" -C "$DEST" --strip-components=1
done
echo "    koffi native binaries staged:"
find node_modules/@koromix -name '*.node' | sed 's/^/      /'

echo "==> [2/6] Rebuild the shared web bundle (regenerates Resources/web/app.js)"
cd "$REPO/web"
npm install --no-audit --no-fund
npm run build

echo "==> [3/6] Stage page + Spot data into the app (app/web)"
STAGE="$APP/web"
rm -rf "$STAGE"
mkdir -p "$STAGE"
# Page: our own adapted index.html (do NOT edit web/src); bundle from Resources.
cp "$WEBDIR/index.html" "$STAGE/index.html"
cp "$RES/app.js" "$STAGE/app.js"
# Data the renderer and settings window need.
cp -R "$RES/spots" "$STAGE/spots"
cp -R "$RES/thumbs" "$STAGE/thumbs"
cp -R "$RES/bands" "$STAGE/bands"
# Tray icons.
mkdir -p "$APP/icons"
cp "$REPO/icon/tomori.png" "$APP/icons/tomori.png" 2>/dev/null || true
cp "$REPO/icon/menubar@2x.png" "$APP/icons/menubar@2x.png" 2>/dev/null || true
cp "$REPO/icon/menubar.png" "$APP/icons/menubar.png" 2>/dev/null || true

# Version stamp for the 정보 pane: build date + the commit it was built from.
# Read by main.js appVersion(); "개발 빌드" is shown when this file is absent.
BUILD_DATE="$(date +%Y.%m.%d)"
BUILD_COMMIT="$(git -C "$REPO" rev-parse --short HEAD 2>/dev/null || echo dev)"
cat > "$APP/version.json" <<EOF
{ "date": "$BUILD_DATE", "commit": "$BUILD_COMMIT" }
EOF
echo "    version.json: $BUILD_DATE ($BUILD_COMMIT)"

echo "==> [4/6] Package for win32 x64 and arm64"
cd "$APP"
rm -rf "$OUT"
mkdir -p "$OUT"
PACKAGER="$APP/node_modules/.bin/electron-packager"

# --prune=false: keep the manually-staged @koromix win32 binaries (they are not
# in the host dependency graph, so a prune would delete them). The app is tiny;
# the bulk is Electron + Spot data, unaffected by pruning either way.
# koffi's .node files are auto-unpacked from the asar by packager.
for ARCH in x64 arm64; do
  echo "    - win32/$ARCH"
  "$PACKAGER" "$APP" BDONImmersiveHome \
    --platform=win32 \
    --arch="$ARCH" \
    --electron-version="$ELECTRON_VERSION" \
    --out="$OUT" \
    --overwrite \
    --prune=false \
    --ignore="(^/build-tmp)" \
    --ignore="(^/qa)" \
    --ignore="(^/\.DS_Store)" \
    --tmpdir="$TMP"
done

echo "==> [5/6] README + zip"
for ARCH in x64 arm64; do
  PKGDIR="$OUT/BDONImmersiveHome-win32-$ARCH"
  if [ ! -d "$PKGDIR" ]; then
    echo "ERROR: expected package dir missing: $PKGDIR" >&2
    exit 1
  fi
  cat > "$PKGDIR/README-ko.txt" <<'EOF'
Our Notes 라이브 배경화면 (Windows)

실행 방법
  1. 이 폴더의 BDONImmersiveHome.exe 를 실행하세요.
  2. Windows SmartScreen 경고가 나오면: "추가 정보" → "실행" 을 누르세요.
     (서명되지 않은 앱이라 처음 한 번만 나옵니다.)
  3. 배경이 바탕화면 아이콘 뒤에 나타납니다. 트레이(작업 표시줄 오른쪽
     아이콘 모음)의 아이콘을 눌러 "배경 설정…" 을 열 수 있습니다.

설정 / 로그 위치
  %APPDATA%\BDONImmersiveHome\settings.json   (설정)
  %APPDATA%\BDONImmersiveHome\log.txt         (로그, 메모리 포함)

종료
  트레이 아이콘 → 종료

참고
  - GPU 없는 가상 머신에서도 소프트웨어 렌더링으로 동작합니다(느릴 수 있음).
  - 여러 모니터를 지원하며, 모니터를 연결/해제하면 자동으로 따라갑니다.
EOF

  ZIP="$DIST/BDONImmersiveHome-Web-win32-$ARCH.zip"
  rm -f "$ZIP"
  ( cd "$OUT" && zip -r -q "$ZIP" "BDONImmersiveHome-win32-$ARCH" )
  echo "    - $(basename "$ZIP"): $(du -h "$ZIP" | cut -f1)"
done

echo "==> [6/6] Verify koffi binaries + data inside packages"
FAIL=0
ASARBIN="$APP/node_modules/.bin/asar"
for ARCH in x64 arm64; do
  PKGDIR="$OUT/BDONImmersiveHome-win32-$ARCH"
  ASAR="$PKGDIR/resources/app.asar"
  UNPACKED="$PKGDIR/resources/app.asar.unpacked"
  echo "    [$ARCH]"

  # koffi native for THIS arch must be unpacked (native modules can't load from asar).
  KNODE="$UNPACKED/node_modules/@koromix/koffi-win32-$ARCH/win32_$ARCH/koffi.node"
  if [ -f "$KNODE" ]; then
    echo "      koffi win32_$ARCH binary: ok ($(du -h "$KNODE" | cut -f1))"
  else
    echo "      koffi win32_$ARCH binary: MISSING"; FAIL=1
  fi

  # Data + page inside the asar. Pipe list straight to grep (a captured var of
  # the whole listing proved flaky on the larger arch).
  check_entry() {
    if "$ASARBIN" list "$ASAR" 2>/dev/null | grep -qx "$1"; then
      echo "      ${1}: ok"
    else
      echo "      ${1}: MISSING"; FAIL=1
    fi
  }
  check_entry "/web/index.html"
  check_entry "/web/app.js"
  check_entry "/web/spots/index.json"
  SPOTS=$("$ASARBIN" list "$ASAR" 2>/dev/null | grep -c "^/web/spots/" || true)
  THUMBS=$("$ASARBIN" list "$ASAR" 2>/dev/null | grep -c "^/web/thumbs/" || true)
  echo "      web/spots entries: $SPOTS ; web/thumbs entries: $THUMBS"
done

if [ "$FAIL" -ne 0 ]; then
  echo "==> VERIFY FAILED" >&2
  exit 1
fi
echo "==> Done. Zips in $DIST"
