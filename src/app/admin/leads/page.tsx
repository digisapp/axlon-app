import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  Mail,
  User,
  Package,
  Clock,
  PlayCircle,
  MessageSquare,
  TrendingUp,
  Globe,
  Megaphone,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 100;

interface SearchParams {
  source?: string;
  microsite?: string;
  status?: string;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = await searchParams;
  const supabase = await createClient();

  // Narrow the list without re-querying the whole table client-side.
  let listQuery = supabase
    .from('leads')
    .select(
      `*, listings(id, title, price), microsite:microsites(id, name, domain)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (filters.microsite) {
    listQuery = listQuery.eq('microsite_id', filters.microsite);
  } else if (filters.source === 'microsite') {
    listQuery = listQuery.not('microsite_id', 'is', null);
  } else if (filters.source === 'phone_call') {
    listQuery = listQuery.eq('source', 'phone_call');
  } else if (filters.source === 'marketplace') {
    listQuery = listQuery.in('source', ['website', 'contact_form', 'chat', 'referral', 'other']);
  }

  if (filters.status) {
    listQuery = listQuery.eq('status', filters.status);
  }

  const todayStart = new Date().toISOString().split('T')[0];

  const [
    { data: leads, count: filteredCount },
    { count: totalLeads },
    { count: newLeads },
    { count: phoneLeads },
    { count: micrositeLeads },
    { count: todayLeads },
    { data: sites },
  ] = await Promise.all([
    listQuery,
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('source', 'phone_call'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).not('microsite_id', 'is', null),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('microsites').select('id, name, domain').order('domain'),
  ]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'qualified': return 'bg-green-100 text-green-700';
      case 'won': return 'bg-emerald-100 text-emerald-700';
      case 'lost': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIntentColor = (intent: string | null) => {
    switch (intent) {
      case 'buy': return 'bg-green-100 text-green-700';
      case 'lease': return 'bg-blue-100 text-blue-700';
      case 'rent': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const activeSite = filters.microsite
    ? sites?.find((s) => s.id === filters.microsite)
    : null;

  const sourceTabs = [
    { key: undefined, label: 'All' },
    { key: 'microsite', label: 'Microsites' },
    { key: 'phone_call', label: 'Phone' },
    { key: 'marketplace', label: 'Marketplace' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Every inquiry from microsites, phone calls and the marketplace
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{totalLeads || 0}</p>
            <p className="text-sm text-muted-foreground">Total Leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <MessageSquare className="h-5 w-5 text-green-500" />
              {(newLeads || 0) > 0 && (
                <Badge variant="outline" className="border-green-300 text-xs text-green-600">
                  Action needed
                </Badge>
              )}
            </div>
            <p className="text-3xl font-bold">{newLeads || 0}</p>
            <p className="text-sm text-muted-foreground">New Leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <Globe className="h-5 w-5 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold">{micrositeLeads || 0}</p>
            <p className="text-sm text-muted-foreground">From Microsites</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <Phone className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{phoneLeads || 0}</p>
            <p className="text-sm text-muted-foreground">Phone Calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">{todayLeads || 0}</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {sourceTabs.map((tab) => {
          const isActive = !filters.microsite && filters.source === tab.key;
          return (
            <Link
              key={tab.label}
              href={tab.key ? `/admin/leads?source=${tab.key}` : '/admin/leads'}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}

        {(sites?.length ?? 0) > 0 && (
          <span className="ml-2 flex flex-wrap items-center gap-2">
            {sites!.map((site) => (
              <Link
                key={site.id}
                href={`/admin/leads?microsite=${site.id}`}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  filters.microsite === site.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {site.domain}
              </Link>
            ))}
          </span>
        )}
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeSite ? `Leads from ${activeSite.domain}` : 'All Leads'}
          </CardTitle>
          <CardDescription>
            Showing {leads?.length || 0} of {filteredCount || 0} matching leads
            {(filteredCount || 0) > PAGE_SIZE && ` (most recent ${PAGE_SIZE})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads && leads.length > 0 ? (
            <div className="space-y-4">
              {leads.map((lead) => {
                const site = Array.isArray(lead.microsite) ? lead.microsite[0] : lead.microsite;
                const campaign = lead.utm_campaign || lead.utm_source;

                return (
                  <div
                    key={lead.id}
                    className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {lead.buyer_name || lead.name || 'Unknown'}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          {lead.intent && (
                            <span className={`rounded-full px-2 py-0.5 text-xs ${getIntentColor(lead.intent)}`}>
                              {lead.intent}
                            </span>
                          )}
                          {site && (
                            <Link href={`/admin/microsites/${site.id}`}>
                              <Badge variant="secondary" className="text-xs hover:bg-secondary/80">
                                <Globe className="mr-1 h-3 w-3" />
                                {site.domain}
                              </Badge>
                            </Link>
                          )}
                          {lead.source === 'phone_call' && (
                            <Badge variant="secondary" className="text-xs">
                              <Phone className="mr-1 h-3 w-3" />
                              Phone
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {(lead.buyer_phone || lead.phone) && (
                            <a
                              href={`tel:${lead.buyer_phone || lead.phone}`}
                              className="flex items-center gap-1 hover:text-foreground"
                            >
                              <Phone className="h-3 w-3" />
                              {lead.buyer_phone || lead.phone}
                            </a>
                          )}
                          {(lead.buyer_email || lead.email) && (
                            <a
                              href={`mailto:${lead.buyer_email || lead.email}`}
                              className="flex items-center gap-1 hover:text-foreground"
                            >
                              <Mail className="h-3 w-3" />
                              {lead.buyer_email || lead.email}
                            </a>
                          )}
                          {(lead.product_interest || lead.equipment_type) && (
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {lead.product_interest || lead.equipment_type}
                            </span>
                          )}
                          {campaign && (
                            <span className="flex items-center gap-1">
                              <Megaphone className="h-3 w-3" />
                              {campaign}
                              {lead.utm_medium ? ` · ${lead.utm_medium}` : ''}
                            </span>
                          )}
                        </div>

                        {lead.message && (
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {lead.message}
                          </p>
                        )}

                        {lead.call_recording_url && (
                          <div className="mt-2 flex items-center gap-2">
                            <a
                              href={lead.call_recording_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <PlayCircle className="h-4 w-4" />
                              Play Recording
                            </a>
                            {lead.call_duration_seconds && (
                              <span className="text-xs text-muted-foreground">
                                ({formatDuration(lead.call_duration_seconds)})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString()}{' '}
                          {new Date(lead.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {lead.landing_path && (
                          <span className="text-xs text-muted-foreground">{lead.landing_path}</span>
                        )}
                        {lead.listings && (
                          <Link
                            href={`/listing/${lead.listings.id}`}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <Package className="h-3 w-3" />
                            {lead.listings.title?.slice(0, 30)}
                            {(lead.listings.title?.length ?? 0) > 30 ? '…' : ''}
                            {lead.listings.price && (
                              <span className="text-muted-foreground">
                                ${lead.listings.price.toLocaleString()}
                              </span>
                            )}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Phone className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No leads match this filter</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Leads from microsites, phone calls and inquiries will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
