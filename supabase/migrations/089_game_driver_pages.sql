-- HEAVY HAUL RUSH: what the driver and company pages read. A driver or a company is found by its name in lower
-- case, so a page's address does not care how the name was typed on a given run.
create or replace view public.game_board as
  select distinct on (course, load, driver) id, created_at, driver, company, course, load, time_seconds, pay, grade, damage, beat_storm,
         user_id is not null as verified,
         lower(driver) as key,
         lower(company) as company_key
  from public.game_runs
  order by course, load, driver, pay desc, time_seconds asc;

-- Every run, newest first, with the keys: a driver's and a company's recent runs.
create or replace view public.game_recent as
  select id, created_at, driver, company, course, load, time_seconds, pay, grade, hits, beat_storm,
         user_id is not null as verified,
         lower(driver) as key,
         lower(company) as company_key
  from public.game_runs;

grant select on public.game_board, public.game_recent to anon, authenticated;

notify pgrst, 'reload schema';
