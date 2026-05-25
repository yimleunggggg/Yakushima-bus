#!/usr/bin/env python3
"""Parse SEO report Markdown for ntfy summary and HTML email."""
from __future__ import annotations

import html
import re
import sys
from pathlib import Path


def _strip_md(text: str) -> str:
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    t = re.sub(r"`([^`]+)`", r"\1", t)
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
    return t.strip()


def _lines(path: Path) -> list[str]:
    return path.read_text(encoding="utf-8").splitlines()


def _section_lines(lines: list[str], heading: str, max_items: int = 4) -> list[str]:
    out: list[str] = []
    capture = False
    for raw in lines:
        line = raw.strip()
        if line.startswith("## ") and heading in line:
            capture = True
            continue
        if capture and (line.startswith("## ") or line == "---"):
            break
        if not capture:
            continue
        if line.startswith("|") or not line or line.startswith(">"):
            continue
        if line.startswith("- "):
            out.append(_strip_md(line[2:])[:130])
        elif not line.startswith("#"):
            out.append(_strip_md(line)[:130])
        if len(out) >= max_items:
            break
    return out


def ntfy_summary(path: Path, max_lines: int = 10) -> str:
    lines = _lines(path)
    out: list[str] = []
    title = _strip_md(lines[0].lstrip("# ").strip()) if lines else "SEO 报告"
    out.append(title[:80])

    for heading in ("一、今日结论", "30 秒结论", "摘要"):
        chunk = _section_lines(lines, heading, max_items=3)
        for c in chunk:
            if c not in out:
                out.append(c)
        if len(out) >= 4:
            break

    for heading in ("三、为什么会这样",):
        if len(out) >= max_lines - 2:
            break
        chunk = _section_lines(lines, heading, max_items=1)
        for c in chunk:
            if c not in out and not c.startswith("⚠"):
                out.append(c[:120])

    for heading in ("本周优先", "四、优化方向"):
        if len(out) >= max_lines - 1:
            break
        capture = False
        for raw in lines:
            line = raw.strip()
            if line.startswith("## ") and heading in line:
                capture = True
                continue
            if capture and line.startswith("## "):
                break
            if capture and line.startswith("|") and "P0" in line:
                cells = [c.strip() for c in line.strip("|").split("|")]
                if len(cells) >= 3 and cells[0] not in ("领域", "---"):
                    out.append(f"[{cells[2]}] {cells[0]}: {_strip_md(cells[1])[:80]}")
                    break

    seen: set[str] = set()
    for heading in ("六、待办清单", "今天一件事", "待办"):
        if len(out) >= max_lines:
            break
        chunk = _section_lines(lines, heading, max_items=2)
        for c in chunk:
            text = _strip_md(c.lstrip("👤 ").lstrip("⏳ ").lstrip("🤖 "))
            if text in seen:
                continue
            seen.add(text)
            out.append(text[:100])
            if len(out) >= max_lines:
                break

    if len(out) < 3:
        for raw in lines:
            if raw.strip().startswith("- **"):
                out.append(_strip_md(raw.strip().lstrip("- "))[:120])
            if len(out) >= max_lines:
                break

    if len(out) < 2:
        out.append("详见 docs/seo/reports/daily/")

    return "\n".join(out[:max_lines])


def _md_table_to_html(rows: list[str]) -> str:
    if len(rows) < 2:
        return ""

    def split_row(r: str) -> list[str]:
        return [c.strip() for c in r.strip("|").split("|")]

    header = split_row(rows[0])
    body_rows = [split_row(r) for r in rows[2:] if r.strip().startswith("|")]
    th = "".join(f"<th>{html.escape(c)}</th>" for c in header)
    trs = []
    for row in body_rows:
        tds = "".join(f"<td>{html.escape(c)}</td>" for c in row)
        trs.append(f"<tr>{tds}</tr>")
    return (
        '<table style="border-collapse:collapse;width:100%;max-width:640px;font-size:14px">'
        f"<thead><tr>{th}</tr></thead><tbody>{''.join(trs)}</tbody></table>"
    )


def email_html(path: Path) -> str:
    lines = _lines(path)
    parts: list[str] = []
    site = "https://yakushimabus.com"
    for raw in lines[:5]:
        if "yakushimabus" in raw:
            m = re.search(r"https?://[^\s·]+", raw)
            if m:
                site = m.group(0)
            break

    parts.append(
        '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,'
        'Helvetica,Arial,sans-serif;color:#1a1a1a;max-width:680px;line-height:1.55">'
    )
    parts.append(
        f'<p style="margin:0 0 16px;color:#666;font-size:13px">'
        f'<a href="{html.escape(site)}">{html.escape(site)}</a> · SEO 自动报告</p>'
    )

    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.strip()

        if line.startswith("# "):
            parts.append(
                f'<h1 style="font-size:22px;margin:0 0 12px;border-bottom:2px solid #e8e8e8;'
                f'padding-bottom:8px">{html.escape(_strip_md(line[2:]))}</h1>'
            )
            i += 1
            continue

        if line.startswith("## "):
            parts.append(
                f'<h2 style="font-size:17px;margin:24px 0 10px;color:#333">'
                f'{html.escape(_strip_md(line[3:]))}</h2>'
            )
            i += 1
            continue

        if line.startswith("### "):
            parts.append(
                f'<h3 style="font-size:15px;margin:16px 0 8px;color:#444">'
                f'{html.escape(_strip_md(line[4:]))}</h3>'
            )
            i += 1
            continue

        if line.startswith("|") and i + 1 < len(lines) and lines[i + 1].strip().startswith("|"):
            table_lines = [line]
            i += 1
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            tbl = _md_table_to_html(table_lines)
            if tbl:
                parts.append(f'<div style="margin:12px 0;overflow-x:auto">{tbl}</div>')
            continue

        if line.startswith("```"):
            block = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                block.append(lines[i])
                i += 1
            i += 1
            pre = html.escape("\n".join(block))
            parts.append(
                f'<pre style="background:#f6f8fa;padding:12px;border-radius:6px;'
                f'font-size:12px;overflow-x:auto">{pre}</pre>'
            )
            continue

        if line.startswith("- "):
            items = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                items.append(f"<li>{html.escape(_strip_md(lines[i].strip()[2:]))}</li>")
                i += 1
            parts.append(f'<ul style="margin:8px 0;padding-left:20px">{"".join(items)}</ul>')
            continue

        if line in ("---", "***"):
            parts.append('<hr style="border:none;border-top:1px solid #eee;margin:20px 0">')
            i += 1
            continue

        if line.startswith(">"):
            parts.append(
                f'<p style="margin:8px 0;font-size:13px;color:#555">{html.escape(_strip_md(line.lstrip("> ")))}</p>'
            )
            i += 1
            continue

        if line:
            parts.append(f"<p style='margin:8px 0'>{html.escape(_strip_md(line))}</p>")
        i += 1

    parts.append(
        '<p style="margin-top:24px;font-size:12px;color:#888">'
        "完整报告见仓库 docs/seo/reports/ · 由 GitHub Actions 自动发送</p></div>"
    )
    return "".join(parts)


def main() -> None:
    if len(sys.argv) < 3:
        print("usage: seo_notify_format.py ntfy|html PATH", file=sys.stderr)
        sys.exit(1)
    path = Path(sys.argv[2])
    if not path.is_file():
        sys.exit(1)
    mode = sys.argv[1]
    if mode == "ntfy":
        print(ntfy_summary(path))
    elif mode == "html":
        print(email_html(path))
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
