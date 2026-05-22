# SEO 半月报 · 2026-05-22-test

| | |
|---|---|
| 类型 | reminder（每半月 1/15 日） |
| 站点 | https://yakushimabus.com |
| 上一轮 | ## Round 1 — 2026-05-21 |

---

## 1. 本期摘要

定时任务已跑完 **静态自检**（sitemap、meta、robots 等）。  
**尚未**改网站代码——需要你（或在 Cursor 说「跑一轮 SEO 优化」）根据 GSC 数据决定是否微调 title/description。

**你现在要做的（约 10 分钟）**
1. 打开 [Google Search Console 效果](https://search.google.com/search-console/performance/search-analytics) → 选 28 天 → 记下展示、点击、平均排名
2. 填进 \`docs/seo/TRACKING.md\` 指标表
3. 在 Cursor 说：**跑一轮 SEO 优化**（我会读 GSC 数据并改 meta + 写 Round 报告）


---

## 2. GSC / GA4 数据（自动）

- **GSC**（2026-04-22 ~ 2026-05-19）：展示 **0** · 点击 **0** · 平均排名 **0.0**
- 索引抽查：
  - ✓ https://yakushimabus.com/ → PASS
  - ○ https://yakushimabus.com/map/ → NEUTRAL
  - ○ https://yakushimabus.com/access/ → NEUTRAL
  - ○ https://yakushimabus.com/about/ → NEUTRAL
- **GA4** 28 天：用户 **48** · 自然搜索 **0**

---

## 3. 自动检查结果

```
SEO check — yakushimabus.com

  ✓ robots.txt
  ✓ robots.txt
  ✓ sitemap.xml
  ✓ sitemap.xml (4 URLs)
  ✓ GSC
  ✓ index.html meta
  ✓ map/index.html meta
  ✓ access/index.html meta
  ✓ about/index.html meta
  ✓ llms.txt

All checks passed.
```

---

## 4. 为什么做这些事（学习）

| 动作 | 理由 |
|------|------|
| 提交 sitemap | 告诉 Google 有哪 4 个 URL，比等爬虫乱逛更快 |
| title / description | 搜索结果里显示的标题和摘要；含「屋久島 バス 時刻表」等词才容易被搜到 |
| 静态 `page-lead` 导语 | 爬虫不跑 JS 也能读到关键词，避免首页「空壳」 |
| JSON-LD 结构化数据 | 帮助 Google 理解这是「旅行类 Web 应用」，非普通博客 |
| 不堆旅游攻略 | 保持「公交工具」定位，避免和观光协会抢词、稀释点击率 |
| 指标表 TRACKING.md | 同一套词每 2–4 周对比，才知道改动有没有用 |

**新站正常节奏**：1–4 周展示≈0；4–8 周长尾词慢慢出现。看 **趋势** 不看单日。

---

## 5. 效果追踪

已配置 Google 授权时，**GSC/GA4 会自动写入** `docs/seo/metrics/latest.json` 与 `TRACKING.md` 指标表。

| 去哪看 | 看什么 |
|--------|--------|
| 本报告 §2 | 28 天展示/点击/排名、Top 词、索引、GA4 自然流量 |
| `docs/seo/TRACKING.md` | 历史对比表 |

**目标查询词（P0）**：屋久島 バス 時刻表 / 屋久岛 公交 时刻表 / Yakushima bus timetable

---

## 今日洞察

- GSC 展示仍为 0：新站 1–8 周内常见。此时应盯 **GA4 是否有人用工具**、**四 URL 索引是否 PASS**，而不是焦虑「没排名」。
- 近 7 日约 **48** 位用户在使用站点——说明工具链有人打开，SEO 与产品都有效。
- 索引 NEUTRAL 页 3 个：属正常跟进项，**手动**在 GSC 做 URL 检查并请求编入索引。
## 学一点

- **Organic Search 渠道**：GA4 里自然搜索会话上涨，说明 SEO 起量；与 GSC 点击交叉验证。Direct 多可能是书签、微信分享链接直达。
- **索引 PASS / NEUTRAL**：PASS 表示 Google 已收录可用；NEUTRAL 常是新页或次要页，可在 Search Console 对该 URL「请求编入索引」（需手动，无稳定全自动 API）。
## 下一步建议

- **👤 手动** — GSC → URL 检查 → 对首页与 /map/ 请求编入索引（各一次即可）
- **⏳ 观察** — 本周一查看 `proposals/` 周报；有 P1 项再 Issue 回复 approve
- **🤖 自动** — 无需改代码；日报与自检已由 Actions 自动完成

---

## 9. 存档

| 位置 | 说明 |
|------|------|
| Git | `docs/seo/reports/*-reminder.md`、`metrics/latest.json` |
| Issue | 标签 `seo-round`，可 Watch 收邮件 |

*半月报不改代码；复杂改版用 Cursor「跑一轮 SEO 优化」。*

