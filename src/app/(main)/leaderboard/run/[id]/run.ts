// One posted HEAVY HAUL RUSH run, read with the public key: what the run page and its share picture show.
import { rows } from '../../board';

export type Run = {
  id: number; created_at: string; driver: string; company: string | null; course: string; load: string;
  time_seconds: number; pay: number; grade: string; hits: number; beat_storm: boolean; verified: boolean;
};

export async function getRun(raw: string): Promise<Run | null> {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  const found = await rows<Run>(`game_recent?select=id,created_at,driver,company,course,load,time_seconds,pay,grade,hits,beat_storm,verified&id=eq.${id}`);
  return found[0] ?? null;
}

const titled = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
export const placeName = (r: Run) => titled(r.course);
export const jobName = (r: Run) => (r.load.startsWith('RECOVERY') ? `Recovery: ${titled(r.load.replace('RECOVERY', '').trim())}` : titled(r.load));
