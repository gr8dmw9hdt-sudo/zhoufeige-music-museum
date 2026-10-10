-- 访问日志补充「访客大致位置」：Cloudflare 在边缘提供，只有国家/地区/城市级，不含 IP
-- 在 Supabase Dashboard → SQL Editor 里执行一次。

alter table public.site_visits
  add column if not exists country text,
  add column if not exists region text,
  add column if not exists city text,
  add column if not exists timezone text;
