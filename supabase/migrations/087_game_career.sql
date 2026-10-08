-- HEAVY HAUL RUSH: a career behind the board. A run names a driver and, if they say so, their company and the
-- event code from a show's QR. Totals are views over the runs, so nothing has to be kept in step by hand.
alter table public.game_runs add column if not exists company text check (char_length(company) <= 40);
alter table public.game_runs add column if not exists event_code text check (event_code ~ '^[A-Z0-9]{3,12}$');
create index if not exists game_runs_driver on public.game_runs (lower(driver));
create index if not exists game_runs_company on public.game_runs (lower(company)) where company is not null;
create index if not exists game_runs_event on public.game_runs (event_code, pay desc) where event_code is not null;

-- A show or a dealer's weekend: runs posted with its code go on its own board while it is on.
create table if not exists public.game_events (
  code text primary key check (code ~ '^[A-Z0-9]{3,12}$'),
  name text not null check (char_length(name) <= 80),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  prize text check (char_length(prize) <= 120),
  created_at timestamptz not null default now()
);
alter table public.game_events enable row level security;
drop policy if exists "anyone may see the events" on public.game_events;
create policy "anyone may see the events" on public.game_events for select to anon, authenticated using (true);

-- Grades in order, for a best-of.
create or replace function public.game_grade_rank(g text) returns int language sql immutable as $$
  select case g when 'S' then 0 when 'A' then 1 when 'B' then 2 when 'C' then 3 else 4 end
$$;

-- Every driver's career: runs, pay, seat hours, clean runs, best grade, and the company they last drove for.
create or replace view public.game_driver_totals as
  select lower(driver) as key,
         (array_agg(driver order by created_at desc))[1] as driver,
         (array_agg(company order by created_at desc) filter (where company is not null))[1] as company,
         count(*)::int as runs,
         sum(pay)::bigint as pay,
         round(sum(time_seconds) / 3600.0, 2) as hours,
         count(*) filter (where hits = 0)::int as clean_runs,
         (array['S','A','B','C','D'])[min(public.game_grade_rank(grade)) + 1] as best_grade,
         max(created_at) as last_run
  from public.game_runs
  group by lower(driver);

-- Every company: its drivers added up.
create or replace view public.game_company_totals as
  select lower(company) as key,
         (array_agg(company order by created_at desc))[1] as company,
         count(distinct lower(driver))::int as drivers,
         count(*)::int as runs,
         sum(pay)::bigint as pay,
         round(sum(time_seconds) / 3600.0, 2) as hours,
         max(created_at) as last_run
  from public.game_runs
  where company is not null and company <> ''
  group by lower(company);

-- The season: a month. Pay added up per driver per month.
create or replace view public.game_season_board as
  select date_trunc('month', created_at) as season,
         lower(driver) as key,
         (array_agg(driver order by created_at desc))[1] as driver,
         (array_agg(company order by created_at desc) filter (where company is not null))[1] as company,
         count(*)::int as runs,
         sum(pay)::bigint as pay
  from public.game_runs
  group by date_trunc('month', created_at), lower(driver);

grant select on public.game_driver_totals, public.game_company_totals, public.game_season_board, public.game_events to anon, authenticated;

-- The board shows the outfit beside the name.
create or replace view public.game_board as
  select distinct on (course, load, driver) id, created_at, driver, company, course, load, time_seconds, pay, grade, damage, beat_storm
  from public.game_runs
  order by course, load, driver, pay desc, time_seconds asc;
grant select on public.game_board to anon, authenticated;
