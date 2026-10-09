import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { rows, money, clock, Table, CompanyLink, Verified, Stat } from '../../board';

export const revalidate = 60;

type PageProps = { params: Promise<{ name: string }> };
type Totals = { driver: string; company: string | null; runs: number; pay: number; hours: number; clean_runs: number; best_grade: string; verified: boolean };
type Claim = { handle: string; company: string | null; created_at: string };
type Best = { course: string; load: string; grade: string; time_seconds: number; pay: number };
type Recent = { course: string; load: string; grade: string; time_seconds: number; pay: number; created_at: string };

const keyOf = async (params: PageProps['params']) => decodeURIComponent((await params).name).toLowerCase().slice(0, 24);

async function load(key: string) {
  const q = encodeURIComponent(key);
  const [totals, claims] = await Promise.all([
    rows<Totals>(`game_driver_totals?select=driver,company,runs,pay,hours,clean_runs,best_grade,verified&key=eq.${q}`),
    rows<Claim>(`game_drivers?select=handle,company,created_at&handle=ilike.${q.replace(/\*/g, '')}`),
  ]);
  return { totals: totals[0] ?? null, claim: claims.find((c) => c.handle.toLowerCase() === key) ?? null };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const key = await keyOf(params);
  const { totals, claim } = await load(key);
  const name = claim?.handle ?? totals?.driver ?? key;
  return {
    title: `${name} — HEAVY HAUL RUSH driver`,
    description: totals ? `${name}: ${totals.runs} runs, ${money(Number(totals.pay))} career pay in HEAVY HAUL RUSH at Axleyard.` : `${name} in HEAVY HAUL RUSH at Axleyard.`,
    alternates: { canonical: `/leaderboard/driver/${encodeURIComponent(key)}` },
  };
}

export default async function DriverPage({ params }: PageProps) {
  const key = await keyOf(params);
  const q = encodeURIComponent(key);
  const [{ totals, claim }, best, recent] = await Promise.all([
    load(key),
    rows<Best>(`game_board?select=course,load,grade,time_seconds,pay&key=eq.${q}&order=pay.desc&limit=20`),
    rows<Recent>(`game_recent?select=course,load,grade,time_seconds,pay,created_at&key=eq.${q}&order=created_at.desc&limit=10`),
  ]);
  if (!totals && !claim) notFound();
  const name = claim?.handle ?? totals?.driver ?? key;
  const company = claim?.company ?? totals?.company ?? null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">
        <Link href="/leaderboard" className="hover:underline">HEAVY HAUL RUSH leaderboard</Link> / driver
      </p>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {name}
            {claim ? <Verified /> : null}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {company ? <>Drives for <CompanyLink name={company} /></> : 'Independent'}
            {claim ? ` · verified driver since ${new Date(claim.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/play">Play now — beat {name}</Link>
        </Button>
      </div>
      {totals ? (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Stat label="Career pay" value={money(Number(totals.pay))} />
          <Stat label="Runs" value={String(totals.runs)} />
          <Stat label="Seat hours" value={Number(totals.hours).toFixed(1)} />
          <Stat label="Clean runs" value={String(totals.clean_runs)} />
          <Stat label="Best grade" value={totals.best_grade} />
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2">
        <Table
          title="Best on each job"
          head={['Place', 'Job', 'Grade', 'Time', 'Pay']}
          body={best.map((r) => [r.course, r.load, r.grade, clock(Number(r.time_seconds)), money(r.pay)])}
          empty="No runs posted yet."
        />
        <Table
          title="Latest runs"
          head={['When', 'Place', 'Job', 'Grade', 'Pay']}
          body={recent.map((r) => [new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), r.course, r.load, r.grade, money(r.pay)])}
          empty="No runs posted yet."
        />
      </div>
      {!claim ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Is this you? <Link href="/login?redirect=%2Fplay" className="underline">Sign in with Axleyard</Link>, post a run under this name, and it’s yours for good.
        </p>
      ) : null}
    </main>
  );
}
