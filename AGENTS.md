# Agent rules

## Update summary: always ask the human

The mac and Windows apps show each update's summary (the GitHub release body) in 설정 > 정보 before installing it. The human writes it; no agent does.

- Whenever you commit and build for distribution (`build.sh`, `tools/make_dmg.sh`, `windows/native/build.sh` + `package.sh`, `android/build.sh`) or run `tools/release.sh`, first ask the human for the update summary of that version.
- Do not draft, suggest, translate, shorten or infer it (not from commits either), even when told to finish without questions.
- Save the human's words verbatim to `dist/release-notes.md`. `tools/release.sh` publishes that file and refuses to run without it.

## Releases per platform

- `tools/release.sh --platforms windows` (or `mac`, `android`, comma-separated) publishes only those packages, e.g. for a bug on one OS. The apps update only from a release holding their own package.
- Only a release with all platforms becomes Latest. Installs up to b21 read `releases/latest` alone; never mark a partial release Latest.
