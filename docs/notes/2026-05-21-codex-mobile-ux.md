# Codex 移动端 UX 修复（2026-05-21）

## 依据
Headless Chrome 实测 yakushimabus.com（390×844 / 1366×900）反馈。

## 已做（P0）
1. **地图页移动端**：`map-layout-secondary` 优先，`primary`（PDF）沉底
2. ~~**首页出发/到达**：上下结构~~ → **已回滚**，保持左右并排
3. **移动端 PDF**：触屏设备隐藏 iframe 与 JPG 预览栈，仅保留「打开官方 PDF」主按钮（首页 details + 地图页）
4. **上岛页**：船班区块（jetfoil_* / ferry）移动端改卡片；运价等宽表加横滑提示
5. **关于页**：信任说明（本站性质、数据来源、更新、非官方声明、联系方式）置顶；个人介绍后移并弱化标题样式

## 文件
- `styles.css?v=mobile-ux-v1`
- `map/index.html`, `index.html`, `access/index.html`, `about/index.html`, `about-data.js`

## 未做（下一批）
- 班次卡片「查看停靠站」标签
- Picker 互斥
- 时刻表弹窗底栏固定
- 桌面 PDF loading / 路线图快照
