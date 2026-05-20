# 2026-05-20 视觉预览 v2（Codex「雨林公交工具」）

**状态：预览版，待用户确认**

## 改动
- `styles.css` token 重设：森林绿 / 海青 / 苔藓 / 砂色 / 雨色 / 琥珀 warn
- 纸感雾感背景 + 顶栏森林→海色带
- **下一班车**：双层径向高光 + 2rem 交通屏时间字
- day-tabs → segmented control；tags 语义色（ok/warn/season）
- 链接/PDF 用 `--rain`/`--link`；badge 降饱和
- 圆角收敛：容器 10px / 按钮 8px / 标签 5px

## 确认方式
本地打开 `index.html` 看下一班区域、日种 tab、班次 tags、整体气质。

---

## v3 设计反馈（2026-05-20 已落地）

- **Token**：`--moss` #8f9a3a（黄绿山林）、`--sand` #d9b56e（暖砂海岸）、`--rain` #5a8299（雨色加深）
- **语义色**：`.tag.moss` 仅 3–11 季/荒川登山；`.tag.season`（sand）冬季季票与支付标签；`--rain` 外链/PDF/导航次态
- **可读性**：`--text-label` 0.75rem；次导航/筛选标签同步加大
- **动效**：`.next-bar.is-live` 2.5s `scale(1.01)` 轻柔脉冲
- **质感**：body 雨纹 repeating-gradient（约 3% 视觉权重）；PDF 摘要 `expand-badge` 用 rain 强调
