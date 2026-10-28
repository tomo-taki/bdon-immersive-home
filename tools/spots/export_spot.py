#!/usr/bin/env python3
"""Export Home Spot situations of the local catalog for build_spot.py.

The situations are those of the Ournotes asset service's catalog (local_spots.py). For each one this writes
data/source/<situation>/:
  host.json       the room placement and drawing order of the Spot's home screen that build_spot.py reads
  spot/room.glb   the background, with room.json
  spot/spot.json  the situation, with spot/spine/*
and lists it in data/source/spot_ids.txt as "<spotId> <situation>". --all exports every Spot of the master data and
the previews the list has.

The files are made by nnnotes 0.1.4 (StarMoe-org/nnnotes) from the service's own catalog file (checked against its
snapshot's SHA-256). The catalog and bundles come from the region's Bilibili CDN that the watcher reports, decrypted
with the bundle key in the service's source (backend/CSharp/Crypto.cs), and are cached in data/cache.
`nnnotes spot` reads a MonoBehaviour's class from its MonoScript, which ships only in the game's APK
(shared_monoscripts.bundle); here a class is told by the fields only it serializes (CLASSES), so no APK is needed.

The Spot id, MasterHomeSpot row and names come from the region's master data, as in local_spots.py.
A situation without a MasterHomeSpot row needs --id: a preview with no names, not for a release.

Needs Python 3.11+ with nnnotes 0.1.4 (data/ is not committed):
  python3.12 -m venv data/venv && data/venv/bin/pip install nnnotes==0.1.4
Usage: data/venv/bin/python tools/spots/export_spot.py [--ournotes DIR] [--id N] <situation | Spot id>... | --all
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import tomllib
from pathlib import Path

import UnityPy
from nnnotes import room, spot, storyhost
from nnnotes.addressables import BundleKey
from nnnotes.catalog import Catalog
from nnnotes.jsonio import write_json
from nnnotes.unity import SceneGraph, deref, strip_pptrs

from local_spots import (ROOT, SERVICE, SITUATION_KEY, SPOT_IDS, WATCHER, exports, game_state, get, master_table,
                         ournotes_dir, snapshot)

# Script classes by fields that only they serialize (a class matches when it has all of them).
CLASSES = {
    "SpotSituationSettings": {"backgroundPosition", "originalOffset", "orbitRatio", "fieldOfView"},
    "SpotCharacterController": {"_spotSpineCharacters", "_characters"},
    "SpotSpineCharacter": {"_animation"},
    "SpotCharacter": {"_characterId", "_focus"},
    "SkeletonDataAsset": {"skeletonJSON", "atlasAssets"},
    "SpotBackground": {"_situationObjects"},
}
# The Spot scene's camera (EmbScene/Spot, SceneRoot/SceneCamera). The scene ships in the APK, not in the catalog.
SCENE_CAMERA = {"near": 0.30000001192092896, "far": 1000.0, "fieldOfView": 19.0}


def without_spine(drawn_meshes):
    """room.drawn_meshes without the objects a Spine shader draws. A background's Spine object (the millsage cafe's
    04_BG_table and 04_BG_chair) stores only its prefab's preview mesh, and the Spine runtime makes the real one each
    frame: room.glb and roomNodes leave them out, and background_spine makes them Spine characters."""
    shaders: dict = {}

    def is_spine(pptr) -> bool:
        if not pptr.path_id:
            return False
        mat = pptr.deref()
        if room.object_key(mat) not in shaders:
            shader = deref(mat, mat.read_typetree()["m_Shader"]).read_typetree()
            shaders[room.object_key(mat)] = "/Spine/" in shader["m_ParsedForm"]["m_Name"]
        return shaders[room.object_key(mat)]

    def drawn(mf_by_go, mr_by_go, graph, on_null_mesh):
        for tf_pid, mesh, mats in drawn_meshes(mf_by_go, mr_by_go, graph, on_null_mesh):
            if not any(map(is_spine, mats)):
                yield tf_pid, mesh, mats
    return drawn


# room.extract_room (room.glb) and placed_background (roomNodes) both draw what room.drawn_meshes yields.
room.drawn_meshes = without_spine(room.drawn_meshes)


def bundle_settings(folder: Path) -> tuple[str, BundleKey]:
    """The fallback CDN root (config.toml cdn_root) and the bundle key (backend/CSharp/Crypto.cs) of the Ournotes
    folder."""
    cdn = tomllib.loads((folder / "config.toml").read_text())["cdn_root"]
    source = (folder / "backend/CSharp/Crypto.cs").read_text()
    key = re.search(r'aes\.Key = Convert\.FromHexString\("([0-9A-Fa-f]+)"\)', source)
    seed = re.search(r'SHA256\.HashData\(Convert\.FromHexString\("([0-9A-Fa-f]+)"\)', source)
    if not key or not seed:
        raise SystemExit(f"{folder}/backend/CSharp/Crypto.cs: no bundle key and nonce seed")
    return cdn, BundleKey(bytes.fromhex(key[1]), bytes.fromhex(seed[1]))


def catalog_versions(snap: dict, watcher: str = WATCHER) -> list[str]:
    """The catalog file versions the snapshot may be of, likeliest first: the resource version of the watcher's update
    that made it (catalog_<resource version>), then its scope's own (main, a manual refresh)."""
    try:
        updates = json.loads(get(watcher.rstrip("/") + "/updates"))
    except (OSError, ValueError):           # no watcher
        updates = []
    made = [u["resource_version"] for u in updates if u.get("snapshot") == snap["snapshot"]]
    return list(dict.fromkeys([*made, snap["version"]]))


def open_catalog(snap: dict, versions: list[str], cache: Path, cdn: str, key: BundleKey) -> Catalog:
    """The catalog file of the service's snapshot, downloaded into `cache` once: the one of `versions` whose
    SHA-256 is the snapshot's. A cached catalog_main that is not is downloaded again (the service may have
    refreshed since)."""
    def matches(cat: Catalog) -> bool:
        return hashlib.sha256(cat.sources()["remote"]).hexdigest() == snap["content_sha256"]

    for version in versions:
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


def spine_writer(spine_dir: Path):
    """The `write(file name, bytes)` of spot.write_skeleton for one situation's Spine files: a JSON skeleton compact
    (the app ships it). A situation and its background may name the same file; it must be the same."""
    spine_dir.mkdir(parents=True, exist_ok=True)
    written: dict[str, bytes] = {}

    def write(name: str, data: bytes) -> None:
        if name.endswith(".json"):
            data = json.dumps(json.loads(data), separators=(",", ":"), ensure_ascii=False).encode()
        if written.setdefault(name, data) != data:
            raise RuntimeError(f"{spine_dir}: two different Spine files named {name}")
        (spine_dir / name).write_bytes(data)
    return write


def situation(cat: Catalog, key: str, row: dict | None, spot_id: int, tables: dict,
              write) -> tuple[dict, list[dict], str]:
    """spot.json of a situation key (its master data row and names, and the situation settings and Spine characters as
    nnnotes spot.extract reads them), the sorting order of each Spine character (as storyhost.spine_records) and the
    name of the situation's prefab; the Spine files go to `write` (spine_writer)."""
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

    # A preview has no MasterText row: the settings list it as an unreleased Spot.
    text = next((t for t in tables["MasterText"] if t["_id"] == row["_nameTextId"]), {}) if row else {
        "_korean": "미공개 스팟"}
    doc = {
        "spotId": spot_id,
        "master": row,
        "name": {lang[1:]: text.get(lang, "") for lang in spot.LANGS},
        "situationSettings": strip_pptrs(by_cls["SpotSituationSettings"][0].read_typetree()),
        "spineCharacters": spine_chars,
        "skeletons": list(skeletons.values()),
    }
    name = storyhost.container_go(env, cat._entry(key)["internal_id"]).read_typetree()["m_Name"]
    return doc, sorting, name


def background_key(key: str, row: dict | None) -> str:
    """The situation's background: its MasterHomeSpot row's, else its room's (Spot/<room>/Background/<room>)."""
    room_name = SITUATION_KEY.fullmatch(key)["room"]
    return row["_backgroundAssetPath"] if row else f"Spot/{room_name}/Background/{room_name}"


def placed_background(cat: Catalog, key: str, situation_name: str, write) -> dict:
    """roomRoot, roomNodes (path, placed, active per room.glb node) and situation of the background `key` placed for
    a situation, as storyhost.background: SpotBackground.Prepare(situation_name) on the prefab root, then the root
    activated. The node names go with them, to check room.glb, and the background's Spine objects the situation
    shows (background_spine; their files go to `write`)."""
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
        "spine": background_spine(env, graph, root, shown, write),
    }


def background_spine(env, graph: SceneGraph, root: int, shown: dict, write) -> dict:
    """The Spine objects of a placed background that are active (the millsage cafe's 04_BG_table and 04_BG_chair,
    which its situation 04 shows): Spine characters of the situation in all but their place, so in the form of
    situation()'s spineCharacters, skeletons and sorting orders. room.glb leaves them out (without_spine)."""
    renderers = {o.read_typetree()["m_GameObject"]["m_PathID"]: o
                 for o in env.objects if o.type.name == "MeshRenderer"}
    skeletons, written, out = {}, {}, {"spineCharacters": [], "skeletons": [], "sorting": []}
    for o in env.objects:
        if o.type.name != "MonoBehaviour":
            continue
        try:
            t = o.read_typetree()
        except Exception:                   # no type tree: not a SkeletonAnimation
            continue
        if "skeletonDataAsset" not in t or "_animationName" not in t or not t.get("m_Enabled", 1):
            continue
        go = t["m_GameObject"]["m_PathID"]
        tf = graph.tf_of_go[go]
        if not (storyhost.under(graph, tf, root) and storyhost.active_in_hierarchy(graph, tf, shown)):
            continue
        sda = o.read().skeletonDataAsset
        if sda.path_id not in skeletons:
            skeletons[sda.path_id] = spot.write_skeleton(sda.deref(), write, written)
            out["skeletons"].append(skeletons[sda.path_id])
        path = graph.path(tf)
        out["spineCharacters"].append({
            "path": path, "skeletonData": skeletons[sda.path_id]["name"],
            "animation": {k: t[k] for k in ("_animationName", "loop", "timeScale", "initialSkinName", "initialFlipX",
                                            "initialFlipY", "pmaVertexColors", "tintBlack", "zSpacing")},
            "world": spot._mat4(graph.world_of_go(go))})
        mt = renderers[go].read_typetree() if go in renderers else {}
        out["sorting"].append({"path": path, "sortingOrder": mt.get("m_SortingOrder"),
                               "sortingLayer": mt.get("m_SortingLayerID")})
    return out


def export(cat: Catalog, key: str, row: dict | None, spot_id: int, tables: dict, out: Path) -> None:
    sdir = out / "spot"
    write = spine_writer(sdir / "spine")
    doc, sorting, name = situation(cat, key, row, spot_id, tables, write)
    bg_key = background_key(key, row)
    room_doc = room.extract_room(cat, bg_key, sdir / "room.glb")
    bg = placed_background(cat, bg_key, name, write)
    glb_nodes = [n["name"] for n in storyhost.glb_json(sdir / "room.glb")["nodes"]]
    if glb_nodes != bg.pop("nodeNames") or room_doc["meshCount"] != len(bg["roomNodes"]):
        raise RuntimeError(f"{bg_key}: room.glb nodes differ from the placed background's")
    bg_spine = bg.pop("spine")
    doc["spineCharacters"] += bg_spine["spineCharacters"]
    doc["skeletons"] += bg_spine["skeletons"]
    sorting += bg_spine["sorting"]
    write_json(sdir / "spot.json", doc)
    write_json(out / "host.json", {
        "format": "bdon-immersive-home.spot-host/2",
        "about": "The placed room, camera and drawing order of a Spot's home screen that tools/spots/build_spot.py "
                 "reads, exported from the local catalog by tools/spots/export_spot.py",
        "situationKey": key, "home": {**bg, "camera": SCENE_CAMERA, "spineCharacters": sorting}})
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
    ap.add_argument("spots", nargs="*", help="situations (home_..._01) or Spot ids")
    ap.add_argument("--all", action="store_true", help="every Spot of the master data and the previews of --ids")
    ap.add_argument("--id", type=int, help="Spot id of a situation without a MasterHomeSpot row (a preview)")
    ap.add_argument("--service", default=SERVICE, help=f"Ournotes asset service (default {SERVICE})")
    ap.add_argument("--watcher", default=WATCHER, help=f"Ournotes watcher (default {WATCHER})")
    ap.add_argument("--ournotes", help="Ournotes folder (default: the running asset service's)")
    ap.add_argument("--out", type=Path, default=ROOT / "data/source", help="where to write (default data/source)")
    ap.add_argument("--ids", type=Path, default=SPOT_IDS, help="list to add them to (default %(default)s)")
    ap.add_argument("--cache", type=Path, default=ROOT / "data/cache", help="catalogs and bundles (default data/cache)")
    args = ap.parse_args()
    if args.all == bool(args.spots):
        raise SystemExit("give situations or Spot ids, or --all")
    if args.id is not None and len(args.spots) != 1:
        raise SystemExit("--id takes one situation")

    state = game_state(args.watcher)
    snap = snapshot(args.service, state["region"])
    _, key = bundle_settings(ournotes_dir(args.ournotes))
    cdn = state["cdn_root"].split("|")[0]
    cat = open_catalog(snap, catalog_versions(snap, args.watcher), args.cache / snap["region"], cdn, key)
    tables = {t: master_table(state, t) for t in ("MasterHomeSpot", "MasterText")}
    rows = {r["_situationAssetPath"]: r for r in tables["MasterHomeSpot"]}
    by_situation = {SITUATION_KEY.fullmatch(k)["situation"]: k for k in cat.keys("Spot/")
                    if SITUATION_KEY.fullmatch(k) and "/Background/" not in k}

    jobs: list[tuple[str, int]] = []       # (situation key, Spot id)
    if args.all:
        for sit_key, row in sorted(rows.items(), key=lambda e: e[1]["_id"]):
            if sit_key in by_situation.values():
                jobs.append((sit_key, row["_id"]))
            else:
                print(f"{row['_id']}: {sit_key} is not in the catalog")
        for situation, spot_id in exports(args.ids).items():
            if situation not in by_situation:
                print(f"{spot_id} {situation}: listed, but not in the catalog")
            elif by_situation[situation] not in rows:
                jobs.append((by_situation[situation], int(spot_id)))
    for arg in args.spots:
        if arg.isdigit():
            row = next((r for r in rows.values() if str(r["_id"]) == arg), None)
            if row is None:
                raise SystemExit(f"{arg}: no MasterHomeSpot row in {snap['region']}")
            sit_key = row["_situationAssetPath"]
        elif arg in by_situation:
            sit_key = by_situation[arg]
        else:
            raise SystemExit(f"{arg}: no situation of that name in the catalog")
        if sit_key not in rows and args.id is None:
            raise SystemExit(f"{arg}: no MasterHomeSpot row in {snap['region']} yet (--id N exports a preview)")
        jobs.append((sit_key, args.id if args.id is not None else rows[sit_key]["_id"]))

    # A Spot id names the app's files (data/spots/<room>/<id>, data/thumbs/<id>.jpg): one situation each.
    listed = exports(args.ids)
    for sit_key, spot_id in jobs:
        situation = SITUATION_KEY.fullmatch(sit_key)["situation"]
        other = next((d for d, i in listed.items() if i == str(spot_id) and d != situation), None)
        if other:
            raise SystemExit(f"Spot id {spot_id} of {situation} is {other}'s in {args.ids}: "
                             f"remove that first (tools/spots/remove_spot.py {other})")

    for sit_key, spot_id in jobs:
        directory = SITUATION_KEY.fullmatch(sit_key)["situation"]
        export(cat, sit_key, rows.get(sit_key), spot_id, tables, args.out / directory)
        register(args.ids, spot_id, directory)
    print(f"{len(jobs)} exported, listed in {args.ids}; build_spot.py packages them (macos/build.sh)")


if __name__ == "__main__":
    main()
