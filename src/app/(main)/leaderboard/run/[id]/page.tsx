import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { money, clock, DriverLink, CompanyLink } from '../../board';
import { getRun, placeName, jobName } from './run';

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const run = await getRun((await params).id);
  if (!run) return { title: 'HEAVY HAUL RUSH run' };
  const title = `${run.driver} scored ${run.grade} and ${money(run.pay)} on ${placeName(run)} — HEAVY HAUL RUSH`;
  const description = `${jobName(run)} in ${clock(Number(run.time_seconds))}. Think you can beat it? Play free at axleyard.com/play — no download.`;
  return { title, description, openGraph: { title, description, type: 'website' }, twitter: { card: 'summary_large_image', title, description } };
}

/** A run someone shared: the card, and the way to play and beat it. */
export default async function RunPage({ params }: PageProps) {
  const run = await getRun((await params).id);
  if (!run) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">
        <Link href="/leaderboard" className="hover:underline">HEAVY HAUL RUSH leaderboard</Link> / a run
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-amber-400 text-7xl font-black text-black">{run.grade}</div>
        <div>
          <p className="text-4xl font-black text-emerald-600">{money(run.pay)}</p>
          <p className="text-lg font-semibold">{placeName(run)} · {jobName(run)}</p>
          <p className="text-muted-foreground">
            {clock(Number(run.time_seconds))} · {run.hits === 0 ? 'no hits' : `${run.hits} hit${run.hits === 1 ? '' : 's'}`}{run.beat_storm ? ' · beat the storm' : ''}
          </p>
          <p className="mt-1">
            <DriverLink name={run.driver} verified={run.verified} />
            {run.company ? <> · <CompanyLink name={run.company} /></> : null}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/play">Play now — beat {run.driver}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/leaderboard">See the leaderboard</Link>
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        HEAVY HAUL RUSH is free, in the browser, on a phone or a computer: get the load there before the storm does. The trailers on the billboards are real — find them at <Link href="/search" className="underline">Axleyard</Link>.
      </p>
    </main>
  );
}
