#!/usr/bin/env python3
"""List the Home Spot situations of the local catalog that the app does not have yet.

The local MoeNotes Viewer browses a moenotes-assets service (Docker, http://127.0.0.1:8091): one region's
Addressables catalog, where every Spot situation is a key Spot/<room>/<situation>/<situation>. The app's Spots
are data/spots/index.json (each spot.json "name" is its situation). The region's master data, the tables bdon.moe
reads (metadata.bdon.moe/<region>/master/), gives a situation its Spot id and name once the game lists it in
MasterHomeSpot; until then the catalog has the assets of a Spot the game does not show yet.

export_spot.py exports a new situation in the layout fetch_spot.py writes.

Usage: local_spots.py [--service URL] [--region kr]
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from fetch_spot import get

ROOT = Path(__file__).resolve().parents[2]
SERVICE = "http://127.0.0.1:8091"
MASTER = "https://metadata.bdon.moe/{region}/master/{table}.json"
SITUATION_KEY = re.compile(r"Spot/(?P<room>[^/]+)/(?P<situation>[^/]+)/(?P=situation)")
LOCAL_IDS = ROOT / "data/source/local_spot_ids.txt"


def service_json(service: str, path: str):
    try:
        return json.loads(get(service.rstrip("/") + path))
    except OSError as e:
        raise SystemExit(f"{service}: {e} (is the moenotes-assets container running?)")


def snapshot(service: str, region: str | None) -> dict:
    """The service's current catalog snapshot of `region` (default: the first configured) in its default locale."""
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


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--service", default=SERVICE, help=f"moenotes-assets service (default {SERVICE})")
    ap.add_argument("--region", help="region of the service (default: its first)")
    args = ap.parse_args()

    snap = snapshot(args.service, args.region)
    keys = situation_keys(args.service, snap)
    master = master_spots(snap["region"])
    app, exported = app_situations(), local_exports()
    print(f"local catalog: {snap['region']}/{snap['locale']} catalog {snap['version']}, "
          f"{len(keys)} situations; app: {len(app)} Spots")

    new = 0
    for key in keys:
        situation = SITUATION_KEY.fullmatch(key)["situation"]
        row = master.get(key)
        if situation in app:
            if row and row["id"] != app[situation]:
                print(f"  {situation}: Spot {app[situation]} in the app, {row['id']} in {snap['region']} master data")
            continue
        new += 1
        note = f"{row['id']}  {row['name']}" if row else f"-      no MasterHomeSpot row in {snap['region']} yet"
        if situation in exported:
            note += f"  (exported as {exported[situation]}, not built yet)"
        print(f"new  {situation:44s} {note}")
    gone = sorted(set(app) - {SITUATION_KEY.fullmatch(k)["situation"] for k in keys})
    for situation in gone:
        print(f"gone {situation:44s} {app[situation]} is not in the local catalog")
    if not new:
        print("no new situations")


if __name__ == "__main__":
    main()
