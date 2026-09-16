import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, MousePointerClick, Users, TrendingUp, Percent } from 'lucide-react';
import { MicrositeTrafficChart } from './MicrositeTrafficChart';
import { MicrositeSettingsForm } from './MicrositeSettingsForm';

export const dynamic = 'force-dynamic';

interface DailyRow { day: string; visits: number; visitors: number; lead_count: number }
interface BreakdownRow { source?: string; path?: string; visits: number; visitors: number }

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
};

export default async function MicrositeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { id } = await params;
  const { days: daysParam } = await searchParams;
  const days = Math.min(Math.max(Number(daysParam) || 30, 1), 365);

  const supabase = await createClient();

  const { data: site } = await supabase
    .from('microsites')
    .select('*, manufacturer:manufacturers(id, name, slug)')
    .eq('id', id)
    .maybeSingle();

  if (!site) notFound();

  const [{ data: daily }, { data: sources }, { data: pages }, { data: recentLeads }, { data: manufacturers }] =
    await Promise.all([
      supabase.rpc('get_microsite_daily_stats', { p_microsite_id: id, p_days: days }),
      supabase.rpc('get_microsite_sources', { p_microsite_id: id, p_days: days, p_limit: 8 }),
      supabase.rpc('get_microsite_pages', { p_microsite_id: id, p_days: days, p_limit: 8 }),
      supabase
        .from('leads')
        .select('id, buyer_name, buyer_email, buyer_phone, product_interest, status, created_at, utm_source')
        .eq('microsite_id', id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase.from('manufacturers').select('id, name, slug').gt('product_count', 0).order('name'),
    ]);

  // The RPC returns lead_count (a column named `leads` would collide with the
  // leads table inside the function body); the chart speaks in `leads`.
  const series = ((daily ?? []) as DailyRow[]).map((row) => ({
    day: row.day,
    visits: Number(row.visits || 0),
    visitors: Number(row.visitors || 0),
    leads: Number(row.lead_count || 0),
  }));

  const totals = series.reduce(
    (acc, row) => ({
      visits: acc.visits + row.visits,
      visitors: acc.visitors + row.visitors,
      leads: acc.leads + row.leads,
    }),
    { visits: 0, visitors: 0, leads: 0 }
  );
  const conversion = totals.visitors > 0 ? (totals.leads / totals.visitors) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/microsites"
          className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All microsites
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{site.domain}</h1>
          <Badge variant="secondary" className={STATUS_STYLES[site.status] ?? ''}>
            {site.status}
          </Badge>
          {site.status === 'live' && (
            <a
              href={`https://${site.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Open <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{site.name}</p>
      </div>

      {/* Range picker */}
      <div className="flex gap-2">
        {[7, 30, 90].map((d) => (
          <Link
            key={d}
            href={`/admin/microsites/${id}?days=${d}`}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              days === d ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            {d}d
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Visits', value: totals.visits.toLocaleString(), icon: MousePointerClick },
          { label: 'Unique visitors', value: totals.visitors.toLocaleString(), icon: Users },
          { label: 'Leads', value: totals.leads.toLocaleString(), icon: TrendingUp },
          { label: 'Conversion', value: `${conversion.toFixed(1)}%`, icon: Percent },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Traffic and leads</CardTitle>
          <CardDescription>Last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <MicrositeTrafficChart data={series} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic sources</CardTitle>
            <CardDescription>Where visitors came from</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <BreakdownTable rows={(sources ?? []) as BreakdownRow[]} labelKey="source" emptyText="No traffic yet" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top pages</CardTitle>
            <CardDescription>Most-viewed paths</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <BreakdownTable rows={(pages ?? []) as BreakdownRow[]} labelKey="path" emptyText="No page views yet" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent leads</CardTitle>
          <CardDescription>
            <Link href={`/admin/leads?microsite=${id}`} className="hover:underline">
              View all leads from this site →
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!recentLeads?.length ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">No leads yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Contact</th>
                    <th className="px-4 py-2.5 font-medium">Interest</th>
                    <th className="px-4 py-2.5 font-medium">Source</th>
                    <th className="px-4 py-2.5 font-medium">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">{lead.buyer_name}</td>
                      <td className="px-4 py-2.5">
                        <a href={`mailto:${lead.buyer_email}`} className="hover:underline">
                          {lead.buyer_email}
                        </a>
                        {lead.buyer_phone && (
                          <div className="text-xs text-muted-foreground">{lead.buyer_phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{lead.product_interest || '—'}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{lead.utm_source || 'direct'}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <MicrositeSettingsForm site={site} manufacturers={manufacturers ?? []} />
    </div>
  );
}

function BreakdownTable({
  rows,
  labelKey,
  emptyText,
}: {
  rows: BreakdownRow[];
  labelKey: 'source' | 'path';
  emptyText: string;
}) {
  if (!rows.length) {
    return <p className="px-6 py-8 text-center text-sm text-muted-foreground">{emptyText}</p>;
  }
  const max = Math.max(...rows.map((r) => Number(r.visits || 0)), 1);

  return (
    <div className="divide-y">
      {rows.map((row) => {
        const label = row[labelKey] || '—';
        const visits = Number(row.visits || 0);
        return (
          <div key={label} className="relative px-4 py-2.5">
            <div
              className="absolute inset-y-0 left-0 bg-primary/10"
              style={{ width: `${(visits / max) * 100}%` }}
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-between gap-4 text-sm">
              <span className="truncate font-medium">{label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {visits.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
