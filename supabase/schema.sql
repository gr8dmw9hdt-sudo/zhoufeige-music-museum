-- 周菲戈 · 24:01 深夜音乐馆 —— Supabase 建库脚本
-- 用法：Supabase 控制台 → SQL Editor → 整段粘贴执行一次。

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

-- 站点访问统计（按天记录，供前台访客计数器 + 后台每日趋势）
create table public.site_daily_visits (
  day date primary key,
  visits bigint not null default 0
);

-- 自增今日访问量，并返回累计总数（供 /api/visit 使用）
create or replace function public.increment_site_visit()
returns bigint
language sql
as $$
  with inc as (
    insert into public.site_daily_visits (day, visits)
    values ((now() at time zone 'Asia/Shanghai')::date, 1)
    on conflict (day)
    do update set visits = public.site_daily_visits.visits + 1
    returning visits
  )
  select coalesce(sum(visits), 0)::bigint from public.site_daily_visits;
$$;

-- 读取累计总数（供 /api/visit 返回访客展示、后台统计）
create or replace function public.get_site_visit_total()
returns bigint
language sql
as $$
  select coalesce(sum(visits), 0)::bigint from public.site_daily_visits;
$$;

-- 访问日志：记录每次「新访客」到达的精确时间 + 大致位置（供后台查看具体访问时间）
-- country/region/city/timezone 由 Cloudflare 在边缘提供，仅国家/地区/城市级，不含 IP
create table public.site_visits (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default now(),
  country text,
  region text,
  city text,
  timezone text
);

-- 存储桶（public，供图片/视频公开直链访问）
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- 说明：本项目服务端统一用 service_role 密钥读写（绕过 RLS），
-- 审核逻辑由应用代码保证（公开页只查 status=approved、投稿强制 status=pending），
-- 因此无需额外配置 RLS 策略。
