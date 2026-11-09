#!/usr/bin/env python3
"""Test PaperSaver and Sparkle without changing the installed app or wallpaper."""
import copy
import functools
import hashlib
import http.server
import json
import plistlib
import shutil
import subprocess
import tempfile
import threading
import time
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path

PACKAGE = Path(__file__).resolve().parent
ROOT = PACKAGE.parents[1]
OUTPUT = ROOT / "work/macos-integration"
SPARKLE_NS = "http://www.andymatuschak.org/xml-namespaces/sparkle"
FEED_VALID = 1  # SPUAppcastSigningValidationStatusSucceeded
ARCHIVE_ERRORS = {3001, 3002}  # SUSignatureError, SUValidationError
RESUME_ERROR = 1004  # SUResumeAppcastError
RETRY_LIMIT = 3
RETRY_DELAY = 1
LOOPBACK = "127.0.0.1"
EPHEMERAL_PORT = 0
PROCESS_TIMEOUT = 45
RECEIPT_TIMEOUT = 15
RECEIPT_POLL = 0.1
LSREGISTER = "/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister"
CURRENT_VERSION = "1"
UPDATE_VERSION = "2"
APP_NAME = "BDON Integration.app"
FIXTURE_NOTES = "<p>통합 테스트 &amp; fixture</p>"


def run(*args):
    return subprocess.run([str(arg) for arg in args], check=True, capture_output=True,
                          text=True, timeout=PROCESS_TIMEOUT)


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def sign_feed(signer, key, path):
    run(signer, "--ed-key-file", key, "--disable-signing-warning", path)


def make_app(binary, framework, app, info):
    contents = app / "Contents"
    (contents / "MacOS").mkdir(parents=True)
    (contents / "Frameworks").mkdir()
    executable = contents / "MacOS/IntegrationProbe"
    shutil.copy2(binary, executable)
    run("/usr/bin/ditto", framework, contents / "Frameworks/Sparkle.framework")
    (contents / "Info.plist").write_bytes(plistlib.dumps(info))
    run("/usr/bin/install_name_tool", "-add_rpath", "@executable_path/../Frameworks", executable)
    run("/usr/bin/codesign", "--force", "--deep", "--sign", "-", app)
    requirement = f'=designated => identifier "{info["CFBundleIdentifier"]}"'
    run("/usr/bin/codesign", "--force", "--sign", "-", "--requirements", requirement, app)
    run("/usr/bin/codesign", "--verify", "--deep", "--strict", app)
    return executable


def check_feed(executable, base, name, status, version=None):
    result = run(executable, "sparkle", f"{base}/{name}.xml")
    report = json.loads(result.stdout)
    require(report["status"] == status, f"{name}: {report}")
    require(report.get("version") == version, f"{name}: wrong version: {report}")
    if status != "failed":
        require(report.get("feedValidation") == FEED_VALID, f"{name}: feed was not validated")
    print(f"PASS: Sparkle {name}")
    return report


def altered_feed(original, destination, edit, signer, key):
    tree = ET.parse(original)
    item = tree.find("./channel/item")
    require(item is not None, "generated appcast has no item")
    edit(tree, item)
    tree.write(destination, encoding="utf-8", xml_declaration=True)
    sign_feed(signer, key, destination)


def check_signatures(signer, key, archive, signature, directory):
    run(signer, "--verify", "--ed-key-file", key, archive, signature)
    tampered = directory / "tampered.zip"
    shutil.copy2(archive, tampered)
    with tampered.open("ab") as stream:
        stream.write(b"corruption fixture")
    result = subprocess.run([str(signer), "--verify", "--ed-key-file", str(key),
                             str(tampered), signature], capture_output=True, text=True,
                            timeout=PROCESS_TIMEOUT)
    require(result.returncode != 0, "Sparkle accepted a modified archive")
    print("PASS: Sparkle archive signature and corruption rejection")


def check_install(executable, base, archives, directory, signer, key):
    def corrupt_url(_tree, entry):
        entry.find("enclosure").set("url", f"{base}/Corrupt.zip")

    shutil.copy2(directory / "tampered.zip", archives / "Corrupt.zip")
    altered_feed(archives / "appcast.xml", archives / "corrupt-archive.xml", corrupt_url, signer, key)
    rejected = json.loads(run(executable, "install", f"{base}/corrupt-archive.xml").stdout)
    require(rejected["status"] == "failed" and ARCHIVE_ERRORS.intersection(rejected["errorCodes"]),
            f"corrupt archive was not rejected by the updater: {rejected}")
    corrupt_plist = executable.parents[1] / "Info.plist"
    require(plistlib.loads(corrupt_plist.read_bytes())["CFBundleVersion"] == CURRENT_VERSION,
            "corrupt archive changed the installed test app")
    print("PASS: Sparkle rejects a corrupt download before installation", flush=True)

    resume_errors = []
    for _attempt in range(RETRY_LIMIT):
        installed = run(executable, "install", f"{base}/appcast.xml")
        if not installed.stdout.strip():
            break
        failure = json.loads(installed.stdout)
        if failure.get("errorCode") != RESUME_ERROR:
            break
        resume_errors.append(failure)
        time.sleep(RETRY_DELAY)
    if resume_errors:
        print(f"OBSERVED: Sparkle resume error 1004; retried {len(resume_errors)} time(s)", flush=True)
    (OUTPUT / "install.log").write_text(installed.stdout + installed.stderr)
    require(not installed.stdout.strip(), f"installation stopped: {installed.stdout}")
    receipt = directory / "receipt.json"
    deadline = time.monotonic() + RECEIPT_TIMEOUT
    while not receipt.exists() and time.monotonic() < deadline:
        time.sleep(RECEIPT_POLL)
    require(receipt.exists(), f"updated trial app did not relaunch: {installed.stderr}")
    result = json.loads(receipt.read_text())
    require(result == {"status": "installed", "version": UPDATE_VERSION}, f"wrong receipt: {result}")
    plist = executable.parents[1] / "Info.plist"
    require(plistlib.loads(plist.read_bytes())["CFBundleVersion"] == UPDATE_VERSION,
            "test app bundle was not replaced")
    run("/usr/bin/codesign", "--verify", "--deep", "--strict", executable.parents[2])
    print("PASS: Sparkle replaces and relaunches the signed trial app", flush=True)
    return {"corruptDownload": rejected, "resumeErrors": resume_errors, "install": result}


def test_sparkle(binary, artifact, directory, bundle_id):
    archives = directory / "archives"
    archives.mkdir()
    run(binary, "key", directory)
    key = directory / "seed.txt"
    public_key = (directory / "public.txt").read_text()
    signer = artifact / "bin/sign_update"
    generator = artifact / "bin/generate_appcast"
    framework = next(artifact.glob("Sparkle.xcframework/macos-*/Sparkle.framework"))
    requested_paths = []

    class Handler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            requested_paths.append(self.path)
            super().do_GET()

        def log_message(self, *_args):
            pass

    handler = functools.partial(Handler, directory=str(archives))
    server = http.server.ThreadingHTTPServer((LOOPBACK, EPHEMERAL_PORT), handler)
    base = f"http://{LOOPBACK}:{server.server_port}"
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        info = {
            "CFBundleIdentifier": bundle_id,
            "CFBundleName": "BDON Integration",
            "CFBundleExecutable": "IntegrationProbe",
            "CFBundlePackageType": "APPL",
            "CFBundleVersion": CURRENT_VERSION,
            "CFBundleShortVersionString": CURRENT_VERSION,
            "LSMinimumSystemVersion": "14.0",
            "LSUIElement": True,
            "BDONIntegrationProbe": True,
            "BDONReceiptPath": str(directory / "receipt.json"),
            "BDONReceiptVersion": UPDATE_VERSION,
            "SUFeedURL": f"{base}/appcast.xml",
            "SUPublicEDKey": public_key,
            "SUEnableAutomaticChecks": False,
            "SUAutomaticallyUpdate": True,
            "SUAllowsAutomaticUpdates": True,
            "SUEnableSystemProfiling": False,
            "SUVerifyUpdateBeforeExtraction": True,
            "SURequireSignedFeed": True,
            "SUSignedFeedFailureExpirationInterval": 0,
            "NSAppTransportSecurity": {"NSAllowsLocalNetworking": True},
        }
        executable = make_app(binary, framework, directory / "current" / APP_NAME, info)
        updated = dict(info, CFBundleVersion=UPDATE_VERSION, CFBundleShortVersionString=UPDATE_VERSION)
        app = directory / "updated" / APP_NAME
        make_app(binary, framework, app, updated)
        archive = archives / "Probe-2.zip"
        run("/usr/bin/ditto", "-c", "-k", "--sequesterRsrc", "--keepParent", app, archive)
        (archives / "Probe-2.html").write_text(FIXTURE_NOTES)

        # Explicit test keys keep both signing tools out of the user's Keychain.
        generated = run(generator, "--ed-key-file", key, "--maximum-deltas", "0",
                        "--download-url-prefix", base + "/", "--embed-release-notes", archives)
        (OUTPUT / "appcast-generation.log").write_text(generated.stdout + generated.stderr)
        original = archives / "appcast.xml"
        item = ET.parse(original).find("./channel/item")
        require(item is not None, "generate_appcast did not create an update")
        enclosure = item.find("enclosure")
        require(enclosure is not None, "generated update has no archive")
        signature = enclosure.attrib[f"{{{SPARKLE_NS}}}edSignature"]
        check_signatures(signer, key, archive, signature, directory)

        reports = {}
        reports["signed"] = check_feed(executable, base, "appcast", "available", UPDATE_VERSION)
        require(reports["signed"].get("notes") == FIXTURE_NOTES, "fixture notes changed")

        # A changed signed feed and an unsigned feed must never offer an update.
        tampered = original.read_bytes().replace(b"<title>", b"<title>tampered ", 1)
        require(tampered != original.read_bytes(), "tamper fixture did not change")
        (archives / "tampered.xml").write_bytes(tampered)
        ET.parse(original).write(archives / "unsigned.xml", encoding="utf-8", xml_declaration=True)
        reports["tampered"] = check_feed(executable, base, "tampered", "failed")
        reports["unsigned"] = check_feed(executable, base, "unsigned", "failed")

        def same_version(_tree, entry):
            entry.find(f"{{{SPARKLE_NS}}}version").text = CURRENT_VERSION

        def unsupported(_tree, entry):
            entry.find(f"{{{SPARKLE_NS}}}minimumSystemVersion").text = "99.0.0"

        def add_beta(tree, entry):
            beta = copy.deepcopy(entry)
            beta.find(f"{{{SPARKLE_NS}}}version").text = "99"
            ET.SubElement(beta, f"{{{SPARKLE_NS}}}channel").text = "beta"
            tree.find("channel").insert(0, beta)

        for name, edit, status, version in [
            ("same-version", same_version, "noUpdate", None),
            ("unsupported-os", unsupported, "noUpdate", None),
            ("beta-filter", add_beta, "available", UPDATE_VERSION),
        ]:
            altered_feed(original, archives / f"{name}.xml", edit, signer, key)
            reports[name] = check_feed(executable, base, name, status, version)

        require(not any(path.endswith(".zip") for path in requested_paths),
                "information check unexpectedly downloaded an archive")
        reports["informationRequests"] = list(requested_paths)
        reports.update(check_install(executable, base, archives, directory, signer, key))
        reports["archiveSignature"] = "valid archive accepted; modified archive rejected"
        reports["requests"] = requested_paths
        return reports
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
        for app in (directory / "current" / APP_NAME, directory / "updated" / APP_NAME):
            if app.exists():
                subprocess.run([LSREGISTER, "-u", str(app)], capture_output=True)
        subprocess.run(["/usr/bin/defaults", "delete", bundle_id], capture_output=True)
        cache = Path.home() / "Library/Caches" / bundle_id
        if cache.is_dir():
            shutil.rmtree(cache)
        archive = archives / "Probe-2.zip"
        if archive.exists():
            digest = hashlib.sha256(archive.read_bytes()).hexdigest()
            cache = Path.home() / "Library/Caches/Sparkle_generate_appcast" / digest
            if cache.is_dir():
                shutil.rmtree(cache)


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "results.json").unlink(missing_ok=True)
    print("Building and testing pinned dependencies…", flush=True)
    build = subprocess.run(["xcrun", "swift", "build", "--disable-sandbox", "--package-path", str(PACKAGE)],
                           capture_output=True, text=True, timeout=300)
    (OUTPUT / "swift-tests.log").write_text(build.stdout + build.stderr)
    require(build.returncode == 0, f"Swift tests failed; see {OUTPUT / 'swift-tests.log'}")
    binary_dir = Path(run("xcrun", "swift", "build", "--package-path", PACKAGE,
                          "--show-bin-path").stdout.strip())
    tested = run(binary_dir / "PaperSaverTests")
    (OUTPUT / "paper-tests.log").write_text(tested.stdout + tested.stderr)
    print(tested.stdout, end="")
    binary = binary_dir / "IntegrationProbe"
    artifact = PACKAGE / ".build/artifacts/sparkle/Sparkle"
    app_id = (ROOT / "macos/app-id.txt").read_text().strip()
    wallpaper = json.loads(run(binary, "wallpaper", app_id).stdout)
    require(wallpaper["roundTripMatches"], "current Mac store failed a typed round trip")
    print(f"PASS: PaperSaver reads {wallpaper['sectionCount']} live store sections")

    bundle_id = f"{app_id}.trial.{uuid.uuid4().hex}.integration"
    with tempfile.TemporaryDirectory(prefix="trial-", dir=OUTPUT) as name:
        sparkle = test_sparkle(binary, artifact, Path(name), bundle_id)
    report = {"os": run("sw_vers", "-productVersion").stdout.strip(),
              "paperSaver": wallpaper, "sparkle": sparkle}
    (OUTPUT / "results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"Results: {OUTPUT / 'results.json'}")


if __name__ == "__main__":
    main()
