#!/usr/bin/env python3
"""Tune a layout against a reference screenshot.

Draws the composed character over a faded copy of the reference, next to
the untouched reference, so part positions can be matched by eye.

Usage: overlay.py <parts_dir> <layout.json> <reference.jpg> <out.jpg>
Layout must carry "reference_scale": parts px -> reference px.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageEnhance

from compose import compose


def main() -> None:
    parts_dir, layout_path = Path(sys.argv[1]), Path(sys.argv[2])
    ref_path, out = Path(sys.argv[3]), Path(sys.argv[4])
    layout = json.loads(layout_path.read_text())
    scale = layout["reference_scale"]

    ref = Image.open(ref_path).convert("RGBA")
    ref = ref.resize((int(ref.width / scale), int(ref.height / scale)), Image.LANCZOS)

    # Canvas == reference frame, origin at its top-left.
    layout = dict(layout, canvas=[ref.width, ref.height], origin=layout.get("origin", [0, 0]))
    char = compose(parts_dir, layout)

    faded = ImageEnhance.Brightness(ImageEnhance.Contrast(ref).enhance(0.35)).enhance(1.4)
    faded.alpha_composite(char)

    sheet = Image.new("RGB", (ref.width * 2 + 10, ref.height), (30, 30, 30))
    sheet.paste(ref.convert("RGB"), (0, 0))
    sheet.paste(faded.convert("RGB"), (ref.width + 10, 0))
    sheet.save(out, quality=85)


if __name__ == "__main__":
    main()
