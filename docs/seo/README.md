# SEO 自动化（本仓库）

本目录只放 **yakushimabus.com 案例的运行数据与私人配置**。公开跟做教程在独立仓库：

**https://github.com/yimleunggggg/vibe-coding-static-site-guide/tree/main/seo/tutorial/README.md**

## 本仓保留什么

| 路径 | 用途 |
|------|------|
| [PRIVATE_SETUP.md](PRIVATE_SETUP.md) | 私人 Secret / 邮箱填表（勿提交密钥） |
| [GOOGLE_SETUP.md](GOOGLE_SETUP.md) | 本项目 Google 授权备忘（含真实 ID 时勿公开） |
| [RUNBOOK.md](RUNBOOK.md) · [NOTIFICATIONS.md](NOTIFICATIONS.md) · [FEISHU_SETUP.md](FEISHU_SETUP.md) | 运维与飞书 |
| `reports/daily/` · `metrics/` | Actions 日报与 API JSON |
| [SEO-JOURNAL.md](SEO-JOURNAL.md) · [CHANGELOG.md](CHANGELOG.md) | 优化记录 |

## 定时任务

| 任务 | UTC | 北京 | 产出 |
|------|-----|------|------|
| 日报 | 09:00 每天 | 17:00 | `reports/daily/` + ntfy/邮件 |
| 周报 | 09:30 每周一 | 17:30 | `metrics/weekly-*.json` + 飞书表格 |

飞书配置（日报 doc / 追踪 doc / **周报表**）：[FEISHU_SETUP.md](FEISHU_SETUP.md)

## 从零跟做

请打开 [vibe-coding-static-site-guide](https://github.com/yimleunggggg/vibe-coding-static-site-guide)，不要在本仓库找 `tutorial/` 或 `playbook/` 副本。
