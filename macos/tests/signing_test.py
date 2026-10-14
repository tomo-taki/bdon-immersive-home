#!/usr/bin/env python3
"""Two versions must retain the same code identity for login items."""
import plistlib
import subprocess
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
APP_ID = "com.togawa.bdon-immersive-home"


def requirement(app):
    result = subprocess.run(["codesign", "-d", "-r-", str(app)], capture_output=True, text=True, check=True)
    return next(line for line in (result.stdout + result.stderr).splitlines() if "designated =>" in line)


def main():
    with tempfile.TemporaryDirectory(prefix="bdon-signing-test-") as directory:
        root = Path(directory)
        identities = []
        for version in (1, 2):
            app = root / f"v{version}.app"
            binary = app / "Contents/MacOS/Test"
            binary.parent.mkdir(parents=True)
            (app / "Contents/Info.plist").write_bytes(plistlib.dumps({
                "CFBundleIdentifier": APP_ID, "CFBundleExecutable": "Test",
                "CFBundlePackageType": "APPL", "CFBundleVersion": str(version),
            }))
            subprocess.run(["clang", "-x", "c", "-o", str(binary), "-"],
                           input=f"int main(void) {{ return {version}; }}", text=True, check=True)
            signer = REPO / "macos/sign_app.py"
            command = ["python3", str(signer), str(app)] if signer.exists() else [
                "codesign", "--force", "--deep", "--sign", "-", str(app)]
            subprocess.run(command, check=True, capture_output=True)
            subprocess.run(["codesign", "--verify", "--deep", "--strict", str(app)], check=True)
            identities.append(requirement(app))
        assert identities[0] == identities[1], "code identity changes on every update"
        assert APP_ID in identities[0] and "cdhash" not in identities[0]
        print("PASS: code identity stays stable across different binaries")


if __name__ == "__main__":
    main()
