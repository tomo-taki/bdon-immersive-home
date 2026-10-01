# Agent rules

## Update summary: always ask the human

The mac and Windows apps show each update's summary (the GitHub release body) in 설정 > 정보 before installing it. The human writes it; no agent does.

- Whenever you commit and build for distribution (`macos/build.sh`, `macos/make_dmg.sh`, `windows/build.sh` + `windows/package.sh`, `android/build.sh`) or run `tools/release.sh`, first ask the human for the update summary of that version.
- Do not draft, suggest, translate, shorten or infer it (not from commits either), even when told to finish without questions.
- Save the human's words verbatim to `dist/release-notes.md`. `tools/release.sh` publishes that file and refuses to run without it.

## Releases per platform

- `tools/release.sh --platforms windows` (or `mac`, `android`, comma-separated) publishes only those packages, e.g. for a bug on one OS. The apps update only from a release holding their own package.
- Only a release with all platforms becomes Latest. Installs up to b21 read `releases/latest` alone; never mark a partial release Latest.

## Layout

- `macos/`: the mac app (`Sources/` Swift, `Resources/` icons, `build.sh`, `make_dmg.sh` + `dmg/`). `Package.swift` stays at the root because its targets reach into `shared/` and `vendor/`.
- `windows/`: the Windows app (`src/`, `res/` icon, `tests/`, `build.sh`, `package.sh`).
- `android/`: the Android live wallpaper (`build.sh`, `app/src/main/`).
- `shared/`: code all three use: `spine-bridge/` (spine-c glue), `scene/` (Spot/room/camera C++ port), `third_party/` (json, stb), `tests/` (host parity tests: `shared/tests/run.sh`).
- `assets/bands/`: band logos for the settings screens. `assets/source/` (not committed) holds icon masters.
- `data/` (not committed): `source/` downloads, `spots/` and `thumbs/` built by `tools/spots/` and `macos/build.sh`.
- `tools/`: `release.sh` and the Spot data pipeline (`tools/spots/`).

## App id

- `com.togawa.bdon-immersive-home` on the mac. `macos/build.sh` gives the dist/ build `<id>.dev` and `macos/make_dmg.sh` restores the release id, so a build left in the repo never stands in for the installed app.
- `com.togawa.bdon_immersive_home` on Android (no `-` allowed); the Java namespace stays `com.bdon.immersivehome`.
- Windows has no bundle-style id (registry and folders use the product name).
