# GA4 埋点与 DebugView（2026-06-25）

## URL 结构（本轮）

| 路径 | 用途 | 旧路径（301 跳转） |
|------|------|-------------------|
| `/` | 时刻表 | — |
| `/fare/` | 路线图 + 票价查询 | `/map/` |
| `/ferry/` | 船运上岛 | `/access/` |
| `/guide/` | 便利设施地图（POI） | — |

中文导航：**票价**（非「运价」）；**地图** 对应 `/guide/`。

## 关键事件（建议在 GA4 → 管理 → 事件 → 标为关键事件）

| 事件 | 触发场景 | 主要参数 |
|------|----------|----------|
| `fare_lookup` | 票价页选站后计算 | `from`, `to`, `fare`, `result_type`（exact / estimate / none / same_stop） |
| `timetable_preset` | 时刻表常用区间快捷 | `preset_id` |
| `timetable_search` | 时刻表区间查询 | `from`, `to`, `day` |
| `timetable_day_tab` | 日种切换 | `day` |
| `timetable_swap` | 交换起终点 | — |
| `open_timetable` | 票价页「查时刻表」 | `from` |
| `nav_click` | 顶栏 Tab | `link_url`, `link_text` |
| `lang_switch` | 语言切换 | `lang` |
| `footer_click` | 页脚内链 | `link_url` |
| `internal_link` | 页内站内链 | `link_url` |
| `section_open` | FAQ / 折叠区展开 | `section` |
| `guide_filter` | 地图筛选 | `category`, `enabled` |
| `guide_poi_select` | 点击 POI | `poi_id`, `category` |
| `guide_stop_select` | 点击公交站 | `stop_id` |
| `file_download` | PDF 链接 | `file_name` |
| `open_maps` | Google Maps | `link_url` |
| `site_feedback` | 页脚反馈 | `rating` |

## DebugView 怎么看

1. 打开任意页面，URL 加 **`?ga_debug=1`**（例：`https://yakushimabus.com/?ga_debug=1`）。**会写入 localStorage**，换页后顶栏链接自动带上参数，DebugView 不会断。
2. 关闭调试：访问 **`?ga_debug=0`**。
3. GA4 后台 → **管理** → **DebugView**。
4. 本机自测可加 **`?ga_internal=1`**，避免污染正式报表（同样会跨页保留）。
5. 操作对照：平日/土日祝 → `timetable_day_tab`；常用区间 → `timetable_preset`；交换 → `timetable_swap`；改站 → `timetable_search`；`/fare/` 选站 → `fare_lookup`。
6. 若只有 `page_view`：硬刷新、确认 `analytics-events.js?v=analytics-v4` 已部署；AdBlock 会挡 gtag。

## GSC 索引

部署后：重新提交 `sitemap.xml`；对 `/fare/`、`/ferry/`、`/guide/` 各 **URL 检查 → 请求编入索引**。旧 `/map/`、`/access/` 保留跳转即可。
