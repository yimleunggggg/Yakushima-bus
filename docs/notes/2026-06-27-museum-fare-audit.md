# 自然馆早班 + 全站票价核查（2026-06-27）

## 自然馆早班

**问题**：宫之浦港入口/宫之浦 → 自然馆工作日早班未出现在查询结果。

**根因**：PDF 早班列 `dest=makino` + `destNote=屋久杉自然館`，时刻只列到牧野，未写自然馆到站；`findTrips` 无法匹配 `yakusugi_museum`。

**修复**（`app-core.js` core-v20）：
- `tripMeansMuseum` + `resolveMuseumDestSegment`：牧野时刻 +5 分推断自然馆到达
- 松叶早班线在冬季（12–2）且目的地为自然馆时不被中央线规则排除
- `routeInSeason`：按路线 `season` 过滤（松叶 4:00 仅冬季显示）

**结果（工作日，3–11 月）**：
- 宫之浦港入口 4:46 → 约 5:29
- 宫之浦 4:48 → 约 5:29

## 票价核查

新增 `scripts/audit_fares.py`：
- `FARE_ANCHORS` 11 项 OK
- `map-data.js` farePairs 与 `build_exact_pairs` **完全一致**（106 对精确票价）
- 票价页逻辑：717 对锚点估算、503 对无报价（非主要列之间，属正常）

常用区间 spot check 均 OK（港→自然馆 1020、入口→自然馆锚点估算 1020、镇上→自然馆 590 等）。
