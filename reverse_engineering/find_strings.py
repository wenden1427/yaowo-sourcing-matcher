"""Find all readable strings in desktop_server.pyc and search PYZ modules."""
import os, re

# Search the main pyc
pyc_path = "desktop_server.exe_extracted/desktop_server.pyc"
with open(pyc_path, "rb") as f:
    data = f.read()

# Find all UTF-8 strings (4+ chars)
strings = set()
for m in re.finditer(rb'[\x20-\x7e]{8,}', data):
    s = m.group().decode('ascii', errors='ignore')
    strings.add(s)

# Filter interesting ones
keywords = ["1688", "inquir", "chat", "msg", "message", "captcha", "ozon",
            "source", "clip", "match", "price", "weight", "size", "dim",
            "alibaba", "seller", "shop", "product", "search", "image",
            "crawl", "scrap", "browser", "driver", "chrome", "http"]
for s in sorted(strings):
    if any(kw in s.lower() for kw in keywords):
        print(f"  {s[:120]}")

# Also list all PYZ modules with interesting names
print("\n=== PYZ MODULES ===")
pyz_dir = "desktop_server.exe_extracted/PYZ.pyz_extracted"
for root, dirs, files in os.walk(pyz_dir):
    for fn in files:
        if fn.endswith('.pyc'):
            path = os.path.join(root, fn)
            rel = os.path.relpath(path, pyz_dir)
            if any(kw in rel.lower() for kw in ["1688","ozon","alibaba","inquir","captcha","chat","message","query","source","match","image","product","shop","seller","crawl","scrap","browser"]):
                print(f"  {rel}")
