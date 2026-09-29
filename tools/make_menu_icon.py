"""Menu-bar template icon: 민트물렁고양이 (Rungcat), Kiro-ghost style.

Tall soft body, pointed ears on the crown's corners, bows on both sides of
the head at eye level, and the face (| | eyes, "ω" mouth) sitting high near
the top, as on the plush. Face and a thin outline around each bow are cut
out. Alpha only, so macOS tints it (NSImage.isTemplate).
Writes icon/menubar.png (18 px) and icon/menubar@2x.png (36 px).
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw
from scipy.spatial import ConvexHull

ROOT = Path(__file__).resolve().parent.parent / "icon"
S = 720                 # drawing canvas; downsampled to 18 / 36 px
CX = S / 2
BOW_GAP = 0.018 * S     # cut outline separating a bow from the head
FACE_Y = 0.30 * S       # eye line, high on the head


def body():
    """Convex hull of a head circle and a wider soft bottom."""
    points = []
    for i in range(120):
        t = 2 * math.pi * i / 120
        points.append((CX + 0.25 * S * math.cos(t), 0.34 * S + 0.24 * S * math.sin(t)))
        points.append((CX + 0.35 * S * math.cos(t), 0.74 * S + 0.24 * S * math.sin(t)))
    hull = ConvexHull(points)
    return [tuple(points[i]) for i in hull.vertices]


def ear(draw, side):
    """Pointed ear on the crown's corner with a slightly rounded tip."""
    tip = (CX + side * 0.215 * S, 0.035 * S)
    draw.polygon([(CX + side * 0.06 * S, 0.17 * S), tip, (CX + side * 0.26 * S, 0.24 * S)], fill=255)
    draw.ellipse((tip[0] - 0.02 * S, tip[1], tip[0] + 0.02 * S, tip[1] + 0.04 * S), fill=255)


def bow(draw, side, fill, grow=0.0):
    """Ribbon on the side of the head at eye level: two triangular lobes and a knot."""
    x, y, r = CX + side * 0.245 * S, FACE_Y + 0.01 * S, 0.034 * S + grow
    for dx in (-1, 1):
        outer = x + dx * 1.9 * (r - grow) + dx * grow
        draw.polygon([(x, y), (outer, y - r), (outer, y + r)], fill=fill)
    draw.ellipse((x - 0.55 * r, y - 0.55 * r, x + 0.55 * r, y + 0.55 * r), fill=fill)


image = Image.new("L", (S, S), 0)
draw = ImageDraw.Draw(image)

draw.polygon(body(), fill=255)
for side in (-1, 1):
    ear(draw, side)
for side in (-1, 1):
    bow(draw, side, 0, grow=BOW_GAP)
    bow(draw, side, 255)

# Face cut-outs, high on the head: | | eyes and an "ω" mouth right below.
eye_w, eye_h = 0.04 * S, 0.085 * S
for side in (-1, 1):
    ex = CX + side * 0.085 * S
    draw.rounded_rectangle((ex - eye_w / 2, FACE_Y - eye_h / 2, ex + eye_w / 2, FACE_Y + eye_h / 2),
                           radius=eye_w / 2, fill=0)
mouth_y, mr = FACE_Y + 0.06 * S, 0.032 * S
for side in (-1, 1):
    mx = CX + side * mr
    draw.arc((mx - mr, mouth_y - mr, mx + mr, mouth_y + mr), 10, 170, fill=0, width=int(0.028 * S))

image.save(ROOT / "menubar_master.png")
for size, name in [(18, "menubar.png"), (36, "menubar@2x.png")]:
    tile = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tile.putalpha(image.resize((size, size), Image.LANCZOS))
    tile.save(ROOT / name)
