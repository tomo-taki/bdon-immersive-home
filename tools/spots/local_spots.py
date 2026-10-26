#!/usr/bin/env python3
"""List the Home Spot situations of the local catalog that the app does not have yet.

The local MoeNotes Viewer browses a moenotes-assets service (Docker, http://127.0.0.1:8091): one region's
Addressables catalog, where every Spot situation is a key Spot/<room>/<situation>/<situation>. The app's Spots
are data/spots/index.json (each spot.json "name" is its situation). The region's master data, the tables bdon.moe
reads (metadata.bdon.moe/<region>/master/), gives a situation its Spot id and name once the game lists it in
MasterHomeSpot; until then the catalog has the assets of a Spot the game does not show yet.

export_spot.py exports a new situation in the layout fetch_spot.py writes; one it exported without a MasterHomeSpot
row (a preview, --id) is listed until the master data lists it, then to be exported again. update_catalog.py keeps
the service on the region's current release and reports the same list.

Usage: local_spots.py [--service URL] [--region kr]
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path

from fetch_spot import get

ROOT = Path(__file__).resolve().parents[2]
SERVICE = "http://127.0.0.1:8091"
MASTER = "https://metadata.bdon.moe/{region}/master/{table}.json"
SITUATION_KEY = re.compile(r"Spot/(?P<room>[^/]+)/(?P<situation>[^/]+)/(?P=situation)")
LOCAL_IDS = ROOT / "data/source/local_spot_ids.txt"
CONFIG_MOUNT = "/etc/moenotes-assets/config.toml"  # compose.yaml of the local MoeNotes folder


def moenotes_dir(arg: str | None) -> Path:
    """The local MoeNotes folder (compose.yaml, config.toml, .env, moenotes-assets/): `arg`, else the folder whose
    config.toml the running moenotes-assets container mounts."""
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
        raise SystemExit("no running moenotes-assets container: give the local MoeNotes folder with --moenotes")
    return Path(source.removeprefix("/host_mnt")).parent   # Docker Desktop names host paths /host_mnt/...


def service_json(service: str, path: str):
    try:
        return json.loads(get(service.rstrip("/") + path))
    except OSError as e:
        raise SystemExit(f"{service}: {e} (is the moenotes-assets container running?)")


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


def master_table(region: str, table: str) -> list[dict]:
    return json.loads(get(MASTER.format(region=region, table=table)))["_allData"]


def master_spots(region: str) -> dict[str, dict]:
    """{situation key: {"id", "name" (Korean, else Japanese)}} of the region's MasterHomeSpot."""
    text = {t["_id"]: t for t in master_table(region, "MasterText")}
    out = {}
    for row in master_table(region, "MasterHomeSpot"):
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


def local_exports() -> dict[str, str]:
    """{situation: Spot id} of data/source/local_spot_ids.txt (export_spot.py)."""
    if not LOCAL_IDS.exists():
        return {}
    return {d: i for i, d in (line.split() for line in LOCAL_IDS.read_text().splitlines() if line.strip())}


def is_preview(situation: str) -> bool:
    """export_spot.py exported the situation without a MasterHomeSpot row (--id)."""
    doc = ROOT / "data/source" / situation / "spot/spot.json"
    return doc.exists() and json.loads(doc.read_text()).get("master") is None


def findings(snap: dict, keys: list[str]) -> list[dict]:
    """What the app lacks of the snapshot's situations `keys`: {kind, situation, app (its Spot id there), row (its
    MasterHomeSpot id and name, or None)} per
      new      a situation the app does not have
      preview  one the app has from a preview export
      id       one whose Spot id in the app is not the master data's
      gone     a Spot of the app that the catalog does not have"""
    master = master_spots(snap["region"])
    app, exported = app_situations(), local_exports()
    out = []
    for key in keys:
        situation = SITUATION_KEY.fullmatch(key)["situation"]
        row = master.get(key)
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
        exported = local_exports().get(f["situation"])
        return f"new     {f['situation']:44s} {row}" + (f"  (exported as {exported}, not built yet)" if exported else "")
    if f["kind"] == "preview":
        return f"preview {f['situation']:44s} {f['app']} in the app; " + (
            f"listed as {row}: export it again" if f["row"] else row)
    if f["kind"] == "id":
        return f"id      {f['situation']:44s} {f['app']} in the app, {row} in {region} master data"
    return f"gone    {f['situation']:44s} {f['app']} is not in the local catalog"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--service", default=SERVICE, help=f"moenotes-assets service (default {SERVICE})")
    ap.add_argument("--region", help="region of the service (default: its first)")
    args = ap.parse_args()

    snap = snapshot(args.service, args.region)
    keys = situation_keys(args.service, snap)
    created = datetime.fromtimestamp(snap["created"])
    print(f"local catalog: {snap['region']}/{snap['locale']} snapshot {snap['snapshot'][:12]} "
          f"({created:%Y-%m-%d %H:%M}), {len(keys)} situations; app: {len(app_situations())} Spots")
    found = findings(snap, keys)
    for f in found:
        print(describe(f, snap["region"]))
    if not found:
        print("nothing new")


if __name__ == "__main__":
    main()
