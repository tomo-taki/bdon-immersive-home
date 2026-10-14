#!/usr/bin/env python3
"""Verify the release gate blocks incompatible Mac packages before staging."""
import os
import plistlib
import subprocess
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def check_gate():
    with tempfile.TemporaryDirectory(prefix="bdon-release-test-") as directory:
        root = Path(directory)
        (root / "tools").mkdir()
        (root / "macos").mkdir()
        (root / "dist").mkdir()
        source = (REPO / "tools/release.sh").read_text()
        (root / "tools/release.sh").write_text(source)
        for name in ("check_release.py", "app-id.txt"):
            source = REPO / "macos" / name
            if source.exists():
                (root / "macos" / name).write_bytes(source.read_bytes())
        # Tiny packages exercise publication checks without touching an install.
        app = root / "dist/BDON Immersive Home.app/Contents"
        app.mkdir(parents=True)
        (root / "dist/release-notes.md").write_text("fixture")
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "."], check=True)
        subprocess.run(["git", "-C", str(root), "-c", "user.name=Test", "-c",
                        "user.email=test@example.invalid", "commit", "-qm", "Fixture"], check=True)
        commit = subprocess.check_output(["git", "-C", str(root), "rev-parse", "--short", "HEAD"], text=True).strip()
        (app / "Info.plist").write_bytes(plistlib.dumps({
            "CFBundleIdentifier": "wrong.app.dev", "BDONCommit": commit,
            "CFBundleVersion": "1", "CFBundleShortVersionString": "2000.01.01",
        }))
        os.utime(app / "Info.plist", (1, 1))
        (root / "dist/BDONImmersiveHome.dmg").write_bytes(b"fixture")
        result = subprocess.run(["bash", str(root / "tools/release.sh"),
                                 "--platforms", "mac", "--dry-run"], capture_output=True, text=True)
        assert result.returncode != 0, "release gate accepted an incompatible bundle id"
        assert "bundle id" in (result.stdout + result.stderr).lower(), result.stdout + result.stderr
        print("PASS: incompatible package rejected before publication")


if __name__ == "__main__":
    check_gate()
