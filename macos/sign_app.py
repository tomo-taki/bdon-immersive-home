#!/usr/bin/env python3
"""Use a stable designated requirement for ad-hoc-signed app updates."""
import plistlib
import subprocess
import sys
from pathlib import Path

RELEASE_ID = Path(__file__).with_name("app-id.txt").read_text().strip()
DEV_SUFFIX = ".dev"


def main():
    app = Path(sys.argv[1])
    info = plistlib.loads((app / "Contents/Info.plist").read_bytes())
    identifier = info.get("CFBundleIdentifier")
    if identifier not in (RELEASE_ID, RELEASE_ID + DEV_SUFFIX):
        raise SystemExit(f"unexpected bundle id: {identifier}")
    # Sign children first; a parent requirement must never replace theirs.
    for framework in (app / "Contents/Frameworks").glob("*.framework"):
        subprocess.run(["/usr/bin/codesign", "--force", "--deep", "--sign", "-", str(framework)], check=True)
    for extension in (app / "Contents/PlugIns").glob("*.appex"):
        plist = extension / "Contents/Info.plist"
        metadata = plistlib.loads(plist.read_bytes())
        command = ["/usr/bin/codesign", "--force", "--sign", "-", "--preserve-metadata=entitlements"]
        if extension.name == "BDONWallpaper.appex":
            metadata["CFBundleIdentifier"] = identifier + ".wallpaper"
            plist.write_bytes(plistlib.dumps(metadata))
            command = ["/usr/bin/codesign", "--force", "--sign", "-", "--entitlements",
                       str(Path(__file__).with_name("WallpaperExtension") / "Entitlements.plist")]
        child_id = metadata["CFBundleIdentifier"]
        command += ["--requirements", f'=designated => identifier "{child_id}"', str(extension)]
        subprocess.run(command, check=True)
    # Ad-hoc's default cdhash changes each build; identify versions by bundle id.
    requirement = f'=designated => identifier "{identifier}"'
    subprocess.run(["/usr/bin/codesign", "--force", "--sign", "-",
                    "--requirements", requirement, str(app)], check=True)
    subprocess.run(["/usr/bin/codesign", "--verify", "--deep", "--strict", str(app)], check=True)


if __name__ == "__main__":
    main()
