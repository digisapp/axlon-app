import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminListingCard } from '@/components/admin/AdminListingCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const { page: pageParam, status: statusFilter } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createClient();

  // Get total count (not limited by default 1000 row cap)
  let countQuery = supabase
    .from('listings')
    .select('*', { count: 'exact', head: true });

  if (statusFilter) {
    countQuery = countQuery.eq('status', statusFilter);
  }

  const { count: totalListings } = await countQuery;

  // Get paginated listings
  let query = supabase
    .from('listings')
    .select(`
      id, title, price, status, views_count, created_at, user_id,
      images:listing_images(url, is_primary)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: listings } = await query;

  // Get status counts for filter badges
  const statusCounts: Record<string, number> = {};
  for (const s of ['active', 'draft', 'sold', 'expired']) {
    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', s);
    statusCounts[s] = count || 0;
  }

  // Get user profiles
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

  const getPrimaryImage = (images: Array<{ url: string; is_primary: boolean }>) => {
    const primary = images?.find((img) => img.is_primary);
    return primary?.url || images?.[0]?.url || null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Draft</Badge>;
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Sold</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const total = totalListings || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

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
          {total.toLocaleString()} total listings
          {statusFilter && ` (${statusFilter})`}
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
            All ({Object.values(statusCounts).reduce((a, b) => a + b, 0).toLocaleString()})
          </Badge>
        </Link>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Link key={status} href={buildHref(1, status)}>
            <Badge
              className={`cursor-pointer px-3 py-1 ${
                statusFilter === status
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count.toLocaleString()})
            </Badge>
          </Link>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings?.map((listing) => {
          const imageUrl = getPrimaryImage(listing.images || []);

          return (
            <AdminListingCard
              key={listing.id}
              listing={listing}
              imageUrl={imageUrl}
              sellerName={profileMap[listing.user_id]?.company_name || profileMap[listing.user_id]?.email || 'Unknown'}
              statusBadge={getStatusBadge(listing.status)}
            />
          );
        })}

        {(!listings || listings.length === 0) && (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No listings found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total.toLocaleString()}
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
