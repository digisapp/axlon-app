-- HEAVY HAUL RUSH: a driver's name can be claimed with an Axleyard account. A claimed name is theirs on every
-- board: runs posted while signed in carry the account and are stamped with the claimed name, and nobody can
-- post under it without signing in. Unclaimed names work as before. A month's season can carry a prize line.

create table if not exists public.game_drivers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  handle text not null check (char_length(handle) between 2 and 24 and handle !~ '[<>&]'),
  company text check (company is null or char_length(company) <= 40),
  created_at timestamptz not null default now()
);
create unique index if not exists game_drivers_handle on public.game_drivers (lower(handle));

alter table public.game_drivers enable row level security;
drop policy if exists "anyone may see the drivers" on public.game_drivers;
create policy "anyone may see the drivers" on public.game_drivers for select to anon, authenticated using (true);
drop policy if exists "a driver claims their own name" on public.game_drivers;
create policy "a driver claims their own name" on public.game_drivers for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "a driver keeps their own name" on public.game_drivers;
create policy "a driver keeps their own name" on public.game_drivers for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select on public.game_drivers to anon, authenticated;
grant insert, update on public.game_drivers to authenticated;

-- A run posted while signed in carries the account.
alter table public.game_runs add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists game_runs_user on public.game_runs (user_id) where user_id is not null;

drop policy if exists "the game may post a run" on public.game_runs;
create policy "the game may post a run" on public.game_runs
  for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());

-- Signed in: the run goes under the claimed name (and the claimed company if the run names none). Not signed in:
-- a claimed name is refused, so nobody else can post as that driver.
create or replace function public.game_runs_driver() returns trigger language plpgsql set search_path = public as $$
declare
  claimed public.game_drivers%rowtype;
begin
  if new.user_id is not null then
    select * into claimed from public.game_drivers where user_id = new.user_id;
    if not found then
      raise exception 'claim a driver name first' using errcode = 'P0001';
    end if;
    new.driver := claimed.handle;
    new.company := coalesce(nullif(new.company, ''), claimed.company);
  elsif exists (select 1 from public.game_drivers where lower(handle) = lower(new.driver)) then
    raise exception 'that driver name is claimed' using errcode = 'P0001', hint = 'sign in to post as this driver';
  end if;
  return new;
end $$;
drop trigger if exists game_runs_driver on public.game_runs;
create trigger game_runs_driver before insert on public.game_runs for each row execute function public.game_runs_driver();

-- The boards say which drivers are verified: a claimed name, posted while signed in.
create or replace view public.game_board as
  select distinct on (course, load, driver) id, created_at, driver, company, course, load, time_seconds, pay, grade, damage, beat_storm,
         user_id is not null as verified
  from public.game_runs
  order by course, load, driver, pay desc, time_seconds asc;

create or replace view public.game_driver_totals as
  select lower(driver) as key,
         (array_agg(driver order by created_at desc))[1] as driver,
         (array_agg(company order by created_at desc) filter (where company is not null))[1] as company,
         count(*)::int as runs,
         sum(pay)::bigint as pay,
         round(sum(time_seconds) / 3600.0, 2) as hours,
         count(*) filter (where hits = 0)::int as clean_runs,
         (array['S','A','B','C','D'])[min(public.game_grade_rank(grade)) + 1] as best_grade,
         max(created_at) as last_run,
         bool_or(user_id is not null) as verified
  from public.game_runs
  group by lower(driver);

create or replace view public.game_season_board as
  select date_trunc('month', created_at) as season,
         lower(driver) as key,
         (array_agg(driver order by created_at desc))[1] as driver,
         (array_agg(company order by created_at desc) filter (where company is not null))[1] as company,
         count(*)::int as runs,
         sum(pay)::bigint as pay,
         bool_or(user_id is not null) as verified
  from public.game_runs
  group by date_trunc('month', created_at), lower(driver);

grant select on public.game_board, public.game_driver_totals, public.game_season_board to anon, authenticated;

-- A month's season, and what the top driver wins. Set by hand; a month with no row has no prize.
create table if not exists public.game_seasons (
  season date primary key check (extract(day from season) = 1),
  prize text check (char_length(prize) <= 160),
  sponsor text check (char_length(sponsor) <= 80),
  created_at timestamptz not null default now()
);
alter table public.game_seasons enable row level security;
drop policy if exists "anyone may see the seasons" on public.game_seasons;
create policy "anyone may see the seasons" on public.game_seasons for select to anon, authenticated using (true);
grant select on public.game_seasons to anon, authenticated;

notify pgrst, 'reload schema';
