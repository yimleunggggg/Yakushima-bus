#!/usr/bin/env python3
"""飞书 Open API 公共方法（文档 / 表格共用）。"""
from __future__ import annotations

import json
import os
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
API = "https://open.feishu.cn/open-apis"
SHEET_META = ROOT / "docs/seo/feishu-sheet.json"


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


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def api_json(method: str, path: str, token: str, **kwargs) -> dict:
    r = requests.request(method, f"{API}{path}", headers=auth_headers(token), timeout=60, **kwargs)
    r.raise_for_status()
    data = r.json()
    if data.get("code") != 0:
        raise RuntimeError(data)
    return data


def load_sheet_meta() -> dict:
    if SHEET_META.is_file():
        return json.loads(SHEET_META.read_text(encoding="utf-8"))
    tok = cfg("FEISHU_SHEET_TOKEN")
    if tok:
        return {"spreadsheet_token": tok}
    return {}


def save_sheet_meta(meta: dict) -> None:
    SHEET_META.parent.mkdir(parents=True, exist_ok=True)
    SHEET_META.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def create_spreadsheet(token: str, title: str, folder_token: str) -> tuple[str, str]:
    data = api_json(
        "POST",
        "/sheets/v3/spreadsheets",
        token,
        json={"title": title, "folder_token": folder_token},
    )
    ss = data["data"]["spreadsheet"]
    return ss["spreadsheet_token"], ss.get("url") or f"https://feishu.cn/sheets/{ss['spreadsheet_token']}"


def ensure_sheet_tab(token: str, spreadsheet_token: str, title: str) -> None:
    data = api_json(
        "GET",
        f"/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/query",
        token,
    )
    titles = {s.get("title") for s in (data.get("data") or {}).get("sheets") or []}
    if title in titles:
        return
    api_json(
        "POST",
        f"/sheets/v2/spreadsheets/{spreadsheet_token}/sheets_batch_update",
        token,
        json={"requests": [{"addSheet": {"properties": {"title": title}}}]},
    )


def col_letter(n: int) -> str:
    """1-based column index → A, B, …, Z, AA, …"""
    s = ""
    while n > 0:
        n, r = divmod(n - 1, 26)
        s = chr(ord("A") + r) + s
    return s or "A"


def read_range(token: str, spreadsheet_token: str, sheet_title: str, end_col: str = "Z") -> list[list]:
    from urllib.parse import quote

    rng = quote(f"{sheet_title}!A1:{end_col}1000", safe="")
    try:
        data = api_json(
            "GET",
            f"/sheets/v2/spreadsheets/{spreadsheet_token}/values/{rng}",
            token,
        )
        return (data.get("data") or {}).get("valueRange", {}).get("values") or []
    except RuntimeError:
        return []


def write_range(token: str, spreadsheet_token: str, sheet_title: str, values: list[list]) -> None:
    if not values:
        return
    cols = max(len(r) for r in values)
    rows = len(values)
    end_col = col_letter(cols)
    old = read_range(token, spreadsheet_token, sheet_title, end_col)
    rng = f"{sheet_title}!A1:{end_col}{rows}"
    api_json(
        "PUT",
        f"/sheets/v2/spreadsheets/{spreadsheet_token}/values",
        token,
        json={"valueRange": {"range": rng, "values": values}},
    )
    if len(old) > rows:
        blank = [[""] * cols for _ in range(len(old) - rows)]
        clear_rng = f"{sheet_title}!A{rows + 1}:{end_col}{len(old)}"
        api_json(
            "PUT",
            f"/sheets/v2/spreadsheets/{spreadsheet_token}/values",
            token,
            json={"valueRange": {"range": clear_rng, "values": blank}},
        )


def resolve_spreadsheet_token(*, allow_create: bool = False) -> tuple[str, dict, str | None]:
    """返回 (token, meta, folder_token)。sync 时 allow_create=False，缺 token 则报错。"""
    meta = load_sheet_meta()
    ss_token = meta.get("spreadsheet_token") or cfg("FEISHU_SHEET_TOKEN")
    folder = cfg("FEISHU_FOLDER_TOKEN")
    if ss_token:
        return ss_token, meta, folder
    if allow_create and folder:
        return "", meta, folder
    raise RuntimeError(
        "未绑定数据表格。请先在飞书建好「YakuBus SEO 数据」，"
        "把 spreadsheet token 写入 GitHub Secret FEISHU_SHEET_TOKEN，"
        "或运行: python3 scripts/seo_feishu_weekly_sheet.py init"
    )
