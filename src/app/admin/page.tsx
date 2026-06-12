import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Package,
  Eye,
  MessageSquare,
  Building2,
  Phone,
  PhoneCall,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Parallel data fetching
  const [
    { count: totalMessages },
    { count: totalListings },
    { count: activeListings },
    { count: totalCalls },
    { count: totalBusinesses },
    { count: pendingBusinesses },
    { count: newLeads },
    { count: pendingTradeIns },
    { data: viewsData },
    { data: recentUsers },
    { data: recentListings },
    { count: todayLeads },
    { count: todayCalls },
  ] = await Promise.all([
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('call_logs').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_business', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('business_status', 'pending'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('trade_in_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.rpc('get_total_views_count'),
    supabase.from('profiles').select('id, email, company_name, is_business, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('listings').select('id, title, status, created_at, user_id').order('created_at', { ascending: false }).limit(5),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase.from('call_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  const totalViews = Number(viewsData) || 0;

  // Get profiles for listings
  const listingUserIds = [...new Set(recentListings?.map((l) => l.user_id) || [])];
  const { data: listingProfiles } = listingUserIds.length > 0
    ? await supabase.from('profiles').select('id, company_name, email').in('id', listingUserIds)
    : { data: [] };

  const listingProfileMap = (listingProfiles || []).reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, { id: string; company_name: string; email: string }>);

  // Action items that need attention
  // Static class strings — Tailwind can't generate interpolated `bg-${color}-100`
  const actionItems = [
    { label: 'Pending Businesses', count: pendingBusinesses || 0, href: '/admin/dealers', colorClass: 'bg-yellow-100', icon: <Building2 className="w-5 h-5" /> },
    { label: 'New Leads', count: newLeads || 0, href: '/admin/leads', colorClass: 'bg-green-100', icon: <PhoneCall className="w-5 h-5" /> },
    { label: 'Pending Trade-Ins', count: pendingTradeIns || 0, href: '/admin/trade-ins', colorClass: 'bg-amber-100', icon: <ArrowUpRight className="w-5 h-5" /> },
  ].filter((item) => item.count > 0);

  return (
    <div className="space-y-6">
      {/* Action Items Banner */}
      {actionItems.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="border-l-4 border-l-red-500 hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.colorClass}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">Needs attention</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    {item.count}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Today's Snapshot */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Today</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <PhoneCall className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Leads</span>
              </div>
              <p className="text-2xl font-bold">{todayLeads || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-cyan-500" />
                <span className="text-sm text-muted-foreground">Calls</span>
              </div>
              <p className="text-2xl font-bold">{todayCalls || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Businesss</span>
              </div>
              <p className="text-2xl font-bold">{totalBusinesses || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Views</span>
              </div>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{totalMessages || 0}</p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <Building2 className="w-4 h-4 text-green-500" />
                {(pendingBusinesses || 0) > 0 && (
                  <Badge variant="outline" className="text-[10px] text-yellow-600 border-yellow-300">
                    {pendingBusinesses} pending
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{totalBusinesses || 0}</p>
              <p className="text-xs text-muted-foreground">Businesss</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <Package className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                  {activeListings} active
                </span>
              </div>
              <p className="text-2xl font-bold">{totalListings || 0}</p>
              <p className="text-xs text-muted-foreground">Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <Eye className="w-4 h-4 text-orange-500 mb-1" />
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <Phone className="w-4 h-4 text-cyan-500 mb-1" />
              <p className="text-2xl font-bold">{totalCalls || 0}</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Users</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users" className="text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {u.company_name || u.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {u.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {u.is_business && (
                        <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                          Business
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6 text-sm">
                No users yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Listings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/listings" className="text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentListings && recentListings.length > 0 ? (
              <div className="space-y-3">
                {recentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {listing.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        by {listingProfileMap[listing.user_id]?.company_name || listingProfileMap[listing.user_id]?.email || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full ${
                          listing.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : listing.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6 text-sm">
                No listings yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
