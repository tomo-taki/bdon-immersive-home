#!/usr/bin/env python3
"""DMG window background: the Yumemita Spot 30002 still, white pads behind
the icons, and a pink arrow from the app to Applications.

Usage: make_background.py <scene.png 1320x760> <out_dir>
Writes background.png (660x380) and background@2x.png (1320x760); make_dmg.sh
joins them into a HiDPI TIFF. Layout must match tools/dmg/settings.py.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

W, H = 660, 380          # window content size in points (settings.py)
S = 2                    # draw at 2x, downsample for the 1x image
APP_XY, APPS_XY = (160, 120), (500, 120)      # icon centres (settings.py)
NOTE_XY = (330, 270)
PAD_W, PAD_ABOVE, PAD_BELOW = 184, 58, 76

PINK = (255, 51, 119)        # BanG Dream! logo red-pink
PINK_SOFT = (255, 150, 190)


def main():
    scene_path, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    scene = Image.open(scene_path).convert("RGB").resize((W * S, H * S), Image.LANCZOS)

    # Soften the scene a little so icons and Finder's black labels stay
    # readable; the pads below carry the labels, so the art can stay visible.
    base = scene.filter(ImageFilter.GaussianBlur(1 * S))
    veil = Image.new("RGB", base.size, (255, 255, 255))
    base = Image.blend(base, veil, 0.18).convert("RGBA")

    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    # White pads behind each icon and its Finder label. The 88pt icon spans
    # cy-44..cy+44 and the one-line label about cy+48..cy+64, so the pad is
    # centred below cy and wide enough for "BDON Immersive Home" (~150pt).
    def pad(cx, cy):
        left, right = cx - PAD_W / 2, cx + PAD_W / 2
        top, bottom = cy - PAD_ABOVE, cy + PAD_BELOW
        d.rounded_rectangle([left * S, top * S, right * S, bottom * S],
                            radius=22 * S, fill=(255, 255, 255, 200), outline=PINK_SOFT + (255,), width=2 * S)
    pad(*APP_XY)
    pad(*APPS_XY)

    # Arrow app -> Applications, between the pads.
    y = APP_XY[1] * S
    x0, x1 = (APP_XY[0] + PAD_W / 2 + 14) * S, (APPS_XY[0] - PAD_W / 2 - 14) * S
    d.rounded_rectangle([x0, y - 7 * S, x1 - 22 * S, y + 7 * S], radius=7 * S, fill=PINK + (255,))
    d.polygon([(x1 - 30 * S, y - 22 * S), (x1, y), (x1 - 30 * S, y + 22 * S)], fill=PINK + (255,))

    pad(*NOTE_XY)

    image = Image.alpha_composite(base, layer).convert("RGB")
    out_dir.mkdir(parents=True, exist_ok=True)
    image.save(out_dir / "background@2x.png")
    image.resize((W, H), Image.LANCZOS).save(out_dir / "background.png")


if __name__ == "__main__":
    main()
