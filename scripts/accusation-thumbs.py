"""Regenerate 720px card thumbnails for the /accusations index. Run after changing any accusation card image (the card field).
Usage: python scripts/accusation-thumbs.py   (needs Pillow)"""
import re, os
from PIL import Image, ImageOps
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
keys = dict(re.findall(r'^\s+(\w+):\s*"([^"]+)"', open(f"{root}/src/lib/images.ts").read(), re.M))
acc = open(f"{root}/src/lib/accusations.ts").read()
for key in re.findall(r'^\s+card: "(\w+)"', acc, re.M):
    src = keys[key]; out = f"{root}/public/images/thumbs/{os.path.splitext(os.path.basename(src))[0]}.jpg"
    im = ImageOps.exif_transpose(Image.open(f"{root}/public{src}")).convert("RGB"); im.thumbnail((720, 720)); im.save(out, quality=78)
    print(out)
