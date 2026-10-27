#!/usr/bin/env python3
"""List the Home Spot situations of the local catalog that the app does not have yet.

The Ournotes asset service (Docker, http://127.0.0.1:8091; the local OurNotes Viewer browses it) holds one region's
Addressables catalog, where every Spot situation is a key Spot/<room>/<situation>/<situation>. Its watcher
(http://127.0.0.1:8092) asks the game's own server list and version API and refreshes the catalog from the region's
Bilibili CDN when the release changes; its /status gives the CDN root and the master data version the game reports.
The app's Spots are data/spots/index.json (each spot.json "name" is its situation).

The region's master data comes from the same CDN (<cdn>/master/<version>/<Table>.bin, checked against its manifest),
decrypted with the key and IV in data/secrets/nnnotes-direct.toml ([master]; not committed) and cached in
data/cache/master. It gives a situation its Spot id and name once the game lists it in MasterHomeSpot; until then
the catalog has the assets of a Spot the game does not show yet.

export_spot.py exports situations into data/source and lists them in data/source/spot_ids.txt; one exported without a
MasterHomeSpot row (a preview, --id) is listed here until the master data lists it, then to be exported again.
update_catalog.py reports the same list every 6 hours.

Needs nnnotes (data/venv). Usage: data/venv/bin/python tools/spots/local_spots.py [--service URL] [--watcher URL]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import tomllib
import urllib.request
from datetime import datetime
from pathlib import Path

from nnnotes import master

ROOT = Path(__file__).resolve().parents[2]
SERVICE = "http://127.0.0.1:8091"
WATCHER = "http://127.0.0.1:8092"
SITUATION_KEY = re.compile(r"Spot/(?P<room>[^/]+)/(?P<situation>[^/]+)/(?P=situation)")
SPOT_IDS = ROOT / "data/source/spot_ids.txt"
MASTER_KEY = ROOT / "data/secrets/nnnotes-direct.toml"
MASTER_CACHE = ROOT / "data/cache/master"
CONFIG_MOUNT = "/etc/backend/config.toml"  # compose.yaml of the Ournotes folder


def get(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=60) as response:
        return response.read()


def ournotes_dir(arg: str | None) -> Path:
    """The Ournotes folder (compose.yaml, config.toml, backend/): `arg`, else the folder whose config.toml the running
    asset service mounts."""
    if arg:
        return Path(arg).expanduser()
    fmt = "{{range .Mounts}}{{if eq .Destination \"%s\"}}{{.Source}}{{end}}{{end}}" % CONFIG_MOUNT
    try:
        ids = subprocess.run(["docker", "ps", "-q", "--filter", f"volume={CONFIG_MOUNT}"],
                             capture_output=True, text=True, check=True).stdout.split()
        source = subprocess.run(["docker", "inspect", "--format", fmt, *ids[:1]],
                                capture_output=True, text=True, check=True).stdout.strip() if ids else ""
    except (OSError, subprocess.CalledProcessError):
        source = ""
    if not source:
        raise SystemExit("no running Ournotes asset service: give the Ournotes folder with --ournotes")
    return Path(source.removeprefix("/host_mnt")).parent   # Docker Desktop names host paths /host_mnt/...


def service_json(service: str, path: str):
    try:
        return json.loads(get(service.rstrip("/") + path))
    except OSError as e:
        raise SystemExit(f"{service}: {e} (are the Ournotes containers running?)")


def game_state(watcher: str) -> dict:
    """The watcher's /status: region, resource_version, master_version, cdn_root (roots joined by "|") and the
    snapshot of its last refresh, as the game's server list and version API reported them."""
    state = service_json(watcher, "/status")
    if not state.get("master_version") or not state.get("cdn_root"):
        raise SystemExit(f"{watcher}: the game's version is not known yet ({state.get('error') or 'not checked'})")
    return state


def snapshot(service: str, region: str | None) -> dict:
    """The service's newest current catalog snapshot of `region` (default: the first configured) in its default
    locale, as the viewer picks it."""
    regions = service_json(service, "/regions")
    reg = next((r for r in regions if r["id"] == region), None) if region else regions[0]
    if reg is None:
        raise SystemExit(f"{service}: no region {region} (configured: {', '.join(r['id'] for r in regions)})")
    snaps = service_json(service, f"/catalogs?region={reg['id']}&locale={reg['default_locale']}")
    current = [s for s in snaps if s["current"]]
    if not current:
        raise SystemExit(f"{service}: no catalog of {reg['id']}/{reg['default_locale']} yet")
    return current[0]


def situation_keys(service: str, snap: dict) -> list[str]:
    """Every situation key of the snapshot (Spot/<room>/<situation>/<situation>; backgrounds excluded)."""
    keys, offset = [], 0
    while True:
        page = service_json(service, f"/assets?snapshot={snap['snapshot']}&prefix=Spot/&limit=1000&offset={offset}")
        keys += [a["key"] for a in page["assets"]]
        offset += len(page["assets"])
        if not page["assets"] or offset >= page["total"]:
            break
    return sorted(k for k in keys if (m := SITUATION_KEY.fullmatch(k)) and m["situation"] != "Background")


def master_key() -> master.MasterKey:
    if not MASTER_KEY.exists():
        raise SystemExit(f"{MASTER_KEY}: missing (the master data's [master] key and iv, 64 hex digits each)")
    m = tomllib.loads(MASTER_KEY.read_text())["master"]
    return master.MasterKey(bytes.fromhex(m["key"]), bytes.fromhex(m["iv"]))


def master_table(state: dict, table: str) -> list[dict]:
    """The rows of a master data table of the version the watcher reports, from the region's CDN once."""
    path = MASTER_CACHE / state["region"] / state["master_version"] / f"{table}.json"
    if not path.exists():
        base = f"{state['cdn_root'].split('|')[0].rstrip('/')}/master/{state['master_version']}"
        files = {f["name"]: f for f in json.loads(get(f"{base}/MasterManifest.json"))["files"]}
        if f"{table}.bin" not in files:
            raise SystemExit(f"master data {state['master_version']}: no {table}")
        raw = get(f"{base}/{table}.bin")
        if hashlib.sha256(raw).hexdigest() != files[f"{table}.bin"]["hash"].lower():
            raise SystemExit(f"master data {state['master_version']}: {table}.bin is not the manifest's")
        path.parent.mkdir(parents=True, exist_ok=True)
        part = path.with_suffix(".part")
        part.write_bytes(master.decode(raw, master_key()))
        part.replace(path)
    return json.loads(path.read_text())["_allData"]


def master_spots(state: dict) -> dict[str, dict]:
    """{situation key: {"id", "name" (Korean, else Japanese)}} of the region's MasterHomeSpot."""
    text = {t["_id"]: t for t in master_table(state, "MasterText")}
    out = {}
    for row in master_table(state, "MasterHomeSpot"):
        t = text.get(row["_nameTextId"], {})
        out[row["_situationAssetPath"]] = {"id": str(row["_id"]), "name": t.get("_korean") or t.get("_japanese", "")}
    return out


def app_situations() -> dict[str, str]:
    """{situation: Spot id} of data/spots (built by build_spot.py)."""
    index = ROOT / "data/spots/index.json"
    if not index.exists():
        return {}
    return {json.loads((index.parent / e["dir"] / "spot.json").read_text())["name"]: e["id"]
            for e in json.loads(index.read_text())}


def exports(ids_file: Path = SPOT_IDS) -> dict[str, str]:
    """{situation: Spot id} of data/source/spot_ids.txt (export_spot.py)."""
    if not ids_file.exists():
        return {}
    return {d: i for i, d in (line.split() for line in ids_file.read_text().splitlines() if line.strip())}


def is_preview(situation: str) -> bool:
    """export_spot.py exported the situation without a MasterHomeSpot row (--id)."""
    doc = ROOT / "data/source" / situation / "spot/spot.json"
    return doc.exists() and json.loads(doc.read_text()).get("master") is None


def findings(snap: dict, keys: list[str], state: dict) -> list[dict]:
    """What the app lacks of the snapshot's situations `keys`: {kind, situation, app (its Spot id there), row (its
    MasterHomeSpot id and name, or None)} per
      new      a situation the app does not have
      preview  one the app has from a preview export
      id       one whose Spot id in the app is not the master data's
      gone     a Spot of the app that the catalog does not have"""
    master_rows = master_spots(state)
    app, exported = app_situations(), exports()
    out = []
    for key in keys:
        situation = SITUATION_KEY.fullmatch(key)["situation"]
        row = master_rows.get(key)
        if situation not in app:
            kind = "new"
        elif situation in exported and is_preview(situation):
            kind = "preview"
        elif row and row["id"] != app[situation]:
            kind = "id"
        else:
            continue
        out.append({"kind": kind, "situation": situation, "app": app.get(situation), "row": row})
    found = {SITUATION_KEY.fullmatch(k)["situation"] for k in keys}
    out += [{"kind": "gone", "situation": s, "app": app[s], "row": None} for s in sorted(set(app) - found)]
    return out


def describe(f: dict, region: str) -> str:
    row = f"{f['row']['id']}  {f['row']['name']}" if f["row"] else f"no MasterHomeSpot row in {region} yet"
    if f["kind"] == "new":
        exported = exports().get(f["situation"])
        return f"new     {f['situation']:44s} {row}" + (f"  (exported as {exported}, not built yet)" if exported else "")
    if f["kind"] == "preview":
        return f"preview {f['situation']:44s} {f['app']} in the app; " + (
            f"listed as {row}: export it again" if f["row"] else row)
    if f["kind"] == "id":
        return f"id      {f['situation']:44s} {f['app']} in the app, {row} in {region} master data"
    return f"gone    {f['situation']:44s} {f['app']} is not in the local catalog"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--service", default=SERVICE, help=f"Ournotes asset service (default {SERVICE})")
    ap.add_argument("--watcher", default=WATCHER, help=f"Ournotes watcher (default {WATCHER})")
    args = ap.parse_args()

    state = game_state(args.watcher)
    snap = snapshot(args.service, state["region"])
    keys = situation_keys(args.service, snap)
    created = datetime.fromtimestamp(snap["created"])
    print(f"local catalog: {snap['region']}/{snap['locale']} snapshot {snap['snapshot'][:12]} "
          f"({created:%Y-%m-%d %H:%M}), {len(keys)} situations, master data {state['master_version'][:12]}; "
          f"app: {len(app_situations())} Spots")
    found = findings(snap, keys, state)
    for f in found:
        print(describe(f, snap["region"]))
    if not found:
        print("nothing new")


if __name__ == "__main__":
    main()
