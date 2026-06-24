"""Static analysis helper for Cython-built .pyd modules.

The script is intentionally read-only: it parses PE metadata and extracts
printable strings from extension modules without importing or executing them.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

import pefile

try:
    from capstone import Cs, CS_ARCH_X86, CS_MODE_64
except Exception:  # pragma: no cover - optional dependency
    Cs = None
    CS_ARCH_X86 = 0
    CS_MODE_64 = 0


DEFAULT_KEYWORDS = [
    "1688",
    "source",
    "stage",
    "image",
    "clip",
    "vector",
    "ocr",
    "sku",
    "offer",
    "detail",
    "freight",
    "dimension",
    "weight",
    "similar",
    "captcha",
    "slider",
    "login",
    "cookie",
    "prompt",
    "queue",
    "excel",
    "api",
    "seller",
    "price",
    "variant",
    "inquiry",
    "reply",
    "listing",
    "profit",
    "store",
    "task",
    "status",
    "货源",
    "询盘",
    "回盘",
    "尺寸",
    "重量",
    "利润",
    "上架",
    "运费",
]


NOISE_PREFIXES = (
    "Py",
    "_Py",
    "__pyx_kp_",
    "__pyx_n_s_",
    "__pyx_vtab",
    "api-ms-win",
    "VCRUNTIME",
    "KERNEL32",
)


def extract_ascii_strings(raw: bytes, min_len: int = 6) -> list[str]:
    pattern = rb"[ -~]{" + str(min_len).encode("ascii") + rb",}"
    return [m.group().decode("latin1", "ignore") for m in re.finditer(pattern, raw)]


def extract_utf16le_strings(raw: bytes, min_len: int = 4) -> list[str]:
    out: list[str] = []
    current: list[int] = []
    for i in range(0, len(raw) - 1, 2):
        code = raw[i] | (raw[i + 1] << 8)
        if code in (9, 10, 13) or 32 <= code <= 0xD7FF or 0xE000 <= code <= 0xFFFD:
            current.append(code)
        else:
            if len(current) >= min_len:
                text = "".join(chr(c) for c in current)
                if is_useful_text(text):
                    out.append(text)
            current = []
    if len(current) >= min_len:
        text = "".join(chr(c) for c in current)
        if is_useful_text(text):
            out.append(text)
    return out


def extract_utf8_text_runs(raw: bytes, min_len: int = 4) -> list[str]:
    decoded = raw.decode("utf-8", "ignore")
    runs: list[str] = []
    current: list[str] = []
    for ch in decoded:
        code = ord(ch)
        keep = ch in "\t\r\n" or 32 <= code <= 126 or "\u4e00" <= ch <= "\u9fff"
        if keep:
            current.append(ch)
        else:
            if len(current) >= min_len:
                text = "".join(current).strip()
                if is_useful_text(text):
                    runs.append(text)
            current = []
    if len(current) >= min_len:
        text = "".join(current).strip()
        if is_useful_text(text):
            runs.append(text)
    return runs


def is_useful_text(text: str) -> bool:
    compact = text.strip()
    if len(compact) < 4:
        return False
    printable = sum(1 for ch in compact if ch.isprintable())
    return printable / max(1, len(compact)) > 0.85


def classify_string(text: str) -> str | None:
    lower = text.lower()
    if text.startswith("services.") or text.startswith("core.") or text.startswith("dao."):
        return "cython_symbol"
    if re.search(r"^[A-Za-z_][A-Za-z0-9_]{5,}$", text):
        if text.startswith(NOISE_PREFIXES):
            return None
        return "identifier"
    if re.search(r"/(api|task|auth|auto|ai-|settings|logs|health)", text):
        return "api_path"
    if re.search(r"create|insert|update|select|source_1688|good_sku|auto_listing|onebound|queue|status", lower):
        return "db_or_state"
    if any(keyword.lower() in lower for keyword in DEFAULT_KEYWORDS if keyword.isascii()):
        return "business_keyword"
    if any(keyword in text for keyword in DEFAULT_KEYWORDS if not keyword.isascii()):
        return "business_keyword"
    return None


def get_section_bytes(pe: pefile.PE, raw: bytes, section_name: str) -> tuple[int, bytes]:
    for section in pe.sections:
        name = section.Name.rstrip(b"\0").decode("ascii", "ignore")
        if name == section_name:
            start = section.PointerToRawData
            end = start + section.SizeOfRawData
            return section.VirtualAddress, raw[start:end]
    return 0, b""


def disassemble_export(pe: pefile.PE, raw: bytes, export_name: str, count: int = 40) -> list[str]:
    if Cs is None:
        return []
    if not hasattr(pe, "DIRECTORY_ENTRY_EXPORT"):
        return []
    target_rva = None
    for symbol in pe.DIRECTORY_ENTRY_EXPORT.symbols:
        name = symbol.name.decode("utf-8", "ignore") if symbol.name else ""
        if name == export_name:
            target_rva = symbol.address
            break
    if target_rva is None:
        return []

    offset = pe.get_offset_from_rva(target_rva)
    chunk = raw[offset : offset + 512]
    md = Cs(CS_ARCH_X86, CS_MODE_64)
    lines = []
    image_base = pe.OPTIONAL_HEADER.ImageBase
    for idx, insn in enumerate(md.disasm(chunk, image_base + target_rva)):
        if idx >= count:
            break
        lines.append(f"0x{insn.address:x}: {insn.mnemonic} {insn.op_str}".rstrip())
    return lines


def analyze_pyd(path: Path, keywords: list[str]) -> dict[str, Any]:
    raw = path.read_bytes()
    pe = pefile.PE(str(path), fast_load=False)

    exports: list[str] = []
    if hasattr(pe, "DIRECTORY_ENTRY_EXPORT"):
        for symbol in pe.DIRECTORY_ENTRY_EXPORT.symbols:
            if symbol.name:
                exports.append(symbol.name.decode("utf-8", "ignore"))

    imports: dict[str, list[str]] = {}
    if hasattr(pe, "DIRECTORY_ENTRY_IMPORT"):
        for entry in pe.DIRECTORY_ENTRY_IMPORT:
            names = []
            for symbol in entry.imports:
                if symbol.name:
                    names.append(symbol.name.decode("utf-8", "ignore"))
            imports[entry.dll.decode("utf-8", "ignore")] = names[:40]

    strings = set(extract_ascii_strings(raw))
    strings.update(extract_utf16le_strings(raw))
    strings.update(extract_utf8_text_runs(raw))

    grouped: dict[str, list[str]] = defaultdict(list)
    keyword_pattern = re.compile("|".join(re.escape(k) for k in keywords), re.I)
    for text in sorted(strings):
        category = classify_string(text)
        if category:
            grouped[category].append(text)
        elif keyword_pattern.search(text):
            grouped["business_keyword"].append(text)

    for category in list(grouped):
        grouped[category] = sorted(set(grouped[category]))[:300]

    module_name = path.name.split(".cp", 1)[0]
    export_name = f"PyInit_{module_name}"
    return {
        "path": str(path),
        "name": path.name,
        "size": path.stat().st_size,
        "machine": hex(pe.FILE_HEADER.Machine),
        "entry_point_rva": hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint),
        "sections": [
            {
                "name": s.Name.rstrip(b"\0").decode("ascii", "ignore"),
                "raw_size": s.SizeOfRawData,
                "virtual_size": s.Misc_VirtualSize,
                "characteristics": hex(s.Characteristics),
            }
            for s in pe.sections
        ],
        "exports": exports,
        "imports": imports,
        "strings": grouped,
        "pyinit_disassembly": disassemble_export(pe, raw, export_name),
    }


def render_markdown(results: list[dict[str, Any]]) -> str:
    lines = [
        "# Hazel .pyd 静态分析报告",
        "",
        "说明：本报告只做静态读取，不导入、不运行目标 `.pyd` 模块。Cython 编译产物无法直接还原原始 Python 源码；这里用于恢复模块职责、接口、状态字段和业务流程。",
        "",
        "## 模块总览",
        "",
        "| 模块 | 大小 | 导出 | 业务字符串数 | 识别符数 |",
        "|---|---:|---|---:|---:|",
    ]
    for item in results:
        strings = item.get("strings", {})
        business_count = len(strings.get("business_keyword", []))
        ident_count = len(strings.get("identifier", [])) + len(strings.get("cython_symbol", []))
        exports = ", ".join(item.get("exports", [])[:3]) or "-"
        lines.append(f"| `{item['name']}` | {item['size']} | `{exports}` | {business_count} | {ident_count} |")

    for item in results:
        lines.extend(["", f"## {item['name']}", ""])
        lines.append(f"- 文件：`{item['path']}`")
        lines.append(f"- 大小：{item['size']} bytes")
        lines.append(f"- 入口 RVA：`{item['entry_point_rva']}`")
        lines.append(f"- 导出：{', '.join(f'`{e}`' for e in item.get('exports', [])) or '-'}")
        lines.append("")
        lines.append("### Sections")
        lines.append("")
        lines.append("| 名称 | Raw | Virtual | Characteristics |")
        lines.append("|---|---:|---:|---|")
        for section in item.get("sections", []):
            lines.append(
                f"| `{section['name']}` | {section['raw_size']} | {section['virtual_size']} | `{section['characteristics']}` |"
            )
        lines.append("")
        lines.append("### Imports")
        lines.append("")
        for dll, names in item.get("imports", {}).items():
            preview = ", ".join(f"`{name}`" for name in names[:12])
            lines.append(f"- `{dll}`：{preview}")

        strings = item.get("strings", {})
        for category, title in [
            ("api_path", "API 路径"),
            ("db_or_state", "数据库/状态线索"),
            ("business_keyword", "业务关键词字符串"),
            ("identifier", "可见函数/变量名"),
            ("cython_symbol", "Cython 符号"),
        ]:
            values = strings.get(category, [])
            if not values:
                continue
            lines.extend(["", f"### {title}", ""])
            for value in values[:80]:
                safe = value.replace("\n", "\\n")
                lines.append(f"- `{safe[:240]}`")

        disassembly = item.get("pyinit_disassembly", [])
        if disassembly:
            lines.extend(["", "### PyInit 反汇编片段", "", "```asm"])
            lines.extend(disassembly[:40])
            lines.append("```")

    lines.append("")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("roots", nargs="+", help="Directories containing .pyd files")
    parser.add_argument("--glob", default="*.pyd", help="Glob pattern under root")
    parser.add_argument("--out-md", default="hazel_pyd_report.md")
    parser.add_argument("--out-json", default="hazel_pyd_report.json")
    parser.add_argument("--keyword", action="append", default=[])
    args = parser.parse_args()

    keywords = DEFAULT_KEYWORDS + list(args.keyword or [])
    paths: list[Path] = []
    for root_arg in args.roots:
      paths.extend(Path(root_arg).rglob(args.glob))
    paths = sorted(set(paths))
    results = [analyze_pyd(path, keywords) for path in paths]

    out_md = Path(args.out_md)
    out_json = Path(args.out_json)
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    out_md.write_text(render_markdown(results), encoding="utf-8")
    print(f"analyzed {len(results)} modules")
    print(f"markdown: {out_md}")
    print(f"json: {out_json}")


if __name__ == "__main__":
    main()
