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
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SA_EMAIL = "seo-metrics-reader@yakushimabus-seo.iam.gserviceaccount.com"
SCOPES = ["https://www.googleapis.com/auth/analytics.manage.users"]


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
        # 桌面 flow 需要 installed 结构
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


def main() -> int:
    prop = (sys.argv[1] if len(sys.argv) > 1 else input("GA4 属性 ID（纯数字）: ")).strip()
    if not prop.isdigit():
        print("请输入数字属性 ID")
        return 1

    try:
        from google.analytics.admin import AnalyticsAdminServiceClient
        from google.analytics.admin_v1alpha.types import AccessBinding
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        print("请先安装: pip3 install google-analytics-admin google-auth-oauthlib")
        return 1

    print("即将打开浏览器，请用 GA4 管理员 Google 账号登录（须为 OAuth 测试用户）…")
    flow = InstalledAppFlow.from_client_config(load_oauth_client(), SCOPES)
    creds = flow.run_local_server(port=0)

    client = AnalyticsAdminServiceClient(credentials=creds)
    parent = f"properties/{prop}"
    binding = AccessBinding(roles=["predefinedRoles/viewer"], user=SA_EMAIL)
    client.create_access_binding(parent=parent, access_binding=binding)
    print(f"✓ 已添加 {SA_EMAIL} 为查看者 → 属性 {prop}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
