# Agent Skills 公开安装

Skill 教 Agent **怎么做**；脚本与 Workflow 仍需从案例仓复制（见 [03-GitHub与Workflow.md](03-GitHub与Workflow.md)）。

## 安装（Cursor / 支持 skills CLI 的 Agent）

```bash
# 列出本仓可用 Skill
npx skills add yimleunggggg/Yakushima-bus -l

# 安装全部
npx skills add yimleunggggg/Yakushima-bus -s '*' -y

# 或只装一个
npx skills add yimleunggggg/Yakushima-bus -s static-site-seo-setup -y
```

| Skill | 用途 |
|---|---|
| `static-site-seo-setup` | 从零搭 GSC/GA4 + Actions + 通知 |
| `static-site-seo-report` | 读日报/周报表格字段 |
| `static-site-seo-incident` | 404、拉数失败、索引问题 |

## 发布给别人

1. 本仓 **Public** 并 push（Skill 在仓库根目录 `static-site-seo-*/SKILL.md`）。
2. 对方运行上列 `npx skills add`；无需 fork 整仓。
3. 脚本模板：复制 `scripts/seo_*` 与 `.github/workflows/seo-*.yml`，Secrets 各自配置。

也可把同一套 Skill 目录同步到 [vibe-coding-static-site-guide](https://github.com/yimleunggggg/vibe-coding-static-site-guide) 教程仓。
