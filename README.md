# 🌙 周菲戈 · 24:01 深夜音乐馆

> 00 后创作歌手周菲戈的非官方粉丝站 —— 从《Simon》的 51:0，到首张全创作专辑《24:01》，把深夜里纷飞的心事收进旋律。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

## ✨ 特性

- 🏠 **首页** — 月光金「24:01」首屏 + 鼠标视差 + 导览跳转模块
- 🎵 **音乐** — 5 张专辑曲目 + 精选曲目，点击跳转正版平台试听
- 🎤 **巡演** — 2026「原来你也睡不着」巡回演唱会各场次
- 🗺️ **大事记** — 2014 → 2026 时间轴
- 👤 **关于** — 歌手简介与档案
- 🖼️ **影像馆** — 访客上传图片/视频，审核后公开展示
- 💬 **留言墙** — 写下想对菲戈说的话，审核后上墙
- 🔐 **审核后台**（`/admin`）— 密码保护，一键通过/驳回投稿

## 🛠️ 技术栈

- **框架**：Next.js 16（App Router）+ React 19 + TypeScript
- **样式**：Tailwind CSS v4
- **动效**：framer-motion
- **后端**：Supabase（Postgres + Storage）
- **部署**：Vercel（serverless functions）

## 🚀 本地运行

```bash
git clone https://github.com/你的用户名/zhoufeige-music-museum.git
cd zhoufeige-music-museum
npm install
npm run dev
```

打开 http://localhost:3000。

## 🔧 环境变量 & Supabase 初始化

留言墙和影像馆依赖 Supabase，需要先初始化：

1. 到 [Supabase](https://supabase.com) 新建项目。
2. 打开 **SQL Editor**，把 [supabase/schema.sql](supabase/schema.sql) 整段粘贴执行（建两张表 + 一个存储桶）。
3. 复制 [.env.local.example](.env.local.example) 为 `.env.local`，填入：
   - `NEXT_PUBLIC_SUPABASE_URL` — Project Settings → API → Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → `service_role`
   - `ADMIN_PASSWORD` — `/admin` 审核后台的登录密码（自定）
4. 重启 `npm run dev`。

> ⚠️ `service_role` 密钥权限很大，只放服务端 `.env.local`（已被 `.gitignore` 忽略），**切勿提交到仓库或写进前端组件**。

## ☁️ 部署到 Vercel

1. 把仓库推到 GitHub。
2. 在 [Vercel](https://vercel.com) 里 **Add New → Project → Import** 该仓库。
3. 在项目 **Settings → Environment Variables** 填上面三个变量，另加：
   - `NEXT_PUBLIC_SITE_URL` = 你的正式域名（如 `https://xxx.vercel.app`）
4. **Deploy**。

## 🤝 参与共建

- **方式一（无需编程）**：访问影像馆上传照片、留言墙写下你的故事。
- **方式二（贡献代码）**：Fork 本仓库 → 修改 → 提交 Pull Request。

## ⚠️ 版权声明

- 本站为粉丝纪念网站，与周菲戈及其经纪公司无关。
- 专辑封面、照片等素材版权归原权利人所有。
- 音频/视频链接均跳转至 QQ 音乐 / 网易云 / Apple Music 等正版平台。
- 站内背景音乐《今夜的挽歌》版权归索尼音乐 / 周菲戈工作室所有。
- 如需移除任何内容，请提交 Issue。

## 📄 许可证

[MIT License](LICENSE) © 2026 周菲戈歌迷社区
