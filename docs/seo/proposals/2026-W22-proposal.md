# 每周 SEO/GEO 优化方案 — 2026-W22

**生成日**：2026-05-25 · **站点**：https://yakushimabus.com  
**状态**：⏳ 待确认 — 在 GitHub Issue 回复 `approve` 后执行（或 Cursor 说「执行本周方案」）

---

## 1. 本周数据摘要（7 天）

- GA4 7 日：用户 **78** · 会话 **103**
- GSC 28 日：展示 **10** · 点击 **0**
  - 「yakushima bus」
  - 「屋久島 バス」
  - 「屋久島 バス 時刻表」

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

- 已排除 **疑似 bot** 6 用户 / 6 会话（Poland(3), Austria(1), Canada(1), France(1)）：互动 0% 且均时 0s。**可分析**：约 72 用户 / 97 会话。
- **Direct 98% + Unassigned 1%** 占主导（渠道为 GA4 原始值，bot 多记 Direct）：朋友圈/书签等 **无 referrer** 是主因，不是 GA4 漏记。
- 来源明细 Top：`(direct), github.com, (not set)`（见 §2.2）。
- 欧盟/英国 **3** 用户、互动率 **66.7%**：有实际浏览行为，可能含欧州赴日旅客或英文搜索；仍建议对照着陆页是否多页访问。
- 本周方案只列改动、不自动执行；你 `approve` 后才会开 PR 或 commit（workflow 待接）。

## 学一点

- **GEO / 生成式搜索**：AI 更愿引用页面里**静态可见**的交通事实（`page-lead`、FAQ JSON-LD），而非 JS 动态表格；屋久岛站保持「工具事实」比堆攻略更易被引用。
- **28 天窗口**：GSC 默认看 28 天趋势，单日波动无意义；每 2–4 周对比 TRACKING 表才看得出改动效果。

## 下一步建议

- **👤 手动** — 阅读 §2 表格 → GitHub Issue 评论 `approve` / `defer` / 修改意见
- **👤 手动** — NEUTRAL 索引页：GSC URL 检查 → 请求编入索引
- **🤖 自动** — 批准后：meta / JSON-LD / page-lead 等（待 approve workflow 接入）
- **⏳ 观察** — PDF 官方换版 → 你核对后 rebuild，不自动改时刻表

---

## 6. 批准后如何执行

1. GitHub Issue 评论 **`approve`**（推荐，不必开 Cursor）
2. 或 Cursor：**「执行本周 SEO 方案 2026-W22」**
3. 执行后生成 `reports/2026-05-25-round-N.md` 并更新 CHANGELOG

---

## 7. 确认

- [ ] **approve** — 按 §2 P1 执行
- [ ] **defer** — 本周跳过
- [ ] 留言修改意见

