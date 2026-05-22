# 每周 SEO/GEO 优化方案 — 2026-W21

**生成日**：2026-05-22 · **站点**：https://yakushimabus.com  
**状态**：⏳ 待确认 — 在 GitHub Issue 回复 `approve` 后执行（或 Cursor 说「执行本周方案」）

---

## 1. 本周数据摘要（7 天）


---

## 2. 建议改动（批准后自动/半自动执行）

| 优先级 | 项 | 理由 | 执行方式 |
|--------|-----|------|----------|
| P1 | 若 `/access/` 有 GA4 着陆流量 | 强化 ferry/jetfoil title/description | 自动 PR |
| P1 | GSC 有 Top 词后 | 对齐 P0：屋久島 バス 時刻表 等 | 自动 PR |
| P2 | 索引 NEUTRAL 的页 | GSC URL 检查 + lastmod | **你手动**请求索引 |
| P2 | GA4 仍 0 Organic | 不加攻略；保持工具定位 | 观察 |

*本周若无 GSC 展示：方案以「索引 + GA4 使用」为主，不大改 meta。*

---

## 3. GEO（生成式搜索）

- 保持四页 **静态 `page-lead`** 与 JSON-LD
- `llms.txt` 声明：工具站、数据出处、四 URL
- 不加主观旅游攻略；FAQ 仅交通事实

---

## 4. 需你手动

- [ ] GSC **URL 检查** → 对 NEUTRAL 页请求编入索引
- [ ] 运营商 PDF 换版时通知 → 更新 `sources/` 并 rebuild
- [ ] 外链/社群推广（可选）

---

## 5. 外部洞察（2026-05 基线）

| 主题 | 说明 |
|------|------|
| 2026/3 巴士改点 | 标题已可强调改点期；等 GSC 有词再微调 |
| 鹿儿岛↔屋久岛 船票/高速船 | `/access/` + booking 卡片 |
| 离岛通用攻略 | **不做**；避免稀释工具定位 |

*下周从此表 + 新 GSC Top 词更新。*

## 本期洞察

- 数据平稳：维持工具定位，等周一周报方案再决定是否改 meta。
- 本周方案只列改动、不自动执行；你 `approve` 后才会开 PR 或 commit（workflow 待接）。
## 学一点

- **Organic Search 渠道**：GA4 里自然搜索会话上涨，说明 SEO 起量；与 GSC 点击交叉验证。Direct 多可能是书签、微信分享链接直达。
- **索引 PASS / NEUTRAL**：PASS 表示 Google 已收录可用；NEUTRAL 常是新页或次要页，可在 Search Console 对该 URL「请求编入索引」（需手动，无稳定全自动 API）。
## 下一步建议

- **👤 手动** — 阅读 §2 表格 → GitHub Issue 评论 `approve` / `defer` / 修改意见
- **👤 手动** — NEUTRAL 索引页：GSC URL 检查 → 请求编入索引
- **🤖 自动** — 批准后：meta / JSON-LD / page-lead 等（待 approve workflow 接入）
- **⏳ 观察** — PDF 官方换版 → 你核对后 rebuild，不自动改时刻表

---

## 6. 批准后如何执行

1. GitHub Issue 评论 **`approve`**（推荐，不必开 Cursor）
2. 或 Cursor：**「执行本周 SEO 方案 2026-W21」**
3. 执行后生成 `reports/2026-05-22-round-N.md` 并更新 CHANGELOG

---

## 7. 确认

- [ ] **approve** — 按 §2 P1 执行
- [ ] **defer** — 本周跳过
- [ ] 留言修改意见

