---
name: static-site-seo-setup
description: >-
  为静态工具站接入 GSC/GA4 日报、GitHub Actions、邮件/ntfy 通知。
  触发：用户要搭 SEO 自动化、复制 Yakushima-bus 式日报、配 Google OAuth、
  加 seo_daily workflow、静态站 Search Console。
---

# 静态站 SEO 自动化搭建

## 两层分发（必读）

| 层 | 装什么 | 别人怎么用 |
|---|---|---|
| **Skill（本包）** | Agent 行为与检查清单 | `npx skills add <owner>/<repo> -s static-site-seo-setup` |
| **脚本模板** | `scripts/seo_*`、`.github/workflows/seo-*.yml` | 从案例仓 **复制** 到目标项目（Skill 不写 Secrets） |

参考案例仓：`Yakushima-bus`（yakushimabus.com）。公开教程：`docs/seo/tutorial/` 或独立库 `vibe-coding-static-site-guide`。

## 执行顺序

1. **Google**：Cloud 项目 → GSC OAuth（Search Console API）→ GA4 服务账号只读 → 见教程 `02-Google授权.md`。
2. **GitHub Secrets**（名称与案例仓一致）：`GSC_*`、`GA4_*`、`RESEND_*`、`NTFY_*` 等；勿写入 Skill 或提交到 git。
3. **复制脚本**：`seo_fetch_daily.py`、`seo_daily_report.py`、`seo_priorities.py`、`seo_notify*.sh`、`seo_site_uptime.py` 及 `seo_daily_ci*.sh`。
4. **Workflow**：`seo-daily.yml`（cron + 失败重跑）、可选 `seo-weekly.yml`；`permissions: contents: write` 仅用于写 `docs/seo/metrics/`。
5. **首次验证**：本地 `python3 scripts/seo_fetch_daily.py` → `seo_daily_report.py` → 检查 `docs/seo/reports/daily/`。
6. **通知**：Resend 域名 DNS；ntfy 主题勿公开；邮件默认 `SEO_EMAIL_DIGEST=1` 发摘要表格式 HTML。

## Agent 约束

- 不猜测 Property ID / 邮箱 / Token；缺则列清单让用户填 Secrets。
- 静态站路径带尾斜杠（`/map/`）与 sitemap 保持一致。
- 新站 Organic=0、GSC 展示低属正常；优先查 **站点是否 404**（GitHub Pages 私有仓、DNS）。

## 关联 Skill

- `static-site-seo-report` — 读日报/周报
- `static-site-seo-incident` — 404、索引、拉数失败
