# Long-Term Workflow

读取时机：当用户问 BuildTrace 什么时候使用、看板如何同步、是否实时更新、如何长期调用、如何让用户新增/隐藏/纠正节点时读取本文件。

## 使用时机

BuildTrace 不应该打断每一步开发。

推荐四个触发点：

1. 开工前：恢复上下文。
2. 重要工作结束后：记录本轮。
3. 看数据或排查问题时：复盘时间段。
4. 用户质疑或补充时：纠正、隐藏、补备注。

## 长期存储

项目内保留两个长期文件：

- `docs/buildtrace/nodes.json`: 结构化事实源，供看板读取和 Agent 更新。
- `docs/buildtrace/PROJECT-NODES.md`: 可读详情账本，供人类长期追溯。
- `docs/buildtrace/PROJECT-PROFILE.md`: 项目档案，包含目标、指标、约束和项目入口。

看板是浏览和编辑辅助，不是唯一存储位置。

## 项目入口 / 资料柜

用户经常需要从项目记忆跳回这些地方：

- GitHub / 代码仓库 / issue / PR
- 原始文档、飞书/Notion/Google Docs、README
- 参考资料、竞品、灵感来源
- GA4、PostHog、Search Console、数据看板
- Vercel、Cloudflare、GitHub Actions、部署后台
- Stripe、支付、联盟、收入后台
- Figma、设计稿、素材库
- 运营后台、CMS、客服或错误监控

这些入口应放在 `project.resources` 和 `PROJECT-PROFILE.md` 的项目入口区。

资源入口不是项目节点，也不是证据本身。它们是资料柜。只有当某个链接支撑一条具体记录时，才把它写进对应节点的 `sourceRefs` 或 `evidence`。

资源入口字段：

- `id`: 稳定标识，便于看板编辑。
- `category`: `code` / `docs` / `reference` / `data` / `deploy` / `finance` / `admin` / `design` / `other`。
- `title`: 用户看到的名称。
- `url`: 网页链接或本地相对路径。
- `note`: 说明这个入口是什么、什么时候看、注意什么。

看板里可以新增、编辑、移除项目入口。静态页面会先写入浏览器本地缓存；要长期保存到项目文件，需要导出 JSON，或让 Agent 把修改写回 `docs/buildtrace/nodes.json`。

不要保存密钥、token、客户隐私、支付明细或任何敏感凭证。

## 看板如何同步

静态 HTML 在浏览器里不能直接写回项目文件。

三种同步方式：

- Agent 更新：用户让 Agent 记录/修正节点，Agent 直接更新 `nodes.json` 并重生成 `PROJECT-NODES.md`。
- 手动导入：用户打开 viewer，导入最新 `nodes.json`。
- 手动导出：用户在 viewer 编辑/隐藏/新增后导出 JSON，再让 Agent 写回 `docs/buildtrace/nodes.json`。

如果从本地服务器访问 viewer，它可以尝试读取 `../data/nodes.json` 或打包示例；但真实项目仍以 `docs/buildtrace/nodes.json` 为准。

## 用户自主操作

用户可以：

- 新增节点草稿。
- 编辑标题、日期、场景、状态、一句话、为什么做、依据/来源。
- 隐藏节点。隐藏不等于删除。
- 写自由备注。
- 导出 JSON 交给 Agent 写回。

Agent 收到用户纠正时，应优先保留用户判断，并把纠正写入 `userNotes`。

## 删除策略

默认隐藏，不默认删除。

只有用户明确说“删除”，并且备份当前 `nodes.json` 后，才删除节点。

## 什么时候建节点

应该建节点：

- 功能新增或重要体验变化。
- Bug 修复，尤其是影响数据、交易、可信度、关键路径。
- 埋点、数据口径、实验方案变化。
- SEO、增长、变现、定价、支付、订阅相关变化。
- 架构、数据结构、模型/提示词、部署策略变化。
- 用户明确说“这个想法/判断/取舍值得记一下”。

不应该建节点：

- 纯格式化。
- 没有用户影响的微小重命名。
- 每个 commit 都建一条。
- 无证据的猜测。
