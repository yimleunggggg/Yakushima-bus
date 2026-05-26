---
name: static-site-seo-report
description: >-
  解读静态站 SEO/GA4 日报与周报：表格字段、P0 优先级、GSC 与 GA4 差异。
  触发：用户贴日报、问 Organic 为何为 0、Direct 是否微信、报告格式乱、
  邮件摘要含义。
---

# SEO 日报 / 周报解读

## 报告结构（v2，表格为主）

| 章节 | 内容 |
|---|---|
| §一 今日结论 | 一句话 + **P0 表** + 窗口汇总表 |
| §二 数据明细 | 有数据才输出 2.1–2.7；无则一行提示 |
| §三 为什么会这样 | **现象 \| 说明** 两列表 |
| §四 优化方向 | **优先级 \| 领域 \| 建议 \| 谁做 \| 依据** |
| §五 GSC | 指标表 + 查询词表 + 索引状态表 |
| §六 待办 | **负责 \| 待办**（与 §四 P0 去重，不重复 Issue approve） |

邮件默认 **digest 模式**：只渲染 §一、§三表、§五前两表、§六表；完整 Markdown 在仓库 `docs/seo/reports/`。

## 常见误读

- **Direct 高** ≠ 没人用；微信/书签无 referrer → Direct。
- **GSC 展示 > 0 但 Organic = 0**：排名靠后或未点击；窗口差 1–2 天。
- **可分析 < GA4 原始**：剔除了互动 0% + 均时 0s 的 bot 行。
- **索引 PASS + Live 404**：历史快照；以 uptime / HTTP 探测为准。

## Agent 动作

1. 先看 §一 P0 表与 uptime 告警。
2. 对照 §四 与 §六，只建议 **👤 手动** 项；🤖 自动项勿让用户重复操作。
3. 改报告格式时改 `scripts/seo_daily_report.py`（`_md_table`）与 `seo_notify_format.py`（`_extract_md_tables`），勿手改生成 md。
