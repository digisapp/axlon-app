-- HEAVY HAUL RUSH: a signed-in driver's garage (the bank, the upgrades bought, the paint, the stars at each job)
-- kept with their claimed name, so it follows them from one device to the next. The game writes it whole, as
-- JSON, under the driver's own row (the existing "a driver keeps their own name" policy lets them).
alter table public.game_drivers add column if not exists garage jsonb;
