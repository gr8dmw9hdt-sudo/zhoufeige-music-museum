-- 访问日志：记录每次「新访客」到达的精确时间（供后台查看具体访问时间）
-- 在 Supabase Dashboard → SQL Editor 里执行一次。

create table public.site_visits (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default now()
);
