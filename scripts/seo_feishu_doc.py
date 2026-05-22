#!/usr/bin/env python3
"""将 Markdown 日报发布到飞书云文档（每日新建一篇）。"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
LINKS_FILE = ROOT / "docs" / "seo" / "feishu-links.json"
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


def append_markdown(token: str, doc_id: str, md: str) -> None:
    """按段落写入文档（简化：每段一个 text block）。"""
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    chunks = [c.strip() for c in md.split("\n\n") if c.strip()]
    children = []
    for chunk in chunks[:80]:
        text = chunk[:2000]
        children.append(
            {
                "block_type": 2,
                "text": {"elements": [{"text_run": {"content": text + "\n"}}]},
            }
        )
    if not children:
        return
    r = requests.post(
        f"{API}/docx/v1/documents/{doc_id}/blocks/{doc_id}/children",
        headers=headers,
        json={"children": children, "index": 0},
        timeout=60,
    )
    r.raise_for_status()
    data = r.json()
    if data.get("code") != 0:
        raise RuntimeError(data)


def save_link(date: str, doc_id: str, title: str) -> str:
    url = f"https://feishu.cn/docx/{doc_id}"
    links = {}
    if LINKS_FILE.is_file():
        links = json.loads(LINKS_FILE.read_text(encoding="utf-8"))
    links[date] = {"document_id": doc_id, "title": title, "url": url}
    LINKS_FILE.parent.mkdir(parents=True, exist_ok=True)
    LINKS_FILE.write_text(json.dumps(links, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return url


def main() -> int:
    if len(sys.argv) < 2:
        print("用法: seo_feishu_doc.py path/to/report.md", file=sys.stderr)
        return 1
    report_path = Path(sys.argv[1])
    if not report_path.is_file():
        print(f"找不到 {report_path}", file=sys.stderr)
        return 1

    folder = cfg("FEISHU_FOLDER_TOKEN")
    if not folder:
        print("ℹ 未配置 FEISHU_FOLDER_TOKEN，跳过飞书（见 docs/seo/FEISHU_SETUP.md）")
        return 0

    md = report_path.read_text(encoding="utf-8")
    date = report_path.stem
    title = f"Yakushima Bus 日报 {date}"

    token = tenant_token()
    doc_id = create_doc(token, title, folder)
    append_markdown(token, doc_id, md)
    url = save_link(date, doc_id, title)
    print(f"✓ Feishu doc: {url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
