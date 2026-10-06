#!/usr/bin/env python3
"""Stamp every page's CSS/JS links with a hash of the file's contents.

Run this after changing css/archive.css or any script in js/:
    python3 tools/stamp-versions.py

Browsers cache files; a new hash in the URL (e.g. archive.css?v=6fc846cd44)
forces them to fetch the new version. js/catalog.js is not listed: pages
already load it fresh on every visit.
"""
import glob, hashlib, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ["css/archive.css", "js/core.js", "js/home.js", "js/browse.js", "js/item.js", "js/icons.js", "js/start.js", "js/palettes.js"]

def digest(path):
    with open(os.path.join(ROOT, path), "rb") as f:
        return hashlib.md5(f.read()).hexdigest()[:10]

stamps = {f: digest(f) for f in FILES if os.path.exists(os.path.join(ROOT, f))}
for page in glob.glob(os.path.join(ROOT, "*.html")):
    with open(page) as f:
        html = f.read()
    for f, v in stamps.items():
        html = re.sub(r'(["\'])' + re.escape(f) + r'(\?v=[0-9a-f]+)?\1',
                      lambda m, f=f, v=v: m.group(1) + f + "?v=" + v + m.group(1), html)
    with open(page, "w") as f:
        f.write(html)
print("Stamped:", ", ".join(f"{k}={v}" for k, v in stamps.items()))
