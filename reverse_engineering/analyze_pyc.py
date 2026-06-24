"""Analyze desktop_server.pyc — list all functions, search for key strings."""
import dis, marshal, types, sys

pyc_path = "desktop_server.exe_extracted/desktop_server.pyc"

with open(pyc_path, "rb") as f:
    f.read(16)  # skip magic + flags
    code = marshal.load(f)

print("=== TOP-LEVEL NAMES ===")
for c in code.co_consts:
    if isinstance(c, types.CodeType):
        print(f"  {c.co_name}")

print(f"\n=== STRING CONSTANTS SEARCH ===")
keywords = ["1688", "询盘", "inquiry", "chat", "message", "尺寸", "重量", "captcha",
            "ozon", "aliexpress", "alibaba", "source", "match", "clip", "ocr"]
found = set()

def search_consts(co):
    for c in co.co_consts:
        if isinstance(c, types.CodeType):
            search_consts(c)
        elif isinstance(c, str):
            for kw in keywords:
                if kw.lower() in c.lower():
                    found.add(f"[{kw}] {c[:120]}")

search_consts(code)
for f in sorted(found):
    print(f"  {f}")

print(f"\n=== INSTRUCTION COUNT ===")
total = len(list(dis.get_instructions(code)))
print(f"  Total bytecode instructions: {total}")
