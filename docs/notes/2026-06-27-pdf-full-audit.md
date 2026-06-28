# PDF 全表车次审计（2026-06-27）

## 工具

`python3 scripts/audit_pdf_trips.py --rebuild`

检查项：PDF 列数、每站时刻与 `columnTrips` 一致、相邻站区间 fragment/column 搜索覆盖。

## 根因（第二处）

除环线拆分丢班外，**解析按参考站列数截断**：

| 侧 | 参考站列数 | PDF 全表最大 | 丢失 |
|---|---|---|---|
| west | 14 (站20) | 15 | 末列如入口 18:26→宫浦小前 18:32 |
| east | 13 (站99) | 15 | 末两列如港 18:11、19:31 |

修复：`parse_side()` 的 `ncols` 改为 `max(全行列数)`。

## 审计结果（修复后）

- 列数缺口：**0**
- 站点时刻与 PDF 不一致：**0**
- column 搜索仍缺班：**0**
- fragment 单独搜索仍缺：**14** 个区间×日种（预期；`findTrips` / `getStopDepartures` 已走 `columnTrips`）
- `python3 scripts/build_all.py --validate --timetable` 含全表审计

## 路线概况

- 中央线西/东：`columnTrips` 各 **15** 列（平日 11 + 土曜 2 + 日祝 2）
- 白谷/荒川/纪元杉：手工 `special.json`，与 PDF 小表一致
- 松叶：独立 `parse_matsubanda.py`

## 示例（入口→宫浦小前）

- 工作日：11 班 → **12 班**（补 18:26）
- 土曜/日祝：不变（3 班）

缓存：`data-column-v3` / `core-v11`
