#!/usr/bin/env python3
"""Validate Mac identities before publishing; never launch or install an app."""
import argparse
import plistlib
import subprocess
import tempfile
from pathlib import Path

RELEASE_ID = Path(__file__).with_name("app-id.txt").read_text().strip()
DEV_SUFFIX = ".dev"


def check_bundle(app, expected):
    with (app / "Contents/Info.plist").open("rb") as stream:
        info = plistlib.load(stream)
    actual = info.get("CFBundleIdentifier")
    if actual != expected:
        raise ValueError(f"bundle id {actual!r}, expected {expected!r}")
    return info


def check_signing(app, expected):
    subprocess.run(["/usr/bin/codesign", "--verify", "--deep", "--strict", str(app)],
                   check=True, capture_output=True)
    result = subprocess.run(["/usr/bin/codesign", "-d", "-r-", str(app)],
                            check=True, capture_output=True, text=True)
    lines = (result.stdout + result.stderr).splitlines()
    requirement = next((line for line in lines if "designated =>" in line), "")
    if f'identifier "{expected}"' not in requirement or "cdhash" in requirement:
        raise ValueError("bundle id signing requirement must stay stable across updates")


def check_dmg(dmg, dev):
    with tempfile.TemporaryDirectory(prefix="bdon-package-") as directory:
        volume = Path(directory) / "volume"
        subprocess.run(["/usr/bin/hdiutil", "attach", str(dmg), "-nobrowse", "-readonly",
                        "-noautoopen", "-mountpoint", str(volume)], check=True, capture_output=True)
        try:
            apps = list(volume.glob("*.app"))
            if len(apps) != 1:
                raise ValueError("DMG must contain exactly one app")
            release = check_bundle(apps[0], RELEASE_ID)
            for key in ("BDONCommit", "CFBundleVersion"):
                if release.get(key) != dev.get(key):
                    raise ValueError(f"DMG {key} differs from the built app")
            check_signing(apps[0], RELEASE_ID)
        finally:
            subprocess.run(["/usr/bin/hdiutil", "detach", str(volume), "-force"],
                           check=True, capture_output=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--app", type=Path, required=True)
    parser.add_argument("--dmg", type=Path)
    args = parser.parse_args()
    try:
        dev = check_bundle(args.app, RELEASE_ID + DEV_SUFFIX)
        check_signing(args.app, RELEASE_ID + DEV_SUFFIX)
        if args.dmg:
            check_dmg(args.dmg, dev)
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Mac package rejected: {error}\n")
    print("Mac package identity verified")


if __name__ == "__main__":
    main()
