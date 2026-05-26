#!/usr/bin/env python3
"""Parse SEO report Markdown for ntfy summary and HTML email."""
from __future__ import annotations

import html
import os
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


def _section_table_rows(lines: list[str], heading: str, max_rows: int = 3) -> list[str]:
    """Extract first column pairs from markdown tables in a section."""
    chunk = _section_slice(lines, heading)
    if not chunk:
        return []
    out: list[str] = []
    for tbl in _extract_md_tables(chunk):
        if len(tbl) < 3:
            continue
        for row_line in tbl[2:]:
            if not row_line.strip().startswith("|"):
                continue
            cells = [c.strip() for c in row_line.strip("|").split("|")]
            if not cells or cells[0] in ("---", "负责", "现象", "优先级", "状态", "指标"):
                continue
            if len(cells) >= 2:
                text = f"{cells[0]}：{_strip_md(cells[1])[:100]}"
            else:
                text = _strip_md(cells[0])[:100]
            if text not in out:
                out.append(text)
            if len(out) >= max_rows:
                return out
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

    for row in _section_table_rows(lines, "一、今日结论", max_rows=2):
        if row.startswith("P0") and row not in out:
            out.append(row[:100])

    for heading in ("四、优化方向",):
        if len(out) >= max_lines - 2:
            break
        for row in _section_table_rows(lines, heading, max_rows=1):
            if row not in out and not row.startswith("⚠"):
                out.append(row[:120])

    for heading in ("三、为什么会这样",):
        if len(out) >= max_lines - 2:
            break
        for row in _section_table_rows(lines, heading, max_rows=1):
            if row not in out and not row.startswith("⚠"):
                out.append(row[:120])

    for heading in ("六、待办清单", "今天一件事", "待办"):
        if len(out) >= max_lines:
            break
        for row in _section_table_rows(lines, heading, max_rows=2):
            if row not in out:
                out.append(row[:100])
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
    th = "".join(
        f'<th style="border:1px solid #ddd;padding:6px 8px;text-align:left">{html.escape(c)}</th>'
        for c in header
    )
    trs = []
    for row in body_rows:
        tds = "".join(
            f'<td style="border:1px solid #ddd;padding:6px 8px;vertical-align:top">{html.escape(c)}</td>'
            for c in row
        )
        trs.append(f"<tr>{tds}</tr>")
    return (
        '<table style="border-collapse:collapse;width:100%;max-width:640px;font-size:13px;'
        'border:1px solid #ddd;margin:8px 0">'
        f"<thead><tr style='background:#f6f8fa'>{th}</tr></thead>"
        f"<tbody>{''.join(trs)}</tbody></table>"
    )


def _find_section(lines: list[str], heading: str) -> tuple[int, int]:
    """Return [start, end) line indices for ## heading (exact substring match)."""
    start = end = -1
    for i, raw in enumerate(lines):
        line = raw.strip()
        if line.startswith("## ") and heading in line:
            start = i
            continue
        if start >= 0 and line.startswith("## ") and heading not in line:
            end = i
            break
    if start >= 0 and end < 0:
        end = len(lines)
    return start, end


def _section_slice(lines: list[str], heading: str) -> list[str]:
    start, end = _find_section(lines, heading)
    if start < 0:
        return []
    return lines[start:end]


def _extract_md_tables(chunk: list[str]) -> list[list[str]]:
    """Split section lines into one or more markdown table line groups."""
    groups: list[list[str]] = []
    current: list[str] = []
    for raw in chunk[1:]:
        line = raw.strip()
        if line.startswith("|"):
            current.append(line)
            continue
        if current:
            groups.append(current)
            current = []
    if current:
        groups.append(current)
    return [g for g in groups if len(g) >= 2]


def email_digest(path: Path) -> str:
    """Short email: conclusion + why + GSC + todos only (no empty §2 tables)."""
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
        'Helvetica,Arial,sans-serif;color:#1a1a1a;max-width:560px;line-height:1.55">'
    )
    parts.append(
        f'<p style="margin:0 0 12px;color:#666;font-size:13px">'
        f'<a href="{html.escape(site)}">{html.escape(site)}</a> · 摘要（完整版在 GitHub 仓库）</p>'
    )

    title = _strip_md(lines[0].lstrip("# ").strip()) if lines else "SEO 报告"
    parts.append(f'<h1 style="font-size:20px;margin:0 0 16px">{html.escape(title)}</h1>')

    for heading in ("一、今日结论", "30 秒结论", "1. 本周数据摘要"):
        chunk = _section_slice(lines, heading)
        if not chunk:
            continue
        # Render subsection without re-adding h2 title for weekly "1."
        inner = email_html_from_lines(chunk[1:], skip_h2=True)
        parts.append(inner)
        break

    for heading in ("三、为什么会这样", "本期洞察"):
        chunk = _section_slice(lines, heading)
        if chunk:
            for tbl_lines in _extract_md_tables(chunk):
                parts.append('<h2 style="font-size:15px;margin:20px 0 8px">要点</h2>')
                parts.append(
                    f'<div style="margin:8px 0;overflow-x:auto">{_md_table_to_html(tbl_lines)}</div>'
                )
                break
        break

    gsc = _section_slice(lines, "五、Google 搜索")
    if gsc:
        parts.append('<h2 style="font-size:15px;margin:20px 0 8px">Google 搜索</h2>')
        tables = _extract_md_tables(gsc)
        for tbl_lines in tables[:2]:
            parts.append(
                f'<div style="margin:8px 0;overflow-x:auto">{_md_table_to_html(tbl_lines)}</div>'
            )

    todos = _section_slice(lines, "六、待办清单")
    if not todos:
        todos = _section_slice(lines, "下一步建议")
    if todos:
        tbl_groups = _extract_md_tables(todos)
        if tbl_groups:
            parts.append('<h2 style="font-size:15px;margin:20px 0 8px">待办</h2>')
            parts.append(
                f'<div style="margin:8px 0;overflow-x:auto">{_md_table_to_html(tbl_groups[0])}</div>'
            )
        else:
            items = []
            for raw in todos[1:]:
                line = raw.strip()
                if line.startswith("- "):
                    items.append(line[2:])
                if len(items) >= 3:
                    break
            if items:
                parts.append('<h2 style="font-size:15px;margin:20px 0 8px">待办</h2>')
                parts.append(
                    "<ul style='margin:0;padding-left:18px;font-size:14px'>"
                    + "".join(f"<li>{html.escape(_strip_md(x))}</li>" for x in items)
                    + "</ul>"
                )

    parts.append(
        '<p style="margin-top:20px;font-size:12px;color:#888">'
        "明细表、渠道/国家维度见仓库 "
        "<code>docs/seo/reports/</code> · GitHub Actions 自动发送</p></div>"
    )
    return "".join(parts)


def email_html_from_lines(lines: list[str], skip_h2: bool = False) -> str:
    """Render markdown fragment to HTML (used by full email and digest)."""
    parts: list[str] = []
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.strip()

        if line.startswith("## ") and skip_h2:
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

        if line.startswith("- "):
            items = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                items.append(f"<li>{html.escape(_strip_md(lines[i].strip()[2:]))}</li>")
                i += 1
            parts.append(f'<ul style="margin:8px 0;padding-left:20px">{"".join(items)}</ul>')
            continue

        if line in ("---", "***"):
            i += 1
            continue

        if line.startswith(">"):
            parts.append(
                f'<p style="margin:8px 0;font-size:13px;color:#555">{html.escape(_strip_md(line.lstrip("> ")))}</p>'
            )
            i += 1
            continue

        if line and not line.startswith("#"):
            parts.append(f"<p style='margin:8px 0;font-size:14px'>{html.escape(_strip_md(line))}</p>")
        i += 1
    return "".join(parts)


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

    if line := (lines[0].strip() if lines else ""):
        if line.startswith("# "):
            parts.append(
                f'<h1 style="font-size:22px;margin:0 0 12px;border-bottom:2px solid #e8e8e8;'
                f'padding-bottom:8px">{html.escape(_strip_md(line[2:]))}</h1>'
            )

    parts.append(email_html_from_lines(lines[1:]))
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
        use_digest = os.environ.get("SEO_EMAIL_DIGEST", "1") != "0"
        print(email_digest(path) if use_digest else email_html(path))
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
