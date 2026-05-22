#!/usr/bin/env python3
"""
一次性：用你的 Google 账号授权读 GSC，得到 refresh token。

前置：secrets/oauth-client.json（与 GA4 grant 同一桌面 OAuth 客户端）
      OAuth Test users 含你的 Gmail

用法：
  python3 scripts/seo_setup_gsc_oauth.py

成功后：
  1. 复制终端里的 refresh token → GitHub Secret GOOGLE_OAUTH_REFRESH_TOKEN
  2. 同一 oauth-client.json 全文 → Secret GOOGLE_OAUTH_CLIENT_JSON
  3. Run workflow
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from google_auth_oauthlib.flow import InstalledAppFlow

from seo_oauth_util import GSC_READONLY, oauth_installed_config

ROOT = Path(__file__).resolve().parents[1]
SCOPES = [GSC_READONLY]
OUT = ROOT / "secrets" / "gsc-oauth-token.json"


def main() -> int:
    cfg = oauth_installed_config()
    if not cfg:
        print("缺少 secrets/oauth-client.json", file=sys.stderr)
        print("见 docs/seo/GOOGLE_SETUP.md 第 4 步创建 OAuth 桌面客户端。")
        return 1

    print("即将打开浏览器，请用 GSC 资源的所有者 Gmail 登录（须为 OAuth 测试用户）…")
    flow = InstalledAppFlow.from_client_config(cfg, SCOPES)
    creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")

    if not creds.refresh_token:
        print("未拿到 refresh_token，请删除已有授权后重试（Google 账号 → 第三方访问权限）。")
        return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"refresh_token": creds.refresh_token}, indent=2) + "\n",
        encoding="utf-8",
    )

    print("\n✓ 已保存", OUT)
    print("\n=== GitHub Secrets（Actions 用）===\n")
    print("GOOGLE_OAUTH_REFRESH_TOKEN =")
    print(creds.refresh_token)
    print("\nGOOGLE_OAUTH_CLIENT_JSON = oauth-client.json 全文（若尚未添加）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
