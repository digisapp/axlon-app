import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { rows, money, thisMonth, Table, DriverLink, CompanyLink } from './board';

export const metadata: Metadata = {
  title: 'HEAVY HAUL RUSH Leaderboard — Top Drivers and Companies',
  description: 'The best runs in HEAVY HAUL RUSH, the free heavy-haul driving game at Axleyard. Drivers, companies, and this month’s season.',
  alternates: { canonical: '/leaderboard' },
};

export const revalidate = 60;

type Driver = { driver: string; company: string | null; runs: number; pay: number; hours: number; clean_runs: number; best_grade: string; verified: boolean };
type Company = { company: string; drivers: number; runs: number; pay: number; hours: number };
type Season = { driver: string; company: string | null; runs: number; pay: number; verified: boolean };
type Prize = { prize: string | null; sponsor: string | null };

export default async function LeaderboardPage() {
  const month = thisMonth();
  const [drivers, companies, season, prizes] = await Promise.all([
    rows<Driver>('game_driver_totals?select=driver,company,runs,pay,hours,clean_runs,best_grade,verified&order=pay.desc&limit=25'),
    rows<Company>('game_company_totals?select=company,drivers,runs,pay,hours&order=pay.desc&limit=25'),
    rows<Season>(`game_season_board?select=driver,company,runs,pay,verified&season=eq.${encodeURIComponent(month.toISOString())}&order=pay.desc&limit=25`),
    rows<Prize>(`game_seasons?select=prize,sponsor&season=eq.${month.toISOString().slice(0, 10)}`),
  ]);
  const monthName = month.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const prize = prizes[0]?.prize ? prizes[0] : null;

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
      {prize ? (
        <div className="mb-6 rounded-xl border border-amber-500/50 bg-amber-500/10 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">This month’s prize</p>
          <p className="text-lg font-semibold">
            Top driver in {monthName} wins {prize.prize}
            {prize.sponsor ? <span className="font-normal text-muted-foreground"> — from {prize.sponsor}</span> : null}
          </p>
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2">
        <Table
          title={`This month — ${monthName}`}
          head={['Driver', 'Company', 'Runs', 'Pay']}
          body={season.map((r) => [<DriverLink key="d" name={r.driver} verified={r.verified} />, <CompanyLink key="c" name={r.company} />, String(r.runs), money(Number(r.pay))])}
        />
        <Table
          title="Companies"
          head={['Company', 'Drivers', 'Hours', 'Pay']}
          body={companies.map((r) => [<CompanyLink key="c" name={r.company} />, String(r.drivers), Number(r.hours).toFixed(1), money(Number(r.pay))])}
        />
        <div className="md:col-span-2">
          <Table
            title="Drivers — career"
            head={['Driver', 'Company', 'Runs', 'Seat hours', 'Clean runs', 'Best', 'Career pay']}
            body={drivers.map((r) => [
              <DriverLink key="d" name={r.driver} verified={r.verified} />,
              <CompanyLink key="c" name={r.company} />,
              String(r.runs),
              Number(r.hours).toFixed(1),
              String(r.clean_runs),
              r.best_grade,
              money(Number(r.pay)),
            ])}
          />
        </div>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        <span className="text-sky-500">✓</span> is a verified driver: a name claimed with an Axleyard account.{' '}
        <Link href="/login?redirect=%2Fplay" className="underline">Sign in</Link> and post a run from the game to claim yours.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Game money is for the board only. The trailers on the billboards are real: find them at <Link href="/search" className="underline">Axleyard</Link>.
      </p>
    </main>
  );
}
