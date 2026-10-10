-- 访问统计升级：从「单一总数」改为「按天记录」，后台可看每日趋势
-- 在 Supabase Dashboard → SQL Editor 里执行一次。

drop table if exists public.site_stats;

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
