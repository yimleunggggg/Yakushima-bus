# GitHub Actions Workflow

## 三个定时任务

| Workflow | cron (UTC) | 北京时间 | 做什么 |
|----------|------------|----------|--------|
| `seo-daily.yml` | `0 9 * * *` | 每天 **17:00** | 拉 daily metrics、写日报、通知、commit |
| `seo-review.yml` | `0 9 1,15 * *` | 1/15 日 **17:00** | 半月 28 天 metrics、reminder 报告、Issue、通知 |
| `seo-weekly.yml` | `30 9 * * 1` | 周一 **17:30** | 周报方案、Issue、简要通知 |

均可 **workflow_dispatch** 手动触发。

## 产物路径

| 类型 | 路径 |
|------|------|
| 日报 | `docs/seo/reports/daily/YYYY-MM-DD.md` |
| 半月 | `docs/seo/reports/YYYY-MM-DD-reminder.md` |
| 周报 | `docs/seo/proposals/YYYY-WW-proposal.md` |
| 原始 JSON | `docs/seo/metrics/daily-*.json`、`latest.json` |

## 权限

- `seo-daily` / `seo-review`：`contents: write`（bot commit）
- `seo-weekly`：另需 `issues: write`（开 Issue）

## 待接：approve 执行

评论 `approve` 后自动开 PR 的 workflow **尚未接入**；目前用 Cursor「执行本周方案」或手动改。
