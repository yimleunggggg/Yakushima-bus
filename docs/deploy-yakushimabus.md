# 部署：yakushimabus.com（GitHub Pages）

纯静态站，无构建步骤；推送 `main` 分支根目录即可。

## 1. 首次推送到 GitHub

```bash
cd "/Users/yimleung/手搓程序/Yakushima-bus"

# 若尚未 init（已 init 可跳过）
git init
git add .
git commit -m "Initial deploy: Yakushima bus timetable tool"

# 在 GitHub 新建空仓库，例如 Yakushima-bus（不要勾选 README）
git branch -M main
git remote add origin https://github.com/你的用户名/Yakushima-bus.git
git push -u origin main
```

## 2. 开启 GitHub Pages

仓库 → **Settings** → **Pages**

| 项 | 值 |
|----|-----|
| Source | Deploy from a branch |
| Branch | `main` / **/** (root) |
| Custom domain | `yakushimabus.com` |

保存后勾选 **Enforce HTTPS**（DNS 生效后才会出现，稍后再开也行）。

仓库根目录已有 `CNAME`（内容为 `yakushimabus.com`），Pages 会自动识别。

## 3. 域名 DNS（在域名注册商处配置）

### 根域名 `yakushimabus.com`（必选）

添加 **4 条 A 记录**，均指向 GitHub Pages：

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### 可选：`www.yakushimabus.com`

| 类型 | 主机 | 值 |
|------|------|-----|
| CNAME | www | `你的用户名.github.io` |

在 GitHub Pages 自定义域名里也可填 `www.yakushimabus.com`；若只用根域名，可在注册商把 www 301 跳到根域名。

DNS 传播通常 **10 分钟～48 小时**。GitHub 仓库 **Settings → Pages** 会显示 DNS 检查状态。

## 4. 验证

```bash
dig yakushimabus.com +short
# 应看到上述四个 IP 之一

curl -I https://yakushimabus.com
# 200，且证书有效
```

浏览器访问：

- https://yakushimabus.com/index.html
- https://yakushimabus.com/map.html

## 5. 日后更新

```bash
python3 scripts/build_all.py   # 改数据后
git add -A
git commit -m "update timetable data"
git push
```

Pages 约 1～2 分钟自动更新。

## 6. 常见问题

| 问题 | 处理 |
|------|------|
| 404 | 确认 Pages 源为 `main` 根目录；`index.html` 在仓库根 |
| 域名未生效 | 等 DNS；不要用 Cloudflare「仅 DNS」以外的错误代理模式（可先 DNS only） |
| HTTPS 灰掉 | 等 DNS 全生效后再开 Enforce HTTPS |
| PDF 本地 assets | `.gitignore` 已忽略 `*.pdf`；线上 PDF 走官方 URL，正常 |

## 7. 备选（不用 GitHub Pages 时）

- **Cloudflare Pages**：连同一 GitHub 仓库，Build command 留空，Output `/`
- **Vercel**：Import 项目，Framework Preset = Other，Root = `./`

自定义域名同样在面板里填 `yakushimabus.com`，DNS 按平台提示即可。
