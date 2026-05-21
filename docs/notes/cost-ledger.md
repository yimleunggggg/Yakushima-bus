# 项目成本台账（待汇总）

> 用户计划最后统一核算整体成本（含 token / API 等）。有新支出请追加一行。

| 日期 | 项目 | 金额 | 备注 |
|------|------|------|------|
| 2026-05-20 | 域名 `yakushimabus.com`（腾讯云） | ¥83 | 首年；微信支付；订单 20260520010000868069691675958468 |
| — | GitHub Pages 托管 | ¥0 | 静态站免费 |
| — | Cursor / LLM token | 待填（见下方估算） | 精确用量见 Cursor Settings → Usage |
| — | 域名续费（次年） | 待查 | 腾讯云控制台查看续费价 |

## 时间与 Token 估算（2026-05-21 修订）

> **口径**：仓库最早产物 → **5/21 01:05 最后一次 commit**。Token 无法从本地日志精确还原（压缩、多窗口、工具截断）。

### 时间

| 指标 | 数值 |
|------|------|
| 首行代码/最早产物 | **2026-05-20 12:15:20**（`_pdf_raw.txt`） |
| 最后一次 commit | **2026-05-21 01:05:32**（`df9fff9`） |
| **日历跨度** | **12 小时 50 分**（不含 5/21 白天后续对话） |
| Git 连续提交窗口 | 18:49 → 01:05，约 **6.3h** |
| 对话窗口 | ≥2 个（`c47e3ffd` + `61ad155c` 主 Agent；`empty-window` 有同 ID 副本勿重复计） |
| 用户轮次（去重） | 主会话 **~170 轮** + 子 agent **~3 轮** |

### 模型与计费

- **本项目实际使用**：Cursor **Composer 2.5**（Cursor 独占，无厂商公开 API 可对标）
- **对外比价**：见下节「厂商官方 API 单价」表（Moonshot / 智谱 / OpenAI / Anthropic）
- **有 context 压缩**：~200k 自动 summarization；本地 transcript 低估真实 token

## 理论成本参考（给别人看 · 2026-05-21）

> **目的**：若用同等工作量、按各模型 **公开 API 单价** 直调（不管 Cursor 套餐/额度），大概花多少钱。  
> **非你的真实账单**；真实值以 [cursor.com/dashboard/usage](https://cursor.com/dashboard/usage) 为准。

### 估算方法（基于 ~20 万 token 自动压缩）

Cursor Agent 在上下文接近上限时会 **自动 summarization**（社区与文档普遍描述在 **~200k token** 量级触发；压缩后保留约 **1k token** 摘要 + 继续对话）。本项目特征：

| 参数 | 取值 |
|------|------|
| 用户轮次 | ~170 |
| Agent 回复 + 工具 | ~970 回复 / ~2100 工具调用 |
| 估算 API 调用次数 | **1200 – 1800**（每轮用户消息含多步 tool loop） |
| 压缩次数 | **6 – 18**（≈ 每 15–25 轮用户消息或每 ~200k 上下文吞吐触发 1 次） |

**每个压缩周期**内：上下文从 ~1k 摘要长到 ~200k，期间每次 API 请求都会 **重复计费整段可见上下文**（缓存命中则 input 更便宜；下表 **未计 cache**，偏保守上限）。

由此得到三档 **总 token 吞吐**（input 为主，Agent 项目通常 input ≫ output）：

| 档位 | 总 Input | 总 Output | 压缩次数 | 适用 |
|------|----------|-----------|----------|------|
| **低** | 1200 万 | 60 万 | ~6 | 少挂 skill、工具输出短 |
| **中** | 2400 万 | 100 万 | ~10 | **本项目最可能区间** |
| **高** | 4500 万 | 180 万 | ~18 | 大量设计 skill、截图、长 PDF/代码回读 |

### 各模型理论费用（厂商官方 API 单价 · 美元）

> **定价来源**：各模型厂商官网/API 文档标价，**不是 Cursor 转售/套餐价**。  
> 计费口径：**标准 Input + Output**（不含 Prompt Cache / Batch 折扣）。汇率 **1 USD ≈ ¥7.25**。

#### 单价出处（2026-05 查阅）

| 模型 | Input / M | Output / M | 官方来源 |
|------|-----------|------------|----------|
| Kimi K2（`kimi-k2-0905`） | $0.60 | $2.50 | [Moonshot 官网](https://platform.moonshot.ai/) |
| Kimi K2.5 | $0.60 | $3.00 | [Moonshot 官网](https://platform.moonshot.ai/) |
| GLM-4.7 | $0.60 | $2.20 | [智谱开放文档 / 定价](https://open.bigmodel.cn/pricing) |
| GLM-4.5-Air | $0.20 | $1.10 | [智谱开放文档 / 定价](https://open.bigmodel.cn/pricing) |
| GPT-5.4 mini | $0.75 | $4.50 | [OpenAI API Pricing](https://openai.com/api/pricing/) |
| GPT-5-Codex | $1.25 | $10.00 | [OpenAI API Pricing](https://openai.com/api/pricing/) |
| GPT-5.2-Codex | $1.75 | $14.00 | [OpenAI API Pricing](https://openai.com/api/pricing/) |
| GPT-5.4 | $2.50 | $15.00 | [OpenAI API Pricing](https://openai.com/api/pricing/) |
| Claude Haiku 4.5 | $1.00 | $5.00 | [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Sonnet 4.6 | $3.00 | $15.00 | [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Opus 4.6 | $5.00 | $25.00 | [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) |

> **说明**：本项目实际在 Cursor 里用的是 **Composer 2.5**（Cursor 自研，**无独立公开 API**）。下表用于「若用同等 token 量直调各厂商 API」的横向对比；Agent 编码场景可优先对照 **Kimi K2 / GLM-4.7 / GPT-5.x-Codex**。

#### 中档（24M in / 1M out）— 推荐对外引用

| 模型 | **USD** | **≈ CNY** |
|------|---------|-----------|
| GLM-4.5-Air | $5.9 | ¥43 |
| Kimi K2 | $16.9 | ¥123 |
| GLM-4.7 | $16.6 | ¥120 |
| Kimi K2.5 | $17.4 | ¥126 |
| GPT-5.4 mini | $22.5 | ¥163 |
| Claude Haiku 4.5 | $29.0 | ¥210 |
| GPT-5-Codex | $40.0 | ¥290 |
| GPT-5.2-Codex | $56.0 | ¥406 |
| GPT-5.4 | $75.0 | ¥544 |
| Claude Sonnet 4.6 | $87.0 | ¥631 |
| Claude Opus 4.6 | $145.0 | ¥1051 |

#### 三档区间（Kimi K2 vs GLM-4.7 vs Claude Sonnet）

| 档位 | Kimi K2 | GLM-4.7 | Claude Sonnet 4.6 |
|------|---------|---------|---------------------|
| 低（12M/0.6M） | $8.7 / ¥63 | $8.5 / ¥62 | $45 / ¥326 |
| **中（24M/1M）** | **$16.9 / ¥123** | **$16.6 / ¥120** | **$87 / ¥631** |
| 高（45M/1.8M） | $31.5 / ¥228 | $31.0 / ¥224 | $162 / ¥1174 |

#### 怎么跟别人一句话解释

> 屋久岛公交站（**~13h、170 轮 Agent、~10 次 200k 压缩**），若 **直调厂商 API**（中档 token）：**Kimi K2 / GLM-4.7 约 ¥120**；**GLM-4.5-Air 约 ¥43**；**GPT-5.2-Codex 约 ¥406**；**Claude Sonnet 约 ¥631**。另加域名 **¥83**。在 Cursor 里实际走 Composer 套餐，不等于上表直调价。

### 说明与误差

1. **压缩**：~200k 触发 summarization 后，真实 input 低于 naive 累加；上表 token 档位已按压缩周期估算，仍 **±40%** 误差。  
2. **未计 Cache / Batch**：Kimi cache hit $0.15/M、Claude cache read 0.1×、OpenAI cached input 等可再 **降 20–40%**。  
3. **未计图片 / skill 注入**：多次设计 skill + 截图，偏 **高档** 更接近。  
4. **智谱国内价**：`open.bigmodel.cn` 可能有人民币标价，与美元标价略有差异，对外分享以 **定价页实时为准**。  
5. **Cursor 用量页** 显示的是 Cursor 侧 **$ 消耗**，不是厂商原价；要用上表估算需自备 in/out token 档位。

### 精力 / token 阶段分布（含各模型理论费用）

> **占比**来自 commit 结构、docs 笔记与对话内容的人工归集（非简单关键词计数）。  
> Token 按 **中档 24M in / 1M out** 拆分；费用按 **厂商官方 API 单价** 计算。

| 占比 | 阶段 | 估 Input | 估 Output | Kimi K2 | GLM-4.7 | Sonnet | 用户轮次(估) | 时段（5/20–5/21） |
|------|------|----------|-----------|---------|---------|--------|-------------|------------------|
| ~25% | **数据层** | ~6M | ~0.25M | $4.2 / ¥31 | $4.1 / ¥30 | $21.8 / ¥158 | ~40 | 12:15–16:00 |
| ~25% | **UI / 视觉** | ~6M | ~0.25M | $4.2 / ¥31 | $4.1 / ¥30 | $21.8 / ¥158 | ~35 | 16:00–20:30 |
| ~15% | **多页功能** | ~3M | ~0.15M | $2.2 / ¥16 | $2.1 / ¥15 | $11.2 / ¥82 | ~25 | 14:00–22:00 |
| ~15% | **PDF 方案** | ~3M | ~0.15M | $2.2 / ¥16 | $2.1 / ¥15 | $11.2 / ¥82 | ~20 | 22:00–01:00 |
| ~10% | **部署 / SEO** | ~2M | ~0.10M | $1.4 / ¥11 | $1.4 / ¥10 | $7.5 / ¥54 | ~15 | 18:49–23:30 |
| ~8% | **PC 双栏** | ~1.9M | ~0.08M | $1.3 / ¥10 | $1.3 / ¥9 | $7.0 / ¥51 | ~12 | 23:30–01:00 |
| ~2% | **三语 / 文案** | ~0.5M | ~0.02M | $0.4 / ¥3 | $0.3 / ¥2 | $2.0 / ¥15 | ~5 | 分散 |
| **合计** | | **~24M** | **~1M** | **$16.9 / ¥123** | **$16.6 / ¥120** | **$87 / ¥631** | **~170** | **12h50m** |

#### 各阶段主要产出

| 阶段 | 主要文件 / 交付 |
|------|----------------|
| 数据层 | `scripts/parse_pdf.py`、`data.js`、`sources/`、`map-data.js` |
| UI / 视觉 | `styles.css` 雨林 v2/v3、`operator-ui.js`、下一班卡片 |
| 多页功能 | `map/`、`access/`、`about/`、`stop-picker.js`、空班次托底 |
| PDF 方案 | `pdf-viewer.js`、`assets/pdf/`、`assets/pdf-preview/` |
| 部署 / SEO | `CNAME`、GA4、favicon、clean URL、`analytics.js` |
| PC 双栏 | `panel-grid`、`map-layout`、aux 全宽（仅 ≥768px） |
| 三语 / 文案 | 四页 JA·ZH·EN、`about-data.js` |

#### 读表提示

- **数据层 + UI** 合计约 **50%** token，是成本大头（PDF 解析 + 多轮设计评审）。  
- **PDF + PC 双栏** 集中在最后 3 小时，单次 tool 调用多，单位时间 token 密度高。  
- 若用 **GLM-4.5-Air** 替代 Kimi K2，全项目理论价约 **¥43**（中档），各阶段按比例 **×0.35** 即可。


### 已知现金成本

- **¥83** 域名（首年）+ **GitHub Pages ¥0**
- Cursor Pro **$20/月**（含 Composer 额度 + $20 API 池；是否超额看 dashboard）

## 待办（域名）

- [ ] 实名审核通过
- [ ] DNSPod：4 条 A → GitHub Pages IP
- [ ] 恢复仓库 `CNAME`（`yakushimabus.com`）
- [ ] GitHub Pages Custom domain + Enforce HTTPS
