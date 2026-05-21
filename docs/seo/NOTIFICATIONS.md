# SEO 通知与平台对接

跑完定时任务后：**报告 + GSC/GA4 数字（已授权时）+ GitHub Issue + 可选邮件/推送**。

## 必做：Google 自动读数（一次性）

👉 **[GOOGLE_SETUP.md](GOOGLE_SETUP.md)** — 6 步配好 Secrets 后，每半月自动拉：

- GSC：28 天展示/点击/排名、Top 查询词、4 页索引状态  
- GA4：28 天用户、自然搜索用户  

写入 `docs/seo/metrics/latest.json` 和 `TRACKING.md` 指标表。

| Secret | 必填 |
|--------|------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | ✅ |
| `GA4_PROPERTY_ID` | ✅（数字 ID，不是 G-BX2P31GEHW） |
| `GSC_SITE_URL` | 建议 `https://yakushimabus.com/` |

## 可选：推送通知

| Secret | 用途 |
|--------|------|
| `NTFY_TOPIC` | 手机 ntfy 推送 |
| `SEO_NOTIFY_EMAIL` + `RESEND_API_KEY` | 邮件 |

## 零配置也能收到

- GitHub **Watch** 仓库 → Issue 邮件  
- 报告 `docs/seo/reports/YYYY-MM-DD-reminder.md`

## Cursor 手动一轮

说「跑一轮 SEO 优化」→ 先跑 `seo_fetch_metrics.py`，再改 meta + 写 Round 报告。
