#!/usr/bin/env python3
"""Fit atlas parts onto a reference screenshot by masked template matching.

For every part: try rotations (and a few scales), find where its opaque
pixels best match the reference, then refine locally. Writes a layout JSON
whose coordinates are in reference pixels divided by the global scale, so
compose.py draws parts at their native size.

Usage: fit_parts.py <parts_dir> <reference.jpg> <x0,y0,x1,y1> <out_layout.json>
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

COARSE = 0.5          # search at half resolution first
ROT_STEP = 6          # degrees, coarse
ROT_FINE = 1          # degrees, refine
MIN_OPAQUE = 180      # skip tiny parts (sweat drops etc.)
ALPHA_CUT = 160


def rotated(part: Image.Image, angle: float, scale: float):
    """Return (bgr, mask, (w, h) of rotated image) for a part."""
    if scale != 1:
        part = part.resize((max(1, int(part.width * scale)), max(1, int(part.height * scale))), Image.LANCZOS)
    rot = part.rotate(angle, resample=Image.BICUBIC, expand=True)
    arr = np.array(rot)
    mask = (arr[..., 3] > ALPHA_CUT).astype(np.uint8) * 255
    bgr = cv2.cvtColor(arr[..., :3], cv2.COLOR_RGB2BGR)
    return bgr, mask


def match(ref, tpl, mask):
    if tpl.shape[0] >= ref.shape[0] or tpl.shape[1] >= ref.shape[1] or mask.sum() == 0:
        return -1, (0, 0)
    res = cv2.matchTemplate(ref, tpl, cv2.TM_CCOEFF_NORMED, mask=mask)
    res = np.nan_to_num(res, nan=-1, posinf=-1, neginf=-1)
    _, score, _, loc = cv2.minMaxLoc(res)
    return score, loc


def fit(part, ref_full, ref_small, scale):
    best = (-1, 0, (0, 0))
    for angle in range(0, 360, ROT_STEP):
        tpl, mask = rotated(part, angle, scale * COARSE)
        score, loc = match(ref_small, tpl, mask)
        if score > best[0]:
            best = (score, angle, loc)

    # Refine angle and position at full resolution near the coarse hit.
    _, angle0, (lx, ly) = best
    top = (-1, angle0, (0, 0), (0, 0))
    for angle in np.arange(angle0 - ROT_STEP, angle0 + ROT_STEP + 0.1, ROT_FINE):
        tpl, mask = rotated(part, angle, scale)
        h, w = mask.shape
        cx, cy = int(lx / COARSE), int(ly / COARSE)
        pad = 24
        x0, y0 = max(0, cx - pad), max(0, cy - pad)
        window = ref_full[y0:cy + h + pad, x0:cx + w + pad]
        score, (mx, my) = match(window, tpl, mask)
        if score > top[0]:
            top = (score, float(angle), (x0 + mx, y0 + my), (w, h))
    return top


def main() -> None:
    parts_dir, ref_path = Path(sys.argv[1]), Path(sys.argv[2])
    x0, y0, x1, y1 = (int(v) for v in sys.argv[3].split(","))
    out = Path(sys.argv[4])
    scale = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0

    ref = cv2.imread(str(ref_path))[y0:y1, x0:x1]
    ref_small = cv2.resize(ref, None, fx=COARSE, fy=COARSE, interpolation=cv2.INTER_AREA)

    fits = []
    for path in sorted(parts_dir.glob("*.png")):
        part = Image.open(path).convert("RGBA")
        if (np.array(part)[..., 3] > ALPHA_CUT).sum() < MIN_OPAQUE:
            continue
        score, angle, (mx, my), (w, h) = fit(part, ref, ref_small, scale)

        # Centre of the rotated template in reference px -> native part px.
        cx = (x0 + mx + w / 2) / scale
        cy = (y0 + my + h / 2) / scale
        fits.append({
            "name": path.stem, "score": round(score, 4), "angle": round(angle, 1),
            "x": round(cx - part.width / 2, 1), "y": round(cy - part.height / 2, 1),
        })
        print(f"{path.stem:24s} score={score:.3f} angle={angle:6.1f} centre=({cx:.0f},{cy:.0f})", flush=True)

    out.write_text(json.dumps({"scale": scale, "fits": fits}, indent=1))


if __name__ == "__main__":
    main()
