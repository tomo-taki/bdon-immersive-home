#!/usr/bin/env python3
"""Embed the wallpaper extension using the app's existing renderer objects."""
import platform
import plistlib
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "macos/WallpaperExtension"
EXECUTABLE = "BDONWallpaper"


def run(*args):
    subprocess.run([str(arg) for arg in args], check=True)


def main():
    app = Path(sys.argv[1]).resolve()
    info = plistlib.loads((app / "Contents/Info.plist").read_bytes())
    binary_dir = Path(subprocess.check_output(
        ["xcrun", "swift", "build", "-c", "release", "--show-bin-path"], cwd=ROOT, text=True).strip())
    work = ROOT / "work/wallpaper-extension"
    work.mkdir(parents=True, exist_ok=True)
    module = work / "module.modulemap"
    headers = ROOT / "shared/spine-bridge/include"
    module.write_text(f'module SpineBridge {{ umbrella "{headers}" export * }}\n')
    bridge = work / "Bridge.o"
    sdk = subprocess.check_output(["xcrun", "--show-sdk-path"], text=True).strip()
    arch = platform.machine()
    target = f"{arch}-apple-macos26.0"
    run("xcrun", "clang", "-target", target, "-isysroot", sdk, "-fobjc-arc", "-c",
        SOURCE / "Bridge.m", "-o", bridge)
    bundle = app / "Contents/PlugIns/BDONWallpaper.appex/Contents"
    (bundle / "MacOS").mkdir(parents=True, exist_ok=True)
    metadata = {
        "CFBundleIdentifier": info["CFBundleIdentifier"] + ".wallpaper",
        "CFBundleExecutable": EXECUTABLE, "CFBundleName": "BDON Immersive Home",
        "CFBundleDisplayName": "BDON Immersive Home", "CFBundlePackageType": "XPC!",
        "CFBundleVersion": info["CFBundleVersion"],
        "CFBundleShortVersionString": info["CFBundleShortVersionString"],
        "CFBundleInfoDictionaryVersion": "6.0",
        "LSMinimumSystemVersion": "26.0",
        "EXAppExtensionAttributes": {"EXExtensionPointIdentifier": "com.apple.wallpaper"},
    }
    plist = bundle / "Info.plist"
    plist.write_bytes(plistlib.dumps(metadata))
    resources = bundle / "Resources"
    resources.mkdir(exist_ok=True)
    shutil.copyfile(SOURCE / "Aerial-LICENSE.txt", resources / "Aerial-LICENSE.txt")
    # The sandbox may read its own assets; the containing app reads the same copy.
    data = app / "Contents/Resources/data"
    if data.is_dir():
        destination = resources / "data"
        if destination.exists():
            shutil.rmtree(destination)
        shutil.move(str(data), destination)
    objects = []
    for name in ("SpineBridge", "SpineC"):
        combined = binary_dir / f"{name}.o"
        objects.extend([combined] if combined.exists() else (binary_dir / f"{name}.build").glob("*.o"))
    sources = sorted((ROOT / "macos/Sources/Render").glob("*.swift"))
    sources += [ROOT / "macos/Sources" / name for name in
                ("SpotMetalView.swift", "SpotCatalog.swift", "CursorSupport.swift", "EventLog.swift", "NativeScene.swift", "NativeSceneChannel.swift")]
    sources += sorted(SOURCE.glob("*.swift"))
    command = ["xcrun", "swiftc", "-O", "-application-extension", "-parse-as-library", "-swift-version", "5", "-target", target,
               "-sdk", sdk, "-import-objc-header", SOURCE / "Bridge.h", "-Xcc", f"-fmodule-map-file={module}",
               "-module-name", EXECUTABLE, *sources, *objects, bridge, "-o", bundle / "MacOS" / EXECUTABLE]
    command += ["-Xlinker", "-sectcreate", "-Xlinker", "__TEXT", "-Xlinker", "__info_plist", "-Xlinker", plist]
    command += ["-Xlinker", "-e", "-Xlinker", "_NSExtensionMain", "-Xlinker", "-u", "-Xlinker", "_main"]
    for framework in ("Metal", "MetalKit", "MetalFX", "ExtensionFoundation", "IOSurface", "QuartzCore"):
        command += ["-framework", framework]
    run(*command)
    run("/usr/bin/codesign", "--force", "--sign", "-", "--entitlements", SOURCE / "Entitlements.plist",
        bundle.parent)


if __name__ == "__main__":
    main()
