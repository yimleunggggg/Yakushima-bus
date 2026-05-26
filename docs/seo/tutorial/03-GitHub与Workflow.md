# GitHub Actions Workflow

## 定时任务（2026-05 起仅 daily）

| Workflow | cron (UTC) | 北京时间 | 做什么 |
|----------|------------|----------|--------|
| `seo-daily.yml` | `0 9 * * *` | 每天 **17:00** | 拉 metrics、写日报 v2、通知、commit（**含失败重跑**） |

另有 GitHub 自带的 **pages-build-deployment**（Pages 部署），与 SEO 无关。

均可 **workflow_dispatch** 手动触发。

> **已移除**：`seo-review.yml`（半月 + Issue）、`seo-weekly.yml`（周报）— 与 daily 重复；需要周报可本地 `bash scripts/seo_report_weekly.sh`。

## 日报 job 内部

单 job 调用 `scripts/seo_daily_ci_with_retry.sh`：

```text
seo_check → fetch（最多 3 次）→ seo_daily_report.py → 飞书日报/追踪
→ ntfy/邮件 → git commit/push（最多 3 次）
     ↓ 失败
  等 60s 整轮再跑第 2 次
     ↓ 仍失败
  seo_notify_failure.sh → ntfy 高优先级
```

与**本地电脑开不开机无关**，全在 GitHub 云端。

## 产物路径

| 类型 | 路径 |
|------|------|
| 日报 | `docs/seo/reports/daily/YYYY-MM-DD.md` |
| 优化追踪 | `docs/seo/SEO-JOURNAL.md` |
| 原始 JSON | `docs/seo/metrics/daily-*.json`、`daily-latest.json` |
| 飞书链接 | `docs/seo/feishu-links.json`、`feishu-journal.json` |

## 权限

- `seo-daily`：`contents: write`（bot commit metrics / reports）

## 手动周报（可选）

```bash
bash scripts/seo_report_weekly.sh          # → docs/seo/proposals/YYYY-WW-proposal.md
bash scripts/seo_notify.sh docs/seo/proposals/YYYY-WW-proposal.md "主题"
```

详见 [06-日报与优化追踪.md](06-日报与优化追踪.md)。
