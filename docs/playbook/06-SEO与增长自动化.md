# SEO 与增长自动化

> 进阶模块：站点上线后，让数据**每天流到你手机**，Git 里留档案，慢慢学 GA4/GSC。

---

## 实现效果（先讲人话）

| 你收到什么 | 什么时候 | 要不要你操作 |
|------------|----------|--------------|
| 手机 ntfy 推送 | 日报 17:00（北京） | 不用 |
| Gmail 邮件 | 同上（配了 Resend 后） | 不用 |
| 仓库 Markdown | `docs/seo/reports/daily/` 永久存档 | 不用 |

**不用 Cursor，不用电脑开机** — 全是 GitHub Actions 云端 cron。

---

## 报告分工

```text
日报 → 站点健康、GSC/GA4 表格、P0 待办、学一点
```

需要周报时本地跑 `scripts/seo_report_weekly.sh`（不再 cron）。

日报**不改代码**；避免 AI 每天乱改 meta。

---

## 跟练教程（脱敏 · 可分享）

完整步骤在：**[docs/seo/tutorial/README.md](../seo/tutorial/README.md)**

| 章 | 内容 |
|----|------|
| 01 | 目标与五阶段 |
| 02 | Google 授权（OAuth + 服务账号） |
| 03 | GitHub Secrets + daily workflow |
| 04 | Resend + DNSPod + ntfy |
| 05 | 怎么看报告、Issue approve |
| 06 | **日报 v2**、自动 P0–P2、失败重跑、飞书追踪 |
| 排错 | [TROUBLESHOOTING.md](../seo/tutorial/TROUBLESHOOTING.md) |

私人填表：[PRIVATE_SETUP.md](../seo/PRIVATE_SETUP.md)

---

## 报告里有什么（2026-05 v2）

日报含：

- **§一 本周优先** — 从 GSC `top_queries` / `index_status` + GA4 **自动**算 P0  
- **§二～§五** — 全量数据、为什么、优化方向（带数据依据）  
- **§六 待办** — 从 P0 抽出你要手动做的  
- **§七 学一点** — 轮换概念  

长期追踪：`docs/seo/SEO-JOURNAL.md` + 飞书「SEO 优化追踪」。见 [tutorial/06](../seo/tutorial/06-日报与优化追踪.md)。

失败 **自动重跑一轮**；两轮仍失败 ntfy 告警（与电脑开不开无关）。

---

## 报告里旧版「学习板块」

半月报/周报仍含：洞察、学一点、下一步（自动/手动标签）。

---

## 还没接上的（诚实说）

| 项 | 状态 |
|----|------|
| 飞书云文档 | 日报每天一篇 + **SEO 优化追踪**长文档 | Secret 配好后自动 |
| Issue `approve` → 自动 PR | 待做 |
| GA4 自定义事件（查路线、开 PDF） | 待做 |

见 [ROADMAP](../seo/ROADMAP.md)。

---

## 要不要 OpenClaw / Hermes / 飞书机器人？

**不要。** 本项目用：

- GitHub Actions 跑脚本  
- Resend 发邮件  
- ntfy 推手机  
- （可选）飞书开放平台 **文档 API** 直接建 doc  

那些是别的「7×24 Agent 平台」，适合更复杂场景，小工具站用 Actions 足够。

---

## 下一篇

[07-踩坑·决策·思考](07-踩坑·决策·思考.md)
