#!/usr/bin/env python3
"""List every Home Spot and one Home Talk that carries it.

Reads the moenotes story index (storage.bdon.moe/moenotes/stories.json) and
writes "<spotId> <advId>" lines; each Talk's export contains that Spot's
room, settings and resident skeletons (see fetch_spot.py).

Usage: list_spots.py <out_dir>   -> <out_dir>/stories.json, <out_dir>/spot_ids.txt
"""
import json
import sys
from pathlib import Path

from fetch_spot import BASE, get


def main() -> None:
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    raw = get(BASE + "stories.json")
    (out / "stories.json").write_bytes(raw)

    first_talk = {}
    for story in json.loads(raw)["stories"]:
        for group in story.get("groups", []):
            spot = group.get("spot")
            if spot:
                first_talk.setdefault(spot["id"], story["advId"])

    lines = [f"{spot} {adv}" for spot, adv in sorted(first_talk.items())]
    (out / "spot_ids.txt").write_text("\n".join(lines) + "\n")
    print(f"{len(lines)} Home Spots")


if __name__ == "__main__":
    main()
