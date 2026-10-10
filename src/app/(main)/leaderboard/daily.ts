// HEAVY HAUL RUSH's Daily Run, worked out the way the game works it out: one place, one load (or recovery job)
// and one truck for everyone each day, the day turning at midnight East Coast time. This is a copy of the game's
// own pick (HEAVY-HAUL web/src/sim/daily.ts and day.ts): keep the two in step, names and order included.

const Places = ['Farm Road', 'The Port', 'Mountain Pass', 'Downtown', 'The Canyon', 'The Coast', 'Midnight Ridge', 'Open Road'];
const Loads = ['Turbine Blade', 'Transformer', 'Rocket Stage', 'House', 'Excavator', 'Yacht'];
const Jobs = ['Coach', 'Camper', 'School Bus', 'Pickup'];
const Trucks = ['Mammoth', 'Bull', 'Hornet'];

export type Daily = { day: string; label: string; place: string; job: string; truck: string; recovery: boolean };

const eastern = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });

/** The day on the East Coast, written 2026-10-09. */
export function dayKey(at: number = Date.now()): string {
  const parts = eastern.formatToParts(at);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function dayBefore(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) - 86400000).toISOString().slice(0, 10);
}

function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

function hash(n: number): number {
  let x = Math.imul(n | 0, 0x9e3779b1) >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
}

function order(k: number, seed: number): number[] {
  const out = Array.from({ length: k }, (_, i) => i);
  let r = hash(seed * 31 + k);
  for (let i = k - 1; i > 0; i--) {
    r = hash(r + i);
    const j = r % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function inTurn(n: number, k: number): number {
  const round = Math.floor(n / k), at = n - round * k;
  const now = order(k, round);
  if (now[0] === order(k, round - 1)[k - 1]) [now[0], now[1]] = [now[1], now[0]];
  return now[at];
}

const label = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' });

export function dailyFor(day: string = dayKey()): Daily {
  const n = dayNumber(day);
  const recovery = hash(n) % 4 === 0;
  const [y, m, d] = day.split('-').map(Number);
  return {
    day,
    label: label.format(Date.UTC(y, m - 1, d)),
    place: Places[inTurn(n, Places.length)],
    job: recovery ? `Recovery — ${Jobs[inTurn(n, Jobs.length)]}` : Loads[inTurn(n, Loads.length)],
    truck: Trucks[inTurn(n, Trucks.length)],
    recovery,
  };
}
