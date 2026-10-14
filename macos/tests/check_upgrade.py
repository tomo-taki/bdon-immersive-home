#!/usr/bin/env python3
"""Exercise real download validation in isolated app bundles; never install."""
import argparse
import functools
import hashlib
import http.server
import os
import plistlib
import subprocess
import tempfile
import threading
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
RELEASE_ID = "com.togawa.bdon-immersive-home"
LEGACY_ID = "moe.local.bdon-immersive-home"
LEGACY_REV = "d45c502"
PACKAGE = "BDONImmersiveHome.dmg"
CHECKSUMS = "SHA256SUMS.txt"
RUNNER = '''
extension Updater {
    fileprivate func testPackage(_ release: Release) async throws -> URL {
        try await download(release)
    }
}
@main
private enum UpgradeTest {
    private static let testBuild = 990032
    @MainActor static func main() async {
        let base = CommandLine.arguments[1]
        let expected = CommandLine.arguments[2]
        let work = FileManager.default.temporaryDirectory.appendingPathComponent("BDONUpdate-\\(testBuild)")
        defer { try? FileManager.default.removeItem(at: work) }
        let release = Updater.Release(build: testBuild, title: "fixture", notes: "",
            package: URL(string: base + "/BDONImmersiveHome.dmg")!,
            checksums: URL(string: base + "/SHA256SUMS.txt")!,
            page: URL(string: "https://github.com/tomo-taki/bdon-immersive-home")!)
        do {
            let app = try await Updater.shared.testPackage(release)
            precondition(expected == "accept", "legacy consumer unexpectedly accepted renamed id")
            precondition(Bundle(url: app)?.bundleIdentifier == Bundle.main.bundleIdentifier)
            print("PASS: current consumer downloads, verifies, extracts and accepts the package")
        } catch {
            precondition(expected == "reject" && (error as? URLError)?.code == .cannotOpenFile,
                         "unexpected package validation failure: \\(error)")
            print("PASS: b27 consumer requires the documented manual replacement")
        }
    }
}
'''


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("dmg", type=Path)
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="bdon-upgrade-test-") as directory:
        root = Path(directory)
        (root / PACKAGE).symlink_to(args.dmg.resolve())
        with args.dmg.open("rb") as stream:
            digest = hashlib.sha256()
            for chunk in iter(lambda: stream.read(4 << 20), b""):
                digest.update(chunk)
        (root / CHECKSUMS).write_text(f"{digest.hexdigest()}  {PACKAGE}\n")
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=root))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            for consumer, identity, expected in [("current", RELEASE_ID, "accept"), ("b27", LEGACY_ID, "reject")]:
                work = root / consumer
                work.mkdir()
                source = REPO / "macos/Sources"
                updater = (source / "Updater.swift").read_text() if consumer == "current" else subprocess.check_output(
                    ["git", "-C", str(REPO), "show", f"{LEGACY_REV}:Sources/BDONImmersiveHome/Updater.swift"], text=True)
                swift = work / "consumer.swift"
                swift.write_text(updater + RUNNER)
                app = work / "Consumer.app/Contents"
                (app / "MacOS").mkdir(parents=True)
                binary = app / "MacOS/Consumer"
                (app / "Info.plist").write_bytes(plistlib.dumps({
                    "CFBundleIdentifier": identity, "CFBundleVersion": "31" if consumer == "current" else "27",
                    "CFBundleExecutable": "Consumer", "CFBundlePackageType": "APPL",
                }))
                dependencies = [source / name for name in ["ReleaseFeed.swift", "AppIdentity.swift", "EventLog.swift", "UpdateFailure.swift"]]
                subprocess.run(["swiftc", "-parse-as-library", str(swift), *map(str, dependencies),
                                "-o", str(binary)], check=True)
                temporary = work / "temporary"
                temporary.mkdir()
                env = dict(os.environ, TMPDIR=str(temporary) + "/")
                subprocess.run([str(binary), f"http://127.0.0.1:{server.server_port}", expected],
                               env=env, check=True)
        finally:
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    main()
