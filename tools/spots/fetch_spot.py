#!/usr/bin/env python3
"""Download a Home Spot's host files from a moenotes Home Talk story export.

moenotes (bdon.moe) publishes every story as a manifest at
  https://storage.bdon.moe/moenotes/stories/<advId>.json
whose "files" map logical paths to content-addressed blobs under
  https://storage.bdon.moe/moenotes/assets/<sha256>.<ext>[.gz]
A Home Talk's host/spot/ folder holds the room (room.glb), the Spot
settings and character placements (spot.json) and each resident's Spine
4.2 skeleton JSON with its atlas and texture.

Blobs are either one "asset" (optionally gzip-stored) or several "parts"
that are concatenated. Output: <out_dir>/<path relative to host/spot/>.

Usage: fetch_spot.py <advId> <out_dir>
"""
import gzip
import json
import sys
import urllib.request
from pathlib import Path

BASE = "https://storage.bdon.moe/moenotes/"
PREFIX = "host/"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) bdon-immersive-home"}  # CDN rejects urllib's default UA


def get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA)) as response:
        return response.read()


def blob(entry: dict) -> bytes:
    if "parts" in entry:
        # Large JSON is split by top-level key: [[key, asset, size, stored], ...].
        fields = [b'"%s":%s' % (key.encode(), blob({"asset": asset})) for key, asset, *_ in entry["parts"]]
        return b"{" + b",".join(fields) + b"}"
    data = get(BASE + entry["asset"])
    return gzip.decompress(data) if entry["asset"].endswith(".gz") else data


def main() -> None:
    adv_id, out = sys.argv[1], Path(sys.argv[2])
    manifest = json.loads(get(f"{BASE}stories/{adv_id}.json"))
    out.mkdir(parents=True, exist_ok=True)

    for path, entry in manifest["files"].items():
        if not path.startswith(PREFIX):
            continue
        data = blob(entry)
        if "parts" in entry:
            json.loads(data)  # joined parts must form valid JSON
        elif "size" in entry and len(data) != entry["size"]:
            raise SystemExit(f"{path}: size {len(data)} != {entry['size']}")
        target = out / path[len(PREFIX):]
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        print(f"{path[len(PREFIX):]:48s} {len(data):>10,d} bytes")


if __name__ == "__main__":
    main()
