# BuildTrace — YakuBus

这个文件是 **YakuBus 项目记忆的唯一主源**。人看、Agent 读写。

## 为什么做（人写的）

日本徒步时候找不到路所以做的交通信息查询工具（上线1.5个月，800+用户，60%自然搜索，制作过程记录 ）。

很多都是基于自己的爱好，“我就是我的产品的用户” ，基于自己过往的产品和项目，更多的是运营经验，来玩和优化这些小玩意。

## 项目初心

- 为什么做这个项目: 让屋久岛旅行者在路边快速查到下一班公交、路线与运价；数据对齐官方 PDF，不靠记忆猜班次。
- 面向谁: 屋久岛旅行者（日/中/英）、本地居民、旅行社从业者。
- 目前最重要的判断: 先保证时刻表数据准确与多语可用，再扩 SEO/联盟；项目记忆用轻量 Markdown，不回到 JSON 看板主源。
- 不想做成什么: 不做后端；不在船运页插打断任务的一日游卡片；不把无依据的推断写成事实。
- 成功大概长什么样: 用户搜「屋久岛 バス 時刻表」能找到站、查到对班；运营能回看「当时为什么改、依据在哪」。

## 我的表达习惯（可选）

- 我觉得 / 我担心 / 先不要做 / 后面看数据 / 有没有依据 / 记 shiplog / 记 buildtrace

## 使用约定

- Markdown 是主数据源；`nodes.json` 与旧 viewer **只读归档**。
- 每条记录必须写 `依据`；本轮默认 `依据: 本轮对话`。
- 结果状态只用：`待观察 / 有效 / 无效 / 不确定`。
- Viewer 若存在，只能解析本文件，不能写回或维护第二主源。
- 项目入口、手动节点、纠错、隐藏：通过 Agent 改本文件。

## 项目入口 / 参考资料

- GitHub: https://github.com/yimleunggggg/Yakushima-bus
- Production: https://yakushimabus.com
- 运维版号快览: `docs/OPS-JOURNAL.md`
- SEO 专轴: `docs/seo/SEO-JOURNAL.md`
- GA4: https://analytics.google.com/ — 测量 ID `G-BX2P31GEHW`
- Bing Webmaster: https://www.bing.com/webmasters/
- 项目档案: `docs/buildtrace/PROJECT-PROFILE.md`
- BuildTrace 使用说明: `docs/buildtrace/SKILL.md`

## 回填前证据盘点

> **2026-07-06 已完成主题级回填**（BT-04～BT-28 + Clarity 独立条）。2026-07-19 又完成本机 Codex rollout、compact、多 Agent、Git 与首批 Cursor 导出的增量审计；这仍不等于逐条对话全覆盖。Coverage 见 `docs/buildtrace/BACKFILL-COVERAGE.md`。

- 可读文件: `docs/OPS-JOURNAL.md`（V1.0–V1.8.3）、`docs/notes/`（95 篇）、`docs/seo/SEO-JOURNAL.md`、`README.md`
- 发现方式: glob · rg · git log（114 commits）· nodes.json/PROJECT-NODES **旁证核对**
- git 覆盖范围: 2026-05-20（`1425c02`）→ 2026-07-18（`6a224cc`），共 138 个提交
- 可用聊天记录: 本轮原话；`docs/shiplog/SHIPLOG.md`（2 条已迁入）；本机恢复审计在 148 份日志中匹配 21 份 Codex rollout 来源，覆盖 18 个唯一任务、168 条去重用户原话、1 个 compact 窗口、3 条多 Agent 派生边；另有用户提供的首批 5 份 Cursor 对话导出
- transcript 扫描: 已审计本机匹配 rollout 与首批 Cursor 导出；Codex App 任务当前可列出 6 个明显相关任务，已读取 5 个非当前任务的可用页面；长任务旧页和后续新增导出仍需继续做增量映射
- 可用截图/导出: 用户 Bing 截图 2026-06-30（V1.8.3 / BT 已有条）
- 已读来源: OPS-JOURNAL 全文、nodes.json 标题枚举、commits 关键 hash、notes 按主题抽读
- 未读但疑似相关: notes 全篇逐字（已按主题合并入条）；SEO daily metrics JSON 逐文件
- 不可访问来源: GA4/GSC/Bing/Clarity 后台实时数据；已删除、无权限或从未导出的外部对话
- 需要用户确认的问题: Bing 2026-07-03 动作的后台复扫结果仍未取得；不能把上线写成有效

## 项目记录

### 2026-07-19 — 同步 BuildTrace v1.17 并恢复项目级自动规则

记录 ID: bt-20260719-yakushima-buildtrace-v117
来源可信度: confirmed
来源覆盖: current-turn, feishu-export, codex-task-api, local-rollout-audit, git, project-files
关联任务: codex-thread/019f74f2-c1a0-7462-a15f-508cb80c124b
依据: 用户本轮完整原话；BuildTrace sync / init 输出；`.buildtrace/recovery/latest.json` 私有恢复清单；Codex App 任务读取；本项目 Git 与 35 条既有记录；桌面与 390px 真实 Viewer 验收
场景: ai-workflow
可见范围: private
结果状态: 待观察
后续回看: 2026-08-19

沟通原文:
- [Q1 | user | 019f74f2-c1a0-7462-a15f-508cb80c124b | verbatim]
  > 所有东西作完push，从我最初的出发点出发，分别给我buildtrace这个项目本身用了buildtrace以后得看板，和Yakushima的看板，并且重新梳理readme和对外介绍和使用方式，这是我目前的版本https://my.feishu.cn/wiki/QUmtwGPQniDhbnkyR9VcoYe9nPh?from=from_copylink 还没写完，你可以用飞书cli看
- [Q2 | user | 019f74f2-c1a0-7462-a15f-508cb80c124b | verbatim]
  > 继续

需求总结:
- [R1 <- Q1] 让 Yakushima 使用最新版 BuildTrace，并提供能够看到本项目真实记录的看板。
- [R2 <- Q1] 看板与记录要回到最初目的：保存人的判断、Agent 执行与后来结果，不是只装一份通用前端。
- [R3 <- Q1] 完成后整理并推送相关改动。
- [R4 <- Q2] 继续执行已经开始的发布与验证工作。

Agent 当时理解:
- [U1 <- R1,R2 | current-turn/commentary] Agent 先区分了「全局 Skill 可被发现」与「项目规则真正激活」：Yakushima 虽然已有旧 Viewer，却没有根目录 `AGENTS.md`，普通 Codex 协作不能可靠地自动恢复和写回。
- [U2 <- R1,R2 | current-turn/commentary] Agent 将真实验收定义为：同步模板但不覆盖项目事实；重新审计仍可访问的历史；把 7 月 6 日之后的真实工作补回主源；让复盘轨至少有一个不伪造结论的运营观察。
- [U3 <- R3 | current-turn/commentary] Agent 明确不提交 `.buildtrace/` 私有恢复清单、旧备份、临时 walkthrough 或与本轮无关的工作区内容。

Agent 计划:
- [P1 <- R1,R2] 核对 Yakushima 现有 BuildTrace 版本、项目记忆、Git 状态和历史缺口。
- [P2 <- R1,R2] 从最新版 BuildTrace 安全同步受管理的 Skill、Viewer、CLI、结构参考与部署说明。
- [P3 <- R2] 补齐项目级自动规则，重新审计 compact、任务、Git、多 Agent 与外部导出覆盖。
- [P4 <- R1,R2] 补记 7 月 6 日之后的真实项目动作，并将一条 SEO 动作升级为可回看的观察契约。
- [P5 <- R1,R2] 用真实主源启动 Viewer，检查项目脉络、复盘轨、决策手册与隐私边界。
- [P6 <- R3] 只暂存本轮确定属于 BuildTrace 的项目文件，验证后提交并推送。

执行轨迹:
- [E1 <- P1 | completed] 确认旧看板有 35 条记录但停在 2026-07-06；项目根目录缺少 `AGENTS.md`；受管理的 Skill 与 Viewer 仍是 v1.15 前后的旧版；工作区另有未提交备份与临时文件，需要隔离。
- [E2 <- P2 | completed] 运行 `sync`，更新 7 个受管理文件、新建 6 个参考与脚本文件，保留项目自己的 `BUILDTRACE.md` 和项目资料；旧模板备份到私有 `.buildtrace/backups/`。
- [E3 <- P3 | completed] 运行安全 `init`，只新建缺失的根目录 `AGENTS.md`；恢复审计在 148 份日志中匹配 21 份 Codex rollout 来源，覆盖 18 个唯一任务、168 条去重用户原话、1 个 compact 窗口、3 条多 Agent 派生边、138 个 Git 提交。Codex App 当前列出 6 个明显相关任务，已读取 5 个非当前任务的可用页面；外部平台和未暴露 fork 仍明确列为缺口。
- [E4 <- P4 | completed] 将 2026-07-18 真实用户问题和已推送修复补成完整记录；给 2026-07-03 Bing 动作增加稳定 record ID、假设、观察计划和决策原则，但因没有后台复扫数据，继续标为待观察。
- [E5 <- P5 | completed] 本地 Viewer 真实读取本项目 Markdown：桌面端显示 37 条项目记录、项目资料、复盘轨和决策手册；390px 检查无横向溢出，项目资料与人的初心仍可读取。
- [E6 <- P6 | pending] 等待最终测试与 Git 审查后补记。

人的假设:
- [H1] 在真实项目中同时激活项目级规则、历史恢复和只读 Viewer，比只复制一个看板模板更能让后续 Agent 延续人的判断与项目因果。
- [H2] 把旧动作补成带基线、窗口和判断规则的观察契约，会让 Yakushima 的运营数据复盘比「已经上线」更可信。

为什么做:
- Yakushima 是 BuildTrace 面向真实项目的验证对象。若它的记录停在两周前、项目规则没有激活，即使界面能打开，也不能证明这套工作流可以长期使用。
- 本项目同时包含交通准确性、移动端体验、SEO、分析和联盟等不同类型动作，适合检验同一结构能否容纳产品事实与运营结果。

做了什么:
- 安全同步 v1.17 模板，补齐 Codex 项目级自动规则和私有历史恢复审计。
- 更新历史覆盖声明，新增最新真实 UX 修复记录，并把 Bing 动作变成有明确到期规则的复盘项。

观察计划:
- [W1 | 指标=意义明确的项目工作在同一轮写回率 | 数据源=后续一个月 Git 与 BUILDTRACE.md 对照 | 基线=7 月 6 日至 18 日至少 1 次重要修复未及时写回 | 目标=100% | 窗口=2026-07-19 至 2026-08-19 | 达成规则=所有意义明确的功能、修复、运营动作或发布均在完成当轮新增或更新一条有依据记录] 验证项目级自动规则是否真正工作。
- [W2 | 指标=到期观察完成回看数 | 数据源=复盘轨与对应数据平台 | 基线=0 | 目标=>=1 | 窗口=2026-07-19 至 2026-08-19 | 达成规则=至少一条真实动作补入后续数据与 supported/refuted/mixed/inconclusive 判断] 验证复盘轨能否从展示变成实际归因流程。

决策原则:
- [dp-action-to-outcome-review | 运营] 不把上线或完成动作当成结果；保留原始假设、观察契约、后续数据和人的结论。

技术备注:
- `.buildtrace/recovery/latest.json` 与 `.buildtrace/backups/` 是私有审计 / 备份，不是第二主源，也不进入公开看板或 Git 提交。
- 五份 Cursor 导出已在任务 `019f75ff-2875-7fd0-ae7e-3f9586e0217e` 完成首轮时间顺序与隐私审计；其中可确认内容应继续增量补强既有记录，原始全文不直接提交。

结果:
- v1.17 模板、项目级自动规则、增量恢复审计与真实 Viewer 验收已经落地；Git 推送完成前，不能把本记录改为「有效」。

### 2026-07-18 — 末班后自动展示全天并修复本地预览样式

记录 ID: bt-20260718-after-last-bus-show-all
来源可信度: confirmed
来源覆盖: codex-task-api, git, browser-verification, project-files
关联任务: codex-thread/019f73b6-1189-7572-982a-d77925b18c05
依据: 用户三条完整原话；Agent 当时理解与执行记录；`index.html`；浏览器本地文件验证；commit `6a224cc`
场景: ux-content
可见范围: private
结果状态: 有效
后续回看: 无

沟通原文:
- [Q1 | user | 019f73b6-1189-7572-982a-d77925b18c05 | verbatim]
  > 这里，如果当天所有班次已经过了，我希望默认取消勾选\"只看之后”，让用户能看到所有
- [Q2 | user | 019f73b6-1189-7572-982a-d77925b18c05 | verbatim]
  > 崩了
- [Q3 | user | 019f73b6-1189-7572-982a-d77925b18c05 | verbatim]
  > push吧

需求总结:
- [R1 <- Q1] 当天存在班次但所有班次已过时，默认取消「只看之后」并展示全天班次。
- [R2 <- Q2] 修复修改后本地打开页面样式崩坏的问题。
- [R3 <- Q3] 验证后只提交并推送本次首页修复。

Agent 当时理解:
- [U1 <- R1 | 019f74ad-2489-7e02-966e-45495a0c2b18/commentary] Agent 将规则限定为「筛选后没有未来班次、但当天实际有班次时自动取消」；如果当天本来就没有班次，保留空状态。
- [U2 <- R1 | 019f74ad-2489-7e02-966e-45495a0c2b18/commentary] Agent 进一步区分系统默认与用户主动选择：只在默认状态自动取消；用户之后手动勾选时仍尊重用户选择。
- [U3 <- R2 | 019f74f4-8fa2-76e1-b47d-1ae0693ef7ce/commentary] Agent 根据截图判断不是筛选逻辑崩溃，而是 `file://` 打开时根路径样式表被解析到磁盘根目录，需改为同目录相对路径。
- [U4 <- R3 | 019f74fb-5963-7642-8abc-82b806e0f1e7/commentary] Agent 明确只提交首页两个修复，保留 `docs/buildtrace`、备份和其他未提交内容不动，并在远端出现 SEO 新提交后安全整合而不强推。

Agent 计划:
- [P1 <- R1] 定位筛选状态与结果渲染流程，恢复默认自动取消逻辑。
- [P2 <- R1] 保留用户主动重新勾选后的选择，不把自动规则变成强制规则。
- [P3 <- R2] 用实际浏览器检查失败资源，修复本地文件模式且不改变线上行为。
- [P4 <- R1,R2] 重新走完末班后场景，确认样式和班次展示均正常。
- [P5 <- R3] 仅暂存 `index.html`，整合远端更新后推送。

执行轨迹:
- [E1 <- P1 | completed] 在 `index.html` 恢复「默认筛选结果为空且当天有班次时自动取消」的逻辑。
- [E2 <- P2 | completed] 保留手动选择状态；用户主动重新勾选后继续显示「之后无班次」。
- [E3 <- P3 | completed] 将首页样式资源从站点根路径改为同目录相对路径，解决 `file://` 下错误读取 `file:///styles.css` 的问题。
- [E4 <- P4 | completed] 浏览器以本地文件模式确认 CSS 成功加载、布局恢复、末班后自动取消筛选并展示全天 10 班。
- [E5 <- P5 | completed] 仅提交 `index.html`，安全整合远端 SEO 报告提交后推送 `main`，commit `6a224cc`。

为什么做:
- 用户在当天末班后仍需要查看全天班次作为行程参考。默认筛选把结果变成空白，会让人误以为当天没有公交。
- 自动回退不能覆盖人的主动选择，否则「只看之后」会变成无法控制的假开关。

做了什么:
- 末班后默认展示全天；用户手动筛选时继续尊重选择。
- 修复本地文件预览的样式路径，并完成浏览器回归与 Git 推送。

技术备注:
- 实现与资源路径修复都位于 `index.html`；发布证据为 commit `6a224cc`。
- 浏览器验证使用本地 `file://` 页面，确认 CSS 加载与末班后全天 10 班展示；没有把浏览器状态写回项目主源。

结果:
- 真实浏览器验证通过并已部署；这条记录也补回了 7 月 6 日之后项目记忆漏写的最新产品动作。

### 2026-07-06 — BuildTrace v1.14 规则补丁安装（YakuBus）

来源可信度: confirmed
依据: 本轮对话
场景: ai-workflow
结果状态: 不确定
后续回看: 无

沟通原文:
- 请重新覆盖安装 BuildTrace v1.14，使用 buildtrace-v1.14.zip；同版本规则补丁，不要重写 BUILDTRACE.md 历史记录。
- Viewer 只能只读解析 BUILDTRACE.md；不创建 nodes.json；项目入口/手动节点/纠错通过 Agent 改 BUILDTRACE.md。

需求总结:
- 在 YakuBus 项目覆盖安装 v1.14 规则文件，确认 Markdown 主源边界，不恢复 JSON/viewer 主源。

为什么做:
- v1.14 收口了 Markdown-first、只读 Viewer、依据必填与回填审计规则；需与全局 skill 和 Cursor rule 对齐，避免 Agent 继续写 nodes.json 或误用旧看板。

做了什么:
- 覆盖 `docs/buildtrace/SKILL.md`、`CURSOR-UPDATE-PROMPT.md`、`PROJECT-PROFILE.md`、`.cursor/rules/buildtrace.mdc`、`~/.cursor/skills/buildtrace/SKILL.md`。
- 新建本文件 `BUILDTRACE.md`（项目尚无历史文件；未复制 zip 内 BuildTrace 产品自用历史）。
- 自 Shiplog 迁入 2 条项目记录（见下）；`nodes.json` 不更新。

技术备注:
- 安装包: `/Users/yimleung/Documents/Codex/2026-06-30/skills-gpt-claude-https-claude-ai/outputs/buildtrace-v1.14.zip`
- 旧 `docs/buildtrace/nodes.json`、`viewer/` 保留归档

结果:
- 规则已安装；Markdown 只读看板见 `docs/buildtrace/viewer-md/`（解析本文件）；旧 `viewer/` 仍为 JSON 版归档。

### 2026-07-03 — Bing meta description 加长并 push

记录 ID: bt-20260703-bing-meta-description
来源可信度: inferred
来源覆盖: historical-transcript, screenshot, git, ops-journal
关联任务: 未记录
依据: 本轮对话 · Bing Webmaster 截图（2026-06-30）· commit `0cb0673` · `docs/OPS-JOURNAL.md` V1.8.3
场景: seo-growth
可见范围: private
结果状态: 待观察
后续回看: 2026-07-08

沟通原文:
- （Bing 后台：meta description 过短，2 页 `/` 与 `/access/`）
- 可以 push

需求总结:
- 按 Bing 建议加长 meta description 并部署。

Agent 当时理解:
- 未捕捉；不能用 2026-07-19 的理解倒填成当时 Agent 已表达过的内容。

Agent 计划:
- 未捕捉；现有证据只能确认需求、修改、部署和上线前数据基线。

执行轨迹:
- [E1 | completed] 加长首页、`/ferry/` 的 meta / og / twitter description；`/access/` 补 description 与 `noindex, follow`；更新 `seo-head-zh.js`。
- [E2 | completed] push `main` @ `0cb0673`。
- [E3 | pending] Bing 后台复扫结果尚未取得。

人的假设:
- [H1 | inferred-from-record] 加长 description 并处理 `/access/` 的索引边界后，Bing 标记的 2 个技术性建议页应在重新抓取后减少或清除；搜索曝光变化只能作为相关信号，不能仅凭先后顺序认定由本次修改造成。

为什么做:
- Bing 标记首页与 `/access/` 描述过短（建议 150–160 字）；收录初期希望消掉技术性 SEO 建议项。

做了什么:
- 加长首页、`/ferry/` meta/og/twitter；`/access/` 补 description + `noindex, follow`；`seo-head-zh.js` → v2；push `main` @ `0cb0673`。

观察计划:
- [W1 | 指标=Bing meta description 技术建议页数 | 数据源=Bing Webmaster | 基线=2 页（`/`、`/access/`） | 目标=0 | 窗口=2026-07-03 至重新抓取后 7 天 | 达成规则=同一建议项对两页均消失] 判断技术修复是否被 Bing 重新识别。
- [W2 | 指标=Bing 搜索展示与点击 | 数据源=Bing Webmaster | 基线=2026-06-28 至 06-30 共 74 展示 / 10 点击 | 目标=仅记录变化，不预设增长幅度 | 窗口=修改后 7 至 28 天 | 达成规则=记录同期页面、查询、索引和其他改动后由人判断 supported/refuted/mixed/inconclusive] 避免把同时发生的曝光变化直接归因于 description。

决策原则:
- [dp-action-to-outcome-review | 运营] 不把上线或完成动作当成结果；保留原始假设、观察契约、后续数据和人的结论。

技术备注:
- `index.html`、`ferry/index.html`、`access/index.html`、`seo-head-zh.js?v=seo-zh-v2`

结果:
- 已 push。**Bing 建议是否清除未验证**。用户截图基线：74 展示 / 10 点击（6/28–6/30）；首页 41 展示 7 点击；`/map/` 30 展示 1 点击。

### 2026-07-03 — Shiplog 过渡（已被 v1.14 接替）

来源可信度: confirmed
依据: 本轮对话 · `docs/shiplog/SHIPLOG.md` SL-2026-07-03-02
场景: ai-workflow
结果状态: 不确定
后续回看: 无

沟通原文:
- 使用 SHIPLOG.md 作为唯一项目记忆源；不要 BuildTrace JSON/看板作主源。

需求总结:
- 短期用 Shiplog 纯 Markdown 替代 JSON 双轨。

为什么做:
- 当时 BuildTrace 过重；需要可扫读、有原话、有可信度的记录。

做了什么:
- 建立 `docs/shiplog/`；BuildTrace 标停用。2026-07-06 用户改回 BuildTrace v1.14 Markdown 主源。

技术备注:
- `docs/shiplog/SHIPLOG.md` 现作只读参考，不作主源。

结果:
- 已由 BuildTrace v1.14 接替；Shiplog 不再更新。

### 2026-07-03 — Microsoft Clarity 热力图接入

来源可信度: confirmed
依据: commit `696b04e` · commit `39e4c24` · `clarity.js`
场景: analytics-data
结果状态: 待观察
后续回看: 2026-07-19

沟通原文:
- 未捕捉。

需求总结:
- 在全站主页面接入 Microsoft Clarity 会话录制/热力图，本地开发跳过加载。

为什么做:
- unknown（commit 仅说明与 GA4 同样跳过 localhost；未记录产品动机或隐私评审原话）。

做了什么:
- 新增 `clarity.js`（项目 ID `xggkccgsor`）；8 个主页面引用。
- 跟进 commit 将外链改为 head 内联官方 snippet，便于 Clarity 后台验证安装。

技术备注:
- `696b04e` Add Microsoft Clarity tracking；`39e4c24` Inline snippet for setup detection
- `index.html`、`fare/`、`ferry/`、`map/`、`intro/`、`about/`、`trekking/`、`without-car/`
- localhost / 127.0.0.1 / `.local` 不加载

结果:
- 已部署；是否用于 UX 复盘、与 GA4 分工未记录。

### 2026-07-01 — BuildTrace 工具链 v1.1→v1.10（JSON 时代，已归档）

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.7.6–V1.8.2 · commit 记录 · nodes.json 旁证（工具升级节点）
场景: ai-workflow
结果状态: 不确定
后续回看: 无

沟通原文:
- 请读取 docs/buildtrace/CURSOR-UPDATE-PROMPT.md，并按这个项目内的 BuildTrace / Trace v1.10 规则继续维护。不要覆盖用户数据。

需求总结:
- 分阶段升级 BuildTrace 看板/脚本（v1.1 深度回填 → v1.5 字段 → v1.6–v1.10 UI），历史节点保留在 `nodes.json`。

为什么做:
- 需要项目节点记忆与 OPS-JOURNAL 互补；当时以 JSON + viewer 为工具主源（2026-07-06 已由 v1.14 Markdown 主源接替）。

做了什么:
- V1.7.6 接入 BuildTrace；V1.7.7 深度回填 38 节点；V1.7.8–V1.9 语言/ v1.5 迁移；V1.8.0–V1.8.2 v1.6/v1.8/v1.10 工具覆盖。
- 备份 `nodes-before-v1.5.json` 等；`PROJECT-NODES.md` 多次重生成。

技术备注:
- `docs/buildtrace/viewer/`、`nodes.json`（42 节点截止 2026-07-01）、`buildtrace-v1.5.zip`～`v1.10.zip`
- 2026-07-03～06 Shiplog / v1.14 切换后 JSON 不再作主源

结果:
- 工具链已完成使命；主源已迁至 `BUILDTRACE.md`，旧 viewer 只读归档。

### 2026-06-30 — PDF 列对齐、时刻表搜索与登山联盟区

来源可信度: confirmed
依据: commit `cbaef16` · `docs/OPS-JOURNAL.md`（同期 UX 版本）· nodes.json 旁证 #6
场景: bugfix
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 修复 PDF 列对齐、时刻表搜索体验，并整理登山页联盟模块位置。

为什么做:
- inferred：用户反馈或自测发现列错位/搜索不顺；登山联盟区需与内容流一致（详见 V1.6.4 移回季节下方）。

做了什么:
- PDF 列对齐修复；时刻表搜索 UX 改进；登山页联盟区布局调整（与 V1.6.4 同期主题）。

技术备注:
- commit `cbaef16` Fix PDF column alignment, timetable search UX, and trekking partner section
- `styles.css` layout 版本、`app-core.js` 搜索逻辑

结果:
- 已上线；未单独记录回归验证结论。

### 2026-06-29 — 区间车程合理性过滤

来源可信度: confirmed
依据: `docs/notes/2026-06-29-segment-plausibility.md` · nodes.json 旁证 #7
场景: bugfix
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 过滤不合理短区间车程查询结果，避免 PDF 解析边界产生的荒谬班次组合。

为什么做:
- inferred：跨站小段或锚点估算可能产生不可乘坐的「逻辑班次」，需 plausibility 规则挡掉。

做了什么:
- 在行程/搜索路径增加区间车程合理性校验。

技术备注:
- `docs/notes/2026-06-29-segment-plausibility.md`；`app-core.js` 相关过滤

结果:
- 已合并上线；效果未量化。

### 2026-06-29 — 邻近站提示、行程卡与下一班提示条

来源可信度: confirmed
依据: commit `329d738` · nodes.json 旁证 #8 · `docs/notes/2026-06-28-near-route-tips.md`
场景: feature
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 时刻表 UX：邻近站班次提示、行程卡片、底部下一班提示条。

为什么做:
- inferred：路边查车需快速看到「下一班」与邻近站可选方案，减少选错站。

做了什么:
- 行程卡展示；邻近站班次 tips；next-bar 下一班逻辑（commit `329d738`）。

技术备注:
- `app-core.js?v=core-v*`、`styles.css`；commit `329d738`

结果:
- 已上线；待观察实际使用是否降低选站错误（无埋点结论记录）。

### 2026-06-28 — 38 天复盘：CLS、结构化数据、sitemap、可及性

来源可信度: confirmed
依据: commit `93b27c8` · nodes.json 旁证 #9 · `docs/notes/2026-06-27-phase1-review.md`
场景: seo-growth
结果状态: 待观察
后续回看: 2026-07-19

沟通原文:
- 未捕捉。

需求总结:
- 按阶段一复盘清单修复累积布局偏移、结构化数据、sitemap、可及性项。

为什么做:
- inferred：站内自检或 Lighthouse/GSC 提示需集中清一批技术债，避免影响收录与体验。

做了什么:
- commit `93b27c8` Apply phase-1 review fixes: CLS, schema, sitemap, and a11y。

技术备注:
- `docs/notes/2026-06-27-phase1-review.md`、`docs/notes/2026-06-28-phase1-review-actions.md`

结果:
- 已部署；Core Web Vitals / 收录改善未在本仓库记录结论。

### 2026-06-28 — 中文 SEO 动态 meta 与百度首访

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.6.8 · `docs/notes/2026-06-28-baidu-search-setup.md` · nodes.json 旁证 #10
场景: seo-growth
结果状态: 待观察
后续回看: 2026-07-19

沟通原文:
- 未捕捉。

需求总结:
- 中文搜索来源首访动态中文 title/description；提交中文 sitemap。

为什么做:
- inferred：拓展百度等中文搜索入口，静态页默认日文/英文 meta 不足以覆盖中文查询意图。

做了什么:
- `seo-head-zh.js`；`sitemap-zh.xml`（7 URL）；`lang-boot.js` v4 百度/搜狗来源优先 `zh`。

技术备注:
- `seo-head-zh.js?v=seo-zh-v1`、`lang-boot.js?v=lang-v4`

结果:
- 已登记百度资源平台；中文收录与 CTR 未在仓库记录结论。

### 2026-06-28 — GA4 事件委托与内部流量过滤

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.6.9–V1.7.1 · `docs/notes/2026-06-25-analytics.md` · nodes.json 旁证 #11
场景: analytics-data
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- GA4 全站事件改委托绑定；排除 internal 自测流量；debug 参数跨页持久化。

为什么做:
- inferred：多页静态站换页后 DebugView 断链；自测污染标准报告。

做了什么:
- `analytics-events.js` v4 事件委托 + debug localStorage；GA4 后台过滤器排除 `traffic_type=internal`；关键事件标记（V1.7.0）。

技术备注:
- `analytics-events.js?v=analytics-v4`；GA4 `G-BX2P31GEHW`

结果:
- 后台配置完成；标准报告用户数口径变更，未记录前后对比数值。

### 2026-06-27 — 便利设施地图 /guide/ → /map/

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.6.1 · nodes.json 旁证 #12 · `docs/notes/2026-06-27-map-url.md`
场景: architecture
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- POI 便利设施地图 canonical 改为 `/map/`，并收紧地图页移动端 UI。

为什么做:
- inferred：`/guide/` 语义含糊；SEO 与导航需明确「地图」着陆页；`/fare/` 已拿走运价语义。

做了什么:
- `/map/` canonical；301 自旧 guide 路径；chip 间距、班次卡、列表高度等 UI 修复。

技术备注:
- `map/index.html`、`styles.css?v=layout-v130`～`v132`；commit `00c3fd6`

结果:
- 已上线；GSC URL 迁移需后续检查（OPS 待办仍列 `/map/`）。

### 2026-06-27 — PDF 全表 15 列与构建审计

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.6.0、V1.6.5 · nodes.json 旁证 #13 · `docs/notes/2026-06-27-pdf-full-audit.md`
场景: bugfix
结果状态: 有效
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- PDF 解析取全表最大列数（15 列）；构建链路接入时刻审计；修复缺班。

为什么做:
- confirmed：OPS 记录宫之浦港入口→宫浦小前 **11 班→12 班** 与 PDF 不一致，根因末列截断。

做了什么:
- `parse_pdf.py` ncols 全表最大；`audit_pdf_trips.py`；`build_all.py --validate`；`data.js` data-column-v3。

技术备注:
- `docs/notes/2026-06-27-pdf-full-audit.md`；审计命令 `python3 scripts/audit_pdf_trips.py --rebuild`

结果:
- 班次数与 PDF 对齐；构建失败即阻断发布。

### 2026-06-27 — 环线 columnTrips 跨站搜索丢班修复

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.5.9 · nodes.json 旁证 #14 · `docs/notes/2026-06-27-column-trip-search.md`
场景: bugfix
结果状态: 有效
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 环线搜索跨 2–3 站时不再只剩首班（如松叶仅 04:00）。

为什么做:
- confirmed：OPS 描述 fragment 小段匹配丢班；需按 PDF 列起终点匹配。

做了什么:
- `data.js` 增加 `columnTrips`；`findTrips` 优先列起终点。

技术备注:
- `app-core.js?v=core-v10`、`data.js?v=data-column-v2`

结果:
- 跨站搜索班次数恢复；与 15 列修复同批数据版本升级。

### 2026-06-27 — 浏览器语言自动检测与用户语言选择持久化

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.6.2、V1.6.3 · nodes.json 旁证 #15 · `docs/notes/2026-06-27-browser-lang.md`
场景: feature
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 首访按浏览器语言落地 ja/zh/en；用户手动选语言后不被 URL 参数打回。

为什么做:
- inferred：降低首访语言摩擦；避免分享链携带 `?lang=zh` 覆盖用户手动选 EN。

做了什么:
- `lang-boot.js` v1 自动检测 + URL 写入；v2 `lang-picked` localStorage 持久化。

技术备注:
- `lang-boot.js?v=lang-v1`→`v2`、`site-chrome.js`、`app-core.js`

结果:
- 已上线；各语言流量占比未记录。

### 2026-06-26 — 全站 SEO 文案「2026最新」

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.5.0 · nodes.json 旁证 #16 · `docs/notes/2026-06-26-seo-2026-latest.md`
场景: seo-growth
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- SERP 主文案由「3月改定」改为「2026最新」，PDF 脚注仍保留具体改定月。

为什么做:
- inferred：「3月改定」易被理解为过时年度，影响点击率。

做了什么:
- 各页 title/meta/JSON-LD/FAQ；`site-chrome.js` lead 文案同步。

技术备注:
- `site-chrome.js?v=chrome-v21`

结果:
- 已部署；CTR 变化见 SEO-JOURNAL，本文件未复述数值。

### 2026-06-25 — Klook/Viator 联盟页内投放

来源可信度: inferred
依据: commit `b65c3e8` · nodes.json 旁证 #17 · `docs/notes/2026-06-25-ferry-trekking-affiliate.md`
场景: monetization
结果状态: 待观察
后续回看: 2026-07-19

沟通原文:
- 未捕捉。

需求总结:
- 在船运、登山等上下文页内投放 Klook/Viator 联盟模块，不打断主任务流。

为什么做:
- inferred：在交通/登山信息场景自然曝光一日游联盟，但遵守「船运页不插打断卡片」底线（登山页位置后续 V1.6.4 调整）。

做了什么:
- Klook + Viator 联盟组件；情境化投放（commit `b65c3e8`）。

技术备注:
- `trekking/`、`ferry/` 相关模块；`docs/notes/2026-06-25-ferry-trekking-affiliate.md`

结果:
- 已上线；转化与收入未记录。

### 2026-06-25 — GA4 全站 26 项自定义事件

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.4.0 · nodes.json 旁证 #20 · `docs/notes/2026-06-25-analytics.md`
场景: analytics-data
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 票价查询、时刻表、导航、语言、PDF、地图 POI 等 26 项 GA4 自定义事件全站覆盖。

为什么做:
- inferred：静态多页站需统一行为数据，支撑 SEO/产品迭代判断。

做了什么:
- 新增 `analytics-events.js` v1，全页 head 引用（后续升至 v4）。

技术备注:
- `analytics-events.js?v=analytics-v1`；与 V1.7.0 关键事件标记、V1.7.1 委托升级为同轴演进

结果:
- 事件已上报；不含 Microsoft Clarity（见 2026-07-03 独立条）。

### 2026-06-25 — 六页工具站与产品介绍页 SEO

来源可信度: confirmed
依据: commit `574fb07` · nodes.json 旁证 #19 · `docs/notes/2026-06-25-intro-seo-update.md`
场景: seo-growth
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 六页工具站结构下刷新 intro 与各页 SEO、内链。

为什么做:
- inferred：URL 重命名后需统一对外叙事与搜索意图覆盖。

做了什么:
- intro 文案、全站内链、各页 meta/结构化数据更新（commit `574fb07`）。

技术备注:
- `intro/`、`site-chrome.js`、各页 head

结果:
- 已部署；收录见 SEO 专轴。

### 2026-06-25 — URL 重命名 /fare/ 与 /ferry/

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.3.0 · commit `7f70ec6` · nodes.json 旁证 #18 · `docs/notes/2026-06-25-url-fare-ferry.md`
场景: architecture
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 运价页 `/fare/`、船运页 `/ferry/`；旧 `/map/`（票价）、`/access/`（船运）301 跳转。

为什么做:
- inferred：原路径语义与页面内容错位（map=运价、access=船运），不利于 SEO 与用户理解。

做了什么:
- 新 canonical URL；301 保留 query/hash；`sitemap.xml` 仅新 URL。

技术备注:
- `fare/index.html`、`ferry/index.html`；`docs/notes/2026-06-25-url-fare-ferry.md`

结果:
- 已上线；旧 URL 权重迁移待 GSC 观察（OPS 待办）。

### 2026-06-24 — GA4/GSC 日报周报与飞书同步

来源可信度: confirmed
依据: nodes.json 旁证 #21 · git `4792f09`、`8c35c29` · `docs/seo/RUNBOOK.md`
场景: ops-release
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 自动化拉取 GSC/GA4 生成日报；周报与飞书表格同步。

为什么做:
- inferred：持续 SEO 运营需可重复的数据管道，减少手工抄数。

做了什么:
- GitHub Actions 日报/周报 workflow；飞书 sheet 自动创建与同步（commits `4792f09`、`8c35c29`、`c5d44a9`）。

技术备注:
- `docs/seo/`、`docs/notes/` 飞书相关登记；`.github/workflows/`

结果:
- 流水线运行中；单日 metrics JSON 在 `docs/seo/metrics/`，不作节点逐日复述。

### 2026-06-24 — POI 地图、公交站名单一来源与星级反馈

来源可信度: confirmed
依据: nodes.json 旁证 #22–24 · `docs/notes/2026-06-24-stop-single-source.md` · `docs/notes/2026-06-24-site-feedback.md`
场景: feature
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 便利设施地图与公交站名统一数据源；全站星级反馈组件；页脚精简。

为什么做:
- inferred：避免地图/时刻表站名不一致；轻量收集用户反馈。

做了什么:
- POI + 公交站单一来源重构；feedback 组件；footer 精简（多 commit 2026-06-24 批次）。

技术备注:
- `bus-stops-geo.js`、`map-data.js`；`docs/notes/2026-06-24-poi-guide-map.md`

结果:
- 已上线；反馈量未记录。

### 2026-06-23 — 登山参考页、Ko-fi 与渡轮停运公告

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` 相关版本 · nodes.json 旁证 #23–26 · `docs/notes/2026-06-23-trekking-page.md` · `docs/notes/2026-06-23-ko-fi-support.md` · `docs/notes/2026-06-23-ferry-suspensions.md`
场景: feature
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 上线 `/trekking/` 登山参考；Ko-fi 赞助入口；船运页运休/停运公告区。

为什么做:
- inferred：登山公交衔接是高频场景；停运信息需与船运同页；赞助覆盖运维成本（动机 inferred）。

做了什么:
- `trekking/index.html`；Ko-fi 链接；ferry 停运列表与数据来源。

技术备注:
- `docs/notes/2026-06-23-*.md`；`trekking-data.js`

结果:
- 已上线；联盟与赞助转化未记录。

### 2026-06-09 — 全站 UI 层级统一与日文 SEO

来源可信度: confirmed
依据: nodes.json 旁证 #27 · commits `0d0341a`、`1904e48`、`99970de` 等 · `docs/notes/2026-06-09-meta-line-verification.md`
场景: ux-content
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 统一页头层级、FAQ、aux 底栏；加强日文 SEO meta 与内链。

为什么做:
- inferred：多页迭代后信息层级不一致；日本用户是核心受众。

做了什么:
- `.page-section-title` 层级；FAQ 排版；日文 meta/内链（commit `0d0341a` 等）。

技术备注:
- `styles.css` layout 版本递增；`site-chrome.js`

结果:
- 全站视觉层级对齐 design-system 规则。

### 2026-06-08 — SEO 点击率优化落地（P0–P2）

来源可信度: confirmed
依据: nodes.json 旁证 #28 · `docs/notes/2026-06-08-seo-ctr-update.md` · `docs/seo/SEO-JOURNAL.md`
场景: seo-growth
结果状态: 待观察
后续回看: 2026-07-19

沟通原文:
- 未捕捉。

需求总结:
- 按 SEO 日报优先级落地 P0–P2 CTR/展示优化项。

为什么做:
- inferred：GSC 数据显示部分查询展示高点击低，需改 title/meta/内链。

做了什么:
- 批量页面 SEO 文案与内链调整（详见 SEO-JOURNAL 与 notes）。

技术备注:
- `docs/notes/2026-06-08-seo-ctr-update.md`；`docs/seo/SEO-JOURNAL.md`

结果:
- 已部署；效果指标在 SEO 专轴，本文件不复述。

### 2026-06-04 — 产品介绍页与 30 秒演示视频

来源可信度: confirmed
依据: nodes.json 旁证 #29 · commit `ae0957d` · `docs/notes/2026-05-26-product-video-30s.md`
场景: feature
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- `/intro/` 产品导览页含演示视频；noindex 防与工具页抢权重。

为什么做:
- inferred：对外说明产品能力与合作演示，但不进入主 SEO 着陆页集。

做了什么:
- `intro/index.html` + `assets/video/yakushima-bus-demo.mp4`；sitemap 日报接受 intro（`f1c8543`）。

技术备注:
- `docs/notes/2026-05-21-product-demo-video.md`、`2026-05-26-product-video-30s.md`

结果:
- 页面上线；视频播放与转化未记录。

### 2026-06-04 — 关于页完整数据来源清单

来源可信度: confirmed
依据: commit `7bc06a7` · nodes.json 旁证 #30
场景: ux-content
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 关于页列出全部官方数据来源与引用，建立信任。

为什么做:
- inferred：时刻表/运价需可追溯到官方 PDF，减少「哪来的数据」质疑。

做了什么:
- `about/index.html` + `about-data.js` 完整来源列表；部分来源后迁至 intro（`93f57bb`）。

技术备注:
- commit `7bc06a7` feat(about): list all data sources

结果:
- 已上线；与 intro 来源区后续有分工调整。

### 2026-05-29 — 顶栏导航与运价/上岛页版面收紧

来源可信度: confirmed
依据: nodes.json 旁证 #31 · commit `10bc454`
场景: ux-content
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 顶栏导航、站名层级、运价与 access 页版面收紧。

为什么做:
- inferred：桌面端信息密度与导航一致性反馈。

做了什么:
- commit `10bc454` feat(ui): 顶栏导航、站名层级与运价/access 版面收紧。

技术备注:
- `site-chrome.js`、`styles.css`

结果:
- 已上线。

### 2026-05-26 — 产品介绍页修复与 SEO 日报 v2

来源可信度: confirmed
依据: nodes.json 旁证 #32 · `docs/notes/2026-05-26-intro-page-fixes.md` · git `0a72d44`
场景: ops-release
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- intro 页修复；SEO 日报升级为 v2（全量数据、原因解释、自动优先级）。

为什么做:
- inferred：intro 早期问题阻塞演示；日报需可行动的优先级。

做了什么:
- intro 修复；SEO daily v2 + 失败重跑（`110b5cd`）；飞书追踪（`ee3af4b`）。

技术备注:
- `docs/seo/`；`.github/workflows/seo-daily.yml`

结果:
- 日报流水线稳定；详见 SEO-JOURNAL。

### 2026-05-25 — ⭐ GSC 索引修复与 SEO 基线

来源可信度: confirmed
依据: `docs/OPS-JOURNAL.md` V1.0.0 · nodes.json 旁证 #33 · commit `c11ff5f`、`5f4ff1b`
场景: seo-growth
结果状态: 有效
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 修复 GitHub Pages Private 导致的全站 404；建立 GSC 索引与四页内链基线。

为什么做:
- confirmed：OPS 与 commit `c11ff5f` 记录 Private 仓库致 Pages 404，需改 Public 并重提交 sitemap。

做了什么:
- Pages Public + 重启用；四页 footer 内链；荒川登山口 meta；WebSite JSON-LD；sitemap 提交。

技术备注:
- `docs/seo/SEO-JOURNAL.md`；commit `c11ff5f`、`5f4ff1b`

结果:
- 站点可公开访问；GSC 开始收录（后续指标在 SEO 专轴）。

### 2026-05-25 — SEO 日报自动生成 P0–P2 优先级

来源可信度: confirmed
依据: nodes.json 旁证 #35 · commit `f604827`
场景: ops-release
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 日报从 GSC/GA4 拉数并自动生成 P0–P2 优化优先级。

为什么做:
- inferred：手工读 GSC 不可持续，需脚本化优先级。

做了什么:
- commit `f604827` feat(seo): 日报从 GSC/GA4 拉数自动生成 P0–P2。

技术备注:
- `.github/workflows/`；`docs/seo/scripts/`

结果:
- 成为后续 SEO 运营主轴；逐日报告不入 BuildTrace。

### 2026-05-25 — 运价页地图 UI 精简

来源可信度: inferred
依据: nodes.json 旁证 #34 · `docs/notes/2026-05-25-map-destinations-eval.md`
场景: ux-content
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 按反馈精简运价页地图 UI（目的地展示/层级）。

为什么做:
- inferred：nodes 与 notes 指向用户反馈地图信息过密。

做了什么:
- 运价/地图相关 UI 精简（2026-05-25 批次，具体 diff 见 notes）。

技术备注:
- `docs/notes/2026-05-25-map-destinations-eval.md`；`map-data.js` / fare 页

结果:
- 已调整；无 A/B 记录。

### 2026-05-22 — SEO 双周工作流与 GSC OAuth

来源可信度: confirmed
依据: nodes.json 旁证 #36 · commits `abc2720`、`afbda30`
场景: ops-release
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 建立 SEO 双周报告与 GSC OAuth 拉数能力（后演进为日报）。

为什么做:
- inferred：需要定期从 GSC 取数写报告；OAuth 替代手工导出。

做了什么:
- biweekly workflow；GSC OAuth fetch；SEO 文档扩展（后 `648369f` 移除半月报仅保留 daily）。

技术备注:
- `docs/seo/`；commit `abc2720`、`648369f`

结果:
- 双周流已被日报取代；OAuth 能力保留在脚本中。

### 2026-05-21 — 桌面布局、PDF 预览与上岛预订信息

来源可信度: confirmed
依据: nodes.json 旁证 #37 · commit `78f1fa1`、`01244b1` · `docs/notes/2026-05-21-desktop-layout.md`
场景: feature
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 桌面端布局、PDF 内联预览、上岛交通预订信息完善。

为什么做:
- inferred：移动端先行后需桌面可读；PDF 需页内预览；access 页补预订链。

做了什么:
- commit `78f1fa1` 桌面三语 UX；`01244b1` PDF 预览与 access booking。

技术备注:
- `docs/notes/2026-05-21-map-pdf-mobile-preview.md`、`2026-05-21-access-booking.md`

结果:
- 已上线。

### 2026-05-20 — 项目初始化：PDF 管线、域名、视觉与联盟

来源可信度: confirmed
依据: `README.md` · git 首 commits `1425c02`、`5b0005b` · nodes.json 旁证 #38–42 · `docs/notes/2026-05-20-init.md`
场景: feature
结果状态: 不确定
后续回看: 无

沟通原文:
- 未捕捉。

需求总结:
- 屋久岛公交静态站上线：PDF 解析构建、域名、第三版视觉、首批 Klook 联盟、运维日志制度。

为什么做:
- confirmed（项目初心）：让旅行者路边查下一班公交，数据对齐官方 PDF。

做了什么:
- `scripts/build_all.py` / `parse_pdf.py` 管线；`yakushimabus.com` CNAME；design v3；Klook 联盟首批；`change-journal` 制度（V1.5.8）。

技术备注:
- commits `1425c02`、`5b0005b`、`43076b0`；`docs/notes/2026-05-20-init.md`
- 子主题含：GA4（`9a9d9e0`）、GSC 验证（`e490030`）、clean URL（`6df271d`）等同日批次

结果:
- 站点 MVP 上线；后续迭代见本文件各主题条。
