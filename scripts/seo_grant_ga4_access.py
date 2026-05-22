#!/usr/bin/env python3
"""
一次性：用你的 Google 账号给 GA4 属性添加服务账号「查看者」。

前置（只需一次）：
  1. Cloud Console 启用「Google Analytics Admin API」
  2. OAuth 同意屏幕 → 外部 → 测试用户加你的 Gmail
  3. 凭据 → 创建 OAuth 客户端 ID → 桌面应用 → 下载 JSON
  4. 保存为 secrets/oauth-client.json

用法：
  python3 scripts/seo_grant_ga4_access.py 538426834
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import google.auth.transport.requests
import requests
from google_auth_oauthlib.flow import InstalledAppFlow

ROOT = Path(__file__).resolve().parents[1]
SA_EMAIL = "seo-metrics-reader@yakushimabus-seo.iam.gserviceaccount.com"
SCOPES = ["https://www.googleapis.com/auth/analytics.manage.users"]
ADMIN_API = "https://analyticsadmin.googleapis.com/v1alpha"


def load_oauth_client() -> dict:
    path = ROOT / "secrets" / "oauth-client.json"
    if not path.is_file():
        print(f"缺少 {path}")
        print("请按 docs/seo/GOOGLE_SETUP.md「GA4 脚本授权」创建 OAuth 桌面客户端并下载 JSON。")
        sys.exit(1)
    data = json.loads(path.read_text(encoding="utf-8"))
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
    raise SystemExit("oauth-client.json 格式不对，请用「桌面应用」类型重新下载")


def create_access_binding_rest(creds, prop: str) -> None:
    """REST 调用，避免 gRPC 在部分网络下 503。"""
    body = {"roles": ["predefinedRoles/viewer"], "user": SA_EMAIL}
    url = f"{ADMIN_API}/properties/{prop}/accessBindings"
    last_err: Exception | None = None

    for attempt in range(1, 4):
        creds.refresh(google.auth.transport.requests.Request())
        try:
            resp = requests.post(
                url,
                headers={"Authorization": f"Bearer {creds.token}"},
                json=body,
                timeout=90,
            )
        except requests.RequestException as e:
            last_err = e
            print(f"⚠ 网络错误（{attempt}/3）: {e}")
            time.sleep(3 * attempt)
            continue

        if resp.status_code in (200, 201):
            return
        if resp.status_code == 409 or "ALREADY_EXISTS" in resp.text:
            print(f"ℹ {SA_EMAIL} 已在属性 {prop} 中（跳过）")
            return

        last_err = RuntimeError(f"HTTP {resp.status_code}: {resp.text[:500]}")
        if resp.status_code >= 500 and attempt < 3:
            print(f"⚠ 服务端错误（{attempt}/3）: {resp.status_code}")
            time.sleep(3 * attempt)
            continue
        raise last_err

    if last_err:
        raise last_err


def main() -> int:
    prop = (sys.argv[1] if len(sys.argv) > 1 else input("GA4 属性 ID（纯数字）: ")).strip()
    if not prop.isdigit():
        print("请输入数字属性 ID")
        return 1

    print("即将打开浏览器，请用 GA4 管理员 Google 账号登录（须为 OAuth 测试用户）…")
    flow = InstalledAppFlow.from_client_config(load_oauth_client(), SCOPES)
    creds = flow.run_local_server(port=0)

    print("正在通过 REST API 添加服务账号（无需 gRPC）…")
    create_access_binding_rest(creds, prop)
    print(f"✓ 已添加 {SA_EMAIL} 为查看者 → 属性 {prop}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
