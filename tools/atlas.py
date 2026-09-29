"""Minimal Spine 4.x .atlas parser + region extractor."""
from PIL import Image


def parse(path):
    """Return {name: dict(bounds=(x,y,w,h), offsets=(ox,oy,ow,oh), rotate=deg)}."""
    regions, cur = {}, None
    for raw in open(path, encoding="utf-8").read().splitlines():
        line = raw.strip()
        if not line or line.endswith(".png"):
            cur = None
            continue
        if ":" not in line:
            cur = regions.setdefault(line, {"rotate": 0})
            continue
        if cur is None:
            continue  # page header fields
        key, val = [s.strip() for s in line.split(":", 1)]
        if key in ("bounds", "offsets"):
            cur[key] = tuple(int(v) for v in val.split(","))
        elif key == "rotate":
            cur["rotate"] = 90 if val == "true" else int(val) if val.lstrip("-").isdigit() else 0
    return regions


def extract(page, region):
    """Crop a region, undo packing rotation, and restore its untrimmed canvas."""
    x, y, w, h = region["bounds"]
    rot = region["rotate"]
    # Spine stores rotated regions with swapped w/h in bounds.
    cw, ch = (h, w) if rot in (90, 270) else (w, h)
    img = page.crop((x, y, x + cw, y + ch))
    if rot == 90:
        img = img.rotate(-90, expand=True)
    elif rot == 270:
        img = img.rotate(90, expand=True)
    ox, oy, ow, oh = region.get("offsets", (0, 0, img.width, img.height))
    canvas = Image.new("RGBA", (ow, oh), (0, 0, 0, 0))
    # oy is measured from the bottom in Spine.
    canvas.paste(img, (ox, oh - oy - img.height))
    return canvas


def isolate(page, regions, name_filter=None):
    """Extract regions without neighbour bleed.

    Mesh parts are polygon-packed, so bounding boxes overlap. Each alpha
    island on the page goes to the smallest region rect that contains
    (almost) all of it; everything else inside a rect is masked out.
    """
    import numpy as np
    from scipy import ndimage

    rgba = np.array(page)
    labels, count = ndimage.label(rgba[..., 3] > 0)
    slices = ndimage.find_objects(labels)

    rects = {}
    for name, reg in regions.items():
        x, y, w, h = reg["bounds"]
        if reg["rotate"] in (90, 270):
            w, h = h, w
        rects[name] = (x, y, w, h)

    owner = {}
    for idx, sl in enumerate(slices, start=1):
        ys, xs = np.nonzero(labels[sl] == idx)
        ys = ys + sl[0].start
        xs = xs + sl[1].start
        best, best_key = None, None
        for name, (x, y, w, h) in rects.items():
            inside = ((xs >= x) & (xs < x + w) & (ys >= y) & (ys < y + h)).mean()
            if inside < 0.5:
                continue
            key = (inside < 0.97, w * h if inside >= 0.97 else -inside)
            if best_key is None or key < best_key:
                best, best_key = name, key
        if best:
            owner[idx] = best

    out = {}
    for name, reg in regions.items():
        if name_filter and not name_filter(name):
            continue
        mine = [i for i, n in owner.items() if n == name]
        mask = np.isin(labels, mine)
        clean = rgba.copy()
        clean[~mask, 3] = 0
        out[name] = extract(Image.fromarray(clean), reg)
    return out
