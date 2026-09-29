#!/usr/bin/env python3
"""Bake a composed layout into per-group layers + pivots for the app.

Usage: export_rig.py <parts_dir> <layout.json> <out_dir> <rig_name>
Writes <out_dir>/<rig_name>_<layer>.png and <out_dir>/<rig_name>.json
(coordinates in canvas pixels, y down).
"""
import json
import sys
from pathlib import Path

from compose import compose


def main() -> None:
    parts_dir, layout_path = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir, rig = Path(sys.argv[3]), sys.argv[4]
    out_dir.mkdir(parents=True, exist_ok=True)

    layout = json.loads(layout_path.read_text())
    ox, oy = layout["origin"]
    cw, ch = layout["canvas"]
    layers = []

    for name, (px, py) in layout["layers"]:
        img = compose(parts_dir, layout, only={name})
        bbox = img.getbbox()
        if not bbox:
            continue
        img.crop(bbox).save(out_dir / f"{rig}_{name}.png", optimize=True)
        layers.append({
            "name": name,
            "file": f"{rig}_{name}",
            "frame": list(bbox),          # x0, y0, x1, y1
            "pivot": [ox + px, oy + py],
        })

    meta = {"canvas": [cw, ch], "layers": layers}
    (out_dir / f"{rig}.json").write_text(json.dumps(meta, indent=1))
    print(f"{rig}: {len(layers)} layers")


if __name__ == "__main__":
    main()
