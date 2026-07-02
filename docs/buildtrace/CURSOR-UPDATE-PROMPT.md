# 给 Cursor 的 BuildTrace 更新指令

当前版本：BuildTrace / Trace v1.10

请在当前项目里更新或维护 BuildTrace。注意：这是长期项目记忆系统，不是一次性生成物。

## 更新边界

可以覆盖这些工具文件：

- `docs/buildtrace/SKILL.md`
- `docs/buildtrace/viewer/`
- `docs/buildtrace/scripts/`
- `docs/buildtrace/references/`
- `docs/buildtrace/nodes.schema.json`
- `.cursor/rules/buildtrace.mdc`

不要直接覆盖这些用户数据，除非用户明确要求：

- `docs/buildtrace/nodes.json`
- `docs/buildtrace/PROJECT-PROFILE.md`
- `docs/buildtrace/PROJECT-NODES.md` 中用户手写补充
- `docs/buildtrace/evidence/`
- `project.resources`
- `userNotes`
- `hidden`
- `sourceRefs`

## 本轮维护流程

1. 先读：
   - `docs/buildtrace/PROJECT-PROFILE.md`
   - `docs/buildtrace/nodes.json`
   - `docs/buildtrace/references/evidence-policy.md`
   - `docs/buildtrace/references/lifecycle.md`
2. 识别用户这轮要做的是：
   - 恢复上下文
   - 记录本轮
   - 复盘时间段
   - 补缺口/纠错/隐藏节点
   - 更新工具本体
3. 任何节点都必须有依据：
   - 用户原话
   - 文件路径
   - commit/PR/deploy URL
   - 数据导出
   - 截图/快照路径
   - 明确标注为用户手填
4. 没有依据时不要编造，只能标为 `needs-user-context`、`date-inferred` 或写进待补问题。
5. 如果用户新增、编辑或移除了项目入口，把这些变化写回 `project.resources`。入口字段为 `id/category/title/url/note`，它们是资料柜，不是单条节点证据。
6. 更新 `docs/buildtrace/nodes.json` 后，运行：

```bash
node docs/buildtrace/scripts/nodes-json-to-md.mjs docs/buildtrace/nodes.json docs/buildtrace/PROJECT-NODES.md
```

7. 最后报告：
   - 更新了哪些文件
   - 当前节点数
   - 新增/修改/隐藏了哪些节点
   - 哪些内容缺证据，需要用户确认
   - 是否保留了用户数据

## 如果要安装新版本包

如果用户给了新的 `buildtrace-vX.zip`：

1. 解压到临时目录。
2. 只复制工具文件到 `docs/buildtrace/`。
3. 保留现有 `nodes.json`、`PROJECT-PROFILE.md`、`evidence/`、用户备注、隐藏状态、资源入口。
4. 如 schema 有新增字段，只做向后兼容迁移，不删除旧字段。
5. 更新完成后，在 `nodes.json` 新增一个工具更新节点，记录新版本、来源和改动。
