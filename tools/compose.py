#!/usr/bin/env python3
"""Compose a character from isolated atlas parts using a hand-made layout.

Layout JSON: {"canvas": [w, h], "origin": [x, y], "parts": [[name, x, y, rot, group], ...]}
- parts are drawn in list order (first = back)
- x, y: part top-left relative to origin, in part pixels
- rot: degrees counter-clockwise around the part centre
- group: animation group name used by the app (head, body, tail_l, ...)

Usage: compose.py <parts_dir> <layout.json> <out.png> [scale]
"""
import json
import sys
from pathlib import Path

from PIL import Image


def compose(parts_dir: Path, layout: dict, only=None) -> Image.Image:
    cw, ch = layout["canvas"]
    ox, oy = layout["origin"]
    canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))

    affines = layout.get("affine", {})

    for name, x, y, rot, group, *extra in layout["parts"]:
        if only and group not in only:
            continue
        part = Image.open(parts_dir / f"{name}.png").convert("RGBA")

        # Refined placement (refine_parts.py): full affine, part px -> canvas px.
        if name in affines:
            a, b, tx, c, d, ty = affines[name]
            tx, ty = tx + ox, ty + oy
            det = a * d - b * c
            inv = (d / det, -b / det, (b * ty - d * tx) / det,
                   -c / det, a / det, (c * tx - a * ty) / det)
            layer = part.transform(canvas.size, Image.AFFINE, inv, resample=Image.BICUBIC)
            canvas = Image.alpha_composite(canvas, layer)
            continue

        cx, cy = x + part.width / 2, y + part.height / 2

        # Optional 6th field: uniform scale around the part centre.
        scale = extra[0] if extra else 1
        if scale != 1:
            part = part.resize((round(part.width * scale), round(part.height * scale)), Image.LANCZOS)
        if rot:
            part = part.rotate(rot, resample=Image.BICUBIC, expand=True)
        px = int(round(ox + cx - part.width / 2))
        py = int(round(oy + cy - part.height / 2))
        # Full-size layer so negative offsets clip instead of failing.
        layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        layer.paste(part, (px, py))
        canvas = Image.alpha_composite(canvas, layer)
    return canvas


def main() -> None:
    parts_dir, layout_path, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    scale = float(sys.argv[4]) if len(sys.argv) > 4 else 1
    layout = json.loads(layout_path.read_text())
    img = compose(parts_dir, layout)

    bg = Image.new("RGBA", img.size, (205, 215, 235, 255))
    bg.alpha_composite(img)
    if scale != 1:
        bg = bg.resize((int(bg.width * scale), int(bg.height * scale)), Image.LANCZOS)
    bg.convert("RGB").save(out)


if __name__ == "__main__":
    main()
