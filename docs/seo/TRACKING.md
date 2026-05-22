# SEO 效果追踪

站点：https://yakushimabus.com  
GA4：`G-BX2P31GEHW`（`analytics.js`）  
GSC：域名验证文件 `googlef464172b97bd6d41.html` 已在仓库

## 「URL 检查 → 请求编入索引」是什么意思？

Google 不会立刻爬完你刚上线的每个页面。**URL 检查** = 在 GSC 顶部输入某个网址（如 `https://yakushimabus.com/map/`），看 Google **是否已经收录**。

- **未收录**：显示「URL 不在 Google 上」→ 点 **「请求编入索引」** = 排队让 Google 来爬这一页（通常几天内，不保证立刻进搜索结果）
- **已收录**：显示「URL 已在 Google 上」→ 不用重复点

新站上线后各做一次即可；**只有大改版或新页面**才需要再请求。不是每天点的按钮。

## 自动化（已配置）

| 机制 | 作用 |
|------|------|
| `.github/workflows/seo-review.yml` | 每月 1/15 日：自检 + **自动拉 GSC/GA4** + 报告 + Issue |
| `scripts/seo_fetch_metrics.py` | GSC + GA4 读数（需 `GOOGLE_SETUP.md`） |

**你需要做的**：按 [`RUNBOOK.md`](RUNBOOK.md) / [`GOOGLE_SETUP.md`](GOOGLE_SETUP.md) 配好 3 个 Secrets 并 push → 全自动读数；可选 ntfy/邮件见 `NOTIFICATIONS.md`。

## 通知与报告

| 产物 | 位置 |
|------|------|
| 定时报告 | `docs/seo/reports/YYYY-MM-DD-reminder.md` |
| Round 完成报告 | `docs/seo/reports/YYYY-MM-DD-round-N.md` |
| 邮件 / 手机推送 | 配 GitHub Secrets，见 `NOTIFICATIONS.md` |

## 你需手动完成（一次性）

1. 打开 [Google Search Console](https://search.google.com/search-console) → 确认属性 **yakushimabus.com** 已验证（HTML 文件法）
2. **Sitemap** → 提交 `https://yakushimabus.com/sitemap.xml`（若已提交可跳过）
3. （可选）新页或大改版时 → **URL 检查** → 见上文说明；四 URL 各请求一次即可
4. [GA4](https://analytics.google.com) → 确认数据流 URL 为 `yakushimabus.com`，与 `analytics.js` ID 一致
5. （可选）GSC → **设置 → 用户和权限** 添加自己常用 Google 账号

## 定期任务（建议每 2–4 周）

| 步骤 | 做什么 |
|------|--------|
| 1 | 记录下方「指标表」新一行（GSC + GA4） |
| 2 | GSC → **效果**：看展示/点击/CTR/平均排名；**网页**→ 哪些 URL 有展示 |
| 3 | GSC → **编制索引**→ 确认 4 页均为「已编入索引」 |
| 4 | 根据查询词微调 title/description（见 `CHANGELOG.md` 记录） |
| 5 | 若有新页面或 PDF 大更新 → 改 `sitemap.xml` 的 `<lastmod>` 并在 GSC 重新抓取 |

在 Cursor 可说：**「跑一轮 SEO 优化」**（或等 GitHub Issue `seo-round` 提醒）→ Agent 按 `.cursor/skills/seo-round/SKILL.md` 执行。

## 指标表

| 日期 | GSC 展示 | GSC 点击 | 平均排名 | 已索引页 | GA4 用户(28d) | GA4 自然(28d) | 备注 |
|------|---------|---------|---------|---------|--------------|--------------|------|
| 2026-05-22 | 0 | 0 | 0.0 | 1/4 | 48 | 0 | 自动拉取 2026-05-22 |
| 2026-05-21 | — | — | — | 待查 | — | — | Round 1 技术优化上线，待 GSC 有数据后回填 |

> **新站预期**：首 1–4 周展示≈0 正常；4–8 周开始出现长尾词（屋久島 バス 時刻表 等）。

## 目标查询词（监控用）

| 优先级 | 查询词 |
|--------|--------|
| P0 | 屋久島 バス 時刻表 / 屋久岛 公交 时刻表 / Yakushima bus timetable |
| P0 | 屋久島 バス 運賃 / 屋久岛 公交 票价 |
| P1 | 鹿児島 屋久島 高速船 時刻表 / 屋久岛 船票 |
| P1 | 宮之浦 バス / 安房 バス 時刻表 |
| P2 | 荒川 登山 バス / 白谷 バス |

## 相关文件

- **主教程**：`docs/seo/RUNBOOK.md`
- 技术清单：`docs/notes/seo-geo.md`
- 每轮变更：`docs/seo/CHANGELOG.md`
- `sitemap.xml` / `robots.txt` / `llms.txt` / 各页 `<head>`
