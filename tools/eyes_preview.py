import sys, json
sys.path.insert(0, 'tools')
from pathlib import Path
from compose import compose
from PIL import Image
L = json.load(open('rig/arare_pose.json')); L['canvas'] = [780, 720]
img = compose(Path('rig/arare'), L)
bg = Image.new('RGBA', img.size, (235, 235, 245, 255)); bg.alpha_composite(img)
a = bg.crop((220, 300, 480, 540)).resize((520, 480), Image.LANCZOS).convert('RGB')
r = Image.open('rig/ref/home_vrfloor.jpg').convert('RGB').crop((220, 300, 480, 540)).resize((520, 480), Image.LANCZOS)
s = Image.new('RGB', (1050, 480)); s.paste(r, (0, 0)); s.paste(a, (530, 0)); s.save('prev/eyes.jpg', quality=90)
