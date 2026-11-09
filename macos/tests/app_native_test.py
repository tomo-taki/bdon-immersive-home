#!/usr/bin/env python3
"""Exercise the real wallpaper extension, then restore the user's selections."""
import argparse
import json
import os
import plistlib
import subprocess
import tempfile
import time
from pathlib import Path

from app_defaults import restore_defaults

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'work/native-integration'
STORE = Path.home() / 'Library/Application Support/com.apple.wallpaper/Store/Index.plist'
TIMEOUT = 90
POLL = 0.2
FOUNDATION_EPOCH = 978307200


def run(*args, env=None, check=True):
    return subprocess.run([str(arg) for arg in args], env=env, check=check,
                          capture_output=True, text=True, timeout=TIMEOUT)


def require(value, message):
    if not value:
        raise AssertionError(message)


def choices(value, path=''):
    result = {}
    if isinstance(value, list):
        for index, item in enumerate(value):
            result.update(choices(item, path + '/' + str(index)))
    if isinstance(value, dict):
        if 'Provider' in value:
            result[path] = (value['Provider'], value.get('Configuration'), value.get('Files'))
        for key, item in value.items():
            result.update(choices(item, path + '/' + key))
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('app', type=Path)
    args = parser.parse_args()
    app = args.app.resolve()
    info = plistlib.loads((app / 'Contents/Info.plist').read_bytes())
    identifier = info['CFBundleIdentifier']
    require(identifier.endswith('.dev'), 'test requires the dev app')
    binary = app / 'Contents/MacOS/BDONImmersiveHome'
    data = app / 'Contents/PlugIns/BDONWallpaper.appex/Contents/Resources/data'
    spots = json.loads((data / 'spots/index.json').read_text())
    cache = Path.home() / 'Library/Containers' / (identifier + '.wallpaper') / 'Data/Library/Caches/BDONWallpaper'
    before = choices(plistlib.loads(STORE.read_bytes()))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    environment = dict(os.environ, BDON_NATIVE_TEST='1', BDON_LOG='1')
    result = {}

    with tempfile.TemporaryDirectory(prefix='real-wallpaper-', dir=OUTPUT) as name:
        backup = Path(name) / 'defaults.plist'
        run('/usr/bin/defaults', 'export', identifier, backup)

        def action(command):
            receipt = OUTPUT / ('native-' + command + '.json')
            completed = run(binary, '--native-test', command, receipt, env=environment, check=False)
            with (OUTPUT / 'native-app.log').open('a') as log:
                log.write(completed.stdout + completed.stderr)
            return completed, json.loads(receipt.read_text())

        def preference(key, kind, value):
            run('/usr/bin/defaults', 'write', identifier, key, kind, value)

        def frames(spot, characters, started):
            deadline = time.monotonic() + 8
            records = []
            while time.monotonic() < deadline:
                records = []
                for file in cache.glob('*.json'):
                    record = json.loads(file.read_text())
                    scene = record['scene']
                    if scene['spot'] == spot and scene['characters'] == characters and record['updated'] >= started:
                        records.append(record)
                if any(record['frames'] >= 30 for record in records):
                    return records
                time.sleep(POLL)
            # A locked or sleeping display can suspend the system-owned surfaces.
            require(any(record['frames'] > 0 for record in records), 'extension did not present a GPU frame')
            return records

        try:
            for spot, characters in ((spots[0]['id'], True), (spots[1]['id'], False)):
                preference('spotId', '-string', spot)
                preference('showCharacters', '-bool', str(characters).lower())
                started = time.time() - FOUNDATION_EPOCH
                completed, receipt = action('apply')
                require(completed.returncode == 0 and receipt['success'], f'apply failed: {receipt}')
                result[spot] = frames(spot, characters, started)
                require(len({record['timeline'] for record in result[spot]}) == 1, 'surfaces have separate timelines')
                print(f'PASS: real extension presents Spot {spot}, characters={characters}', flush=True)
                if not any(record['frames'] >= 30 for record in result[spot]):
                    print('UNVERIFIED: continuing animation while the Mac display is inactive', flush=True)
            environment['BDON_NATIVE_TARGET'] = spots[-1]['id']
            completed, receipt = action('transition')
            require(completed.returncode == 0 and receipt['success'], f'live transition failed: {receipt}')
            result['transition'] = receipt
            print(f"PASS: live transition in {receipt['seconds']:.3f}s; agent and contexts unchanged", flush=True)
            completed, receipt = action('restore')
            require(completed.returncode == 0 and receipt['success'], 'restore failed')
            require(choices(plistlib.loads(STORE.read_bytes())) == before, 'original wallpaper choices changed')
            result['originalRestored'] = True
            print('PASS: fresh app process restores original wallpaper and screensaver', flush=True)

            # A provider can launch while scene acquisition fails; it must roll back.
            completed, receipt = action('fail')
            require(completed.returncode != 0 and not receipt['success'], 'invalid scene was accepted')
            require(choices(plistlib.loads(STORE.read_bytes())) == before, 'failed apply did not restore originals')
            result['failedApplyRestored'] = True
            print('PASS: failed scene acquisition restores the original system choices', flush=True)
        finally:
            action('restore')
            restore_defaults(identifier, backup.read_bytes())

    (OUTPUT / 'app-native-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
