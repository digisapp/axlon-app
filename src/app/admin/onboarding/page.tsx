import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  Mail,
  Package,
} from 'lucide-react';

export default async function OnboardingPage() {
  const supabase = await createClient();

  // Get placeholder profiles (scraped dealers needing onboarding)
  const { data: placeholderProfiles, count: totalPlaceholders } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      company_name,
      is_business,
      created_at,
      city,
      state,
      phone
    `, { count: 'exact' })
    .like('email', '%@dealers.axlon.ai')
    .eq('is_business', false)
    .order('created_at', { ascending: false })
    .limit(100);

  // Supabase caps every response at 1,000 rows regardless of .range(), so both of the
  // aggregates below page through a single column and are tallied in JS. The previous
  // version inlined ~1,000 uuids into .in() (request too large) and only ever saw the
  // first 1,000 listings, so the counts were wrong.
  const PAGE = 1000;

  // Active listing counts per user
  const listingCountMap: Record<string, number> = {};
  for (let from = 0; from < 500_000; from += PAGE) {
    const { data: rows, error } = await supabase
      .from('listings')
      .select('user_id')
      .eq('status', 'active')
      .is('deleted_at', null)
      .range(from, from + PAGE - 1);
    if (error || !rows || rows.length === 0) break;
    for (const row of rows) {
      listingCountMap[row.user_id] = (listingCountMap[row.user_id] || 0) + 1;
    }
    if (rows.length < PAGE) break;
  }

  // How many placeholder profiles actually have listings
  let withListings = 0;
  for (let from = 0; from < 500_000; from += PAGE) {
    const { data: rows, error } = await supabase
      .from('profiles')
      .select('id')
      .like('email', '%@dealers.axlon.ai')
      .eq('is_business', false)
      .range(from, from + PAGE - 1);
    if (error || !rows || rows.length === 0) break;
    withListings += rows.filter((r) => (listingCountMap[r.id] || 0) > 0).length;
    if (rows.length < PAGE) break;
  }

  // Active businesses — was hardcoded to 17
  const { count: activeBusinesses } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_business', true)
    .not('is_suspended', 'is', true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Onboarding</h1>
        <p className="text-sm text-muted-foreground">Scraped businesses awaiting activation</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">{totalPlaceholders || 0}</p>
            <p className="text-sm text-muted-foreground">Pending Onboarding</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{withListings}</p>
            <p className="text-sm text-muted-foreground">With Listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{activeBusinesses || 0}</p>
            <p className="text-sm text-muted-foreground">Active Businesses</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <p className="text-sm text-orange-800">
            <strong>What is this?</strong> These are placeholder profiles created when scraping listings from TruckPaper and other sources.
            Each profile represents a potential business that could be converted to an active account.
            They have auto-generated emails like <code className="bg-orange-100 px-1 rounded">dealer@dealers.axlon.ai</code>.
          </p>
        </CardContent>
      </Card>

      {/* Profiles List */}
      <Card>
        <CardHeader>
          <CardTitle>Placeholder Profiles</CardTitle>
          <CardDescription>
            Showing {placeholderProfiles?.length || 0} of {totalPlaceholders || 0} profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {placeholderProfiles && placeholderProfiles.length > 0 ? (
            <div className="space-y-3">
              {placeholderProfiles.map((p) => {
                const listingCount = listingCountMap[p.id] || 0;
                const emailPrefix = p.email.split('@')[0];

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {p.company_name || emailPrefix}
                        </p>
                        {listingCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {listingCount} listings
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {p.email}
                        </p>
                        {p.city && p.state && (
                          <p className="text-sm text-muted-foreground">
                            {p.city}, {p.state}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                      {listingCount > 0 && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/listings?user=${p.id}`}>
                            View Listings
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No placeholder profiles found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
