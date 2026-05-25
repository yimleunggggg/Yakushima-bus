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
| Actions commit 失败 | 无 write 权限 / `feishu-links.json` 不存在 / push 冲突 | 已修复可选 add；重试 job 内 pull --rebase |
| ntfy 有、Actions 红 | notify 在 commit 前；邮件 HTML 或 push 失败 | 看失败步骤；整 job 会自动第 2 轮 |
| 两轮仍失败 | GA4/GSC 网络 / Secrets | 收 ntfy「请人工处理」；Re-run workflow |
| **站点 404 但没 ntfy** | 旧版无 HTTP 探测 | 已加 `seo_site_uptime.py`；GSC「测试实际网址」 |
| **全站 404「Site not found · GitHub Pages」** | 仓库曾改 **Private**（免费版无 Pages）；或 Pages 源未启用 | 改 **Public** → Settings → Pages 重新 Save（main/root）→ 等 2～5 分钟；见 [deploy-yakushimabus.md](../../deploy-yakushimabus.md) §6.1 |
| 日报无 P0 查询词 | GSC fetch 失败或 0 展示 | 看 §五；仍会有索引类 P0 |
| 飞书跳过 | 未配 FEISHU Secret | 正常；见 FEISHU_SETUP |

更多：[GOOGLE_SETUP.md](../GOOGLE_SETUP.md) 文末、[RUNBOOK.md](../RUNBOOK.md) §排错。
