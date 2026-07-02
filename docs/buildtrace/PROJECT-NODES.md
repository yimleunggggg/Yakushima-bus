# 项目节点

由 BuildTrace `nodes.json` 生成。

按时间倒序排列，最新节点在最前。

---

## 项目入口

- 代码 - [GitHub 仓库](https://github.com/yimleunggggg/Yakushima-bus)：origin remote（git remote -v）
- 部署 - [生产站点](https://yakushimabus.com)：GitHub Pages · docs/buildtrace/PROJECT-PROFILE.md
- 文档 - [运维变更日志](docs/OPS-JOURNAL.md)：版本加减改主文件
- 文档 - [项目档案](docs/buildtrace/PROJECT-PROFILE.md)：目标、指标、约束与 Agent 上下文
- 数据 - GA4：测量 ID G-BX2P31GEHW · PROJECT-PROFILE（后台 URL 未存）
- 文档 - [SEO 自动化 RUNBOOK](docs/seo/RUNBOOK.md)：GSC/GA4 日报与 metrics 流水线
- 数据 - [Bing Webmaster](https://www.bing.com/webmasters/)：搜索性能与建议的操作；yakushimabus.com

---

## 待回看/待补结果

- 2026-07-02 - Bing 建议：加长 meta description（首页与旧 /access/）
- 2026-07-15 - Trace / BuildTrace v1.5 安装与节点迁移
- 2026-07-08 - PDF 列对齐、时刻表搜索体验、登山联盟区
- 2026-07-13 - 区间车程合理性过滤
- 2026-07-12 - 邻近站班次提示、行程卡与下一班提示条
- 2026-07-07 - 38 天复盘：累积布局偏移、结构化数据、sitemap、可及性
- 2026-07-06 - 中文 SEO 动态元信息与百度首访
- 2026-07-07 - GA4 事件委托与内部流量过滤
- 2026-07-10 - 便利设施地图 /guide/ → /map/
- 2026-07-08 - PDF 全表 15 列与构建审计
- 2026-07-15 - Klook/Viator 联盟页内投放策略
- none - URL 重命名 /fare/ /ferry/
- none - 六页工具站与产品介绍页 SEO 更新
- none - 全站星级反馈与精简页脚
- none - POI 便利设施地图与公交站名单一来源
- none - 登山参考页 /trekking/
- none - Ko-fi 赞助入口
- none - 全站 UI 层级统一与日文 SEO

---

## 节点

## 2026-06-30 - Bing 建议：加长 meta description（首页与旧 /access/）

**status**: 待回看 (pending-review)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 优化 (optimization)
**review_due**: 2026-07-02（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: Bing 后台提示 meta 过短（2 页）；用户同步了搜索性能截图（6/28–6/30 已有 74 展示/10 点击），希望在收录起步期消除技术性 SEO 建议。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: Bing Webmaster「建议的操作」标记首页与 /access/ 的 meta description 过短；加长首页与 /ferry/ 描述至约 150 字，/access/ 补描述并 noindex 将权重归并 /ferry/。
- 为什么重要: Bing 建议操作：Meta descriptions too short；影响页为 / 与 /access/。

### 场景细节
- 问题/机会: Bing 建议操作：Meta descriptions too short；影响页为 / 与 /access/。
- 这一轮解决方案: 首页与 /ferry/ description 扩至 Bing 建议的 150–160 字量级；/access/ 为 301 跳转页，补说明性 description 并 noindex。
- 成功信号: Bing「建议的操作」该条消失或复扫通过；/ 与 /ferry/ CTR 不恶化。
- 风险/未解决: 改动未 push 前线上仍显示旧文案；/map/ 展示高但 CTR 低是另题。

### 项目变化
- 加了: /access/ 跳转页 meta description; noindex, follow on /access/
- 改了: 首页 meta description / og / twitter 加长; /ferry/ meta description 加长; seo-head-zh.js 首页与船运中文 description 加长; 全站 seo-head-zh 缓存 seo-zh-v2
- 减去了: /access/ 参与索引（noindex）
- 优化了: Bing 技术性 SEO 建议项

### 技术实现
- 技术备注: index.html、ferry/index.html meta/og/twitter；access/index.html 加 description + robots noindex；seo-head-zh.js v2；OPS-JOURNAL V1.8.3。
- 相关文件: index.html; ferry/index.html; access/index.html; seo-head-zh.js; docs/OPS-JOURNAL.md
- 数据或结构: 无数据结构变更
- 架构/配置: 静态 HTML meta + seo-head-zh 中文覆盖
- 验证: 部署后 Bing URL 检查 / 建议的操作复扫（约 48h+）

### 依据/来源
- sourceRefs: 
- evidence: doc: docs/OPS-JOURNAL.md V1.8.3: 运维版本记录; file: index.html: meta description 加长; file: access/index.html: 原无 description；现 noindex+说明; manual: 用户 Bing Webmaster 截图 2026-06-30: 建议操作 2 页 + 搜索性能 74 展示/10 点击
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 2026-06-30 - Bing 搜索性能基线（用户截图） - 74 展示 / 10 点击 / CTR 13.51%（6/28–6/30） - 日本 71 展示；设备全桌面；首页 41 展示 7 点击，/map/ 30 展示 1 点击; 2026-06-30 - Bing 建议：meta description 过短 - 2 页：/ 与 /access/ - 严重性中等；建议 150–160 字符

### 结果回看
- 回看时观察什么: Bing 建议的操作是否清除；首页与 /ferry/ 展示点击（48h+ 后）
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-30 - Trace / BuildTrace v1.10 工具升级（资料柜 + 看板编辑）

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 快照 (snapshot)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 用户确认 (user-confirmed)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 请读取 docs/buildtrace/CURSOR-UPDATE-PROMPT.md，并按这个项目内的 BuildTrace / Trace v1.10 规则继续维护。不要覆盖用户数据；项目入口写回 project.resources（id/category/title/url/note）。
- 理解/提炼: 升级 Trace 工具到 v1.10，强化资料柜与证据规范，同时保留已回填节点与用户字段，并从项目档案/git 初始化稳定入口链接。
- 可信度: 用户已确认 (confirmed-by-user)

### 人话摘要
- 发生了什么: 按 CURSOR-UPDATE-PROMPT 覆盖 v1.10 工具文件，保留 40 条历史节点；看板增强项目资料柜（id/category/title/url/note）与入口编辑，并初始化 6 个有依据的项目入口。
- 为什么重要: v1.8 缺少 v1.10 的资料柜 id 字段、入口编辑/移除 UI 与更新后的 lifecycle 流程。

### 场景细节
- 问题/机会: v1.8 缺少 v1.10 的资料柜 id 字段、入口编辑/移除 UI 与更新后的 lifecycle 流程。
- 这一轮解决方案: 只覆盖工具文件，备份 nodes.json，写入 project.resources，新增升级节点并重生成 PROJECT-NODES.md。
- 成功信号: 看板显示 41 节点与 6 条项目入口；历史 userNotes/hidden/sourceRefs 未丢失。
- 风险/未解决: 资料柜 URL 仅来自 PROFILE/git，GA4 后台链未存需用户后续补。

### 项目变化
- 加了: project.resources 6 条（GitHub、生产站、OPS-JOURNAL、PROJECT-PROFILE、GA4 备注、SEO RUNBOOK）; docs/buildtrace/backups/nodes-before-v1.10.json; 看板资料柜编辑/移除与 resource-board UI
- 改了: Trace v1.10 viewer/SKILL/scripts/references/CURSOR-UPDATE-PROMPT; .cursor/rules/buildtrace.mdc; ~/.cursor/skills/buildtrace/
- 减去了: 
- 优化了: 看板 boot 优先读 ../nodes.json，清空缓存后重载项目数据

### 技术实现
- 技术备注: buildtrace-v1.10.zip 覆盖 viewer/SKILL/scripts/references/CURSOR-UPDATE-PROMPT；备份 nodes-before-v1.10.json；viewer boot 优先 ../nodes.json。
- 相关文件: docs/buildtrace/viewer/index.html; docs/buildtrace/SKILL.md; docs/buildtrace/CURSOR-UPDATE-PROMPT.md; docs/buildtrace/templates/nodes.schema.json; .cursor/rules/buildtrace.mdc
- 数据或结构: buildtrace.nodes.v1 + project.resources.id
- 架构/配置: JSON 主源 + Markdown 导出 + Trace 静态看板
- 验证: node docs/buildtrace/scripts/nodes-json-to-md.mjs docs/buildtrace/nodes.json docs/buildtrace/PROJECT-NODES.md

### 依据/来源
- sourceRefs: 
- evidence: file: buildtrace-v1.10.zip: 安装包（outputs/buildtrace-v1.10.zip）; file: docs/buildtrace/backups/nodes-before-v1.10.json: 升级前备份（40 节点）; file: docs/buildtrace/CURSOR-UPDATE-PROMPT.md: v1.10 更新边界; doc: docs/buildtrace/PROJECT-PROFILE.md: 站点/GA4 依据; command: git remote -v: GitHub 仓库 URL
- 日期依据: 用户确认 (user-confirmed)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 2026-06-30 - 用户发起 v1.10 按边界升级 - 本轮任务对话

### 结果回看
- 回看时观察什么: 看板资料柜是否显示 6 入口；节点数是否为 41。
- 当前结果: 无需回看 (not-needed)
- 经验/结论: project.resources 与节点证据分轨：资料柜放稳定入口，节点 cite sourceRefs/evidence。

---

## 2026-06-30 - Trace / BuildTrace v1.8 工具升级（保留 39 节点）

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 快照 (snapshot)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 用户确认 (user-confirmed)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 请先读取 docs/buildtrace/CURSOR-UPDATE-PROMPT.md，然后按里面的边界维护 BuildTrace。当前版本是 BuildTrace / Trace v1.8。更新工具文件可以覆盖，但不要覆盖 docs/buildtrace/nodes.json、PROJECT-PROFILE.md、evidence/、project.resources、userNotes、hidden、sourceRefs。
- 理解/提炼: 将 Trace 工具链升级到 v1.8，增强看板与证据/生命周期规范，但不丢失已回填的 39 条真实项目节点与用户档案。
- 可信度: 用户已确认 (confirmed-by-user)

### 人话摘要
- 发生了什么: 按 CURSOR-UPDATE-PROMPT 边界覆盖 v1.8 工具文件，保留 nodes.json、PROJECT-PROFILE 与全部历史节点；看板新增里程碑轨、资料柜与 sourceRefs/userNotes/hidden 编辑。
- 为什么重要: v1.6 看板缺少 v1.8 的里程碑轨、资料柜、sourceRefs 编辑与 evidence-policy/lifecycle 参考文档。

### 场景细节
- 问题/机会: v1.6 看板缺少 v1.8 的里程碑轨、资料柜、sourceRefs 编辑与 evidence-policy/lifecycle 参考文档。
- 这一轮解决方案: 按更新边界只覆盖工具文件，备份 nodes.json，重生成 PROJECT-NODES.md，并记录本轮升级节点。
- 成功信号: 看板本地服务加载 40 条节点；PROJECT-PROFILE 与历史节点字段未丢失。
- 风险/未解决: 覆盖 viewer 可能回退 ../nodes.json 加载修复（已在安装后补回）。

### 项目变化
- 加了: docs/buildtrace/CURSOR-UPDATE-PROMPT.md; docs/buildtrace/references/evidence-policy.md; docs/buildtrace/references/lifecycle.md; docs/buildtrace/release/ 发布文案; 看板里程碑轨与 project.resources 资料柜 UI
- 改了: Trace v1.8 viewer/SKILL/scripts/references; .cursor/rules/buildtrace.mdc; ~/.cursor/skills/buildtrace/
- 减去了: 
- 优化了: 看板启动优先读 ../nodes.json；清空缓存并重载而非回示例

### 技术实现
- 技术备注: buildtrace-v1.8.zip 覆盖 viewer/SKILL/scripts/references/release/CURSOR-UPDATE-PROMPT；备份 nodes-before-v1.8.json；viewer 继续优先加载 ../nodes.json。
- 相关文件: docs/buildtrace/viewer/index.html; docs/buildtrace/SKILL.md; docs/buildtrace/scripts/nodes-json-to-md.mjs; docs/buildtrace/CURSOR-UPDATE-PROMPT.md; .cursor/rules/buildtrace.mdc
- 数据或结构: buildtrace.nodes.v1 + v1.8 字段（sourceRefs/userNotes/hidden/resources）
- 架构/配置: JSON 主源 + Markdown 导出 + Trace 静态看板
- 验证: node docs/buildtrace/scripts/nodes-json-to-md.mjs docs/buildtrace/nodes.json docs/buildtrace/PROJECT-NODES.md

### 依据/来源
- sourceRefs: 
- evidence: file: buildtrace-v1.8.zip: 安装包（用户路径 outputs/buildtrace-v1.8.zip）; file: docs/buildtrace/backups/nodes-before-v1.8.json: 升级前备份（39 节点）; doc: docs/buildtrace/CURSOR-UPDATE-PROMPT.md: 更新边界与维护流程; doc: docs/OPS-JOURNAL.md V1.8.1: 运维记录
- 日期依据: 用户确认 (user-confirmed)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 2026-06-30 - 用户发起 v1.8 按边界升级 - 本轮任务对话

### 结果回看
- 回看时观察什么: 看板是否显示 40 节点；里程碑轨与资料柜是否正常。
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 工具升级与用户节点数据应分轨维护，升级前先备份 nodes.json。

---

## 2026-07-01 - Trace / BuildTrace v1.5 安装与节点迁移

**status**: 待回看 (pending-review)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 快照 (snapshot)
**review_due**: 2026-07-15（建议回看日，不是审核）
**date_confidence**: 用户确认 (user-confirmed)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 用户要求先清理旧版 SHIPLOG/BuildTrace/Trace，安装 buildtrace-v1.5.zip，备份并迁移旧 nodes.json，再跑 quick backfill。
- 理解/提炼: 将项目记忆系统升级到 v1.5（Trace 看板 + 场景字段 + 外部时间线），保留已有 38 条真实节点而非重新编造历史。
- 可信度: 用户已确认 (confirmed-by-user)

### 人话摘要
- 发生了什么: 清理旧版 SHIPLOG/BuildTrace，备份 38 条节点并迁移到 v1.5 结构（场景、人话摘要、结构化证据）。
- 为什么重要: 旧版 BuildTrace v1.2 缺少 v1.5 的场景字段、结构化证据与 Trace 看板。

### 场景细节
- 问题/机会: 旧版 BuildTrace v1.2 缺少 v1.5 的场景字段、结构化证据与 Trace 看板。
- 这一轮解决方案: 备份旧 nodes.json，安装 v1.5 包，迁移节点结构，quick backfill 验证近期来源。
- 成功信号: 看板导入后显示完整节点；缺意图节点仍标注 uncertainty。
- 风险/未解决: 迁移可能丢失 v1.2 特有 meta 字段（已写入备份）。

### 项目变化
- 加了: Trace v1.5 viewer/references/scripts; nodes.json v1.5 字段（plainSummary/scenario/dateConfidence/structured evidence）; docs/buildtrace/backups/nodes-before-v1.5.json
- 改了: 38 条节点从 v1.2 结构迁移到 v1.5; .cursor/rules/buildtrace.mdc 更新
- 减去了: BuildTrace v1.2 包文件（由 v1.5 覆盖）
- 优化了: 项目记忆与 Trace 看板对齐

### 技术实现
- 技术备注: docs/buildtrace/ 替换为 v1.5 包；nodes.json 从 backups/nodes-before-v1.5.json 迁移。
- 相关文件: docs/buildtrace/nodes.json; docs/buildtrace/viewer/index.html; docs/buildtrace/SKILL.md; .cursor/rules/buildtrace.mdc
- 数据或结构: buildtrace.nodes.v1 + v1.5 扩展字段
- 架构/配置: JSON 主源 + Markdown 导出 + Trace 静态看板
- 验证: node docs/buildtrace/scripts/nodes-json-to-md.mjs

### 依据/来源
- sourceRefs: 
- evidence: file: buildtrace-v1.5.zip: 安装包; file: docs/buildtrace/backups/nodes-before-v1.5.json: 迁移前备份（38 节点）; doc: docs/OPS-JOURNAL.md V1.7.8: 运维记录
- 日期依据: 用户确认 (user-confirmed)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 2026-07-01 - 用户发起 v1.5 清理安装与 quick backfill - 本轮任务对话

### 结果回看
- 回看时观察什么: 看板导入节点数是否与 nodes.json 一致；缺意图 5 条是否仍可见。
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-07-01 - Quick backfill 来源扫描（v1.5 安装后）

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 快照 (snapshot)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 用户确认 (user-confirmed)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 用新版规则跑一轮 quick backfill。
- 理解/提炼: 安装 v1.5 后需确认近期文档与 git 是否有未收录节点；已有 deep backfill 覆盖 2026-05-20～06-30，本轮以扫描验证为主。
- 可信度: 用户已确认 (confirmed-by-user)

### 人话摘要
- 发生了什么: v1.5 安装后扫描 README、OPS-JOURNAL、notes、git log 与证据目录，确认近期无遗漏的重要节点。
- 为什么重要: 迁移后需确认没有遗漏近期重要改动。

### 场景细节
- 问题/机会: 迁移后需确认没有遗漏近期重要改动。
- 这一轮解决方案: 扫描 README、docs/OPS-JOURNAL、docs/notes、git log -15、docs/buildtrace/evidence/、backups/screenshot-pre-ui-2026-06-24/。
- 成功信号: 未发现 2026-06-30 之后的新产品节点需单独建档。
- 风险/未解决: 压缩对话历史不可读，旧意图仍可能缺失。

### 项目变化
- 加了: quick backfill 来源清单写入 project.backfill
- 改了: 
- 减去了: 
- 优化了: 避免与 deep backfill 重复造节点

### 技术实现
- 技术备注: quick backfill 仅验证近期来源，不重复 deep backfill 的 38 条历史节点。
- 相关文件: docs/buildtrace/nodes.json
- 数据或结构: project.backfill 元数据
- 架构/配置: quick backfill 扫描报告
- 验证: git log --since=2026-06-30 无新产品 commit

### 依据/来源
- sourceRefs: 
- evidence: doc: README.md: 项目定位与数据来源; doc: docs/OPS-JOURNAL.md: V1.7.8 及以前版本块; git-log: git log -15（最新 cbaef16 2026-06-30）: 无 07-01 新产品 commit; doc: docs/notes/2026-06-*: 6 月 notes 已在 deep backfill 覆盖; note: docs/buildtrace/evidence/（空）: 无截图实体; note: backups/screenshot-pre-ui-2026-06-24/: 备份目录存在，未逐文件解析
- 日期依据: 用户确认 (user-confirmed)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需单独回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 2026-06-30 之后无新产品 commit；历史节点靠迁移保留

---

## 2026-06-30 - PDF 列对齐、时刻表搜索体验、登山联盟区

**status**: 已补录 (backfilled)
**scenario**: 数据/埋点 (analytics-data)
**type**: 数据 (data), 优化 (optimization)
**review_due**: 2026-07-08（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 按 PDF 横坐标对齐重建中央线班次；地图弹窗与时刻表共用同一可信数据源；改进搜索体验与登山页三方联盟块布局。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: PDF 列对齐、时刻表搜索体验、登山联盟区：博物馆早班推断；日种空提示。
- 为什么重要: 下次 PDF 更新构建审计是否拦住列错位

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 按 PDF 横坐标对齐重建中央线班次
- 成功信号: 下次 PDF 更新构建审计是否拦住列错位
- 风险/未解决: 

### 项目变化
- 加了: 博物馆早班推断; 日种空提示; 运价审计; 登山页三列联盟块
- 改了: 中央线 columnTrips 重建; 时刻表搜索交互
- 减去了: 
- 优化了: 数据准确性与可发现性

### 技术实现
- 技术备注: 地图弹窗与时刻表搜索共用 columnTrips 单一数据源
- 相关文件: data.js; app-core.js; affiliate-ui.js; trekking/index.html
- 数据或结构: columnTrips 列班次结构
- 架构/配置: 地图弹窗与时刻表搜索共用 columnTrips 单一数据源
- 验证: build_all.py --validate; commit cbaef16

### 依据/来源
- sourceRefs: 
- evidence: commit: cbaef16: git 提交证据; doc: notes/2026-06-27-pdf-column-align.md: 项目 notes 文档
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 2026-06-30 - 关联 commit cbaef16 - cbaef16 - 由回填证据迁移，不等同于上线日期
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 下次 PDF 更新构建审计是否拦住列错位
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-29 - 区间车程合理性过滤

**status**: 已补录 (backfilled)
**scenario**: 数据/埋点 (analytics-data)
**type**: 数据 (data), 决策 (decision)
**review_due**: 2026-07-13（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: PDF 列合并产生 1 分钟跨港、291 分钟仅 3 经停等伪班次；展示它们比查不到更伤信任。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 区间车程合理性过滤：segmentSparse；min/maxPlausibleMinutes。
- 为什么重要: 用户反馈班次错误率

### 场景细节
- 问题/机会: 
- 这一轮解决方案: PDF 列合并产生 1 分钟跨港、291 分钟仅 3 经停等伪班次
- 成功信号: 用户反馈班次错误率
- 风险/未解决: 

### 项目变化
- 加了: segmentSparse; min/maxPlausibleMinutes
- 改了: findTrips 过滤离谱班次
- 减去了: 邻近提示标题「很多人不会想到这样搜」
- 优化了: 无 URL 参数时默认第一个 popular preset

### 技术实现
- 技术备注: 稀疏/密链启发式
- 相关文件: app-core.js
- 数据或结构: 运行时车程合理性过滤（无 schema 变更）
- 架构/配置: 稀疏/密链启发式
- 验证: check_route.js 安房港/博物馆区间

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-29-segment-plausibility.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 用户反馈班次错误率
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-29 - 邻近站班次提示、行程卡与下一班提示条

**status**: 已补录 (backfilled)
**scenario**: 功能新增 (feature)
**type**: 功能 (feature), 体验 (ux)
**review_due**: 2026-07-12（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 用户搜镇名但车停港口，直接零结果会跳出；岛巴士站名粒度是核心体验问题。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 邻近站班次提示、行程卡与下一班提示条：#routeTips 邻近班次提示与一键改搜；默认仅即将发车。
- 为什么重要: routeTips 后 timetable_search 二次触发率

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 用户搜镇名但车停港口，直接零结果会跳出
- 成功信号: routeTips 后 timetable_search 二次触发率
- 风险/未解决: 

### 项目变化
- 加了: #routeTips 邻近班次提示与一键改搜
- 改了: 默认仅即将发车; next-bar/ended 状态; 页脚布局
- 减去了: 
- 优化了: 联盟/PDF 全屏

### 技术实现
- 技术备注: 枚举邻近起终点组合，仅展示多出来的班次
- 相关文件: app-core.js; index.html; styles.css
- 数据或结构: STOP_NEAR_ALTS 邻近站矩阵
- 架构/配置: 枚举邻近起终点组合，仅展示多出来的班次
- 验证: commit 329d738

### 依据/来源
- sourceRefs: 
- evidence: commit: 329d738: git 提交证据; doc: notes/2026-06-28-near-route-tips.md: 项目 notes 文档
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 2026-06-29 - 关联 commit 329d738 - 329d738 - 由回填证据迁移，不等同于上线日期
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: routeTips 后 timetable_search 二次触发率
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-28 - 38 天复盘：累积布局偏移、结构化数据、sitemap、可及性

**status**: 已补录 (backfilled)
**scenario**: 优化 (optimization)
**type**: 优化 (optimization), SEO (seo)
**review_due**: 2026-07-07（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 复盘显示移动端累积布局偏移（CLS）0.495 是瓶颈；自然搜索是唯一健康增长引擎，推 SEO 前先修核心网页指标与结构化数据。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 38 天复盘：累积布局偏移、结构化数据、sitemap、可及性：关于页从业者书签提示；footer/next-bar 预留高度减 CLS。
- 为什么重要: PageSpeed Mobile CLS; GSC impression

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 复盘显示移动端累积布局偏移（CLS）0.495 是瓶颈
- 成功信号: PageSpeed Mobile CLS; GSC impression
- 风险/未解决: 

### 项目变化
- 加了: 关于页从业者书签提示
- 改了: footer/next-bar 预留高度减 CLS; areaServed 迁至 Organization; 全站 analytics.js 延迟加载
- 减去了: 
- 优化了: 移动端 CLS; 可及性标签

### 技术实现
- 技术备注: 静态站性能与可及性优化轮次
- 相关文件: styles.css; sitemap.xml; about/index.html
- 数据或结构: Organization.areaServed 结构化数据字段迁移
- 架构/配置: 静态站性能与可及性优化轮次
- 验证: commit 93b27c8；PageSpeed 复测

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-27-phase1-review.md: 项目 notes 文档; doc: notes/2026-06-28-phase1-review-actions.md: 项目 notes 文档
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: PageSpeed Mobile CLS; GSC impression
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-28 - 中文 SEO 动态元信息与百度首访

**status**: 已补录 (backfilled)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 实验 (experiment)
**review_due**: 2026-07-06（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 百度搜索来的用户大概率是中文意图，首屏英文页可能直接跳出。
- 理解/提炼: 语言不匹配可能增加中文搜索访客摩擦；流量尚小，目标是体验而非证明 SEO 已成功。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 中文 SEO 动态元信息与百度首访：seo-head-zh.js；sitemap-zh.xml。
- 为什么重要: 语言不匹配可能增加中文搜索访客摩擦；流量尚小，目标是体验而非证明 SEO 已成功。

### 场景细节
- 问题/机会: 语言不匹配可能增加中文搜索访客摩擦；流量尚小，目标是体验而非证明 SEO 已成功。
- 这一轮解决方案: 
- 成功信号: 百度自然流量、中文页浏览、路线点击
- 风险/未解决: 

### 项目变化
- 加了: seo-head-zh.js; sitemap-zh.xml; 百度验证; Bing Webmaster
- 改了: lang-boot v4 百度/搜狗首访 zh; robots 双 sitemap
- 减去了: 
- 优化了: 中文访客落地体验

### 技术实现
- 技术备注: 按来源页（referrer）引导首访语言
- 相关文件: seo-head-zh.js; lang-boot.js; sitemap-zh.xml
- 数据或结构: 无数据结构变更
- 架构/配置: 按来源页（referrer）引导首访语言
- 验证: commit ffc5050

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-28-baidu-search-setup.md: 项目 notes 文档; doc: OPS-JOURNAL V1.6.7–V1.6.8: 项目文档证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 百度自然流量、中文页浏览、路线点击
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-28 - GA4 事件委托与内部流量过滤

**status**: 已补录 (backfilled)
**scenario**: 数据/埋点 (analytics-data)
**type**: 数据 (data), 运维 (ops)
**review_due**: 2026-07-07（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 换页后 GA4 DebugView 断链，无法验证多页漏斗；自测流量抬高用户数。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: GA4 事件委托与内部流量过滤：analytics-events v4 委托；debug localStorage 跨页。
- 为什么重要: 关键事件稳定触发

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 换页后 GA4 DebugView 断链，无法验证多页漏斗
- 成功信号: 关键事件稳定触发
- 风险/未解决: 

### 项目变化
- 加了: analytics-events v4 委托; debug localStorage 跨页; 关键事件标记; 内部流量过滤器
- 改了: 全站埋点委托化
- 减去了: 
- 优化了: 跨页漏斗可追踪性

### 技术实现
- 技术备注: document 级事件委托监听
- 相关文件: analytics-events.js
- 数据或结构: GA4 关键事件后台配置
- 架构/配置: document 级事件委托监听
- 验证: OPS-JOURNAL V1.6.9–V1.7.1

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-25-analytics.md: 项目 notes 文档; doc: OPS-JOURNAL V1.6.9–V1.7.1: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 关键事件稳定触发
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-27 - 便利设施地图 /guide/ → /map/

**status**: 已补录 (backfilled)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 架构 (architecture)
**review_due**: 2026-07-10（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: /guide/ 与登山指南语义冲突；/map/ 更贴合「设施/POI 地图」搜索意图。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 便利设施地图 /guide/ → /map/：canonical /map/；/guide/ 301。
- 为什么重要: /guide/ 与登山指南语义冲突；/map/ 更贴合「设施/POI 地图」搜索意图。

### 场景细节
- 问题/机会: /guide/ 与登山指南语义冲突；/map/ 更贴合「设施/POI 地图」搜索意图。
- 这一轮解决方案: 
- 成功信号: GSC /map/ 展示与 CTR
- 风险/未解决: 

### 项目变化
- 加了: 
- 改了: canonical /map/; /guide/ 301; sitemap 更新
- 减去了: 
- 优化了: URL 语义

### 技术实现
- 技术备注: 旧路径静态 301 跳转
- 相关文件: map/index.html; guide/index.html; sitemap.xml
- 数据或结构: 无数据结构变更
- 架构/配置: 旧路径静态 301 跳转
- 验证: commit 00c3fd6

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-27-map-url.md: 项目 notes 文档
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: GSC /map/ 展示与 CTR
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-27 - PDF 全表 15 列与构建审计

**status**: 已补录 (backfilled)
**scenario**: 数据/埋点 (analytics-data)
**type**: 数据 (data), 架构 (architecture)
**review_due**: 2026-07-08（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 地图弹窗与时刻表读不同源会复发；构建阶段必须拦住列错位。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: PDF 全表 15 列与构建审计：audit_pdf_trips.py；build_all.py --validate。
- 为什么重要: 下次 PDF 更新是否构建失败

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 地图弹窗与时刻表读不同源会复发
- 成功信号: 下次 PDF 更新是否构建失败
- 风险/未解决: 

### 项目变化
- 加了: audit_pdf_trips.py; build_all.py --validate
- 改了: parse_pdf ncols=15; 站牌弹窗读 columnTrips; 宫之浦港入口 11→12 班
- 减去了: fragment 弹窗路径
- 优化了: 数据单一来源

### 技术实现
- 技术备注: 构建阶段接入 PDF 列对齐审计
- 相关文件: parse_pdf.py; build_all.py; app-core.js; data.js
- 数据或结构: columnTrips v3
- 架构/配置: 构建阶段接入 PDF 列对齐审计
- 验证: python3 scripts/audit_pdf_trips.py --rebuild

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-27-pdf-full-audit.md: 项目 notes 文档; doc: OPS-JOURNAL V1.6.0/V1.6.5: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 下次 PDF 更新是否构建失败
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-27 - 环线 columnTrips 跨站搜索丢班修复

**status**: 已补录 (backfilled)
**scenario**: 数据/埋点 (analytics-data)
**type**: 数据 (data), 修复 (bugfix)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: fragment 小段匹配导致环线跨 2～3 站搜索只剩首班，用户以为没车。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 环线 columnTrips 跨站搜索丢班修复：data.js columnTrips 字段；findTrips 优先列起终点匹配。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: fragment 小段匹配导致环线跨 2～3 站搜索只剩首班，用户以为没车。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: data.js columnTrips 字段
- 改了: findTrips 优先列起终点匹配
- 减去了: fragment 丢班逻辑
- 优化了: 环线搜索完整性

### 技术实现
- 技术备注: findTrips 优先按列起终点整列匹配
- 相关文件: app-core.js; data.js
- 数据或结构: columnTrips 整列班次字段
- 架构/配置: findTrips 优先按列起终点整列匹配
- 验证: notes/2026-06-27-column-trip-search.md

### 依据/来源
- sourceRefs: 
- evidence: doc: OPS-JOURNAL V1.5.9: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-06-27 - 浏览器语言自动检测与用户语言选择持久化

**status**: 已补录 (backfilled)
**scenario**: 功能新增 (feature)
**type**: 功能 (feature), 体验 (ux)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 首访应匹配浏览器语言；用户手动选语言后不应被 URL 参数覆盖。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 浏览器语言自动检测与用户语言选择持久化：navigator.languages 自动 ja/zh/en；localStorage lang-picked。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 首访应匹配浏览器语言
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: navigator.languages 自动 ja/zh/en; localStorage lang-picked
- 改了: 首访写 URL lang; 手动 EN 不被 ?lang=zh 覆盖
- 减去了: URL 强制覆盖用户选择
- 优化了: 分享链语言一致

### 技术实现
- 技术备注: lang-boot.js 在页面渲染前执行
- 相关文件: lang-boot.js; app-core.js; site-chrome.js
- 数据或结构: localStorage lang-picked 用户语言选择标记
- 架构/配置: lang-boot.js 在页面渲染前执行
- 验证: notes/2026-06-27-browser-lang.md

### 依据/来源
- sourceRefs: 
- evidence: doc: OPS-JOURNAL V1.6.2/V1.6.3: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-06-26 - 全站 SEO 文案「2026最新」

**status**: 已补录 (backfilled)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 内容 (content)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 搜索结果页上「3月改定」主文案易被误解为过时；改为「2026最新」，PDF 备注仍保留具体改定月。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 全站 SEO 文案「2026最新」：各页 title/meta/og/FAQ 3月改定→2026最新。
- 为什么重要: 搜索结果页上「3月改定」主文案易被误解为过时；改为「2026最新」，PDF 备注仍保留具体改定月。

### 场景细节
- 问题/机会: 搜索结果页上「3月改定」主文案易被误解为过时；改为「2026最新」，PDF 备注仍保留具体改定月。
- 这一轮解决方案: 
- 成功信号: GSC CTR 变化（样本小）
- 风险/未解决: 

### 项目变化
- 加了: 
- 改了: 各页 title/meta/og/FAQ 3月改定→2026最新
- 减去了: 
- 优化了: SERP 新鲜度感知

### 技术实现
- 技术备注: 全站 SEO 文案层
- 相关文件: site-chrome.js; 各页 HTML
- 数据或结构: 无数据结构变更
- 架构/配置: 全站 SEO 文案层
- 验证: notes/2026-06-26-seo-2026-latest.md

### 依据/来源
- sourceRefs: 
- evidence: doc: OPS-JOURNAL V1.5.0: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: GSC CTR 变化（样本小）
- 当前结果: 不确定 (unclear)
- 经验/结论: 

---

## 2026-06-25 - Klook/Viator 联盟页内投放策略

**status**: 已补录 (backfilled)
**scenario**: 变现/交易 (monetization)
**type**: 变现 (monetization), 决策 (decision)
**review_due**: 2026-07-15（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 船运页用户意图是查票与时刻，插一日游卡片像打断任务；登山页用户在规划行程，联盟卡片是补充。变现应跟随页面意图。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: Klook/Viator 联盟页内投放策略：affiliate-data.js 集中；AffiliateUI 多页。
- 为什么重要: affiliate_click 按页分布

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 船运页用户意图是查票与时刻，插一日游卡片像打断任务
- 成功信号: affiliate_click 按页分布
- 风险/未解决: 

### 项目变化
- 加了: affiliate-data.js 集中; AffiliateUI 多页; affiliate_click 事件
- 改了: partner-data.js / partner-ui.js 重命名防广告拦截
- 减去了: ferry 页 Viator 块
- 优化了: 上下文联盟

### 技术实现
- 技术备注: 按页面用户意图挂载联盟模块
- 相关文件: affiliate-data.js; affiliate-ui.js; trekking/index.html; ferry/index.html
- 数据或结构: 无数据结构变更
- 架构/配置: 按页面用户意图挂载联盟模块
- 验证: commit b65c3e8

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-25-ferry-trekking-affiliate.md: 项目 notes 文档; doc: notes/2026-06-27-trek-affiliate-restore.md: 项目 notes 文档
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: affiliate_click 按页分布
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-25 - URL 重命名 /fare/ /ferry/

**status**: 已补录 (backfilled)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 架构 (architecture)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 原 /map/ 承载票价语义、/access/ 承载船运语义，与页面实际内容不符；规范 URL 应对齐用户搜索词（運賃/船运）。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: URL 重命名 /fare/ /ferry/：/fare/；/ferry/ 着陆页。
- 为什么重要: 原 /map/ 承载票价语义、/access/ 承载船运语义，与页面实际内容不符；规范 URL 应对齐用户搜索词（運賃/船运）。

### 场景细节
- 问题/机会: 原 /map/ 承载票价语义、/access/ 承载船运语义，与页面实际内容不符；规范 URL 应对齐用户搜索词（運賃/船运）。
- 这一轮解决方案: 
- 成功信号: GSC 新 URL 收录
- 风险/未解决: 

### 项目变化
- 加了: /fare/; /ferry/ 着陆页
- 改了: /map/→/fare/; /access/→/ferry/; 301 保留 query; sitemap canonical
- 减去了: 旧路径作 canonical
- 优化了: URL 语义与内链

### 技术实现
- 技术备注: 旧路径 301 跳转并保留 query/hash
- 相关文件: fare/index.html; ferry/index.html; sitemap.xml
- 数据或结构: 无数据结构变更
- 架构/配置: 旧路径 301 跳转并保留 query/hash
- 验证: commit 7f70ec6

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-25-url-fare-ferry.md: 项目 notes 文档; doc: OPS-JOURNAL V1.3.0: 项目文档证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: GSC 新 URL 收录
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-25 - 六页工具站与产品介绍页 SEO 更新

**status**: 待补原因 (needs-user-context)
**scenario**: 内容/文案 (content)
**type**: 内容 (content), SEO (seo)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 从时刻表单页扩展为屋久岛交通工具包（时刻/票价/船运/登山/不租车/地图），每页承接不同搜索意图。
- 可信度: 未捕捉原话 (not-captured)

### 人话摘要
- 发生了什么: 六页工具站与产品介绍页 SEO 更新：without-car；trekking 深化。
- 为什么重要: 各着陆页 GSC 展示分布

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 从时刻表单页扩展为屋久岛交通工具包（时刻/票价/船运/登山/不租车/地图），每页承接不同搜索意图。
- 成功信号: 各着陆页 GSC 展示分布
- 风险/未解决: 

### 项目变化
- 加了: without-car; trekking 深化; intro 六页说明
- 改了: 全站内链; intro SEO; sitemap 扩展
- 减去了: 
- 优化了: 多意图 SEO 承接

### 技术实现
- 技术备注: 多着陆页纯静态站架构
- 相关文件: intro/index.html; without-car/; sitemap.xml
- 数据或结构: 无数据结构变更
- 架构/配置: 多着陆页纯静态站架构
- 验证: commit 574fb07

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-25-intro-seo-update.md: 项目 notes 文档; doc: notes/2026-06-25-portfolio-project-copy.md: 项目 notes 文档; commit: 574fb07: git 提交证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 2026-06-25 - 关联 commit 574fb07 - 574fb07 - 由回填证据迁移，不等同于上线日期
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 各着陆页 GSC 展示分布
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-25 - GA4 全站 26 项自定义事件

**status**: 已补录 (backfilled)
**scenario**: 数据/埋点 (analytics-data)
**type**: 数据 (data), 运维 (ops)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 需要可观测的用户行为（查时刻、查运价、下 PDF）才能判断功能是否被真实使用，而非只看页面浏览量。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: GA4 全站 26 项自定义事件：analytics-events.js 26 事件；全页 head 引用。
- 为什么重要: timetable_search 等关键事件基线

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 需要可观测的用户行为（查时刻、查运价、下 PDF）才能判断功能是否被真实使用，而非只看页面浏览量。
- 成功信号: timetable_search 等关键事件基线
- 风险/未解决: 

### 项目变化
- 加了: analytics-events.js 26 事件; 全页 head 引用
- 改了: 
- 减去了: 
- 优化了: 产品可观测性

### 技术实现
- 技术备注: 静态页前端埋点
- 相关文件: analytics-events.js
- 数据或结构: GA4 自定义事件定义
- 架构/配置: 静态页前端埋点
- 验证: notes/2026-06-25-analytics.md

### 依据/来源
- sourceRefs: 
- evidence: doc: OPS-JOURNAL V1.4.0: 项目文档证据; commit: b65c3e8 前后: git 提交证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: timetable_search 等关键事件基线
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 为后续 analytics-events v4 事件委托与关键事件标记奠基

---

## 2026-06-24 - GA4/GSC 日报周报流水线与飞书同步

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 数据 (data)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 低流量站需要自动化拉数并排优先级，否则 SEO 优化靠手工看后台不可持续。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: GA4/GSC 日报周报流水线与飞书同步：weekly GA4/GSC pipeline；飞书表格同步。
- 为什么重要: 日报是否稳定产出

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 低流量站需要自动化拉数并排优先级，否则 SEO 优化靠手工看后台不可持续。
- 成功信号: 日报是否稳定产出
- 风险/未解决: 

### 项目变化
- 加了: weekly GA4/GSC pipeline; 飞书表格同步; Feishu 自动建表
- 改了: 日报扩展 fetch; Actions workflow
- 减去了: 
- 优化了: SEO 运维自动化

### 技术实现
- 技术备注: GitHub Actions 定时流水线
- 相关文件: .github/workflows/; scripts/seo/
- 数据或结构: docs/seo/metrics/ 日报 JSON 指标文件
- 架构/配置: GitHub Actions 定时流水线
- 验证: commits 4792f09, 8c35c29

### 依据/来源
- sourceRefs: 
- evidence: doc: docs/seo/RUNBOOK.md: 项目文档证据; doc: docs/seo/metrics/: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 日报是否稳定产出
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-06-24 - 全站星级反馈与精简页脚

**status**: 待补原因 (needs-user-context)
**scenario**: 功能新增 (feature)
**type**: 功能 (feature), 体验 (ux)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 需要轻量方式收集真实用户反馈，又不打断查时刻表主任务。
- 可信度: 未捕捉原话 (not-captured)

### 人话摘要
- 发生了什么: 全站星级反馈与精简页脚：页脚 1-5 星反馈；低分 mailto。
- 为什么重要: 反馈提交量与低分主题

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 需要轻量方式收集真实用户反馈，又不打断查时刻表主任务。
- 成功信号: 反馈提交量与低分主题
- 风险/未解决: 

### 项目变化
- 加了: 页脚 1-5 星反馈; 低分 mailto; GA4 site_feedback
- 改了: 页脚合并一行链接; intro/about 跳过反馈
- 减去了: 
- 优化了: 反馈摩擦

### 技术实现
- 技术备注: 页脚内嵌星级反馈组件
- 相关文件: site-chrome.js; styles.css
- 数据或结构: localStorage 反馈提交状态
- 架构/配置: 页脚内嵌星级反馈组件
- 验证: notes/2026-06-24-site-feedback.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-24-site-feedback.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 反馈提交量与低分主题
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-24 - POI 便利设施地图与公交站名单一来源

**status**: 已补录 (backfilled)
**scenario**: 功能新增 (feature)
**type**: 功能 (feature), 数据 (data)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 登山/设施信息与公交站应同地图呈现；站名在多处副本会漂移不一致。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: POI 便利设施地图与公交站名单一来源：guide 地图 POI；bus-stops-geo 统一。
- 为什么重要: guide_filter 使用量

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 登山/设施信息与公交站应同地图呈现
- 成功信号: guide_filter 使用量
- 风险/未解决: 

### 项目变化
- 加了: guide 地图 POI; bus-stops-geo 统一
- 改了: 站名审计; guide 布局 sticky peek
- 减去了: 
- 优化了: 地图信息密度

### 技术实现
- 技术备注: 公交站名单一数据源（bus-stops-geo）
- 相关文件: guide/; bus-stops-geo.js; map-data.js
- 数据或结构: POI 与公交站合并数据层
- 架构/配置: 公交站名单一数据源（bus-stops-geo）
- 验证: notes/2026-06-24-poi-guide-map.md；notes/2026-06-24-stop-single-source.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-24-poi-guide-map.md: 项目 notes 文档; doc: notes/2026-06-24-stop-single-source.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: guide_filter 使用量
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-23 - 登山参考页 /trekking/

**status**: 已补录 (backfilled)
**scenario**: 内容/文案 (content)
**type**: 内容 (content), 功能 (feature)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 承接「屋久岛 登山 バス」类搜索意图；引用观光协会路线，免责声明标明非登山攻略。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 登山参考页 /trekking/：/trekking/ 8 路线；YAMAP 链。
- 为什么重要: trekking 页 Organic 流量

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 承接「屋久岛 登山 バス」类搜索意图
- 成功信号: trekking 页 Organic 流量
- 风险/未解决: 

### 项目变化
- 加了: /trekking/ 8 路线; YAMAP 链; 公交 preset 链
- 改了: 顶栏登山 Tab
- 减去了: 
- 优化了: 登山交通一站式

### 技术实现
- 技术备注: 静态登山参考内容页
- 相关文件: trekking/index.html; trekking-data.js
- 数据或结构: trekking 路线 JSON 数据
- 架构/配置: 静态登山参考内容页
- 验证: notes/2026-06-23-trekking-page.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-23-trekking-page.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: trekking 页 Organic 流量
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-23 - Ko-fi 赞助入口

**status**: 待补原因 (needs-user-context)
**scenario**: 变现/交易 (monetization)
**type**: 变现 (monetization), 运维 (ops)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 未捕捉为何选择 Ko-fi 而非其他赞助方式，以及期望的支持规模。
- 可信度: 未捕捉原话 (not-captured)

### 人话摘要
- 发生了什么: Ko-fi 赞助入口：全站 footer Ko-fi 链；intro 支持块。
- 为什么重要: 是否有赞助转化（Ko-fi 后台）

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 未捕捉为何选择 Ko-fi 而非其他赞助方式，以及期望的支持规模。
- 成功信号: 是否有赞助转化（Ko-fi 后台）
- 风险/未解决: 

### 项目变化
- 加了: 全站 footer Ko-fi 链; intro 支持块; 三语 supportKofi 文案
- 改了: 
- 减去了: 
- 优化了: 

### 技术实现
- 技术备注: 页脚与关于页纯外链跳转
- 相关文件: site-chrome.js; intro/index.html; about/index.html
- 数据或结构: 无数据结构变更
- 架构/配置: 页脚与关于页纯外链跳转
- 验证: notes/2026-06-23-ko-fi-support.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-23-ko-fi-support.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 是否有赞助转化（Ko-fi 后台）
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-23 - 渡轮停运/运休公告区

**status**: 已补录 (backfilled)
**scenario**: 内容/文案 (content)
**type**: 内容 (content), 运维 (ops)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 屋久岛船运受天气影响大，用户查船票前需要看到最新运休信息源。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 渡轮停运/运休公告区：ferry 页运休/停运引用区。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 屋久岛船运受天气影响大，用户查船票前需要看到最新运休信息源。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: ferry 页运休/停运引用区
- 改了: 
- 减去了: 
- 优化了: 船运信息时效性

### 技术实现
- 技术备注: 静态页引用官方运休/停运信息源
- 相关文件: ferry/index.html; access-data.js
- 数据或结构: ferry 船运 JSON 数据
- 架构/配置: 静态页引用官方运休/停运信息源
- 验证: notes/2026-06-23-ferry-suspensions.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-23-ferry-suspensions.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-06-09 - 全站 UI 层级统一与日文 SEO

**status**: 已补录 (backfilled)
**scenario**: 优化 (optimization)
**type**: 优化 (optimization), SEO (seo)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 多页各自为政导致信息层级混乱；日本 Google 是主流量，日文 meta/FAQ/内链需统一强化。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 全站 UI 层级统一与日文 SEO：aux-block 统一折叠区；page-section-title 区块标题层级。
- 为什么重要: GSC 日文关键词 impression

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 多页各自为政导致信息层级混乱
- 成功信号: GSC 日文关键词 impression
- 风险/未解决: 

### 项目变化
- 加了: aux-block 统一折叠区; page-section-title 区块标题层级
- 改了: meta 单行化; 移除页头重复品牌标签; 数据来源迁至 intro 页
- 减去了: 页头重复品牌
- 优化了: 全站一致性; JP SEO

### 技术实现
- 技术备注: 共享 CSS 组件类与层级 token
- 相关文件: styles.css; site-chrome.js; 各页 HTML
- 数据或结构: 全站 design-system 组件约定
- 架构/配置: 共享 CSS 组件类与层级 token
- 验证: commits 0d0341a–99970de

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-09-meta-line-verification.md: 项目 notes 文档; doc: notes/2026-06-09-map-faq-links-layout.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: GSC 日文关键词 impression
- 当前结果: 待回填 (pending)
- 经验/结论: 

---

## 2026-06-08 - SEO 点击率优化落地（P0–P2）

**status**: 已补录 (backfilled)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 内容 (content)
**review_due**: 2026-06-22（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: GSC 有展示但点击率偏低；强化日文 title/description、FAQ、内链，intro 页 noindex 以集中权重。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: SEO 点击率优化落地（P0–P2）：首页/map 静态 seo-lead + FAQ；seo_check.sh。
- 为什么重要: GSC 有展示但点击率偏低；强化日文 title/description、FAQ、内链，intro 页 noindex 以集中权重。

### 场景细节
- 问题/机会: GSC 有展示但点击率偏低；强化日文 title/description、FAQ、内链，intro 页 noindex 以集中权重。
- 这一轮解决方案: 
- 成功信号: 关键词「屋久島 バス 時刻表」展示量与点击率（建议回看日已过，需从 GSC 补结果）
- 风险/未解决: 

### 项目变化
- 加了: 首页/map 静态 seo-lead + FAQ; seo_check.sh
- 改了: 首页/map meta 日文优先; intro noindex; sitemap 4 URL
- 减去了: intro 出 sitemap
- 优化了: SERP 点击率

### 技术实现
- 技术备注: SEO 文案与结构化数据层
- 相关文件: index.html; map/index.html; intro/index.html; sitemap.xml
- 数据或结构: FAQ JSON-LD 结构化数据
- 架构/配置: SEO 文案与结构化数据层
- 验证: notes/2026-06-08-seo-ctr-update.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-06-08-seo-ctr-update.md: 项目 notes 文档; doc: notes/2026-06-24-seo-round-ctr.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 关键词「屋久島 バス 時刻表」展示量与点击率（建议回看日已过，需从 GSC 补结果）
- 当前结果: 不确定 (unclear)
- 经验/结论: 

---

## 2026-06-04 - 产品介绍页与 30 秒演示视频

**status**: 已补录 (backfilled)
**scenario**: 内容/文案 (content)
**type**: 内容 (content), 功能 (feature)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 需要可分享的产品介绍（noindex）供社交媒体与作品集展示，与 SEO 着陆页分离。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 产品介绍页与 30 秒演示视频：/intro/ 产品页；demo 视频 assets/video/。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 需要可分享的产品介绍（noindex）供社交媒体与作品集展示，与 SEO 着陆页分离。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: /intro/ 产品页; demo 视频 assets/video/; intro-data.js
- 改了: 
- 减去了: 
- 优化了: 产品可演示性

### 技术实现
- 技术备注: noindex 产品介绍着陆页
- 相关文件: intro/index.html; assets/video/yakushima-bus-demo.mp4
- 数据或结构: 无数据结构变更
- 架构/配置: noindex 产品介绍着陆页
- 验证: commit ae0957d

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-21-product-demo-video.md: 项目 notes 文档; doc: notes/2026-05-26-product-video-30s.md: 项目 notes 文档; commit: ae0957d: git 提交证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 2026-06-04 - 关联 commit ae0957d - ae0957d - 由回填证据迁移，不等同于上线日期
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-06-04 - 关于页完整数据来源清单

**status**: 已补录 (backfilled)
**scenario**: 内容/文案 (content)
**type**: 内容 (content), 运维 (ops)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 公交数据来自多份官方 PDF/网站，需要透明列出来源以建立信任与方便核对。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 关于页完整数据来源清单：about 页全量数据来源与参考；数据来源从 about 部分迁 intro。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 公交数据来自多份官方 PDF/网站，需要透明列出来源以建立信任与方便核对。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: about 页全量数据来源与参考
- 改了: 数据来源从 about 部分迁 intro
- 减去了: 
- 优化了: 可信度

### 技术实现
- 技术备注: 关于页静态说明
- 相关文件: about/index.html; about-data.js
- 数据或结构: 无数据结构变更
- 架构/配置: 关于页静态说明
- 验证: commit 7bc06a7

### 依据/来源
- sourceRefs: 
- evidence: doc: README.md（数据来源表）: 项目文档证据; commit: 7bc06a7: git 提交证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 2026-06-04 - 关联 commit 7bc06a7 - 7bc06a7 - 由回填证据迁移，不等同于上线日期
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-05-29 - 顶栏导航与运价/上岛页版面收紧

**status**: 已补录 (backfilled)
**scenario**: 优化 (optimization)
**type**: 优化 (optimization), 体验 (ux)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 顶栏站名层级与运价页信息密度需适配移动端单手操作。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 顶栏导航与运价/上岛页版面收紧：顶栏导航；站名层级。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 顶栏站名层级与运价页信息密度需适配移动端单手操作。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: 
- 改了: 顶栏导航; 站名层级; 运价/access 版面
- 减去了: 
- 优化了: 移动端密度

### 技术实现
- 技术备注: 布局 design token 调整
- 相关文件: styles.css; site-chrome.js
- 数据或结构: 无数据结构变更
- 架构/配置: 布局 design token 调整
- 验证: commit 10bc454

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-29-token-estimate-project.md: 项目 notes 文档
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-05-26 - 产品介绍页修复与 SEO 日报 v2

**status**: 已补录 (backfilled)
**scenario**: 内容/文案 (content)
**type**: 内容 (content), 运维 (ops)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: intro 来源区布局需与全站 design-system 对齐；SEO 日报改为表格并移除半月报以降低维护成本。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 产品介绍页修复与 SEO 日报 v2：SEO 日报表格 digest；intro 来源布局。
- 为什么重要: 日报可读性

### 场景细节
- 问题/机会: 
- 这一轮解决方案: intro 来源区布局需与全站 design-system 对齐
- 成功信号: 日报可读性
- 风险/未解决: 

### 项目变化
- 加了: SEO 日报表格 digest
- 改了: intro 来源布局; 移除半月/周报 workflow
- 减去了: 半月报 workflow
- 优化了: 运维负担

### 技术实现
- 技术备注: SEO 日报自动化流水线
- 相关文件: intro/index.html; .github/workflows/seo-daily.yml
- 数据或结构: 无数据结构变更
- 架构/配置: SEO 日报自动化流水线
- 验证: commits 4748124, 648369f

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-26-intro-sources-layout.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 日报可读性
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-05-25 - GSC 索引修复与 SEO 基线（⭐）

**status**: 已补录 (backfilled)
**scenario**: SEO/增长 (growth-seo)
**type**: SEO (seo), 运维 (ops)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: Private 仓库导致 GitHub Pages 全站 404，必须改 Public 才能被 Google 索引。
- 理解/提炼: 站点上线后无法被搜索到是因为 Pages 仓库权限为私有；恢复公开并提交 sitemap、内链与 JSON-LD 是索引前提。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: GSC 索引修复与 SEO 基线（⭐）：四页 footer 内链；荒川登山口 meta。
- 为什么重要: 站点上线后无法被搜索到是因为 Pages 仓库权限为私有；恢复公开并提交 sitemap、内链与 JSON-LD 是索引前提。

### 场景细节
- 问题/机会: 站点上线后无法被搜索到是因为 Pages 仓库权限为私有；恢复公开并提交 sitemap、内链与 JSON-LD 是索引前提。
- 这一轮解决方案: 
- 成功信号: GSC 索引页数
- 风险/未解决: 

### 项目变化
- 加了: 四页 footer 内链; 荒川登山口 meta; WebSite hasPart JSON-LD; GSC sitemap
- 改了: GitHub Pages Public; sitemap lastmod
- 减去了: Private Pages 404 状态
- 优化了: 可索引性

### 技术实现
- 技术备注: GitHub Pages 仓库改为 Public
- 相关文件: sitemap.xml; 各页 footer/JSON-LD
- 数据或结构: WebSite JSON-LD 站点结构数据
- 架构/配置: GitHub Pages 仓库改为 Public
- 验证: OPS-JOURNAL V1.0.0

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-25 Private 404 排查记录: 项目 notes 文档; doc: docs/seo/SEO-JOURNAL.md: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: GSC 索引页数
- 当前结果: 有效 (worked)
- 经验/结论: 站点从不可索引恢复到可被 Google 收录

---

## 2026-05-25 - 运价页地图 UI：按用户反馈精简

**status**: 已补录 (backfilled)
**scenario**: 优化 (optimization)
**type**: 体验 (ux), 决策 (decision)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 用户确认 (user-confirmed)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 用户认为折叠块与说明句无意义。
- 理解/提炼: 主景区折叠块和冗长说明干扰查运价主任务；应删繁就简，SEO 导语并入标题下 header-sub。
- 可信度: 用户已确认 (confirmed-by-user)

### 人话摘要
- 发生了什么: 运价页地图 UI：按用户反馈精简：header-sub 导语；section-divider。
- 为什么重要: 运价页跳出率（样本小，难单独归因）

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 主景区折叠块和冗长说明干扰查运价主任务
- 成功信号: 运价页跳出率（样本小，难单独归因）
- 风险/未解决: 

### 项目变化
- 加了: header-sub 导语; section-divider; altLine 站名规则
- 改了: 删除 #mapDestinations 折叠; 选站区对齐; 运价左对齐
- 减去了: #mapDestinations 折叠区与 map-destinations 页面引用
- 优化了: 运价页可读性

### 技术实现
- 技术备注: 运价页 UI 精简
- 相关文件: map/index.html; styles.css
- 数据或结构: destinations.json 保留备用，未挂页
- 架构/配置: 运价页 UI 精简
- 验证: notes/2026-05-25-map-destinations-eval.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-25-map-destinations-eval.md: 项目 notes 文档
- 日期依据: 用户确认 (user-confirmed)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 运价页跳出率（样本小，难单独归因）
- 当前结果: 不确定 (unclear)
- 经验/结论: 

---

## 2026-05-25 - SEO 日报自动生成 P0–P2 优先级

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 数据 (data)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 需要每日从 GSC/GA4 拉数并自动排优先级，否则个人项目 SEO 迭代会断档。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: SEO 日报自动生成 P0–P2 优先级：日报 GSC/GA4 拉数；P0-P2 优先级。
- 为什么重要: 日报连续天数

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 需要每日从 GSC/GA4 拉数并自动排优先级，否则个人项目 SEO 迭代会断档。
- 成功信号: 日报连续天数
- 风险/未解决: 

### 项目变化
- 加了: 日报 GSC/GA4 拉数; P0-P2 优先级; HTTP 存活探测+ntfy; 失败重跑
- 改了: 邮件 HTML 路径修复
- 减去了: 
- 优化了: SEO 运维节奏

### 技术实现
- 技术备注: GitHub Actions 工作流
- 相关文件: .github/workflows/seo-daily.yml; scripts/seo/
- 数据或结构: docs/seo/metrics/daily-*.json 日报指标
- 架构/配置: GitHub Actions 工作流
- 验证: commits f604827–02a6a3a

### 依据/来源
- sourceRefs: 
- evidence: doc: docs/seo/RUNBOOK.md: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 日报连续天数
- 当前结果: 有效 (worked)
- 经验/结论: 截至 2026-06-30 日报仍持续产出

---

## 2026-05-22 - SEO 双周工作流与 GSC OAuth

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 数据 (data)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 需要程序化读取 GSC 数据支撑 SEO 决策，OAuth 授权是前提。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: SEO 双周工作流与 GSC OAuth：GSC OAuth fetch；biweekly workflow。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 需要程序化读取 GSC 数据支撑 SEO 决策，OAuth 授权是前提。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: GSC OAuth fetch; biweekly workflow; SEO 文档体系; playbook
- 改了: 
- 减去了: 
- 优化了: 数据驱动 SEO

### 技术实现
- 技术备注: CI 定时拉取 GSC/GA4
- 相关文件: .github/workflows/; docs/seo/
- 数据或结构: GSC OAuth refresh token 配置
- 架构/配置: CI 定时拉取 GSC/GA4
- 验证: commit afbda30

### 依据/来源
- sourceRefs: 
- evidence: doc: docs/seo/GOOGLE_SETUP.md: 项目文档证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-05-21 - 桌面布局、PDF 预览与上岛预订信息

**status**: 已补录 (backfilled)
**scenario**: 功能新增 (feature)
**type**: 功能 (feature), 体验 (ux)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 移动端优先不等于放弃桌面；PDF 在触屏设备应内联预览；上岛交通需直出预订参考。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 桌面布局、PDF 预览与上岛预订信息：触屏路线图为内联图；access 预订区块。
- 为什么重要: file_download 事件

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 移动端优先不等于放弃桌面
- 成功信号: file_download 事件
- 风险/未解决: 

### 项目变化
- 加了: 触屏路线图为内联图; access 预订区块; PDF 移动预览
- 改了: 桌面双栏; 三语 UX; travel tips 默认展开
- 减去了: 
- 优化了: 桌面/移动 PDF 体验

### 技术实现
- 技术备注: 桌面/移动响应式双栏布局
- 相关文件: map/index.html; access/; styles.css
- 数据或结构: access 上岛交通 JSON 数据
- 架构/配置: 桌面/移动响应式双栏布局
- 验证: commits 78f1fa1–01244b1

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-21-desktop-layout.md: 项目 notes 文档; doc: notes/2026-05-21-access-booking.md: 项目 notes 文档; doc: notes/2026-05-21-map-pdf-mobile-preview.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: file_download 事件
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-05-20 - yakushimabus.com 域名上线与基础 SEO

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), SEO (seo)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 自定义域名、GA4、GSC 验证、OG 图与 favicon 是公开站点最低配置。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: yakushimabus.com 域名上线与基础 SEO：CNAME yakushimabus.com；GA4 G-BX2P31GEHW。
- 为什么重要: GA4 首周数据

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 自定义域名、GA4、GSC 验证、OG 图与 favicon 是公开站点最低配置。
- 成功信号: GA4 首周数据
- 风险/未解决: 

### 项目变化
- 加了: CNAME yakushimabus.com; GA4 G-BX2P31GEHW; GSC 验证; favicon/OG; SEO/GEO assets; clean URLs
- 改了: map/access/about clean URL
- 减去了: 
- 优化了: 品牌可分享性

### 技术实现
- 技术备注: GitHub Pages 自定义域名部署
- 相关文件: CNAME; analytics.js; sitemap.xml; robots.txt
- 数据或结构: 无数据结构变更
- 架构/配置: GitHub Pages 自定义域名部署
- 验证: commits 3e89cd9–43076b0

### 依据/来源
- sourceRefs: 
- evidence: doc: README.md: 项目文档证据; commit: commits 3e89cd9–43076b0: git 提交证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: GA4 首周数据
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-05-20 - 第三版视觉设计迭代

**status**: 待补原因 (needs-user-context)
**scenario**: 优化 (optimization)
**type**: 优化 (optimization)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: commit 日期明确支持 (commit-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 未捕捉 v3 具体设计目标与用户审美依据。
- 可信度: 未捕捉原话 (not-captured)

### 人话摘要
- 发生了什么: 第三版视觉设计迭代：全站视觉 v3。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 未捕捉 v3 具体设计目标与用户审美依据。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: 
- 改了: 全站视觉 v3
- 减去了: 
- 优化了: 视觉层级

### 技术实现
- 技术备注: styles.css 设计令牌（design tokens）更新
- 相关文件: styles.css
- 数据或结构: 无数据结构变更
- 架构/配置: styles.css 设计令牌（design tokens）更新
- 验证: commit 5b0005b

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-20-visual-v2-preview.md: 项目 notes 文档; commit: 5b0005b: git 提交证据
- 日期依据: commit 日期明确支持 (commit-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 2026-05-20 - 关联 commit 5b0005b - 5b0005b - 由回填证据迁移，不等同于上线日期
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 

---

## 2026-05-20 - 项目初始化：PDF 解析与数据管线

**status**: 已补录 (backfilled)
**scenario**: 功能新增 (feature)
**type**: 功能 (feature), 数据 (data)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 屋久岛公交时刻需从官方 PDF 结构化；纯静态站靠构建脚本保持与官方同步。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 项目初始化：PDF 解析与数据管线：index.html + data.js；parse_pdf.py。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 屋久岛公交时刻需从官方 PDF 结构化
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: index.html + data.js; parse_pdf.py; build_all.py; 48 站中央线; 白谷/荒川/松ばんだ; access 页; 三语 UI 基础
- 改了: 
- 减去了: 
- 优化了: 移动端路边查车

### 技术实现
- 技术备注: PDF 解析 → Python 构建 → 静态 JS 发布
- 相关文件: data.js; scripts/parse_pdf.py; scripts/build_all.py; sources/manifest.json
- 数据或结构: 站点 stops + trips JSON 数据
- 架构/配置: PDF 解析 → Python 构建 → 静态 JS 发布
- 验证: notes/2026-05-20-init.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-20-init.md: 项目 notes 文档; doc: notes/2026-05-20-data-update.md: 项目 notes 文档; doc: README.md: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 项目根节点：数据管线与三语时刻表 MVP

---

## 2026-05-20 - Klook 联盟首批上线

**status**: 待补原因 (needs-user-context)
**scenario**: 变现/交易 (monetization)
**type**: 变现 (monetization)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: 未捕捉为何在 MVP 阶段即接入联盟变现，以及各 adid 页面分配的业务判断。
- 可信度: 未捕捉原话 (not-captured)

### 人话摘要
- 发生了什么: Klook 联盟首批上线：affiliate-data.js；Klook 6 adid。
- 为什么重要: affiliate_click 首月

### 场景细节
- 问题/机会: 
- 这一轮解决方案: 未捕捉为何在 MVP 阶段即接入联盟变现，以及各 adid 页面分配的业务判断。
- 成功信号: affiliate_click 首月
- 风险/未解决: 

### 项目变化
- 加了: affiliate-data.js; Klook 6 adid; Viator pid; affiliate_click GA4; 页脚联盟披露
- 改了: 
- 减去了: 
- 优化了: 交通站变现探索

### 技术实现
- 技术备注: 静态联盟跳转链
- 相关文件: affiliate-data.js; affiliate-ui.js
- 数据或结构: affiliate-data.js 联盟配置
- 架构/配置: 静态联盟跳转链
- 验证: notes/2026-05-20-klook-affiliate.md

### 依据/来源
- sourceRefs: 
- evidence: doc: notes/2026-05-20-klook-affiliate.md: 项目 notes 文档
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: affiliate_click 首月
- 当前结果: 不确定 (unclear)
- 经验/结论: 

---

## 2026-05-20 - 运维变更日志制度

**status**: 已补录 (backfilled)
**scenario**: 运维/发布 (ops-release)
**type**: 运维 (ops), 决策 (decision)
**review_due**: none（建议回看日，不是审核）
**date_confidence**: 文档日期明确支持 (doc-exact)
**hidden**: false
**doc_ref**: ../PROJECT-NODES.md

### 当时为什么做
- 原话: 未捕捉。
- 理解/提炼: AI 辅助开发改动快，需要版本化记录「加了/改了/减去了」，以免数周后说不清部署了什么。
- 可信度: 根据证据推断 (inferred)

### 人话摘要
- 发生了什么: 运维变更日志制度：change-journal.mdc 全局规则；OPS-JOURNAL 格式。
- 为什么重要: 无需结果回看

### 场景细节
- 问题/机会: 
- 这一轮解决方案: AI 辅助开发改动快，需要版本化记录「加了/改了/减去了」，以免数周后说不清部署了什么。
- 成功信号: 无需结果回看
- 风险/未解决: 

### 项目变化
- 加了: change-journal.mdc 全局规则; OPS-JOURNAL 格式
- 改了: 
- 减去了: 
- 优化了: 运维可追溯性

### 技术实现
- 技术备注: Agent 对话结束自动落盘运维日志
- 相关文件: ~/.cursor/rules/change-journal.mdc; docs/OPS-JOURNAL.md
- 数据或结构: semver 版本块格式（OPS-JOURNAL）
- 架构/配置: Agent 对话结束自动落盘运维日志
- 验证: OPS-JOURNAL V1.5.8

### 依据/来源
- sourceRefs: 
- evidence: doc: OPS-JOURNAL: 项目文档证据
- 日期依据: 文档日期明确支持 (doc-exact)

### 用户备注
- 

### 外部时间线
- GA4/PostHog: 暂无
- GitHub/Vercel: 暂无
- Stripe/交易: 暂无
- 手填/其他: 暂无

### 结果回看
- 回看时观察什么: 无需结果回看
- 当前结果: 无需回看 (not-needed)
- 经验/结论: 后续与 BuildTrace 项目节点记忆互补

---
