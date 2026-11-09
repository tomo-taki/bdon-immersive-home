# macOS 도입 테스트

2026-11-08~09 · macOS 27.2 / Apple silicon / Swift 6.4 CLT.
PaperSaver 0.4.0, Sparkle 2.10.1을 실제 BDON 앱에 연결했다.

| 대상 | 확인 |
| --- | --- |
| Sparkle | 실제 앱 DMG 설치·교체·재실행, 중첩 코드 서명 |
| 업데이트 검증 | 피드 누락·피드 변조·DMG 변조 거부, Windows 전용 릴리스 제외 |
| 업데이트 설명 | 사람이 입력한 원문 보존 |
| 시스템 화면 통합 | 실제 wallpaper 확장 등록·시작·4K GPU 프레임 |
| 장면 설정 | Spot 변경, 캐릭터 표시 ON/OFF |
| 복구 | 별도 앱 프로세스에서 원래 배경·화면 보호기 복원, 적용 실패 시 자동 복원 |
| 시스템 선택 | 사용자가 나중에 변경한 슬롯 보존 테스트 |
| 시스템 선택 화면 | 실제 WallpaperExtensionKit의 선택 모델 디코딩 |
| 기존 업데이트 | Sparkle 도입 전 소비자가 새 DMG 검증·추출·수용. b27의 수동 교체 조건 유지 |
| 통합 장면 전환 | 10002 → 50007: 0.465초. WallpaperAgent PID·화면 컨텍스트 ID 유지 |
| 커서 시점 이동 | 통합 바탕화면에서 사용자 동작 확인. 원본 이동 범위가 0인 장면은 설정·메뉴 잠금 |

잠금 해제 후 실제 확장에서 지속 재생과 장면 전환을 확인했다.
설치 앱도 수정본으로 교체하고 사용자 설정을 복원했다.
교체 전 앱은 `work/native-integration/unlocked/BDON Immersive Home.before-delay-fix.app`에 보관한다.
잠금 화면의 최종 시각 확인은 사용자 확인을 기다리고 있다.
Intel, macOS 14·15, 다중 모니터 전환, 관리자 권한 설치도 별도 검증이 필요하다.

## 실행

빌드 전 해당 버전의 업데이트 설명을 사람에게 받아 `dist/release-notes.md`에
원문으로 저장한다. 배포는 하지 않고 로컬 앱과 DMG를 만든다.

```sh
macos/build.sh
bash macos/tests/run.sh
python3 macos/tests/app_update_test.py 'dist/BDON Immersive Home.app'
python3 macos/tests/app_native_test.py 'dist/BDON Immersive Home.app'
macos/make_dmg.sh
python3 macos/tests/check_upgrade.py dist/BDONImmersiveHome.dmg
```

실제 앱 테스트 로그·결과는 `work/native-integration/`에 저장한다.
업데이트 테스트는 임시 앱 복사본을 교체한다. 화면 통합 테스트는 실제 시스템
설정을 변경하고 종료 시 배경·화면 보호기와 앱 환경설정을 복원한다.
시스템에 잠금 해제된 화면이 있어야 지속 애니메이션과 화면 전환을 확인할 수 있다.

`python3 macos/integration/run.py`는 기존 격리 시험을 재현한다.
PaperSaver 설정 테스트 9개와 별도 Sparkle 시험 앱을 사용하며,
결과는 `work/macos-integration/`에 저장한다.

## 화면 통합

설정 > 상세 > 표시 > 배경·화면 보호기 통합에서 활성화한다.
macOS 26 이상에서 지원하며 기본값은 OFF다.
커서 시점 이동은 통합 바탕화면에서도 동작한다. 잠금 화면·화면 보호기는
고정 시점을 사용한다. 게임 원본의 이동 범위가 없는 장면에서는 설정을
비활성화하며, 저장된 ON/OFF 선택은 다음 장면에서도 유지한다.

```text
설정 -> NativeWallpaper -> NativeStoreDriver -> PaperSaver -> WallpaperAgent
                                         |                -> Store/Index.plist
                                         -> 원본 백업·복구

WallpaperAgent -> BDONWallpaper.appex -> 공유 SpotStage -> Metal -> 시스템 화면
```

확장의 샌드박스가 읽을 수 있도록 장면 데이터는 확장 번들에 한 번만 넣는다.
앱도 같은 데이터를 읽는다. 배경·화면 보호기 표면은 같은 재생 상태를 공유한다.
프로세스 시작뿐 아니라 완료된 GPU 프레임을 확인한 뒤 적용 성공으로 판정한다.

통합 활성화 때만 WallpaperAgent를 재시작한다. 장면 변경은 확장 전용 설정
파일과 알림으로 전달한다. 새 자산은 별도 큐에서 불러오고 완료될 때까지
이전 화면을 유지한다. 기존 컨텍스트를 재사용하며 같은 Spot의 캐릭터·시점
설정은 자산을 다시 읽지 않는다. `--native-test transition`이 전환 시간과
프로세스·컨텍스트 유지를 검사한다.

확장의 비공개 ABI는 `macos/WallpaperExtension/Bridge.*`와 선택 모델에 격리했다.
macOS 변경으로 확장이 작동하지 않으면 원래 설정을 복원하고 오류를 표시한다.
[Aerial](https://github.com/AerialScreensaver/Aerial)의 확장 구조와
[PaperSaver 0.4.0](https://github.com/AerialScreensaver/PaperSaver/tree/0.4.0)을 참고했다.
Aerial 라이선스는 확장 리소스에 포함한다.

## 업데이트

기존 GitHub 릴리스 검색·정보 화면·설치 버튼은 유지한다.
설치·검증·앱 교체·재실행은 Sparkle이 수행한다.
서명된 피드와 추출 전 서명 검증을 요구한다.
변조 파일 거부 후 발생할 수 있는 Sparkle 오류 1004만 최대 3회 재시도한다.

`tools/release.sh --platforms mac`은 해당 태그 URL을 가리키는 서명된
`appcast.xml`을 패키지와 함께 준비한다. Windows·Android 전용 릴리스는
Mac 업데이트 후보가 되지 않는다. 기존 DMG·SHA256SUMS도 유지한다.

공개 키는 `macos/sparkle-public-key.txt`, 비공개 키는 Git에서 제외한
`data/secrets/sparkle-ed25519.key`에 있다. 이후 릴리스에도 같은 키가 필요하다.
`BDON_SPARKLE_KEY`로 별도 보관 경로를 지정할 수 있다.
서명 도구는 Sparkle 공식 `generate_appcast`·`sign_update`를 사용한다.
[Sparkle 배포 문서](https://sparkle-project.org/documentation/publishing/).
