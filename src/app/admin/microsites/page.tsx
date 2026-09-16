import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, MousePointerClick, TrendingUp, ExternalLink } from 'lucide-react';
import { NewMicrositeButton } from './NewMicrositeButton';

export const dynamic = 'force-dynamic';

interface OverviewRow {
  microsite_id: string;
  visits: number;
  visitors: number;
  lead_count: number;
  last_visit_at: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
};

export default async function AdminMicrositesPage() {
  const supabase = await createClient();

  const [{ data: sites }, { data: overview }] = await Promise.all([
    supabase
      .from('microsites')
      .select('id, domain, name, status, accent_color, manufacturer:manufacturers(name)')
      .order('status')
      .order('domain'),
    supabase.rpc('get_microsite_overview', { p_days: 30 }),
  ]);

  const stats = new Map<string, OverviewRow>(
    ((overview ?? []) as OverviewRow[]).map((row) => [row.microsite_id, row])
  );

  const totals = (overview ?? []).reduce(
    (acc: { visits: number; visitors: number; leads: number }, row: OverviewRow) => ({
      visits: acc.visits + Number(row.visits || 0),
      visitors: acc.visitors + Number(row.visitors || 0),
      leads: acc.leads + Number(row.lead_count || 0),
    }),
    { visits: 0, visitors: 0, leads: 0 }
  );

  const liveCount = (sites ?? []).filter((s) => s.status === 'live').length;
  const conversion = totals.visitors > 0 ? (totals.leads / totals.visitors) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Microsites</h1>
          <p className="text-sm text-muted-foreground">
            Lead-generation domains — traffic and conversions over the last 30 days
          </p>
        </div>
        <NewMicrositeButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Live sites', value: `${liveCount} / ${sites?.length ?? 0}`, icon: Globe },
          { label: 'Visits (30d)', value: totals.visits.toLocaleString(), icon: MousePointerClick },
          { label: 'Visitors (30d)', value: totals.visitors.toLocaleString(), icon: Users },
          { label: 'Leads (30d)', value: totals.leads.toLocaleString(), icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              {label === 'Leads (30d)' && totals.visitors > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {conversion.toFixed(1)}% of visitors converted
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All domains</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!sites?.length ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              <Globe className="mx-auto mb-3 h-8 w-8 opacity-40" />
              No microsites yet. Add a domain to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Domain</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Visits</th>
                    <th className="px-4 py-3 text-right font-medium">Visitors</th>
                    <th className="px-4 py-3 text-right font-medium">Leads</th>
                    <th className="px-4 py-3 text-right font-medium">Conv.</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sites.map((site) => {
                    const row = stats.get(site.id);
                    const visitors = Number(row?.visitors || 0);
                    const leads = Number(row?.lead_count || 0);
                    const rate = visitors > 0 ? (leads / visitors) * 100 : null;
                    const manufacturer = Array.isArray(site.manufacturer)
                      ? site.manufacturer[0]
                      : site.manufacturer;

                    return (
                      <tr key={site.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <Link href={`/admin/microsites/${site.id}`} className="font-medium hover:underline">
                            {site.domain}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            {site.name}
                            {manufacturer?.name ? ` · ${manufacturer.name}` : ''}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={STATUS_STYLES[site.status] ?? ''}>
                            {site.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {Number(row?.visits || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{visitors.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          {leads.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {rate === null ? '—' : `${rate.toFixed(1)}%`}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {site.status === 'live' && (
                            <a
                              href={`https://${site.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                              Visit <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
