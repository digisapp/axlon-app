import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { rows, money, Table, DriverLink, Stat } from '../../board';

export const revalidate = 60;

type PageProps = { params: Promise<{ name: string }> };
type Totals = { company: string; drivers: number; runs: number; pay: number; hours: number };
type Driver = { driver: string; runs: number; pay: number; best_grade: string; verified: boolean };
type Recent = { driver: string; course: string; load: string; grade: string; pay: number; created_at: string; verified: boolean };

const keyOf = async (params: PageProps['params']) => decodeURIComponent((await params).name).toLowerCase().slice(0, 40);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const key = await keyOf(params);
  const totals = (await rows<Totals>(`game_company_totals?select=company,drivers,runs,pay,hours&key=eq.${encodeURIComponent(key)}`))[0];
  const name = totals?.company ?? key;
  return {
    title: `${name} — HEAVY HAUL RUSH company`,
    description: totals ? `${name}: ${totals.drivers} drivers, ${money(Number(totals.pay))} hauled in HEAVY HAUL RUSH at Axleyard.` : `${name} in HEAVY HAUL RUSH at Axleyard.`,
    alternates: { canonical: `/leaderboard/company/${encodeURIComponent(key)}` },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const key = await keyOf(params);
  const q = encodeURIComponent(key);
  const [totals, recent] = await Promise.all([
    rows<Totals>(`game_company_totals?select=company,drivers,runs,pay,hours&key=eq.${q}`),
    rows<Recent>(`game_recent?select=driver,course,load,grade,pay,created_at,verified&company_key=eq.${q}&order=created_at.desc&limit=12`),
  ]);
  const company = totals[0];
  if (!company) notFound();
  // The drivers: everyone who has posted a run for this company, best first.
  const names = [...new Set(recent.map((r) => r.driver.toLowerCase()))];
  const drivers = names.length
    ? await rows<Driver>(`game_driver_totals?select=driver,runs,pay,best_grade,verified&key=in.(${names.map((n) => `"${encodeURIComponent(n.replace(/"/g, ''))}"`).join(',')})&order=pay.desc`)
    : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">
        <Link href="/leaderboard" className="hover:underline">HEAVY HAUL RUSH leaderboard</Link> / company
      </p>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{company.company}</h1>
        <Button asChild size="lg">
          <Link href="/play">Drive for {company.company}</Link>
        </Button>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Hauled" value={money(Number(company.pay))} />
        <Stat label="Drivers" value={String(company.drivers)} />
        <Stat label="Runs" value={String(company.runs)} />
        <Stat label="Seat hours" value={Number(company.hours).toFixed(1)} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Table
          title="Drivers"
          head={['Driver', 'Runs', 'Best', 'Career pay']}
          body={drivers.map((r) => [<DriverLink key="d" name={r.driver} verified={r.verified} />, String(r.runs), r.best_grade, money(Number(r.pay))])}
        />
        <Table
          title="Latest runs"
          head={['Driver', 'Place', 'Grade', 'Pay']}
          body={recent.map((r) => [<DriverLink key="d" name={r.driver} verified={r.verified} />, r.course, r.grade, money(r.pay)])}
        />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Put your company on the board: type its name on the result screen when you post a run.
      </p>
    </main>
  );
}
