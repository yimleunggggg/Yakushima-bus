# 登山页联盟区块去重（2026-05-20）

## 现象
绳文杉、太鼓岩卡片内各嵌一套 Klook/Viator，Viator 重复出现。

## 修复
- `trekking/index.html`：联盟区移至「登山季节」与「徒步路线」之间（`#trekAffiliateSection`）；路线卡片不再内嵌联盟。
- `affiliate-ui.js`：新增 `trekkingSectionHtml()`，Klook + Viator 各一张卡并排。
- `affiliate-data.js`：Viator 日游从 `ferry` 页 `pages` 移除。
- 船运页底部优惠购票与官方链接合并为同一 `panel-aux` 样式。

## 缓存
`aff-v6`、`layout-v88`
