# 本地预览（给用户验收时必附链接）

```bash
cd Yakushima-bus && python3 -m http.server 8765
```

| 页面 | URL |
|------|-----|
| 便利地图 guide | http://127.0.0.1:8765/guide/?lang=zh |
| 时刻表 | http://127.0.0.1:8765/?lang=zh |
| 运价 | http://127.0.0.1:8765/map/?lang=zh |
| 登山 | http://127.0.0.1:8765/trekking/?lang=zh |

改 `guide.js` / `styles.css` 后提醒用户 **硬刷新**（或带新版本 query）。

**约定**：每次请用户检查 UI 时，回复里必须带上对应预览链接。
