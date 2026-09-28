-- 周菲戈 · 24:01 深夜音乐馆 —— Supabase 建库脚本
-- 用法：Supabase 控制台 → SQL Editor → 整段粘贴执行一次。

-- 留言墙
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  nickname text not null default '匿名',
  content text not null check (char_length(content) between 1 and 500),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- 影像馆
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  nickname text not null default '匿名',
  type text not null check (type in ('image','video')),
  storage_path text not null,
  caption text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- 存储桶（public，供图片/视频公开直链访问）
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- 说明：本项目服务端统一用 service_role 密钥读写（绕过 RLS），
-- 审核逻辑由应用代码保证（公开页只查 status=approved、投稿强制 status=pending），
-- 因此无需额外配置 RLS 策略。
