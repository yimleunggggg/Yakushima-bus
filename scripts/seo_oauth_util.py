"""OAuth 桌面客户端 + refresh token（GSC 读数用）。"""
from __future__ import annotations

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GSC_READONLY = "https://www.googleapis.com/auth/webmasters.readonly"


def oauth_client_raw() -> dict | None:
    raw = os.environ.get("GOOGLE_OAUTH_CLIENT_JSON", "").strip()
    if raw:
        return json.loads(raw)
    path = ROOT / "secrets" / "oauth-client.json"
    if path.is_file():
        return json.loads(path.read_text(encoding="utf-8"))
    return None


def oauth_installed_config() -> dict | None:
    data = oauth_client_raw()
    if not data:
        return None
    if "installed" in data:
        return data
    if "web" in data:
        w = data["web"]
        return {
            "installed": {
                "client_id": w["client_id"],
                "client_secret": w["client_secret"],
                "redirect_uris": ["http://localhost"],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        }
    return None


def oauth_preflight_log() -> None:
    rt = os.environ.get("GOOGLE_OAUTH_REFRESH_TOKEN", "").strip()
    cj = os.environ.get("GOOGLE_OAUTH_CLIENT_JSON", "").strip()
    print(f"OAuth refresh set: {bool(rt)} (len={len(rt)})")
    print(f"OAuth client set: {bool(cj)} (len={len(cj)})")
    if not cj:
        print("OAuth client JSON: missing")
        return
    try:
        json.loads(cj)
        print("OAuth client JSON: parse OK")
    except json.JSONDecodeError as e:
        print(f"OAuth client JSON: parse FAIL ({e})")


def oauth_refresh_token() -> str:
    tok = os.environ.get("GOOGLE_OAUTH_REFRESH_TOKEN", "").strip()
    if tok:
        return tok
    path = ROOT / "secrets" / "gsc-oauth-token.json"
    if path.is_file():
        return (json.loads(path.read_text(encoding="utf-8")).get("refresh_token") or "").strip()
    return ""


def load_user_credentials(scopes: list[str]):
    """用 refresh token 换 access token；失败返回 (None, 错误说明)。"""
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials

    refresh = oauth_refresh_token()
    if not refresh:
        return None, (
            "GSC 需 OAuth：运行 python3 scripts/seo_setup_gsc_oauth.py，"
            "设置 GOOGLE_OAUTH_REFRESH_TOKEN（GSC 不接受服务账号邮箱）"
        )
    cfg = oauth_installed_config()
    if not cfg:
        return None, "缺少 OAuth 客户端：GOOGLE_OAUTH_CLIENT_JSON 或 secrets/oauth-client.json"
    inst = cfg["installed"]
    creds = Credentials(
        token=None,
        refresh_token=refresh,
        token_uri=inst["token_uri"],
        client_id=inst["client_id"],
        client_secret=inst["client_secret"],
        scopes=scopes,
    )
    try:
        creds.refresh(Request())
    except Exception as e:
        return None, f"OAuth refresh 失败: {e}"
    return creds, None
