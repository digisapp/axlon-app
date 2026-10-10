-- HEAVY HAUL RUSH: the Daily Run. Every day the game picks one place, one load (or recovery job) and one truck for
-- everyone; a run driven on it carries the day, and each day has its own board. The day turns at midnight East
-- Coast time. A run can only be posted to today, or to yesterday for a run that crossed midnight.
alter table public.game_runs add column if not exists daily date;
create index if not exists game_runs_daily on public.game_runs (daily, pay desc, time_seconds asc) where daily is not null;

create or replace function public.game_runs_daily() returns trigger language plpgsql set search_path = public as $$
declare
  today date := (now() at time zone 'America/New_York')::date;
begin
  if new.daily is not null and new.daily not between today - 1 and today then
    raise exception 'that daily run is over';
  end if;
  return new;
end $$;

drop trigger if exists game_runs_daily on public.game_runs;
create trigger game_runs_daily before insert on public.game_runs for each row execute function public.game_runs_daily();

-- Each day's board: every driver's best run of the day.
create or replace view public.game_daily_board as
  select distinct on (daily, lower(driver)) id, created_at, daily, driver, company, course, load, time_seconds, pay, grade, damage, beat_storm,
         user_id is not null as verified,
         lower(driver) as key,
         lower(company) as company_key
  from public.game_runs
  where daily is not null
  order by daily, lower(driver), pay desc, time_seconds asc;

grant select on public.game_daily_board to anon, authenticated;

-- A run's own page says when it was a daily (the day goes on the end of game_recent).
create or replace view public.game_recent as
  select id, created_at, driver, company, course, load, time_seconds, pay, grade, hits, beat_storm,
         user_id is not null as verified,
         lower(driver) as key,
         lower(company) as company_key,
         daily
  from public.game_runs;

grant select on public.game_recent to anon, authenticated;

notify pgrst, 'reload schema';
