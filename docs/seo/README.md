# SEO 自动化文档

面向 **静态站点 + GitHub Actions** 的 SEO 数据自动采集与报告教程。以 [yakushimabus.com](https://yakushimabus.com) 为完整案例。

## 从哪里开始

| 你是… | 读这个 |
|--------|--------|
| 产品需求 v2（日报/周报/洞察） | **[ROADMAP.md](ROADMAP.md)** |
| 第一次从零配置 | **[RUNBOOK.md](RUNBOOK.md)**（全文跟做） |
| 只配 Google 授权 | **[GOOGLE_SETUP.md](GOOGLE_SETUP.md)**（7 步详解） |
| 加邮件/手机通知 | [NOTIFICATIONS.md](NOTIFICATIONS.md) |
| 看历史数据 | [TRACKING.md](TRACKING.md) |

## 文档地图

```
RUNBOOK.md          ← 总教程（阶段 A→E）
├── GOOGLE_SETUP.md ← Cloud / GSC / GA4（最细）
├── NOTIFICATIONS.md
├── TRACKING.md
├── CHANGELOG.md    ← 每轮 SEO 改了什么
├── reports/        ← 定时报告存档
├── metrics/        ← API 原始 JSON
└── images/         ← 教程配图（见 images/README.md）
```

## Cursor 优化轮

定时任务 **不会** 自动改网站 meta。有数据后，在 Cursor 说：

```text
跑一轮 SEO 优化
```

## 维护

- 完成 GSC 关联、workflow 验证等 → 更新 [RUNBOOK §8 案例进度](RUNBOOK.md#8-案例进度yakushima-bus)
- 新截图 → [images/README.md](images/README.md) 清单
