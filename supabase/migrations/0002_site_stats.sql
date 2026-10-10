-- 站点访问统计：前台访客计数器
-- 在 Supabase Dashboard → SQL Editor 里一次性执行即可。

create table public.site_stats (
  id int primary key default 1 check (id = 1),
  total_visits bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_stats (id, total_visits)
values (1, 0)
on conflict (id) do nothing;

-- 原子自增访问量（返回最新值，供 /api/visit 使用）
create or replace function public.increment_site_visit()
returns bigint
language sql
as $$
  update public.site_stats
  set total_visits = total_visits + 1, updated_at = now()
  where id = 1
  returning total_visits;
$$;
