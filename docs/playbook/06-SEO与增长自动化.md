# SEO 与增长自动化

> 进阶模块：站点上线后，让数据**每天流到你手机**，Git 里留档案，慢慢学 GA4/GSC。

---

## 实现效果（先讲人话）

| 你收到什么 | 什么时候 | 要不要你操作 |
|------------|----------|--------------|
| 手机 ntfy 推送 | 日报 17:00 / 半月 17:00 / 周报 17:30（北京） | 不用 |
| Gmail 邮件 | 同上（配了 Resend 后） | 不用 |
| GitHub Issue | 周报方案、半月提醒 | 周报可回 `approve` |
| 仓库 Markdown | `docs/seo/reports/` 永久存档 | 不用 |

**不用 Cursor，不用电脑开机** — 全是 GitHub Actions 云端 cron。

---

## 三层报告分工

```text
日报     → 今天站点健康吗？学一点 GA4/GSC
半月报   → 28 天汇总 + 提醒「可以跑优化了」
周报方案 → 建议改哪些 title/meta → 你批准再动
```

日报**不改代码**；避免 AI 每天乱改 meta。

---

## 跟练教程（脱敏 · 可分享）

完整步骤在：**[docs/seo/tutorial/README.md](../seo/tutorial/README.md)**

| 章 | 内容 |
|----|------|
| 01 | 目标与五阶段 |
| 02 | Google 授权（OAuth + 服务账号） |
| 03 | GitHub Secrets + 三个 workflow |
| 04 | Resend + DNSPod + ntfy |
| 05 | 怎么看报告、Issue approve |
| 排错 | [TROUBLESHOOTING.md](../seo/tutorial/TROUBLESHOOTING.md) |

私人填表：[PRIVATE_SETUP.md](../seo/PRIVATE_SETUP.md)

---

## 报告里新增的「学习板块」

每份日报/半月报含：

- **洞察** — 结合数字解读（0 展示也会教「新站正常」）  
- **学一点** — 1～2 条概念（如 Organic vs Direct）  
- **下一步** — 标 `[自动]` / `[你手动]`

适合边做项目边学 SEO，不用另买课。

---

## 还没接上的（诚实说）

| 项 | 状态 |
|----|------|
| 飞书云文档自动归档 | 脚本有，Secret 未配 |
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
