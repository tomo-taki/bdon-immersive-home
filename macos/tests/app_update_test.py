#!/usr/bin/env python3
"""Update the real dev app through a signed local DMG; leave the installed app alone."""
import argparse
import functools
import hashlib
import http.server
import json
import os
import plistlib
import shutil
import subprocess
import tempfile
import threading
import time
import xml.etree.ElementTree as ET
from pathlib import Path

from app_defaults import restore_defaults, snapshot_defaults

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'work/native-integration'
PACKAGE = 'BDONImmersiveHome.dmg'
SPARKLE_NS = 'http://www.andymatuschak.org/xml-namespaces/sparkle'
HTTP_OK = 200
LOOPBACK = '127.0.0.1'
BUILD_OLD = '1'
BUILD_NEW = '2'
TIMEOUT = 180
APP_NAME = 'BDON Immersive Home.app'
LSREGISTER = '/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister'


def run(*args, env=None):
    return subprocess.run([str(arg) for arg in args], env=env, check=True, capture_output=True,
                          text=True, timeout=TIMEOUT)


def require(value, message):
    if not value:
        raise AssertionError(message)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('app', type=Path)
    args = parser.parse_args()
    app = args.app.resolve()
    original = plistlib.loads((app / 'Contents/Info.plist').read_bytes())
    require(original['CFBundleIdentifier'].endswith('.dev'), 'test requires the dev app')
    defaults = snapshot_defaults(original['CFBundleIdentifier'])
    OUTPUT.mkdir(parents=True, exist_ok=True)
    notes = (ROOT / 'dist/release-notes.md').read_text()
    signer = ROOT / '.build/artifacts/sparkle/Sparkle/bin/sign_update'
    key = ROOT / 'data/secrets/sparkle-ed25519.key'
    with tempfile.TemporaryDirectory(prefix='real-update-', dir=OUTPUT) as name:
        work = Path(name)
        current = work / 'current' / APP_NAME
        updated = work / 'updated' / APP_NAME
        archive_dir = work / 'server'
        archive_dir.mkdir()
        receipt = work / 'receipt.json'
        payload = []
        requests = []

        class Handler(http.server.SimpleHTTPRequestHandler):
            def do_GET(self):
                requests.append(self.path)
                if self.path.startswith('/repos/'):
                    data = json.dumps(payload).encode()
                    self.send_response(HTTP_OK)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(data)))
                    self.end_headers()
                    self.wfile.write(data)
                    return
                super().do_GET()

            def log_message(self, *_args):
                pass

        server = http.server.ThreadingHTTPServer((LOOPBACK, 0), functools.partial(Handler, directory=str(archive_dir)))
        base = f'http://{LOOPBACK}:{server.server_port}'
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            for target, version in ((current, BUILD_OLD), (updated, BUILD_NEW)):
                target.parent.mkdir()
                run('/bin/cp', '-cR', app, target)
                metadata = dict(original, CFBundleVersion=version, CFBundleShortVersionString=version,
                                BDONTestReceipt=str(receipt), BDONTestVersion=BUILD_NEW)
                (target / 'Contents/Info.plist').write_bytes(plistlib.dumps(metadata))
                run('python3', ROOT / 'macos/sign_app.py', target)
            archive = archive_dir / PACKAGE
            print('Creating real-app DMG…', flush=True)
            run('/usr/bin/hdiutil', 'create', '-ov', '-format', 'UDZO', '-srcfolder', updated.parent, archive)
            run('python3', ROOT / 'macos/create_appcast.py', '--dmg', archive,
                '--notes', ROOT / 'dist/release-notes.md', '--output', archive_dir / 'appcast.xml',
                '--url-prefix', base + '/')
            (archive_dir / 'SHA256SUMS.txt').write_text(hashlib.sha256(archive.read_bytes()).hexdigest() + '  ' + PACKAGE + '\n')
            entry = {'tag_name': 'b' + BUILD_NEW, 'name': 'fixture', 'body': notes,
                     'html_url': 'https://github.com/tomo-taki/bdon-immersive-home',
                     'assets': [{'name': item, 'browser_download_url': base + '/' + item}
                                for item in (PACKAGE, 'SHA256SUMS.txt', 'appcast.xml')]}
            # A newer Windows-only release must not displace this Mac release.
            windows = dict(entry, tag_name='b3', assets=[{'name': 'BDONImmersiveHome-win-x64.zip',
                                                        'browser_download_url': base + '/windows.zip'}])
            payload[:] = [windows, entry]
            binary = current / 'Contents/MacOS/BDONImmersiveHome'
            environment = dict(os.environ, BDON_UPDATE_API=base, BDON_LOG='1')
            # Old clients still use the DMG; new clients require a signed feed.
            appcast_asset = entry['assets'].pop()
            run(binary, '--update-test', receipt, env=environment)
            require(json.loads(receipt.read_text())['status'] == 'failed', 'missing appcast was accepted')
            require(plistlib.loads((current / 'Contents/Info.plist').read_bytes())['CFBundleVersion'] == BUILD_OLD,
                    'missing appcast changed the app')
            print('PASS: real app requires a signed appcast', flush=True)
            receipt.unlink()
            entry['assets'].append(appcast_asset)
            signed_feed = (archive_dir / 'appcast.xml').read_bytes()
            bad_feed = signed_feed.replace(b'<title>', b'<title>tampered ', 1)
            require(bad_feed != signed_feed, 'feed tamper fixture failed')
            (archive_dir / 'bad-feed.xml').write_bytes(bad_feed)
            entry['assets'][-1]['browser_download_url'] = base + '/bad-feed.xml'
            run(binary, '--update-test', receipt, env=environment)
            require(json.loads(receipt.read_text())['status'] == 'failed', 'tampered feed was accepted')
            require(plistlib.loads((current / 'Contents/Info.plist').read_bytes())['CFBundleVersion'] == BUILD_OLD,
                    'tampered feed changed the app')
            print('PASS: real app rejects a tampered feed', flush=True)
            receipt.unlink()

            corrupt = archive_dir / 'corrupt.dmg'
            run('/bin/cp', '-c', archive, corrupt)
            with corrupt.open('ab') as stream:
                stream.write(b'corruption fixture')
            tree = ET.fromstring(signed_feed)
            tree.find('./channel/item/enclosure').set('url', base + '/corrupt.dmg')
            corrupt_feed = archive_dir / 'corrupt.xml'
            ET.ElementTree(tree).write(corrupt_feed, encoding='utf-8', xml_declaration=True)
            run(signer, '--ed-key-file', key, '--disable-signing-warning', corrupt_feed)
            entry['assets'][-1]['browser_download_url'] = base + '/corrupt.xml'
            run(binary, '--update-test', receipt, env=environment)
            require(json.loads(receipt.read_text())['status'] == 'failed', 'corrupt DMG was accepted')
            require(plistlib.loads((current / 'Contents/Info.plist').read_bytes())['CFBundleVersion'] == BUILD_OLD,
                    'corrupt DMG changed the app')
            print('PASS: real app rejects a corrupt DMG', flush=True)
            receipt.unlink()

            entry['assets'][-1]['browser_download_url'] = base + '/appcast.xml'
            print('Installing the signed DMG through the real updater…', flush=True)
            result = run(binary, '--update-test', receipt, env=environment)
            (OUTPUT / 'app-update.log').write_text(result.stdout + result.stderr)
            deadline = time.monotonic() + 20
            while not receipt.exists() and time.monotonic() < deadline:
                time.sleep(0.1)
            require(receipt.exists(), 'updated real app did not relaunch')
            report = json.loads(receipt.read_text())
            require(report == {'status': 'installed', 'version': BUILD_NEW}, f'update failed: {report}')
            run('/usr/bin/codesign', '--verify', '--deep', '--strict', current)
            require(plistlib.loads((current / 'Contents/Info.plist').read_bytes())['CFBundleVersion'] == BUILD_NEW,
                    'real app bundle was not replaced')
            offer = json.loads(receipt.with_suffix('.offer.json').read_text())
            require(offer['notes'] == notes, 'human-written notes changed')
            report.update(missingFeedRejected=True, tamperedFeedRejected=True, corruptDMGRejected=True, notesPreserved=True,
                          signatureVerified=True, requests=requests)
            (OUTPUT / 'app-update-results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
            print('PASS: real app replaced, relaunched, and retained valid nested signatures', flush=True)
        finally:
            server.shutdown()
            server.server_close()
            thread.join()
            for target in (current, updated):
                subprocess.run([LSREGISTER, '-u', str(target)], capture_output=True)
                extension = target / 'Contents/PlugIns/BDONWallpaper.appex'
                subprocess.run(['/usr/bin/pluginkit', '-r', str(extension)], capture_output=True)
            cache = Path.home() / 'Library/Caches' / original['CFBundleIdentifier'] / 'org.sparkle-project.Sparkle'
            if cache.is_dir():
                shutil.rmtree(cache)
            restore_defaults(original['CFBundleIdentifier'], defaults)


if __name__ == '__main__':
    main()
