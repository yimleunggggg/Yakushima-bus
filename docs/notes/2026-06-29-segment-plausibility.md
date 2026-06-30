# 区间车程合理性过滤

## 问题
PDF 列合并后，`columnTrips` / fragment 会出现「起终点同列但非同一趟」的伪班次：
- 过短：宫之浦港→安房港 12:50→12:51（1 分）
- 过长：宫之浦港→屋久杉自然馆 9:44→14:35（291 分、仅 3 经停覆盖 20 站）

## 机制（`app-core.js`）
- `segmentSparse`：column、chain≤2、或经停覆盖 <35% 视为稀疏
- `minPlausibleMinutes`：相邻≥2min；稀疏 gap≥2 至少 10min；gap≥5 至少 `ceil(gap×1.2)`
- `maxPlausibleMinutes`：稀疏 `min(150, gap×6)`；密链 `min(240, gap×12)`
- 不通过则 `findTrips` 不返回

## UI
- 去掉邻近提示标题「很多人不会想到这样搜」
- 无 URL `from`/`to` 时默认第一个 `popular` preset

## 验证
```bash
node scripts/check_route.js miyanoura_port anbo_port weekday      # 3 班
node scripts/check_route.js miyanoura_port yakusugi_museum weekday # 1 班（无 291 分）
```
