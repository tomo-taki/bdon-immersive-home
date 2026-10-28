#!/usr/bin/env python3
"""Take Home Spot situations out of the app's Spot data.

For each situation (or Spot id, when one situation of data/source/spot_ids.txt has it) this removes its line of
spot_ids.txt, its export (data/source/<situation>/), its built files (data/spots/<room>/<Spot id>/, and the room's
room.glb when no other Spot is in that room) and its thumbnails (data/thumbs/<Spot id>.jpg and <Spot id>_bg.jpg), then
rebuilds data/spots/index.json from the list (build_spot.py). A preview (export_spot.py --id) goes before a release,
and before the master data's own Spot of the same id is exported.

Usage: python3 tools/spots/remove_spot.py <situation | Spot id>...
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

from build_spot import build_all

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "data/source"
SPOT_IDS = SOURCE / "spot_ids.txt"
SPOTS = ROOT / "data/spots"
THUMBS = ROOT / "data/thumbs"


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__.strip().splitlines()[-1])
    listed = {d: i for i, d in (line.split() for line in SPOT_IDS.read_text().splitlines() if line.strip())}
    index = json.loads((SPOTS / "index.json").read_text()) if (SPOTS / "index.json").exists() else []
    built = {json.loads((SPOTS / e["dir"] / "spot.json").read_text())["name"]: e for e in index}

    targets = []
    for arg in sys.argv[1:]:
        hits = [arg] if arg in listed else [d for d, i in listed.items() if i == arg]
        if len(hits) != 1:
            raise SystemExit(f"{arg}: {'no' if not hits else 'more than one'} situation of {SPOT_IDS} has it")
        targets.append(hits[0])

    kept = {s: e for s, e in built.items() if s not in targets}
    for situation in targets:
        spot_id = listed.pop(situation)
        shutil.rmtree(SOURCE / situation, ignore_errors=True)
        entry = built.get(situation)
        if entry:
            shutil.rmtree(SPOTS / entry["dir"], ignore_errors=True)
            if not any(e["room"] == entry["room"] for e in kept.values()):
                shutil.rmtree(SPOTS / entry["room"], ignore_errors=True)
        if not any(e["id"] == spot_id for e in kept.values()):
            for name in (f"{spot_id}.jpg", f"{spot_id}_bg.jpg"):
                (THUMBS / name).unlink(missing_ok=True)
        print(f"removed {spot_id} {situation}")
    SPOT_IDS.write_text("".join(f"{i} {d}\n" for d, i in sorted(listed.items(), key=lambda e: (int(e[1]), e[0]))))
    build_all(SPOTS, SPOT_IDS, SOURCE)


if __name__ == "__main__":
    main()
