# 排错表

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| Resend `email not found` / 发信失败 | 域名未验证、From 地址非法 | DNSPod 核对 SPF/DKIM；先用 `onboarding@resend.dev` 测试 |
| OAuth `invalid_grant` / `access_denied` | refresh token 失效、非 Test user | 重跑 `seo_setup_gsc_oauth.py`；OAuth 同意屏幕加登录 Gmail |
| GA4 `403` / User does not have sufficient permissions | SA 未加 GA4 查看者 | `seo_grant_ga4_access.py [属性ID]` |
| GSC `403` | SA 未加 GSC 用户 | GSC 设置 → 用户 → 服务账号 **完全** |
| GSC 数据空 / OAuth 错误 | 未配 OAuth Secrets | 配齐 5 个 Google Secret |
| 日报 GA4 无渠道维度 | 用了 `latest.json` 半月数据 | 等 daily fetch 成功或本地跑 `seo_fetch_daily.py` |
| ntfy 收不到 | 主题名不一致、未订阅 | Secret 与 app 主题一致 |
| DNS 邮件进垃圾箱 | DKIM 未生效 | DNSPod 等 24h 再测 |
| Actions commit 失败 | 无 write 权限 / 分支保护 | 检查 `permissions` 与 main 保护规则 |
| 飞书跳过 | 未配三个 FEISHU Secret | 正常；见 FEISHU_SETUP |

更多：[GOOGLE_SETUP.md](../GOOGLE_SETUP.md) 文末、[RUNBOOK.md](../RUNBOOK.md) §排错。
