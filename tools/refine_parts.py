#!/usr/bin/env python3
"""Exhaustive local refinement of a layout against the reference screenshot.

Per part, around its current placement, try every rotation / scale on a
fine grid and every translation within a window (matchTemplate), scoring
masked normalised correlation over the pixels that are VISIBLE in the
reference (parts in front are masked out). Front parts go first so the
occlusion of back parts uses already-refined positions. Two passes.

Usage: refine_parts.py <parts_dir> <layout.json> <reference.jpg>
Writes layout["affine"][name] = [a, b, tx, c, d, ty] (part px -> reference px)
and layout["fit_score"][name].
"""
import json
import math
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ALPHA_CUT = 0.5
OCCLUDED = 0.3
MIN_VISIBLE = 120
WINDOW = 14                                  # px translation search radius
ROTATIONS = np.arange(-15, 15.1, 1.0)        # degrees relative to current
SCALES = np.arange(0.85, 1.201, 0.025)       # relative to current
PASSES = 2
MIN_GAIN = 0.01


def placement_affine(part: Image.Image, x, y, rot, scale=1.0):
    """Affine equivalent of compose.py's resize -> rotate(expand) -> centre paste."""
    w, h = part.size
    cx, cy = x + w / 2, y + h / 2
    t = math.radians(rot)
    a, b = scale * math.cos(t), scale * math.sin(t)
    m = np.array([[a, b, 0.0], [-b, a, 0.0]], dtype=np.float64)
    m[:, 2] = np.array([cx, cy]) - m[:, :2] @ np.array([w / 2, h / 2])
    return m


def compose_affine(m, rot_deg, scale, centre):
    """m followed by an extra rotation/scale about `centre` (reference px)."""
    t = math.radians(rot_deg)
    a, b = scale * math.cos(t), scale * math.sin(t)
    r = np.array([[a, b], [-b, a]])
    out = np.zeros((2, 3))
    out[:, :2] = r @ m[:, :2]
    out[:, 2] = r @ (m[:, 2] - centre) + centre
    return out


def main() -> None:
    parts_dir, layout_path, ref_path = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    layout = json.loads(layout_path.read_text())
    affines = layout.get("affine", {})

    ref = cv2.imread(str(ref_path)).astype(np.float32)
    size = (ref.shape[1], ref.shape[0])

    items = []
    for name, x, y, rot, group, *extra in layout["parts"]:
        part = Image.open(parts_dir / f"{name}.png").convert("RGBA")
        arr = np.array(part)
        m = np.array(affines[name], dtype=np.float64).reshape(2, 3) if name in affines \
            else placement_affine(part, x, y, rot, extra[0] if extra else 1.0)
        items.append({
            "name": name,
            "bgr": cv2.cvtColor(arr[..., :3], cv2.COLOR_RGB2BGR).astype(np.float32),
            "alpha": arr[..., 3].astype(np.float32) / 255,
            "m": m, "score": None,
        })

    def warp(img, m, flags=cv2.INTER_LINEAR):
        return cv2.warpAffine(img, m, size, flags=flags, borderValue=0)

    for pass_no in range(PASSES):
        for i in reversed(range(len(items))):            # front to back
            it = items[i]
            front = np.zeros((size[1], size[0]), np.float32)
            for other in items[i + 1:]:
                front = np.maximum(front, warp(other["alpha"], other["m"]))
            reveal = (front < OCCLUDED).astype(np.float32)

            h, w = it["alpha"].shape
            centre = it["m"] @ np.array([w / 2, h / 2, 1.0])
            best = None

            for s in SCALES:
                for r in ROTATIONS:
                    m = compose_affine(it["m"], r, s, centre)
                    # Render the candidate into a tight box around its footprint.
                    corners = m @ np.array([[0, 0, 1], [w, 0, 1], [0, h, 1], [w, h, 1]]).T
                    x0 = int(math.floor(corners[0].min())) - WINDOW
                    y0 = int(math.floor(corners[1].min())) - WINDOW
                    x1 = int(math.ceil(corners[0].max())) + WINDOW
                    y1 = int(math.ceil(corners[1].max())) + WINDOW
                    if x0 < 0 or y0 < 0 or x1 > size[0] or y1 > size[1]:
                        continue
                    local = m.copy()
                    local[:, 2] -= (x0 + WINDOW, y0 + WINDOW)
                    tw, th = x1 - x0 - 2 * WINDOW, y1 - y0 - 2 * WINDOW
                    tpl = cv2.warpAffine(it["bgr"], local, (tw, th))
                    msk = cv2.warpAffine(it["alpha"], local, (tw, th))
                    # Visibility at the current position (occlusion barely moves within the window).
                    vis = reveal[y0 + WINDOW:y1 - WINDOW, x0 + WINDOW:x1 - WINDOW]
                    msk = ((msk > ALPHA_CUT) & (vis > 0)).astype(np.float32)
                    if msk.sum() < MIN_VISIBLE:
                        continue
                    res = cv2.matchTemplate(ref[y0:y1, x0:x1], tpl, cv2.TM_CCOEFF_NORMED, mask=msk)
                    res = np.nan_to_num(res, nan=-1, posinf=-1, neginf=-1)
                    _, score, _, (dx, dy) = cv2.minMaxLoc(res)
                    if best is None or score > best[0]:
                        cand = m.copy()
                        cand[:, 2] += (dx - WINDOW, dy - WINDOW)
                        best = (score, cand, r, s, dx - WINDOW, dy - WINDOW)

            if best is None:
                if pass_no == PASSES - 1:
                    print(f"{it['name']:24s} hidden - kept")
                continue

            # Score of the unchanged placement is the (r=0, s=1, d=0) case.
            old = it["score"] if it["score"] is not None else -1
            if best[0] > old + MIN_GAIN or it["score"] is None:
                it["m"], it["score"] = best[1], best[0]
            if pass_no == PASSES - 1:
                _, _, r, s, dx, dy = best
                print(f"{it['name']:24s} ncc {it['score']:.3f}  rot {r:+5.1f}  scale {s:.3f}  shift ({dx:+d},{dy:+d})")

    layout["affine"] = {it["name"]: [round(float(v), 5) for v in it["m"].reshape(-1)] for it in items}
    layout["fit_score"] = {it["name"]: round(float(it["score"]), 3) for it in items if it["score"] is not None}
    layout_path.write_text(json.dumps(layout, indent=1))


if __name__ == "__main__":
    main()
