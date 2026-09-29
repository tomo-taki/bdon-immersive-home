#!/usr/bin/env python3
"""Translation-only outline fit for flat, low-texture parts (face, head).

Correlation is unreliable on flat skin, so these parts keep the rotation and
scale they share with the head parts (0 deg, 1.0) and only their position is
searched: the part's outline pixels that are visible in the reference are
scored against the reference's edge distance transform (chamfer matching).

Usage: fit_outline.py <parts_dir> <layout.json> <before_layout.json> <reference.jpg> name [name ...]
Starting positions come from before_layout.json (the unrefined placement).
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

from refine_parts import placement_affine, ALPHA_CUT, OCCLUDED

WINDOW = 30


def main() -> None:
    parts_dir, layout_path, before_path, ref_path = (Path(a) for a in sys.argv[1:5])
    names = sys.argv[5:]
    layout = json.loads(layout_path.read_text())
    before = {p[0]: p for p in json.loads(before_path.read_text())["parts"]}
    order = [p[0] for p in layout["parts"]]

    ref = cv2.imread(str(ref_path), cv2.IMREAD_GRAYSCALE)
    size = (ref.shape[1], ref.shape[0])
    edges = cv2.Canny(cv2.GaussianBlur(ref, (3, 3), 0), 40, 110)
    dist = cv2.distanceTransform(255 - edges, cv2.DIST_L2, 3)

    def alpha_of(name):
        return np.array(Image.open(parts_dir / f"{name}.png").convert("RGBA"))[..., 3].astype(np.float32) / 255

    for name in names:
        part = Image.open(parts_dir / f"{name}.png").convert("RGBA")
        _, x, y, _, _, *extra = before[name]
        m = placement_affine(part, x, y, 0, 1.0)

        # Occlusion by refined parts in front.
        front = np.zeros((size[1], size[0]), np.float32)
        for other in order[order.index(name) + 1:]:
            om = np.array(layout["affine"][other]).reshape(2, 3)
            front = np.maximum(front, cv2.warpAffine(alpha_of(other), om, size))

        # Outline of the part in its own pixels.
        solid = (alpha_of(name) > ALPHA_CUT).astype(np.uint8)
        outline = solid - cv2.erode(solid, np.ones((3, 3), np.uint8))
        ys, xs = np.nonzero(outline)
        pts = (m @ np.stack([xs, ys, np.ones_like(xs)]).astype(np.float64)).T

        best = None
        for dy in range(-WINDOW, WINDOW + 1):
            for dx in range(-WINDOW, WINDOW + 1):
                px = np.round(pts[:, 0] + dx).astype(int)
                py = np.round(pts[:, 1] + dy).astype(int)
                ok = (px >= 0) & (py >= 0) & (px < size[0]) & (py < size[1])
                px, py = px[ok], py[ok]
                vis = front[py, px] < OCCLUDED
                if vis.sum() < 40:
                    continue
                # Truncated chamfer: robust to outline pixels with no edge nearby.
                cost = np.minimum(dist[py[vis], px[vis]], 8).mean()
                if best is None or cost < best[0]:
                    best = (cost, dx, dy, int(vis.sum()))

        cost, dx, dy, used = best
        m[:, 2] += (dx, dy)
        layout["affine"][name] = [round(float(v), 5) for v in m.reshape(-1)]
        print(f"{name:14s} chamfer {cost:.2f}px over {used} outline px, shift ({dx:+d},{dy:+d})")

    layout_path.write_text(json.dumps(layout, indent=1))


if __name__ == "__main__":
    main()
