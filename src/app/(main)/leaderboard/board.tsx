// What the HEAVY HAUL RUSH pages share: the board read with the public key, money, the tables, and the links
// from a name to its driver page or its company page.
import Link from 'next/link';
import type { ReactNode } from 'react';

export async function rows<T>(path: string): Promise<T[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } });
    return r.ok ? ((await r.json()) as T[]) : [];
  } catch {
    return [];
  }
}

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
export const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(1).padStart(4, '0')}`;
/** The first of this month, UTC: what a season is keyed by. */
export function thisMonth(): Date {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function Verified() {
  return (
    <span title="Verified driver: a claimed name, posted while signed in" className="ml-1 text-sky-500">
      ✓
    </span>
  );
}

export function DriverLink({ name, verified }: { name: string; verified?: boolean }) {
  return (
    <Link href={`/leaderboard/driver/${encodeURIComponent(name.toLowerCase())}`} className="hover:underline">
      {name}
      {verified ? <Verified /> : null}
    </Link>
  );
}

export function CompanyLink({ name }: { name: string | null }) {
  if (!name) return <>—</>;
  return (
    <Link href={`/leaderboard/company/${encodeURIComponent(name.toLowerCase())}`} className="hover:underline">
      {name}
    </Link>
  );
}

export function Table({ title, head, body, empty = 'Nobody here yet. Be the first.' }: { title: ReactNode; head: string[]; body: ReactNode[][]; empty?: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {body.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="w-8 py-1">#</th>
                {head.map((h) => (
                  <th key={h} className="py-1 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="py-1.5 text-muted-foreground">{i + 1}</td>
                  {r.map((c, j) => (
                    <td key={j} className={`py-1.5 pr-3 ${j === r.length - 1 ? 'font-semibold text-emerald-600' : ''}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
