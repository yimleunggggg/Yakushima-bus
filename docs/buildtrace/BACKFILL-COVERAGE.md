# BuildTrace 回填 Coverage（YakuBus）

**首次回填日期**：2026-07-06

**最近增量审计**：2026-07-19

**覆盖类型**：主题级（theme-level）+ 本机 Codex / 首批 Cursor 导出增量审计，**非**逐 user_query / 逐 commit 全覆盖
**BUILDTRACE 总条数**：37（2026-07-19 补入 v1.17 同步与 2026-07-18 真实 UX 修复）

## 2026-07-19 增量覆盖

- 本机 Codex rollout：扫描 148 份，匹配 21 份日志来源，覆盖 18 个唯一 Yakushima 任务。
- 匹配内容计数：168 条去重用户原话、342 条 Agent 消息出现次数、1 个 compact 窗口、3 条多 Agent 派生边。fork 可能重复携带消息前缀，因此用户消息按稳定 ID 去重，Agent 消息保留为来源内出现次数。
- Codex App 当前可列出 6 个明显相关任务；已读取 5 个非当前任务的可用页面。3 个长任务仍有旧页待继续分页，不能标记为完整映射。
- Git：覆盖 2026-05-20 至 2026-07-18，共 138 个提交与 4 个本地 / 远端分支引用。
- 用户另行提供 5 份 Cursor 对话导出，共 26,176 行、286 个 User 消息块。首轮已完成文件时间顺序、重叠关系、隐私与噪声审计；尚需按既有 35 条记录逐条做有证据的增量补强，不能把原始全文直接提交。
- 外部平台：GA4、GSC、Bing、Clarity 实时后台以及未导出的其他 AI 工具仍不可访问。
- 不可恢复边界：删除、无权限或从未导出的对话不能宣称已恢复；没有原生父子 ID 的 fork 只能标成推断。

本轮新增了 2026-07-18 的完整用户原话、Agent 理解 / 计划 / 执行与 commit 证据，并将 2026-07-03 Bing 动作升级为带基线、窗口和判断规则的复盘项。其余 Cursor 原话继续按证据增量补入，不用当前 Agent 的措辞替代历史内容。

## 记录映射表

| 编号 | 标题 | 来源路径 | 可信度 | 来源类型 | 缺口风险 | merged-skipped-unmapped |
|---|---|---|---|---|---|---|
| — | BuildTrace v1.14 安装 | 本轮对话 | confirmed | transcript | 低 | — |
| — | Bing meta 加长 | OPS V1.8.3 · commit `0cb0673` · 截图 | inferred | ops+git | 中（Bing 复扫未验证） | — |
| — | Shiplog 过渡 | SHIPLOG SL-03-02 | confirmed | transcript | 低 | — |
| CL-01 | Microsoft Clarity 接入 | commit `696b04e` · `39e4c24` · `clarity.js` | confirmed | git+file | 中（动机 unknown；隐私评审无记录） | **独立成条**（非 BT-21 批次） |
| BT-28 | BuildTrace 工具链 v1.1→v1.10 | OPS V1.7.6–V1.8.2 · nodes 旁证 #1–5 | confirmed | ops+git | 低 | 合并 5 个工具升级节点 |
| BT-27 | PDF 列对齐/搜索/登山联盟 | commit `cbaef16` · nodes #6 | confirmed | git | 中（无用户原话） | — |
| BT-26a | 区间车程合理性过滤 | notes/2026-06-29-segment-plausibility · nodes #7 | confirmed | notes | 中 | — |
| BT-26b | 邻近站/行程卡/下一班条 | commit `329d738` · nodes #8 | confirmed | git+notes | 中 | — |
| BT-25a | 38 天复盘 CLS/schema/a11y | commit `93b27c8` · nodes #9 | confirmed | git+notes | 中（效果未量化） | — |
| BT-25b | 中文 SEO + 百度 | OPS V1.6.8 · notes/baidu | confirmed | ops+notes | 中 | — |
| BT-25c | GA4 委托 + 内部流量过滤 | OPS V1.6.9–V1.7.1 · nodes #11 | confirmed | ops | 低 | 与 BT-21 同轴，分主题 |
| BT-24a | /guide/→/map/ | OPS V1.6.1 · nodes #12 | confirmed | ops | 低 | — |
| BT-24b | PDF 15 列 + 构建审计 | OPS V1.6.0/6.5 · nodes #13 | confirmed | ops | 低 | — |
| BT-24c | columnTrips 丢班 | OPS V1.5.9 · nodes #14 | confirmed | ops | 低 | — |
| BT-24d | 浏览器语言 | OPS V1.6.2/6.3 · nodes #15 | confirmed | ops | 中 | — |
| BT-23 | SEO「2026最新」 | OPS V1.5.0 · nodes #16 | confirmed | ops | 低 | — |
| BT-22 | Klook/Viator 联盟 | commit `b65c3e8` · nodes #17 | inferred | git | 中 | — |
| BT-21 | GA4 26 项事件 | OPS V1.4.0 · nodes #20 | confirmed | ops | 低 | **未含 Clarity**（见 CL-01） |
| BT-20 | 六页工具站 SEO | commit `574fb07` · nodes #19 | confirmed | git | 低 | — |
| BT-19 | URL /fare/ /ferry/ | OPS V1.3.0 · nodes #18 | confirmed | ops | 中（GSC 迁移） | — |
| BT-18 | GA4/GSC 流水线 + 飞书 | nodes #21 · RUNBOOK | confirmed | ops+git | 低 | — |
| BT-17 | POI/站名/星级反馈 | nodes #22–24 · notes | confirmed | notes | 中 | 合并 3 节点 |
| BT-16 | 登山/Ko-fi/渡轮停运 | nodes #23–26 · notes | confirmed/inferred | notes | 中（Ko-fi 动机 inferred） | 合并 3 节点 |
| BT-15 | UI 层级 + 日文 SEO | nodes #27 · commits 批次 | confirmed | git | 低 | — |
| BT-14 | SEO CTR P0–P2 | nodes #28 · SEO-JOURNAL | confirmed | seo | 中（指标在专轴） | — |
| BT-13 | 关于页数据来源 | commit `7bc06a7` · nodes #30 | confirmed | git | 低 | — |
| BT-12 | intro + 30s 视频 | commit `ae0957d` · nodes #29 | confirmed | git | 低 | — |
| BT-11 | 顶栏导航版面 | commit `10bc454` · nodes #31 | confirmed | git | 低 | — |
| BT-10 | intro 修复 + 日报 v2 | nodes #32 · seo commits | confirmed | ops | 低 | — |
| BT-09 | 运价地图 UI 精简 | nodes #34 · notes | inferred | notes | 中 | — |
| BT-08 | 日报 P0–P2 自动生成 | commit `f604827` · nodes #35 | confirmed | git | 低 | — |
| BT-07 | ⭐ GSC 索引基线 | OPS V1.0.0 · nodes #33 | confirmed | ops+git | 低 | — |
| BT-06 | SEO 双周 + OAuth | nodes #36 · git | confirmed | git | 低 | 双周流后并入日报 |
| BT-05 | 桌面/PDF/预订 | nodes #37 · commits | confirmed | git | 低 | — |
| BT-04 | 项目初始化 | README · git 首批 · nodes #38–42 | confirmed | readme+git | 中（早期原话缺） | 合并 init/域名/视觉/Klook/运维制度 |

## nodes.json 映射

- **42 节点** → **29 条 BUILDTRACE**（含 3 条已有 + 26 回填）；42 节点全部有主题归属或并入 BT-04/BT-17/BT-16/BT-28。
- **未单独成条的 nodes**：#2 Quick backfill 扫描 → 并入 BT-28；#3 Bing meta → 已有独立条（2026-07-03）。

## merged / skipped / unmapped

| 类型 | 内容 |
|---|---|
| **merged** | 42 nodes → 26 新主题条；2026-05-20 五日 init 子主题；2026-06-27 四数据/UX 主题；2026-06-28 三 SEO/analytics 主题 |
| **skipped（噪音）** | ~40+ `docs(seo): daily report` commits；`docs/seo/metrics/daily-*.json` 逐日文件 |
| **skipped（专轴）** | SEO 效果数值 → `docs/seo/SEO-JOURNAL.md` 不复述 |
| **unmapped（低优先级）** | notes 内单次 UI 微调（如 `2026-05-20-ferry-diagonal-line`、footer-i18n 等）未独立成条，语义已含在 BT-04/BT-15 |
| **unmapped（待补）** | V1.7.4–V1.7.5 SHIPLOG 接入/下线（3 天制度切换）— 已由现有 Shiplog/v1.14 条覆盖制度，未另开 |
| **Clarity 决策** | commit `696b04e` 为**独立**第三方行为分析工具（非 GA4 事件批次）→ **CL-01 独立条**，不并入 BT-21 |

## 声明

本次为 **主题级可读历史回填**，不声称逐条对话或逐 commit 全覆盖。若后续发现 notes/transcript 新来源，应先做回填审计再增补条目。
