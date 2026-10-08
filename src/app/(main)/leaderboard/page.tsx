import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'HEAVY HAUL RUSH Leaderboard — Top Drivers and Companies',
  description: 'The best runs in HEAVY HAUL RUSH, the free heavy-haul driving game at Axleyard. Drivers, companies, and this month’s season.',
  alternates: { canonical: '/leaderboard' },
};

export const revalidate = 60;

type Driver = { driver: string; company: string | null; runs: number; pay: number; hours: number; clean_runs: number; best_grade: string };
type Company = { company: string; drivers: number; runs: number; pay: number; hours: number };
type Season = { driver: string; company: string | null; runs: number; pay: number };

async function rows<T>(path: string): Promise<T[]> {
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

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

function Table({ title, head, body }: { title: string; head: string[]; body: string[][] }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {body.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nobody here yet. Be the first.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="w-8 py-1">#</th>
              {head.map((h) => (
                <th key={h} className="py-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((r, i) => (
              <tr key={i} className="border-t border-border/60">
                <td className="py-1.5 text-muted-foreground">{i + 1}</td>
                {r.map((c, j) => (
                  <td key={j} className={`py-1.5 ${j === r.length - 1 ? 'font-semibold text-emerald-600' : ''}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default async function LeaderboardPage() {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const [drivers, companies, season] = await Promise.all([
    rows<Driver>('game_driver_totals?select=driver,company,runs,pay,hours,clean_runs,best_grade&order=pay.desc&limit=25'),
    rows<Company>('game_company_totals?select=company,drivers,runs,pay,hours&order=pay.desc&limit=25'),
    rows<Season>(`game_season_board?select=driver,company,runs,pay&season=eq.${encodeURIComponent(monthStart.toISOString())}&order=pay.desc&limit=25`),
  ]);
  const monthName = monthStart.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">HEAVY HAUL RUSH</p>
          <h1 className="text-3xl font-bold">The Leaderboard</h1>
          <p className="mt-1 text-muted-foreground">Who hauls the best, and for who. Every run posted from the game lands here.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/play">Play now — free, no download</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Table
          title={`This month — ${monthName}`}
          head={['Driver', 'Company', 'Runs', 'Pay']}
          body={season.map((r) => [r.driver, r.company ?? '—', String(r.runs), money(Number(r.pay))])}
        />
        <Table
          title="Companies"
          head={['Company', 'Drivers', 'Hours', 'Pay']}
          body={companies.map((r) => [r.company, String(r.drivers), Number(r.hours).toFixed(1), money(Number(r.pay))])}
        />
        <div className="md:col-span-2">
          <Table
            title="Drivers — career"
            head={['Driver', 'Company', 'Runs', 'Seat hours', 'Clean runs', 'Best', 'Career pay']}
            body={drivers.map((r) => [r.driver, r.company ?? '—', String(r.runs), Number(r.hours).toFixed(1), String(r.clean_runs), r.best_grade, money(Number(r.pay))])}
          />
        </div>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Game money is for the board only. The trailers on the billboards are real: find them at <Link href="/search" className="underline">Axleyard</Link>.
      </p>
    </main>
  );
}
