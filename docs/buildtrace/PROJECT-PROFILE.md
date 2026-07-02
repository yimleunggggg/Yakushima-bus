# Project Profile

## Project

- Name: YakuBus（yakushimabus.com）
- One-sentence purpose: 屋久岛公交时刻表、路线图、运价与上岛交通的一站式静态查询站。
- Current stage: 上线约 40 天（2026-05-20 → 2026-07-01）；BuildTrace 已安装，**42** 项目节点。
- Primary audience: 屋久岛旅行者（日/中/英）、本地居民、旅行社从业者。
- Main surfaces: `/` 时刻表 · `/map/` POI 地图 · `/fare/` 运价 · `/ferry/` 船运 · `/trekking/` 登山 · `/without-car/` 不租车攻略 · `/intro/` 产品介绍

## Goals

- Primary goal: 让用户在路边快速查到下一班公交、路线与运价。
- Secondary goals: SEO 获客、联盟变现（Klook/Viator）、中文搜索渠道、数据可信。
- Current phase: Phase-1 复盘后修 CLS/埋点/中文 SEO；持续优化时刻表 UX 与数据准确性。

## Metrics and signals

- Acquisition: GA4 Organic Search ~40%、GSC 日本 Google 为主；百度/Bing 刚起步。
- Activation: `timetable_search`（时刻表区间查询）、`fare_lookup`（运价查询）。
- Engagement: 感兴趣会话 ~43%；平均每活跃用户 ~2.8 页。
- Retention: 回访 ~10%（旅行工具正常偏低）。
- Revenue or transactions: `affiliate_click`（trekking / without-car / ferry Klook）。
- Reliability: PDF 数据与官方对齐；`build_all.py --validate` 构建审计。
- SEO: GSC position ~8.9；Mobile CLS 曾是瓶颈（0.495）。
- Qualitative feedback: 见 `docs/notes/2026-06-24-site-feedback.md`

## Constraints

- Technical constraints: 纯静态 GitHub Pages，无后端；数据来自官方 PDF 解析。
- Business constraints: 个人项目，低流量，样本量小难做归因。
- Design constraints: 多页 UI 一致性（`design-system.mdc`）；时刻一律 `HH:mm` 24 小时制。
- Things we intentionally do not want: 船运页插一日游联盟卡片；展示 PDF 解析出的离谱伪班次。

## Important context for agents

- Stack: 纯 HTML/CSS/JS 静态站；`data.js` 等由 Python `build_all.py` 生成。
- Build/run commands: `python build_all.py`；本地 `python -m http.server 8765`
- Deployment: GitHub Pages → yakushimabus.com
- Analytics: GA4 `G-BX2P31GEHW`；`analytics-events.js` v4 事件委托
- Test or validation: `node scripts/check_route.js`；`build_all.py --validate`
- Sensitive data boundaries: 不自动读 GA4/GSC 后台；证据存路径摘要，不上传。

## Current open questions

- 百度中文 SEO 策略是否带来可测量的 engagement 提升？
- 联盟点击在 trekking vs without-car 哪个页面更有效？
- Mobile CLS 修复后 CWV 与 GSC impression 是否改善？
