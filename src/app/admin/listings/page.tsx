import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminListingCard } from '@/components/admin/AdminListingCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 50;
const ALL_STATUSES = ['active', 'draft', 'sold', 'expired', 'deleted'] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; user?: string }>;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const { page: pageParam, status: statusFilter, user: userParam } = await searchParams;
  // `?page=abc` parses to NaN, which would reach .range(NaN, NaN) and error the query
  const parsedPage = parseInt(pageParam || '1', 10);
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const offset = (currentPage - 1) * PAGE_SIZE;
  // /admin/onboarding links here with ?user=<uuid> — ignore anything that isn't a uuid
  const userFilter = userParam && UUID_RE.test(userParam) ? userParam : undefined;

  const supabase = await createClient();

  // Counts come from COUNT queries: a plain select is capped at 1,000 rows by Supabase,
  // which silently under-counted every tab (and broke pagination) past 1k listings.
  const statusCountQuery = (status: string) => {
    let q = supabase.from('listings').select('*', { count: 'exact', head: true });
    if (status === 'deleted') {
      q = q.not('deleted_at', 'is', null);
    } else {
      q = q.eq('status', status).is('deleted_at', null);
    }
    if (userFilter) q = q.eq('user_id', userFilter);
    return q;
  };

  const allCountQuery = () => {
    let q = supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);
    if (userFilter) q = q.eq('user_id', userFilter);
    return q;
  };

  const [
    { count: activeCount },
    { count: draftCount },
    { count: soldCount },
    { count: expiredCount },
    { count: deletedCount },
    { count: nonDeletedCount },
  ] = await Promise.all([
    statusCountQuery('active'),
    statusCountQuery('draft'),
    statusCountQuery('sold'),
    statusCountQuery('expired'),
    statusCountQuery('deleted'),
    allCountQuery(),
  ]);

  const statusCounts: Record<string, number> = {
    active: activeCount ?? 0,
    draft: draftCount ?? 0,
    sold: soldCount ?? 0,
    expired: expiredCount ?? 0,
    deleted: deletedCount ?? 0,
  };
  const allTotal = nonDeletedCount ?? 0;

  // listing_images RLS only exposes images for active or self-owned listings, so the
  // Draft/Sold/Expired/Deleted tabs lose their thumbnails under the session client.
  // Read rows as service role — but only after re-checking admin here. Next's
  // auth guide: a layout's redirect doesn't stop a page segment from rendering
  // (and layouts don't re-run on client navigation), so the layout gate alone
  // must not be what stands between a request and a service-role query.
  const { isAdmin } = await checkIsAdmin();
  if (!isAdmin) notFound();
  const adminSupabase = createAdminClient();

  // Build paginated query
  let query = adminSupabase
    .from('listings')
    .select(`
      id, title, price, status, views_count, created_at, deleted_at, user_id,
      images:listing_images(url, thumbnail_url, is_primary)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (statusFilter === 'deleted') {
    query = query.not('deleted_at', 'is', null);
  } else if (statusFilter) {
    query = query.eq('status', statusFilter).is('deleted_at', null);
  } else {
    // "All" tab — show non-deleted only (deleted has its own tab)
    query = query.is('deleted_at', null);
  }
  if (userFilter) query = query.eq('user_id', userFilter);

  const { data: listings } = await query;

  // Total count for current filter (for pagination)
  let filteredTotal: number;
  if (statusFilter === 'deleted') {
    filteredTotal = statusCounts.deleted;
  } else if (statusFilter) {
    filteredTotal = statusCounts[statusFilter] ?? 0;
  } else {
    filteredTotal = allTotal;
  }

  // Resolve seller profiles in one query
  const userIds = [...new Set((listings ?? []).map((l) => l.user_id as string))];
  const { data: profiles } = userIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, company_name, email')
        .in('id', userIds)
    : { data: [] };

  const profileMap = (profiles || []).reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, { id: string; company_name: string; email: string }>);

  const getPrimaryImage = (images: Array<{ url: string; thumbnail_url?: string | null; is_primary: boolean }>) => {
    const primary = images?.find((img) => img.is_primary) || images?.[0];
    if (!primary) return null;
    return primary.thumbnail_url?.length ? primary.thumbnail_url : primary.url || null;
  };

  const getStatusBadge = (status: string, isDeleted: boolean) => {
    if (isDeleted) return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Deleted</Badge>;
    switch (status) {
      case 'active':  return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'draft':   return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Draft</Badge>;
      case 'sold':    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Sold</Badge>;
      case 'expired': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Expired</Badge>;
      default:        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(filteredTotal / PAGE_SIZE);

  const buildHref = (p: number, s?: string) => {
    const params = new URLSearchParams();
    if (p > 1) params.set('page', p.toString());
    if (s) params.set('status', s);
    if (userFilter) params.set('user', userFilter);
    const qs = params.toString();
    return `/admin/listings${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Listing Management</h1>
        <p className="text-sm text-muted-foreground">
          {filteredTotal.toLocaleString()} listing{filteredTotal !== 1 ? 's' : ''}
          {statusFilter ? ` — ${statusFilter}` : ''}
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Link href={buildHref(1)}>
          <Badge
            className={`cursor-pointer px-3 py-1 ${
              !statusFilter
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({allTotal.toLocaleString()})
          </Badge>
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link key={s} href={buildHref(1, s)}>
            <Badge
              className={`cursor-pointer px-3 py-1 ${
                statusFilter === s
                  ? s === 'deleted'
                    ? 'bg-red-700 text-white hover:bg-red-600'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                  : s === 'deleted' && statusCounts.deleted > 0
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s]?.toLocaleString() ?? 0})
            </Badge>
          </Link>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings?.map((listing) => (
          <AdminListingCard
            key={listing.id}
            listing={listing}
            imageUrl={getPrimaryImage(listing.images || [])}
            sellerName={
              profileMap[listing.user_id]?.company_name ||
              profileMap[listing.user_id]?.email ||
              'Unknown'
            }
            statusBadge={getStatusBadge(listing.status, !!listing.deleted_at)}
          />
        ))}

        {(!listings || listings.length === 0) && (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">
                {statusFilter === 'deleted' ? 'No deleted listings' : 'No listings found'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, filteredTotal)} of{' '}
            {filteredTotal.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link href={buildHref(currentPage - 1, statusFilter)}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link href={buildHref(currentPage + 1, statusFilter)}>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
