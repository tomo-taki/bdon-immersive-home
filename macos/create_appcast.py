#!/usr/bin/env python3
"""Sign a per-release Mac appcast; GitHub discovery supplies its asset URL."""
import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path

from sparkle_config import ROOT, SEED


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dmg", type=Path, required=True)
    parser.add_argument("--notes", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--url-prefix", required=True)
    args = parser.parse_args()
    if not SEED.is_file() or not args.notes.read_text().strip():
        parser.error("Signing key and human-written release notes are required")
    tool = ROOT / ".build/artifacts/sparkle/Sparkle/bin/generate_appcast"
    with tempfile.TemporaryDirectory(prefix="bdon-appcast-") as name:
        stage = Path(name)
        (stage / args.dmg.name).symlink_to(args.dmg.resolve())
        shutil.copyfile(args.notes, stage / (args.dmg.stem + ".md"))
        subprocess.run([str(tool), "--ed-key-file", str(SEED), "--maximum-deltas", "0",
                        "--embed-release-notes", "--download-url-prefix", args.url_prefix,
                        "-o", str(stage / "appcast.xml"), str(stage)], check=True)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(stage / "appcast.xml", args.output)


if __name__ == "__main__":
    main()
