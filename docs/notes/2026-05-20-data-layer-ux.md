# 2026-05-20 数据层正式化 + UX

## 数据层
- `sources/holidays.json` — 日本祝日 + 日种规则
- `sources/routes/special.json` — 白谷/荒川/纪元杉（原 parse_pdf 硬编码）
- `scripts/build_meta_data.py` → `meta-data.js`（有效期、季节、构建 warnings）
- `app-core.js` — 共享 `detectDayType` / JST / `pick` / toast / ARIA label
- `build_all.py --validate` 扩展：运价 + meta 过期检查（过期 fail，14 天内 warn）

## UX
- 时刻表：tagline「屋久岛公交即时查询」、下一班加重、班次卡片展开箭头
- 交换起终点 toast；map 设站 toast 沿用 AppCore
- 站点 picker：combobox ARIA + 选项 aria-label（含日文站名）
- meta 条：有 warnings 时显示「数据可能需更新」chip

## 更新流程
改 JSON/manifest → `python3 scripts/build_all.py` → 提交产物
