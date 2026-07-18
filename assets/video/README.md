# 介绍页演示视频

| 文件 | 用途 |
|------|------|
| `yakushima-bus-demo-web.mp4` | 线上播放版（720×1280，约 5 MB / 54 秒） |
| `yakushima-bus-demo.mp4` | 高码率源版，仅作后续转码源 |
| `yakushima-bus-demo-poster.jpg` | 竖版封面（勿用横版 `og-image`） |

若进度条无法拖动快进，多为 MP4 未做 **faststart** 优化；可用 `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4` 重封装后覆盖。
