-- HEAVY HAUL RUSH at /play: every finished run, posted by the game itself with the public key.
-- Anyone can post a run and anyone can read the board; what is posted has to be a run the game could
-- actually produce, so a hand-made row cannot top the board by a mile.
create table if not exists public.game_runs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  driver text not null check (char_length(driver) between 1 and 24),
  course text not null check (char_length(course) <= 40),
  load text not null check (char_length(load) <= 40),
  time_seconds numeric(8,1) not null check (time_seconds between 30 and 3600),
  pay integer not null check (pay between 0 and 2000000),
  grade text not null check (grade in ('S', 'A', 'B', 'C', 'D')),
  damage smallint not null check (damage between 0 and 100),
  hits smallint not null check (hits between 0 and 500),
  close_calls smallint not null check (close_calls between 0 and 500),
  beat_storm boolean not null default false,
  client text check (char_length(client) <= 64)
);

create index if not exists game_runs_board on public.game_runs (course, load, pay desc, time_seconds asc);
create index if not exists game_runs_recent on public.game_runs (created_at desc);

alter table public.game_runs enable row level security;

drop policy if exists "anyone may read the board" on public.game_runs;
create policy "anyone may read the board" on public.game_runs
  for select to anon, authenticated using (true);

drop policy if exists "the game may post a run" on public.game_runs;
create policy "the game may post a run" on public.game_runs
  for insert to anon, authenticated with check (true);

-- The board itself: the best run per driver on each job, so one good driver does not fill it.
create or replace view public.game_board as
  select distinct on (course, load, driver) id, created_at, driver, course, load, time_seconds, pay, grade, damage, beat_storm
  from public.game_runs
  order by course, load, driver, pay desc, time_seconds asc;

grant select on public.game_board to anon, authenticated;
