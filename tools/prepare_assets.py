#!/usr/bin/env python3
"""Cut wallpaper sprites out of the published vrfloor_03 background atlas.

Source: assets.bdon.moe (ko) Spot/home_003_yumemita_01_vrfloor_03 texture.
Each sprite is the alpha island containing a seed point (atlas pixels),
optionally clipped to a rect, so neighbouring atlas parts never bleed in.
Output: Resources/scene/<name>.png
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
ATLAS = ROOT / "assets-src" / "003_yumemita_01_vrfloor_03_texure.png"
OUT = ROOT / "Resources" / "scene"
MAX_SIDE = 2048
ALPHA_MIN = 8
GROUP_RADIUS = 6  # px; merges letters of one sign into one island

# name: (seed_x, seed_y, clip rect (x, y, w, h) or None)
SPRITES = {
    "sky": (200, 300, (0, 0, 3250, 1765)),
    "floor": (1600, 2842, (0, 2242, 3212, 1275)),
    "cloud_long": (1006, 2067, None),
    "cloud_puff": (2874, 3841, None),
    "cloud_tall_a": (3877, 1883, None),
    "cloud_tall_b": (3525, 1626, None),
    "planet_blue": (919, 3884, (711, 3673, 429, 422)),
    "saturn": (2102, 3862, (1675, 3631, 845, 464)),
    "sign": (3578, 2961, None),
    "platform": (3657, 3281, None),
    "disc": (3587, 3913, None),
    "bubble": (3789, 2859, None),
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rgba = np.array(Image.open(ATLAS).convert("RGBA"))
    solid = rgba[..., 3] > ALPHA_MIN

    # Label islands on a slightly grown mask, then keep original alpha.
    grown = ndimage.binary_dilation(solid, iterations=GROUP_RADIUS)
    labels, _ = ndimage.label(grown)

    for name, (sx, sy, clip) in SPRITES.items():
        island = labels == labels[sy, sx]
        if clip:
            x, y, w, h = clip
            keep = np.zeros_like(island)
            keep[y:y + h, x:x + w] = True
            island &= keep

        piece = rgba.copy()
        piece[~island, 3] = 0

        ys, xs = np.nonzero(island & solid)
        crop = piece[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

        img = Image.fromarray(crop)
        img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        img.save(OUT / f"{name}.png", optimize=True)
        print(f"{name:14s} {img.width}x{img.height}")


if __name__ == "__main__":
    main()
