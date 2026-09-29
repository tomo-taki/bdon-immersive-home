"""Build icon/AppIcon.icns from icon/tomori.png (macOS squircle-ish tile)."""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

CANVAS = 1024
BODY = 824          # Apple icon grid: 824 px tile inside a 1024 canvas
RADIUS = 185
SIZES = [16, 32, 128, 256, 512]

root = Path(__file__).resolve().parent.parent / "icon"
src = Image.open(root / "tomori.png").convert("RGBA")

# Upscale the square portrait to the tile, clip to a rounded rect.
face = src.resize((BODY, BODY), Image.LANCZOS)
mask = Image.new("L", (BODY, BODY), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, BODY - 1, BODY - 1), RADIUS, fill=255)
face.putalpha(mask)

# Soft drop shadow like system icons.
offset = (CANVAS - BODY) // 2
shadow = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
shadow_mask = Image.new("L", (CANVAS, CANVAS), 0)
ImageDraw.Draw(shadow_mask).rounded_rectangle((offset, offset + 12, offset + BODY, offset + BODY + 12), RADIUS, fill=90)
shadow.putalpha(shadow_mask.filter(ImageFilter.GaussianBlur(14)))
icon = Image.alpha_composite(shadow, Image.new("RGBA", (CANVAS, CANVAS)))
icon.alpha_composite(face, (offset, offset))

iconset = root / "AppIcon.iconset"
iconset.mkdir(exist_ok=True)
for size in SIZES:
    icon.resize((size, size), Image.LANCZOS).save(iconset / f"icon_{size}x{size}.png")
    icon.resize((size * 2, size * 2), Image.LANCZOS).save(iconset / f"icon_{size}x{size}@2x.png")
icon.save(root / "AppIcon_1024.png")
subprocess.run(["iconutil", "-c", "icns", str(iconset), "-o", str(root / "AppIcon.icns")], check=True)
print(root / "AppIcon.icns", file=sys.stderr)
