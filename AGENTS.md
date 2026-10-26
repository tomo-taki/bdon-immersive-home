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
- `data/` (not committed): `source/` downloads, `spots/` and `thumbs/` built by `tools/spots/` and `macos/build.sh`, `cache/` and `venv/` of `tools/spots/export_spot.py`, `local_spots.json` and `update_catalog.log` of `tools/spots/update_catalog.py`.
- `tools/`: `release.sh` and the Spot data pipeline (`tools/spots/`).

## New Spots from the local catalog

- The local MoeNotes Viewer reads a moenotes-assets service (Docker, 127.0.0.1:8091). `python3 tools/spots/local_spots.py` lists the situations of its catalog that `data/spots` lacks, with the Spot id and name the region's master data gives them.
- `data/venv/bin/python tools/spots/export_spot.py <situation | Spot id>` writes one into `data/source/<situation>/` in the story site's layout and lists it in `data/source/local_spot_ids.txt`. The next `macos/build.sh` adds it to `data/spots` with its cover and thumbnails; the Windows and Android builds take them from there.
- Set up `data/venv` once: `python3.12 -m venv data/venv && data/venv/bin/pip install nnnotes==0.1.4`. Keep the pin: 0.1.4 is the exporter the story site's files came from.
- A situation without a MasterHomeSpot row has no Spot id or name yet; `--id N` exports a preview. Never release one: delete its line from `local_spot_ids.txt` and its `data/spots` and `data/thumbs` files first.
- Once the story site has the Spot, `build_spot.py` builds it from the site and skips the local export.
- `python3 tools/spots/update_catalog.py --install` (a LaunchAgent; `--uninstall` removes it) moves the service to the region's current release at login and every 6 hours, and notifies new situations and previews that the master data now lists. It lets a release refresh the catalog and cancels the release's export of every asset, so keep the service's `version_poll_secs` at 0.

## App id

- `com.togawa.bdon-immersive-home` on the mac. `macos/build.sh` gives the dist/ build `<id>.dev` and `macos/make_dmg.sh` restores the release id, so a build left in the repo never stands in for the installed app.
- Keep this id stable (`macos/app-id.txt`). The release gate checks both the DMG identity and its stable signing requirement. b27 and earlier need one manual DMG replacement because their updater rejects the renamed id.
- `com.togawa.bdon_immersive_home` on Android (no `-` allowed); the Java namespace stays `com.bdon.immersivehome`.
- Windows has no bundle-style id (registry and folders use the product name).
