#!/usr/bin/env python3
"""Export Home Spot situations of the local catalog in the layout fetch_spot.py writes.

local_spots.py lists the situations of the local moenotes-assets service (the local MoeNotes Viewer's catalog) that
the app lacks. For each one given this writes data/source/<situation>/ as fetch_spot.py writes a Home Talk's host/
folder, so build_spot.py packages it unchanged:
  host.json       the part of the story host's `home` (ournotes.story-host/1) that build_spot.py reads
  spot/room.glb   the background, with room.json
  spot/spot.json  the situation, with spot/spine/*
and lists it in data/source/local_spot_ids.txt as "<spotId> <situation>".

The files are made by nnnotes 0.1.4 (StarMoe-org/nnnotes), the exporter of the moenotes story site, from the
service's own catalog file (checked against its snapshot's SHA-256). Bundles come from the CDN in the service's
config.toml, decrypted with the key in its source (moenotes-assets/CSharp/Crypto.cs), and are cached in data/cache.
`nnnotes spot` reads a MonoBehaviour's class from its MonoScript, which ships only in the game's APK
(shared_monoscripts.bundle); here a class is told by the fields only it serializes (CLASSES), so no APK is needed.

The Spot id, MasterHomeSpot row, names and tap talks come from the region's master data, as in local_spots.py.
A situation without a MasterHomeSpot row needs --id: a preview with no names, not for a release.

Needs Python 3.11+ with nnnotes 0.1.4 (data/ is not committed):
  python3.12 -m venv data/venv && data/venv/bin/pip install nnnotes==0.1.4
Usage: data/venv/bin/python tools/spots/export_spot.py [--moenotes DIR] [--id N] <situation | Spot id>...
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import tomllib
from pathlib import Path

import UnityPy
from nnnotes import room, spot, storyhost
from nnnotes.addressables import BundleKey
from nnnotes.catalog import Catalog
from nnnotes.jsonio import write_json
from nnnotes.unity import SceneGraph, deref, strip_pptrs

from local_spots import LOCAL_IDS, ROOT, SERVICE, SITUATION_KEY, master_table, snapshot

CONFIG_MOUNT = "/etc/moenotes-assets/config.toml"  # compose.yaml of the local MoeNotes folder
# Script classes by fields that only they serialize (a class matches when it has all of them).
CLASSES = {
    "SpotSituationSettings": {"backgroundPosition", "originalOffset", "orbitRatio", "fieldOfView"},
    "SpotCharacterController": {"_spotSpineCharacters", "_characters"},
    "SpotSpineCharacter": {"_animation"},
    "SpotCharacter": {"_characterId", "_focus"},
    "SkeletonDataAsset": {"skeletonJSON", "atlasAssets"},
    "SpotBackground": {"_situationObjects"},
}
# The Spot scene's camera (EmbScene/Spot, SceneRoot/SceneCamera). The scene ships in the APK; every Spot of the
# story site has these values.
SCENE_CAMERA = {"near clip plane": 0.30000001192092896, "far clip plane": 1000.0, "field of view": 19.0}


def moenotes_dir(arg: str | None) -> Path:
    """The local MoeNotes folder (compose.yaml, config.toml, moenotes-assets/): --moenotes, $MOENOTES_LOCAL, else
    the folder whose config.toml the running moenotes-assets container mounts."""
    if arg or os.environ.get("MOENOTES_LOCAL"):
        return Path(arg or os.environ["MOENOTES_LOCAL"]).expanduser()
    fmt = "{{range .Mounts}}{{if eq .Destination \"%s\"}}{{.Source}}{{end}}{{end}}" % CONFIG_MOUNT
    try:
        ids = subprocess.run(["docker", "ps", "-q", "--filter", f"volume={CONFIG_MOUNT}"],
                             capture_output=True, text=True, check=True).stdout.split()
        source = subprocess.run(["docker", "inspect", "--format", fmt, *ids[:1]],
                                capture_output=True, text=True, check=True).stdout.strip() if ids else ""
    except (OSError, subprocess.CalledProcessError):
        source = ""
    if not source:
        raise SystemExit("no running moenotes-assets container: give the local MoeNotes folder with --moenotes")
    return Path(source.removeprefix("/host_mnt")).parent   # Docker Desktop names host paths /host_mnt/...


def bundle_settings(folder: Path) -> tuple[str, BundleKey]:
    """The CDN root (config.toml cdn_root) and bundle key (CSharp/Crypto.cs) of the service."""
    cdn = tomllib.loads((folder / "config.toml").read_text())["cdn_root"]
    source = (folder / "moenotes-assets/CSharp/Crypto.cs").read_text()
    key = re.search(r'aes\.Key = Convert\.FromHexString\("([0-9A-Fa-f]+)"\)', source)
    seed = re.search(r'SHA256\.HashData\(Convert\.FromHexString\("([0-9A-Fa-f]+)"\)', source)
    if not key or not seed:
        raise SystemExit(f"{folder}/moenotes-assets/CSharp/Crypto.cs: no bundle key and nonce seed")
    return cdn, BundleKey(bytes.fromhex(key[1]), bytes.fromhex(seed[1]))


def open_catalog(snap: dict, cache: Path, cdn: str, key: BundleKey) -> Catalog:
    """The catalog file of the service's snapshot, downloaded into `cache` once: the one whose SHA-256 is the
    snapshot's. A cached catalog_main that is not is downloaded again (the service may have refreshed since)."""
    def matches(cat: Catalog) -> bool:
        return hashlib.sha256(cat.sources()["remote"]).hexdigest() == snap["content_sha256"]

    for version in dict.fromkeys(v for v in (snap.get("catalog_version"), snap["version"]) if v):
        cat = Catalog.load(snap["locale"], cache, cdn=cdn, bundle_key=key, version=version)
        if not matches(cat) and version == "main":
            Catalog.cache_file(snap["locale"], cache).unlink()
            cat = Catalog.load(snap["locale"], cache, cdn=cdn, bundle_key=key)
        if matches(cat):
            return cat
    raise SystemExit(f"the CDN's catalog is not the service's snapshot {snap['snapshot'][:12]}: refresh its catalog")


def classes(env) -> dict[str, list]:
    """{class: MonoBehaviours} of the CLASSES in an environment, in object order."""
    out: dict[str, list] = {}
    for o in env.objects:
        if o.type.name != "MonoBehaviour":
            continue
        try:
            fields = set(o.read_typetree())
        except Exception:                   # no type tree: none of CLASSES (their bundles carry theirs)
            continue
        hits = [c for c, need in CLASSES.items() if need <= fields]
        if len(hits) > 1:
            raise RuntimeError(f"MonoBehaviour {o.path_id} has the fields of {', '.join(hits)}")
        if hits:
            out.setdefault(hits[0], []).append(o)
    return out


def situation(cat: Catalog, key: str, row: dict | None, spot_id: int, tables: dict,
              spine_dir: Path) -> tuple[dict, list[dict], str]:
    """spot.json of a situation key (as nnnotes spot.extract) and the sorting order of each Spine character (as
    storyhost.spine_records), and the name of the situation's prefab; the Spine files go to `spine_dir`."""
    env = UnityPy.load(*[str(p) for p in cat.fetch_key(key)])
    graph = SceneGraph(env)
    by_cls = classes(env)
    controller = strip_pptrs(by_cls["SpotCharacterController"][0].read_typetree())
    # The controller lists the SpotSpineCharacter and SpotCharacter components, though not always all of them
    # (10004 lists one twice and leaves Soyo_back out): CLASSES found each one it lists.
    for cls, field in (("SpotSpineCharacter", "_spotSpineCharacters"), ("SpotCharacter", "_characters")):
        if not {p["m_PathID"] for p in controller[field]} <= {o.path_id for o in by_cls.get(cls, [])}:
            raise RuntimeError(f"{key}: the controller's {field} names components that are not {cls}")

    def world_of(go_pptr) -> list[float]:
        return spot._mat4(graph.world_of_go(go_pptr["m_PathID"]))

    def write(name: str, data: bytes) -> None:
        if name.endswith(".json"):          # compact, as the story site stores a JSON skeleton
            data = json.dumps(json.loads(data), separators=(",", ":"), ensure_ascii=False).encode()
        (spine_dir / name).write_bytes(data)

    spine_dir.mkdir(parents=True, exist_ok=True)
    skeletons, written = {}, {}
    for o in by_cls.get("SkeletonDataAsset", []):
        skeletons[o.path_id] = spot.write_skeleton(o, write, written)
    spine_chars = spot.spine_characters(by_cls.get("SpotSpineCharacter", []), graph, skeletons, world_of)

    renderers = {o.read_typetree()["m_GameObject"]["m_PathID"]: o
                 for o in env.objects if o.type.name == "MeshRenderer"}
    sorting = []
    for o, char in zip(by_cls.get("SpotSpineCharacter", []), spine_chars):
        rec = {"path": char["path"], "sortingOrder": None, "sortingLayer": None}
        anim = deref(o, o.read_typetree()["_animation"])
        mr = anim and renderers.get(anim.read_typetree()["m_GameObject"]["m_PathID"])
        if mr is not None:
            mt = mr.read_typetree()
            rec.update(sortingOrder=mt.get("m_SortingOrder"), sortingLayer=mt.get("m_SortingLayerID"))
        sorting.append(rec)

    text = next((t for t in tables["MasterText"] if row and t["_id"] == row["_nameTextId"]), {})
    taps: dict[int, list[int]] = {}
    for r in tables["MasterStoryHomeSpotTapTalkEpisode"]:
        if r.get("_spotId") == spot_id:
            taps.setdefault(r["_characterId"], []).append(r["_advId"])
    bg_key = background_key(key, row)
    doc = {
        "spotId": spot_id,
        "master": row,
        "name": {lang[1:]: text.get(lang, "") for lang in spot.LANGS},
        "tapTalk": {str(k): v for k, v in sorted(taps.items())},
        "situationSettings": strip_pptrs(by_cls["SpotSituationSettings"][0].read_typetree()),
        "controller": {k: v for k, v in controller.items() if k not in ("_spotSpineCharacters", "_characters")},
        "characters": spot.tap_targets(by_cls.get("SpotCharacter", []), graph, world_of),
        "spineCharacters": spine_chars,
        "skeletons": list(skeletons.values()),
        "resources": {"background": [b.name for b in cat.resolve(bg_key)],
                      "situation": [b.name for b in cat.resolve(key)]},
        "matrixConvention": "Unity world space (left-handed), 4x4 column-major",
    }
    name = storyhost.container_go(env, cat._entry(key)["internal_id"]).read_typetree()["m_Name"]
    return doc, sorting, name


def background_key(key: str, row: dict | None) -> str:
    """The situation's background: its MasterHomeSpot row's, else its room's (Spot/<room>/Background/<room>)."""
    room_name = SITUATION_KEY.fullmatch(key)["room"]
    return row["_backgroundAssetPath"] if row else f"Spot/{room_name}/Background/{room_name}"


def placed_background(cat: Catalog, key: str, situation_name: str) -> dict:
    """roomRoot, roomNodes (path, placed, active per room.glb node) and situation of the background `key` placed for
    a situation, as storyhost.background: SpotBackground.Prepare(situation_name) on the prefab root, then the root
    activated. The node names go with them, to check room.glb."""
    env = UnityPy.load(*[str(p) for p in cat.fetch_key(key)])
    graph = SceneGraph(env)
    mf_by_go, mr_by_go = room.mesh_components(env)
    root_go = storyhost.container_go(env, cat._entry(key)["internal_id"]).path_id
    root = graph.tf_of_go[root_go]
    spot_bg = [o for o in classes(env).get("SpotBackground", [])
               if graph.tf_of_go.get(o.read_typetree()["m_GameObject"]["m_PathID"]) == root]
    if spot_bg:
        entries = [(e.get("SituationName"), [storyhost._go_ref(spot_bg[0], h) for h in e.get("HideObjects") or []])
                   for e in spot_bg[0].read_typetree().get("_situationObjects") or []]
        prep = storyhost.prepare(graph, root, situation_name + storyhost.CLONE, entries)
    else:
        prep = {"name": situation_name, "matched": False, "activate": [], "hide": [], "overrides": {}}
    shown = {**prep["overrides"], root_go: True}
    nodes, _ = storyhost.glb_order(room.drawn_meshes(mf_by_go, mr_by_go, graph, lambda p: None))
    t = graph.tf[root]
    return {
        "roomRoot": {"path": graph.path(root), "localPosition": t["m_LocalPosition"],
                     "localRotation": t["m_LocalRotation"], "localScale": t["m_LocalScale"]},
        "roomNodes": [{"path": graph.path(tf), "placed": storyhost.under(graph, tf, root),
                       "active": storyhost.under(graph, tf, root) and storyhost.active_in_hierarchy(graph, tf, shown)}
                      for tf, _ in nodes],
        "situation": {"name": prep["name"], "matched": prep["matched"],
                      "activate": [graph.path(x) for x in prep["activate"]],
                      "hide": [graph.path(graph.tf_of_go[g]) if g in graph.tf_of_go else None for g in prep["hide"]]},
        "nodeNames": [name for _, name in nodes],
    }


def export(cat: Catalog, key: str, row: dict | None, spot_id: int, tables: dict, out: Path) -> None:
    sdir = out / "spot"
    doc, sorting, name = situation(cat, key, row, spot_id, tables, sdir / "spine")
    write_json(sdir / "spot.json", doc)
    bg_key = background_key(key, row)
    room_doc = room.extract_room(cat, bg_key, sdir / "room.glb")
    bg = placed_background(cat, bg_key, name)
    glb_nodes = [n["name"] for n in storyhost.glb_json(sdir / "room.glb")["nodes"]]
    if glb_nodes != bg.pop("nodeNames") or room_doc["meshCount"] != len(bg["roomNodes"]):
        raise RuntimeError(f"{bg_key}: room.glb nodes differ from the placed background's")
    home = {"spotId": spot_id, "spot": "spot/spot.json", "room": "spot/room.glb", **bg,
            "sceneRoot": {"key": "EmbScene/Spot", "sceneCamera": {"camera": SCENE_CAMERA}},
            "spineCharacters": sorting}
    write_json(out / "host.json", {
        "format": "bdon-immersive-home.spot-host/1",
        "about": "The part of an ournotes.story-host/1 home screen that tools/spots/build_spot.py reads, exported "
                 "from the local catalog by tools/spots/export_spot.py",
        "situationKey": key, "home": home})
    active = sum(n["active"] for n in bg["roomNodes"])
    print(f"{spot_id} {name}: {len(doc['spineCharacters'])} Spine characters, "
          f"{active}/{len(bg['roomNodes'])} room nodes active")


def register(ids_file: Path, spot_id: int, directory: str) -> None:
    """Put "<spotId> <directory>" in the list, replacing the directory's line, sorted by Spot id."""
    lines = ids_file.read_text().splitlines() if ids_file.exists() else []
    entries = {d: i for i, d in (ln.split() for ln in lines if ln.strip())}
    entries[directory] = str(spot_id)
    ids_file.parent.mkdir(parents=True, exist_ok=True)
    ids_file.write_text("".join(f"{i} {d}\n" for d, i in sorted(entries.items(), key=lambda e: (int(e[1]), e[0]))))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("spots", nargs="+", help="situations (home_..._01) or Spot ids")
    ap.add_argument("--id", type=int, help="Spot id of a situation without a MasterHomeSpot row (a preview)")
    ap.add_argument("--service", default=SERVICE, help=f"moenotes-assets service (default {SERVICE})")
    ap.add_argument("--region", help="region of the service (default: its first)")
    ap.add_argument("--moenotes", help="local MoeNotes folder (default: the running container's)")
    ap.add_argument("--out", type=Path, default=ROOT / "data/source", help="where to write (default data/source)")
    ap.add_argument("--ids", type=Path, default=LOCAL_IDS, help="list to add them to (default %(default)s)")
    ap.add_argument("--cache", type=Path, default=ROOT / "data/cache", help="catalogs and bundles (default data/cache)")
    args = ap.parse_args()
    if args.id is not None and len(args.spots) != 1:
        raise SystemExit("--id takes one situation")

    snap = snapshot(args.service, args.region)
    cdn, key = bundle_settings(moenotes_dir(args.moenotes))
    cat = open_catalog(snap, args.cache / snap["region"], cdn, key)
    tables = {t: master_table(snap["region"], t) for t in
              ("MasterHomeSpot", "MasterText", "MasterStoryHomeSpotTapTalkEpisode")}
    by_id = {str(r["_id"]): r for r in tables["MasterHomeSpot"]}
    by_situation = {SITUATION_KEY.fullmatch(k)["situation"]: k for k in cat.keys("Spot/")
                    if SITUATION_KEY.fullmatch(k) and "/Background/" not in k}

    for arg in args.spots:
        if arg.isdigit():
            if arg not in by_id:
                raise SystemExit(f"{arg}: no MasterHomeSpot row in {snap['region']}")
            sit_key = by_id[arg]["_situationAssetPath"]
        elif arg in by_situation:
            sit_key = by_situation[arg]
        else:
            raise SystemExit(f"{arg}: no situation of that name in the catalog")
        row = next((r for r in tables["MasterHomeSpot"] if r["_situationAssetPath"] == sit_key), None)
        if row is None and args.id is None:
            raise SystemExit(f"{arg}: no MasterHomeSpot row in {snap['region']} yet (--id N exports a preview)")
        spot_id = args.id if args.id is not None else row["_id"]
        directory = SITUATION_KEY.fullmatch(sit_key)["situation"]
        export(cat, sit_key, row, spot_id, tables, args.out / directory)
        register(args.ids, spot_id, directory)
    print(f"listed in {args.ids}; build_spot.py packages them with the story site's Spots (macos/build.sh)")


if __name__ == "__main__":
    main()
