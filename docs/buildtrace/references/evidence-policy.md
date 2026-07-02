# Evidence Policy

读取时机：当 Agent 创建、回填、修正、隐藏、删除、合并、复盘项目节点，或用户质疑日期、截图、commit、上线时间、数据归因是否真实时读取本文件。

## 第一原则

不要编造。

BuildTrace 的价值不是让时间线看起来完整，而是让未来的人知道哪些内容有依据、哪些只是推断、哪些需要补。

## 节点必须有依据

每条节点至少写一种可检查来源：

- `sourceRefs`: commit hash、文件路径、Markdown 记录、截图路径、导出的 GA4/PostHog/Stripe 数据、Vercel deployment URL、GitHub PR/issue URL、用户原话所在文档。
- `evidence`: 结构化证据说明。适合写 `{ kind, ref, note, supports }`。
- `docRef`: 指向 `PROJECT-NODES.md` 中对应的长期记录位置。

如果没有来源，不要把它写成事实。改成：

- `dateConfidence: unknown` 或 `date-inferred`
- `humanIntent.confidence: not-captured`
- `status: needs-user-context`
- `sourceRefs: ["缺来源：需要用户确认"]`

## 日期规则

Git 只能证明某个文件或 commit 在某个时间存在，不能自动证明“功能在这天上线”。

不要把“仓库 2026-05-20 初始化”写成“某个功能 2026-05-20 上线”，除非有对应 commit、部署记录、日志、文档或用户确认。

## commit / push / deploy 怎么记录

commit、push、deploy、PR、issue、CI、Vercel deployment 默认是事实轨道，不一定是项目节点。

把它们升格成节点的条件：

- 它代表一次用户可感知的功能、修复、变更、实验或发布。
- 它承载一个关键决策，例如回滚、架构迁移、埋点方案变化。
- 它是后续数据变化可能需要对照的上线点。

否则放在：

- `externalEvents`
- `sourceRefs`
- `evidence`

## 截图和页面快照

只有真实存在的截图或快照路径才能写入证据。

允许提示用户补截图：

- “这个节点适合保留上线前截图。当前未发现截图文件，要不要补？”

不允许写：

- “before/after screenshot” 但没有文件路径。
- “页面快照已保存” 但目录不存在。

## 用户纠错

如果用户说某条是错的：

1. 保留原节点，不要直接删除。
2. 写入 `userNotes` 说明用户纠错。
3. 修正字段。
4. 如果用户只是不想看，把 `hidden: true`，不要硬删除。
5. 如果用户要求删除，先备份 `nodes.json`。

## 结果回看不是强制任务

不是每个节点都必须回填结果。用户可以选择：

- 暂不回看
- 写一句备注
- 标记无需回看
- 只保留为历史记录

Agent 不要把所有节点都催成待办。
