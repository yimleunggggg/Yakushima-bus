# SEO 自动化文档

面向 **静态站点 + GitHub Actions** 的 SEO 数据自动采集与报告。以 [yakushimabus.com](https://yakushimabus.com) 为完整案例。

## 从哪里开始

| 你是… | 读这个 |
|--------|--------|
| **从零跟做（推荐）** | **[tutorial/README.md](tutorial/README.md)** 公开脱敏教程 |
| 填自己的 Secret / 邮箱 | [PRIVATE_SETUP.md](PRIVATE_SETUP.md)（私人清单，勿提交密钥） |
| 产品需求 v2（日报/周报/洞察） | [ROADMAP.md](ROADMAP.md) |
| 第一次从零配置（旧版详述） | [RUNBOOK.md](RUNBOOK.md) |
| 只配 Google 授权 | [GOOGLE_SETUP.md](GOOGLE_SETUP.md) |
| 加邮件/手机通知 | [NOTIFICATIONS.md](NOTIFICATIONS.md) |
| 飞书云文档（可选） | [FEISHU_SETUP.md](FEISHU_SETUP.md) |
| 看历史数据 | [TRACKING.md](TRACKING.md) |

## 文档地图

```
tutorial/           ← 公开教程体系（脱敏）
PRIVATE_SETUP.md    ← 私人填表（可 copy 为 .local.md）
ROADMAP.md          ← 需求 v2 / 进度
RUNBOOK.md          ← 总流程（阶段 A→E）
GOOGLE_SETUP.md     ← Cloud / GSC / GA4（最细）
NOTIFICATIONS.md
reports/daily/      ← 日报
reports/*-reminder  ← 半月
proposals/          ← 周报方案
metrics/            ← API JSON
```

## 定时任务一览

| 任务 | UTC | 北京 | 产出 |
|------|-----|------|------|
| 日报 | 09:00 每天 | 17:00 | `reports/daily/` + ntfy/邮件 |
| 半月 | 09:00 每月 1/15 | 17:00 | `*-reminder.md` + Issue |
| 周报 | 09:30 每周一 | 17:30 | `proposals/` + Issue |

## Cursor 优化轮

定时任务 **默认不改** meta。有数据后可在 Cursor 说「跑一轮 SEO 优化」，或周报 Issue 回复 `approve`（自动 PR workflow 待接）。

## 维护

- 完成关键配置 → 更新 [PRIVATE_SETUP.md](PRIVATE_SETUP.md) 验证表、[RUNBOOK §8](RUNBOOK.md)
- 新截图 → [images/README.md](images/README.md)
