#!/usr/bin/env python3
"""飞书「SEO 优化追踪」长文档：init / sync-full / checkpoint（日报后追加）。"""
from __future__ import annotations

import json
import os
import re
import sys
from datetime import date
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
JOURNAL_MD = ROOT / "docs/seo/SEO-JOURNAL.md"
JOURNAL_META = ROOT / "docs/seo/feishu-journal.json"
API = "https://open.feishu.cn/open-apis"


def cfg(name: str) -> str:
    return os.environ.get(name, "").strip()


def tenant_token() -> str:
    app_id = cfg("FEISHU_APP_ID")
    app_secret = cfg("FEISHU_APP_SECRET")
    if not app_id or not app_secret:
        raise RuntimeError("缺少 FEISHU_APP_ID / FEISHU_APP_SECRET")
    r = requests.post(
        f"{API}/auth/v3/tenant_access_token/internal",
        json={"app_id": app_id, "app_secret": app_secret},
        timeout=30,
    )
    r.raise_for_status()
    data = r.json()
    if data.get("code") != 0:
        raise RuntimeError(data)
    return data["tenant_access_token"]


def load_meta() -> dict:
    if JOURNAL_META.is_file():
        return json.loads(JOURNAL_META.read_text(encoding="utf-8"))
    return {}


def save_meta(meta: dict) -> None:
    JOURNAL_META.parent.mkdir(parents=True, exist_ok=True)
    JOURNAL_META.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def create_doc(token: str, title: str, folder_token: str) -> str:
    r = requests.post(
        f"{API}/docx/v1/documents",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": title, "folder_token": folder_token},
        timeout=30,
    )
    r.raise_for_status()
    data = r.json()
    if data.get("code") != 0:
        raise RuntimeError(data)
    return data["data"]["document"]["document_id"]


def md_to_blocks(md: str, limit: int = 100) -> list[dict]:
    chunks = [c.strip() for c in md.split("\n\n") if c.strip()]
    children = []
    for chunk in chunks[:limit]:
        text = chunk[:2000]
        children.append(
            {
                "block_type": 2,
                "text": {"elements": [{"text_run": {"content": text + "\n"}}]},
            }
        )
    return children


def prepend_blocks(token: str, doc_id: str, md: str) -> None:
    children = md_to_blocks(md)
    if not children:
        return
    r = requests.post(
        f"{API}/docx/v1/documents/{doc_id}/blocks/{doc_id}/children",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"children": children, "index": 0},
        timeout=60,
    )
    r.raise_for_status()
    data = r.json()
    if data.get("code") != 0:
        raise RuntimeError(data)


def doc_id_from_env_or_file() -> str | None:
    explicit = cfg("FEISHU_JOURNAL_DOC_ID")
    if explicit:
        return explicit
    meta = load_meta()
    return meta.get("document_id")


def ensure_doc(token: str) -> tuple[str, str]:
    doc_id = doc_id_from_env_or_file()
    title = "YakuBus SEO 优化追踪"
    if doc_id:
        url = f"https://feishu.cn/docx/{doc_id}"
        return doc_id, url

    folder = cfg("FEISHU_FOLDER_TOKEN")
    if not folder:
        raise RuntimeError("缺少 FEISHU_FOLDER_TOKEN 或 FEISHU_JOURNAL_DOC_ID")
    doc_id = create_doc(token, title, folder)
    url = f"https://feishu.cn/docx/{doc_id}"
    save_meta({"document_id": doc_id, "title": title, "url": url})
    return doc_id, url


def cmd_init() -> int:
    if not JOURNAL_MD.is_file():
        print(f"找不到 {JOURNAL_MD}", file=sys.stderr)
        return 1
    folder = cfg("FEISHU_FOLDER_TOKEN")
    if not folder and not cfg("FEISHU_JOURNAL_DOC_ID"):
        print("ℹ 未配置飞书，跳过（见 docs/seo/FEISHU_SETUP.md）")
        return 0
    token = tenant_token()
    doc_id, url = ensure_doc(token)
    if not load_meta().get("initialized"):
        prepend_blocks(token, doc_id, JOURNAL_MD.read_text(encoding="utf-8"))
        meta = load_meta()
        meta["initialized"] = True
        meta["document_id"] = doc_id
        meta["url"] = url
        save_meta(meta)
        print(f"✓ 飞书追踪文档已初始化: {url}")
    else:
        print(f"ℹ 已存在: {url}")
    return 0


def cmd_sync_full() -> int:
    if not JOURNAL_MD.is_file():
        return 1
    folder = cfg("FEISHU_FOLDER_TOKEN")
    if not folder and not cfg("FEISHU_JOURNAL_DOC_ID"):
        print("ℹ 未配置飞书，跳过")
        return 0
    token = tenant_token()
    doc_id, url = ensure_doc(token)
    prepend_blocks(
        token,
        doc_id,
        f"---\n\n## Git 全量同步 · {date.today().isoformat()}\n\n"
        + JOURNAL_MD.read_text(encoding="utf-8")[:12000],
    )
    print(f"✓ 已同步到飞书（prepend）: {url}")
    return 0


def _extract_summary(report_path: Path) -> str:
    text = report_path.read_text(encoding="utf-8")
    title = text.splitlines()[0].lstrip("# ").strip() if text else "日报"
    conclusion = ""
    for i, line in enumerate(text.splitlines()):
        if "一、今日结论" in line or "30 秒结论" in line:
            for j in range(i + 1, min(i + 8, len(text.splitlines()))):
                ln = text.splitlines()[j].strip()
                if ln.startswith("## ") or ln == "---":
                    break
                if ln and not ln.startswith("|") and not ln.startswith(">"):
                    conclusion = ln
                    break
            break
    return title, conclusion


def cmd_checkpoint(report_path: Path) -> int:
    if not report_path.is_file():
        return 1
    if not cfg("FEISHU_FOLDER_TOKEN") and not cfg("FEISHU_JOURNAL_DOC_ID"):
        return 0
    token = tenant_token()
    doc_id, url = ensure_doc(token)
    title, conclusion = _extract_summary(report_path)
    block = (
        f"## 📊 {date.today().isoformat()} 快照\n\n"
        f"来源：{title}\n\n"
        f"{conclusion or '（见 Git 日报）'}\n\n"
        f"Git：`docs/seo/reports/daily/{report_path.stem}.md`\n"
    )
    prepend_blocks(token, doc_id, block)
    print(f"✓ 飞书追踪已追加快照: {url}")
    return 0


def append_journal_table_row(metrics_path: Path) -> None:
    """在 SEO-JOURNAL.md 效果表追加一行（若当日不存在）。"""
    if not JOURNAL_MD.is_file() or not metrics_path.is_file():
        return
    today = date.today().isoformat()
    md = JOURNAL_MD.read_text(encoding="utf-8")
    if f"| {today} |" in md:
        return
    d = json.loads(metrics_path.read_text(encoding="utf-8"))
    gs = d.get("gsc_28d") or d.get("gsc") or {}
    g = d.get("ga4_daily") or {}
    l7 = g.get("last_7d") or {}
    imp = gs.get("impressions", "—") if not gs.get("error") else "err"
    clk = gs.get("clicks", "—") if not gs.get("error") else "—"
    pos = gs.get("position", "—") if not gs.get("error") else "—"
    users = l7.get("active_users", "—")
    row = f"| {today} | {imp} | {clk} | {pos} | {users} | — | Actions 自动 |"
    anchor = "| 日期 | GSC 展示"
    if anchor not in md:
        return
    idx = md.index(anchor)
    tail = md[idx:].splitlines()
    for i, line in enumerate(tail):
        if line.startswith("|------"):
            tail.insert(i + 1, row)
            break
    JOURNAL_MD.write_text(md[:idx] + "\n".join(tail), encoding="utf-8")


def main() -> int:
    if len(sys.argv) < 2:
        print(
            "用法: seo_feishu_journal.py init|sync-full|checkpoint [report.md]",
            file=sys.stderr,
        )
        return 1
    cmd = sys.argv[1]
    if cmd == "init":
        return cmd_init()
    if cmd == "sync-full":
        return cmd_sync_full()
    if cmd == "checkpoint":
        rp = Path(sys.argv[2]) if len(sys.argv) > 2 else None
        if not rp:
            print("checkpoint 需要 report.md 路径", file=sys.stderr)
            return 1
        mp = ROOT / "docs/seo/metrics/daily-latest.json"
        append_journal_table_row(mp)
        return cmd_checkpoint(rp)
    return 1


if __name__ == "__main__":
    sys.exit(main())
