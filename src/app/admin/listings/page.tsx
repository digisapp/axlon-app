import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminListingCard } from '@/components/admin/AdminListingCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 50;
const ALL_STATUSES = ['active', 'draft', 'sold', 'expired', 'deleted'] as const;

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const { page: pageParam, status: statusFilter } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createClient();

  // Single query for all status counts — replaces 4 separate COUNT queries
  const { data: allStatuses } = await supabase
    .from('listings')
    .select('status, deleted_at');

  const statusCounts: Record<string, number> = { active: 0, draft: 0, sold: 0, expired: 0, deleted: 0 };
  let grandTotal = 0;
  for (const row of allStatuses ?? []) {
    grandTotal++;
    if (row.deleted_at) {
      statusCounts.deleted = (statusCounts.deleted || 0) + 1;
    } else {
      const s = row.status as keyof typeof statusCounts;
      if (s in statusCounts) statusCounts[s]++;
    }
  }

  // Build paginated query
  let query = supabase
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

  const { data: listings } = await query;

  // Get total count for current filter (for pagination)
  let filteredTotal: number;
  if (statusFilter === 'deleted') {
    filteredTotal = statusCounts.deleted;
  } else if (statusFilter) {
    filteredTotal = statusCounts[statusFilter] ?? 0;
  } else {
    filteredTotal = grandTotal - statusCounts.deleted;
  }

  // Resolve seller profiles in one query
  const userIds = [...new Set(listings?.map((l) => l.user_id) || [])];
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
        <Link href="/admin/listings">
          <Badge
            className={`cursor-pointer px-3 py-1 ${
              !statusFilter
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({(grandTotal - statusCounts.deleted).toLocaleString()})
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
