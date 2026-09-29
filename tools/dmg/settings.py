# dmgbuild settings for dist/BDONImmersiveHome.dmg (see tools/make_dmg.sh).
# dmgbuild writes the Finder window layout (.DS_Store) itself, so no Finder
# automation permission is needed. Positions must match make_background.py.
import os
import unicodedata

app = defines["app"]            # noqa: F821  (dmgbuild injects `defines`)
dmg_dir = defines["dmg_dir"]    # noqa: F821

volume_name = "BDON Immersive Home"
format = "UDZO"
compression_level = 9
filesystem = "HFS+"

files = [
    app,
    os.path.join(dmg_dir, "readme.txt"),
]
symlinks = {"Applications": "/Applications"}
icon = os.path.join(defines["root"], "icon", "AppIcon.icns")   # noqa: F821  volume icon

background = defines["background"]   # noqa: F821  HiDPI TIFF (1x + 2x)
show_status_bar = False
show_tab_view = False
show_toolbar = False
show_pathbar = False
show_sidebar = False
# Height includes Finder's ~32pt title bar, so the 660x380 background fits.
window_rect = ((200, 120), (660, 412))
default_view = "icon-view"
arrange_by = None
icon_size = 88
text_size = 13
label_pos = "bottom"

# HFS+ stores names decomposed (NFD); Finder ignores NFC keys for Hangul names.
icon_locations = {unicodedata.normalize("NFD", k): v for k, v in {
    "BDON Immersive Home.app": (160, 120),
    "Applications": (500, 120),
    "readme.txt": (330, 270),
}.items()}
