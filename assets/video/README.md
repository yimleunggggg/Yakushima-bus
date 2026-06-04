# 介绍页演示视频

| 文件 | 用途 |
|------|------|
| `yakushima-bus-demo.mp4` | 英文旁白竖版演示（约 54 秒） |
| `yakushima-bus-demo-poster.jpg` | 竖版封面（与视频画幅一致，勿用横版 `og-image`） |

若进度条无法拖动快进，多为 MP4 未做 **faststart** 优化；可用 `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4` 重封装后覆盖。
