import os

for root, dirs, files in os.walk(r"E:/"):
    for fn in files:
        if fn == "config.yaml":
            path = os.path.join(root, fn)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                if "hfsyapi_key" in content or "hfsyapi" in content:
                    print("=== " + path + " ===")
                    print(content[:500])
                    print()
            except:
                pass
