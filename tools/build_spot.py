#!/usr/bin/env python3
"""Package Home Spot situations for the wallpaper's web renderer.

Input: folders written by fetch_spot.py (one per Home Talk advId) holding
host.json and spot/{room.glb, room.json, spot.json, spine/*}.
Output (<out_dir>):
  index.json                      [{id, name, band, room, dir, characters}]
  <room>/room.glb                 shared by every situation of that room
  <room>/<spotId>/spot.json       trimmed scene description (see below)
  <room>/<spotId>/<spine files>

spot.json (Unity world space, left-handed, column-major matrices):
  situation  SpotSituationSettings (camera offsets, fov, drag limits, background TRS)
  camera     near / far / fieldOfView
  roomRoot   baked root transform of the background prefab
  roomNodes  per glb node: active after the situation's Prepare
  characters [{name, skeleton, atlas, scale, world, animation, loop, order}]

Usage: build_spot.py <out_dir> <spot_ids.txt> <fetched_root>
spot_ids.txt lines: "<spotId> <advId>".
"""
from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

# Room prefix home_00N_* -> band.
BANDS = {1: "MyGO!!!!!", 2: "Ave Mujica", 3: "夢限大みゅーたいぷ", 4: "millsage", 5: "一家Dumb Rock!"}


def resolve_skeleton(char: dict, skeletons: dict):
    """spineCharacters[].skeletonData, or the skeleton named after the object when it is null."""
    if char.get("skeletonData") in skeletons:
        return skeletons[char["skeletonData"]]
    suffix = "_" + char["path"].split("/")[-1].lower() + "_SkeletonData"
    return next((s for name, s in skeletons.items() if name.lower().endswith(suffix.lower())), None)


def build(spot_id: str, src: Path, out: Path, stories: dict) -> dict | None:
    spot_dir = src / "spot" if (src / "spot").exists() else src
    spot = json.loads((spot_dir / "spot.json").read_text())
    home = json.loads((src / "host.json").read_text())["home"]
    room = json.loads((spot_dir / "room.json").read_text())["backgroundKey"].split("/")[1]

    target = out / room / spot_id
    target.mkdir(parents=True, exist_ok=True)
    skeletons = {s["name"]: s for s in spot["skeletons"]}
    order = {c["path"]: c["sortingOrder"] for c in home["spineCharacters"]}

    by_name = {c["path"].split("/")[-1]: c for c in spot["spineCharacters"]}
    characters, skipped = [], []
    for char in spot["spineCharacters"]:
        skel = resolve_skeleton(char, skeletons)
        files = [skel["skeleton"], *skel["atlases"]] if skel else []
        world = char.get("world")
        # The export sometimes drops a split-off part ("Hotaru_back": legs, hip)
        # with no world, skeletonData or sortingOrder, although the Spot lists its
        # skeleton. Parts share their owner's skeleton space (Hotaru/Hotaru_back
        # carry identical worlds wherever both are exported), so borrow it and
        # draw just behind the owner.
        base = re.sub(r"_back(_\d+)?$", "", char["path"].split("/")[-1])
        owner = by_name.get(base) if base != char["path"].split("/")[-1] else None
        if not world and skel and owner and owner.get("world"):
            world = owner["world"]
            order[char["path"]] = order.get(owner["path"], 0) - 1
            print(f"  {char['path'].split('/')[-1]}: world missing in export, using {base}'s")
        # No world matrix: the object is inactive in this situation and never drawn.
        if not world or not skel or not all((spot_dir / "spine" / f).exists() for f in files):
            skipped.append(char["path"].split("/")[-1])
            continue
        for file in files:
            shutil.copy(spot_dir / "spine" / file, target / file)
        # Empty _animationName = SkeletonAnimation shows the setup pose (Unity behaviour).
        anim = char.get("animation") or {"_animationName": "home_start", "loop": 0}
        characters.append({
            "name": char["path"].split("/")[-1],
            "skeleton": skel["skeleton"],
            "atlas": skel["atlases"][0],
            "scale": skel["scale"],
            "world": world,
            "animation": anim["_animationName"] or None,
            # home_start is a one-shot entrance. The only looped one
            # (50007 Chieri_shadow) fades in from alpha 0, so looping it
            # blinked the shadow every 1.78 s over the pillar.
            "loop": bool(anim["loop"]) and anim["_animationName"] != "home_start",
            "order": order.get(char["path"], 0),
        })

    # Atlas pages (PNG) named inside each atlas.
    for atlas in {c["atlas"] for c in characters}:
        for line in (target / atlas).read_text().splitlines():
            if line.strip().endswith(".png"):
                shutil.copy(spot_dir / "spine" / line.strip(), target / line.strip())

    cam = home["sceneRoot"]["sceneCamera"]["camera"]
    scene = {
        "name": home["situation"]["name"],
        "situation": spot["situationSettings"],
        "camera": {"near": cam["near clip plane"], "far": cam["far clip plane"], "fieldOfView": cam["field of view"]},
        "roomRoot": home["roomRoot"],
        "roomNodes": [node["active"] for node in home["roomNodes"]],
        "characters": characters,
    }
    (target / "spot.json").write_text(json.dumps(scene))

    if not (out / room / "room.glb").exists():
        shutil.copy(spot_dir / "room.glb", out / room / "room.glb")

    names = stories.get(spot_id, {})
    band = BANDS.get(int(room.split("_")[1]), "")
    note = f" (skipped: {', '.join(skipped)})" if skipped else ""
    print(f"{spot_id} {room}: {len(characters)} characters{note}")
    return {
        "id": spot_id,
        "name": names.get("ko") or names.get("ja") or scene["name"],
        "names": names,
        "band": band,
        "room": room,
        "dir": f"{room}/{spot_id}",
        "characters": [c["name"] for c in characters],
    }


def spot_names(stories_path: Path) -> dict:
    names = {}
    for story in json.loads(stories_path.read_text())["stories"]:
        for group in story.get("groups", []):
            spot = group.get("spot")
            if spot:
                names.setdefault(str(spot["id"]), spot["names"])
    return names


def main() -> None:
    out, ids_file, root = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    stories = spot_names(root / "stories.json")

    index = []
    for line in ids_file.read_text().split("\n"):
        if not line.strip():
            continue
        spot_id, adv_id = line.split()
        entry = build(spot_id, root / adv_id, out, stories)
        if entry:
            index.append(entry)
    (out / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1))
    print(f"{len(index)} situations")


if __name__ == "__main__":
    main()
