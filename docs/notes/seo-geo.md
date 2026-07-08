# SEO / GEO 配置

站点：https://yakushimabus.com

## 追踪与定期优化

| 文件 | 作用 |
|------|------|
| [`docs/OPS-JOURNAL.md`](../OPS-JOURNAL.md) | **运维主文件**（版本块 + 归因 ID + 平台对照 + 待办） |
| [`~/.cursor/rules/change-journal.mdc`](../../../.cursor/rules/change-journal.mdc) | 版本块格式与 Agent 义务（全项目） |
| [`docs/seo/TRACKING.md`](../seo/TRACKING.md) | GSC/GA4 操作清单、指标表、目标查询词 |
| [`docs/seo/CHANGELOG.md`](../seo/CHANGELOG.md) | 每轮 SEO 改了什么 |

在 Cursor 说 **「跑一轮 SEO 优化」** 即可按上述文档迭代；说 **「跑一轮 GEO」** 按本文「GEO 运营」节执行。

---

## 已部署文件

| 文件 | 作用 |
|------|------|
| `robots.txt` | 爬虫规则 + sitemap；允许 GPTBot / Claude / PerplexityBot / Google-Extended 等 |
| `sitemap.xml` / `sitemap-zh.xml` | 多页 URL + hreflang + lastmod |
| `llms.txt` | GEO：供 LLM / AI 搜索引用的站点摘要 |
| `favicon.ico` / `favicon.svg` / `favicon-48x48.png` | 浏览器标签 + Google 搜索结果小图标 |
| `apple-touch-icon.png` | iOS 主屏幕 180×180 |
| `og-image.svg` → `og-image.png` | OG/Twitter 分享图 1200×630 |
| `site.webmanifest` | PWA 图标声明 |
| `analytics.js` | GA4 `G-BX2P31GEHW` |

## Google Search Console / Bing / 中文搜索

- GSC 验证：`googlef464172b97bd6d41.html`；详见 `docs/seo/TRACKING.md`
- Bing：2026-06-28 从 GSC 导入；[`2026-06-28-bing-webmaster-setup.md`](2026-06-28-bing-webmaster-setup.md)
- 百度等：[`2026-06-28-baidu-search-setup.md`](2026-06-28-baidu-search-setup.md)；`sitemap-zh.xml` + `seo-head-zh.js`

## Google Analytics 4

- 衡量 ID：`G-BX2P31GEHW`（各页 `<head>` 已引用 `analytics.js`）
- **基线快照（2026-07-08，近 90 天）**：626 用户；首次来源 Top5 = (direct) 40% · google 31% · bing 11% · yahoo 10% · **chatgpt.com 5.4%**（34 人，互动 38s）

---

## GEO 参考资料（外部）

### 方法论文档

| 资料 | 链接 |
|------|------|
| GEO 内容工程操作手册与评估标准 | https://doc.laoyao.cn/9fl0bc |
| GEO 内容工程系统研究报告 | https://doc.laoyao.cn/t754wa |
| GEO 方法体系与单篇内容实操教程 | https://doc.laoyao.cn/54yx5b |
| GEO: Generative Engine Optimization（Aggarwal et al., KDD'24） | https://doc.laoyao.cn/0elhy1 |
| GEO in digital repositories | https://doc.laoyao.cn/fnf30e |
| Measurement Framework: Selection vs Absorption | https://doc.laoyao.cn/ykiktr |

### 工具与 Skill

| 资源 | 链接 |
|------|------|
| GEO 改写提示词 | https://ai.laoyao.cn/ylOfC |
| GEO 改写 Skill | https://ai.laoyao.cn/cqWRs |
| 单篇 GEO 特征标注演示 | https://doc.laoyao.cn/00j3ps |
| yao-geo-skills | https://github.com/yaojingang/yao-geo-skills |
| GEOFlow | https://github.com/yaojingang/GEOFlow |
| yao-meta-skill | https://github.com/yaojingang/yao-meta-skill |
| geo-citation-lab 数据集 | https://github.com/yaojingang/geo-citation-lab |

### 框架要点（落盘摘要）

1. **两阶段指标**：Citation **Selection**（被检索选中）与 **Absorption**（事实/结构被吸收进答案）分开测。
2. **知识原子**：定义句、数字、对比、步骤、边界条件、官方出处 — 优于纯 Q&A 包装。
3. **白帽有效手段**（论文 + 实证）：统计数据、权威引用、引语、模块化结构、语义对齐；keyword stuffing 对生成引擎几乎无效。
4. **平台差异**：ChatGPT 引用少但吸收深；Perplexity 引用广但浅；Google AI 常并入 `google` 来源。
5. **测量**：Prompt Graph + 重复试验 + before/after，不能只看单次截图或 citation 数量。

---

## 为何 GA4「首次用户来源」里几乎没有其他 AI？

> 快照：仅见 `chatgpt.com`（34）+ `openai`（3），未见 Perplexity / Claude / Gemini / Copilot / Kimi 等。

| 原因 | 说明 |
|------|------|
| **归因合并到传统搜索** | Google AI Overview / Gemini 点击、Bing Copilot 点击，GA4 通常记为 **`google` / `bing`**，不会单独标 AI。你站 bing 67 人里可能含 Copilot 流量。 |
| **零点击** | AI 在对话内直接给时刻/路线，用户不点链接 → **GA4 完全看不到**，但站点可能已被引用（Selection/Absorption 成功，却无会话）。 |
| **Referrer 缺失** | 部分客户端（含 Claude、部分 App 内浏览器）不带 `Referer` 或剥掉 → 落入 **`(direct)`**（你站 direct 占 40%，其中一部分可能是 AI 引荐）。 |
| **量级低于 Top 10** | 90 天仅 626 用户；Perplexity 等长尾可能各 1–3 人，排在第 11 名以后报表不展示。 |
| **爬虫 ≠ 用户** | `robots.txt` 已 Allow 的 GPTBot / PerplexityBot 等是**索引抓取**，不进「用户获取」报告。 |
| **中文 AI 生态** | Kimi / 豆包 / DeepSeek 等对日文·英文小岛交通垂类覆盖弱，且多不向外链发稳定 referrer。 |
| **测量口径** | 「首次用户来源」= 人类点击进站；**不等于**「被 AI 引用次数」。后者需 Prompt 试验（见下）。 |

**建议补测（GA4 里操作）**

1. **报告 → 流量获取 → 流量获取：会话来源/媒介** — 搜 `perplexity`、`claude`、`gemini`、`copilot`（含大小写）。
2. **探索** — 维度 `会话来源` 含 `ai` / `gpt` / `pplx` 的正则过滤。
3. **GA4 管理 → 数据展示 → 引荐来源排除列表** — 确认未误把 AI 域名标为「站内」。
4. **站内事件**（可选后续）：`?utm_source=chatgpt` 等 UTM 无法覆盖无点击场景；真正可见性靠 **GEOFlow / 手工 Prompt 试验**。

---

## GEO 首轮审计（2026-07-08）

### 现状评分（自评 / 100 分卡简版）

| 维度 | 得分 | 证据 |
|------|------|------|
| L0 战略与边界 | 15/15 | 工具站定位清晰；非官方、有免责声明 |
| L1 Prompt Graph | 5/15 | 未系统列出目标问法（英/日/中） |
| L2 知识资产 | 12/20 | 时刻/票价数据准；缺「可抄走」的数字块 |
| L3 结构与证据 | 14/20 | `llms.txt`、JSON-LD、FAQ；FAQ 缺具体班次/票价数字 |
| L4 权威网络 | 8/15 | 链官方 PDF；缺第三方一致事实（维基/观光协会等文内互证） |
| L5 测量 | 3/15 | 仅有 GA4 来源；无 Selection/Absorption 基线 |
| **合计** | **57/100** | 工具强、GEO 工程化弱 |

### 与 GA4 现象的对应

- `chatgpt.com` 有量但互动 **38s** → 多为**点进来用工具**，未必在答案里**吸收**了页面文本。
- 优化方向：让关键事实在**静态 HTML** 即可被抽取（不仅靠 JS 渲染结果）。

### Prompt Graph（首批，待实测）

| 语言 | 示例 Prompt |
|------|-------------|
| EN | How to get from Miyanoura Port to Shiratani Unsuikyo by bus? |
| EN | Yakushima bus timetable 2026 / bus fare Miyanoura to Anbo |
| EN | How to visit Jomon Sugi without a car? |
| JA | 屋久島 バス 時刻表 宮之浦 白谷 |
| JA | 屋久島 レンタカーなし バスだけで回る |
| ZH | 屋久岛公交时刻表 2026 / 屋久岛没车怎么玩 |

### 优先改动（下一轮 GEO 实施）

| 优先级 | 页面 | 动作 | 状态 |
|--------|------|------|------|
| P0 | `/without-car/` | 增加**证据容器**：定义 + 典型区间首末班表 + 票价区间数字 + 官方 PDF 链接 | ✅ 2026-07-08 |
| P0 | `/` 静态区 | FAQ 补 2–3 条**带具体数字**的问答（如宫之浦↔机场班次范围） | ✅ 2026-07-08 |
| P1 | `llms.txt` | 补关键数字摘要（非仅导航链接） | ✅ 2026-07-08 |
| P1 | `/trekking/` | 登山口巴士季節（3–11 月）+ 班次要点表 |
| P2 | 全站 | `dateModified` / 页面「数据截至」与 schema 同步 |
| P2 | 测量 | 用 [GEOFlow](https://github.com/yaojingang/GEOFlow) 或手工对 6 条 Prompt 记 Selection / Absorption 基线 |

### 白帽边界（本项目）

- 不做：隐蔽文本、虚假统计、提示注入、冒充官方。
- 做：真实官方数据、可核对数字、清晰非官方声明、结构化的步骤与对比。

---

## 后续可选（SEO）

- map/access 加 `?lang=` hreflang 与首页一致
- 1–2 篇 `/tips/` 乘车指南（链回工具，不扩成攻略站）
