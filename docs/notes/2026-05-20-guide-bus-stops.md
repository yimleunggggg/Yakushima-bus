# 地图页公交站点

- **只显示已核实站点**（当前约 32/52）：OpenStreetMap `bus_stop` 站名匹配，或少量人工锚点。
- **不再**用示意图 affine / 经纬度直线插值（会掉进海里）。
- 未匹配到的站：时刻表仍有，地图不标。
- 重建：`python3 scripts/build_stop_geo.py`
