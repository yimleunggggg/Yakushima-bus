# 项目节点

这是 BuildTrace 项目节点记忆的人类可读版。

它记录当时为什么做、项目变化、技术实现、依据/来源，以及后续结果回看。

请按时间倒序记录，最新节点放在最前。

---

## 待回看/待补结果

- 暂无。

---

## 节点

## YYYY-MM-DD - Short node title

**status**: 待回看 (pending-review)
**scenario**: 功能新增 (feature) | Bug 修复 (bugfix) | 优化 (optimization) | 实验 (experiment) | 数据/埋点 (analytics-data) | SEO/增长 (growth-seo) | 变现/交易 (monetization) | 架构/重构 (architecture) | 内容/文案 (content) | 运维/发布 (ops-release) | App (app-mobile) | AI/提示词 (ai-prompt) | 安全/隐私 (security-privacy)
**type**: 功能 (feature), 实验 (experiment), 优化 (optimization), 修复 (bugfix), 数据 (data), 架构 (architecture), 内容 (content), SEO (seo), 变现 (monetization), 运维 (ops), 决策 (decision), 快照 (snapshot)
**review_due**: YYYY-MM-DD or none（建议回看日，不是审核）
**date_confidence**: commit-exact | doc-exact | user-confirmed | date-inferred | unknown
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话:
- 理解/提炼:
- 可信度: 用户已确认 (confirmed-by-user) | 根据证据推断 (inferred) | 未捕捉原话 (not-captured)

### 人话摘要
- 发生了什么:
- 为什么重要:

### 场景细节
- 问题/机会:
- 这一轮解决方案:
- 成功信号:
- 风险/未解决:

### 项目变化
- 加了:
- 改了:
- 减去了:
- 优化了:

### 技术实现
- 技术备注:
- 相关文件:
- 数据或结构:
- 架构/配置:
- 验证:

### 依据/来源
- sourceRefs:
- evidence:
- 日期依据:

### 用户备注
- 

### 外部时间线
- GA4/PostHog:
- GitHub/Vercel:
- Stripe/交易:
- 手填事件:

### 结果回看
- 回看时观察什么:
- 当前结果: 待回填 (pending) | 有效 (worked) | 无效/有害 (did-not-work) | 不确定 (unclear) | 无需回看 (not-needed)
- 经验/结论:

---

## Example

## 2026-06-30 - Chinese-first Baidu landing behavior

**status**: 待回看 (pending-review)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 体验 (ux), 获客 (acquisition)
**review_due**: 2026-07-14（建议回看日，不是审核）
**date_confidence**: 用户确认 (user-confirmed)

### 当时为什么做
- 原话: "Baidu users may have Chinese intent. An English landing page may make them leave."
- 理解/提炼: 用户认为中文搜索来源可能带有中文阅读意图，英文优先落地页可能增加理解和行动成本。
- 可信度: 用户已确认 (confirmed-by-user)

### 人话摘要
- 发生了什么: 对百度来源访客优先给中文信息，让中文搜索用户更容易理解页面。
- 为什么重要: 这关系到自然搜索来的用户能不能继续看路线和完成关键动作。

### 场景细节
- 问题/机会: 中文搜索来源可能被英文首屏劝退。
- 这一轮解决方案: 增加中文元信息并调整首访语言启动逻辑。
- 成功信号: 百度自然访问、中文页面访问、路线点击和关键事件有方向性改善。
- 风险/未解决: 流量小，短期很难严格归因。

### 项目变化
- 加了: 中文 metadata 和 Open Graph 内容。
- 改了: 百度来源首访语言启动逻辑。
- 减去了: 无。
- 优化了: 中文访客落地体验。

### 技术实现
- 技术备注: 前端按来源/referrer 做首访语言引导，并补充中文 SEO 文件。
- 相关文件: `seo-head-zh.js`, `lang-boot.js`
- 数据或结构: 无
- 架构/配置: 前端语言路由
- 验证: 本地 URL 检查和线上冒烟测试

### 依据/来源
- sourceRefs: `notes/2026-06-28-baidu-search-setup.md`, `commit hash if available`
- evidence:
- 日期依据: 用户确认 (user-confirmed)

### 用户备注
- 可写一句自己的主观判断或后续补充。

### 外部时间线
- GA4/PostHog: 后续可导入自然搜索、中文页浏览、路线点击等聚合数据。
- GitHub/Vercel: 后续可导入对应 commit、PR、生产部署。
- Stripe/交易: 无。
- 手填事件: 用户可在看 GA4/GSC 后手填关键观察。

### 结果回看
- 回看时观察什么: 7-14 天后看百度自然流量、中文页面访问、路线点击、关键事件。
- 当前结果: 待回填 (pending)
- 经验/结论:
