import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Package,
  Eye,
  MessageSquare,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Warehouse,
  Upload,
  Sparkles,
} from 'lucide-react';
import { SmartImportDropzone } from '@/components/dashboard/SmartImportDropzone';
import { CommandCenter } from '@/components/dashboard/CommandCenter';
import { LeadsPipeline } from '@/components/dashboard/LeadsPipeline';
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/ActivityFeed';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { TrialBanner } from '@/components/dashboard/TrialBanner';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Time constants
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString();

  // Get user's listing IDs first (needed for views queries)
  const { data: userListingIds } = await supabase
    .from('listings')
    .select('id')
    .eq('user_id', user.id);
  const listingIds = userListingIds?.map(l => l.id) || [];

  // Batch 1: All independent queries in parallel
  const [
    { count: unreadMessages },
    { count: total },
    { count: active },
    { data: viewsData },
    { count: leads },
    { count: leadsLast7 },
    { count: leadsPrev7 },
    { count: viewsLast7 },
    { count: viewsPrev7 },
    { data: listings },
    { data: staleListings },
    { data: topViewedListings },
    { count: pipelineNew },
    { count: pipelineContacted },
    { count: pipelineQualified },
    { count: pipelineWon },
    { count: pipelineLost },
    { data: recentLeads },
    { data: recentMessages },
  ] = await Promise.all([
    // Unread messages
    supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false),
    // Total listings
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    // Active listings
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active'),
    // Views data
    supabase
      .from('listings')
      .select('views_count')
      .eq('user_id', user.id),
    // New leads count
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'new'),
    // Leads last 7 days
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo),
    // Leads previous 7 days
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', fourteenDaysAgo)
      .lt('created_at', sevenDaysAgo),
    // Views last 7 days
    supabase
      .from('listing_views')
      .select('*', { count: 'exact', head: true })
      .in('listing_id', listingIds)
      .gte('created_at', sevenDaysAgo),
    // Views previous 7 days
    supabase
      .from('listing_views')
      .select('*', { count: 'exact', head: true })
      .in('listing_id', listingIds)
      .gte('created_at', fourteenDaysAgo)
      .lt('created_at', sevenDaysAgo),
    // Recent listings
    supabase
      .from('listings')
      .select('id, title, price, status, views_count, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    // Stale listings (>45 days)
    supabase
      .from('listings')
      .select('id, title, created_at, price')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .lt('created_at', fortyFiveDaysAgo)
      .order('created_at', { ascending: true })
      .limit(1),
    // Top viewed listing
    supabase
      .from('listings')
      .select('id, title, views_count')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('views_count', { ascending: false })
      .limit(1),
    // Pipeline: new
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'new'),
    // Pipeline: contacted
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'contacted'),
    // Pipeline: qualified
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'qualified'),
    // Pipeline: won
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'won'),
    // Pipeline: lost
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'lost'),
    // Recent leads for activity feed
    supabase
      .from('leads')
      .select('id, buyer_name, source, created_at, listing_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    // Recent messages for activity feed
    supabase
      .from('messages')
      .select('id, sender_name, content, created_at, listing_id')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  // Trial status
  const trialStartDate = profile?.created_at ? new Date(profile.created_at) : new Date();
  const trialEndDate = new Date(trialStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const trialDaysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isOnTrial = !profile?.subscription_status && trialDaysRemaining > 0;
  const showTrialBanner = isOnTrial && trialDaysRemaining <= 21;

  // Compute derived values
  const totalListings = total || 0;
  const activeListings = active || 0;
  const totalViews = viewsData?.reduce((sum, l) => sum + (l.views_count || 0), 0) || 0;
  const newLeads = leads || 0;
  const recentListings = listings || [];

  const leadsTrend = leadsPrev7 && leadsPrev7 > 0
    ? Math.round(((leadsLast7 || 0) - leadsPrev7) / leadsPrev7 * 100)
    : leadsLast7 && leadsLast7 > 0 ? 100 : 0;

  const viewsTrend = viewsPrev7 && viewsPrev7 > 0
    ? Math.round(((viewsLast7 || 0) - viewsPrev7) / viewsPrev7 * 100)
    : viewsLast7 && viewsLast7 > 0 ? 100 : 0;

  const pipeline = {
    new: pipelineNew || 0,
    contacted: pipelineContacted || 0,
    qualified: pipelineQualified || 0,
    won: pipelineWon || 0,
    lost: pipelineLost || 0,
  };

  // Build activity feed
  const activities: ActivityItem[] = [];

  recentLeads?.forEach((lead) => {
    const ago = getTimeAgo(new Date(lead.created_at));
    activities.push({
      id: `lead-${lead.id}`,
      type: lead.source === 'phone_call' ? 'call' : 'lead',
      title: `New lead: ${lead.buyer_name}`,
      description: lead.source === 'phone_call' ? 'Inbound phone call' : 'Submitted inquiry',
      time: ago,
      href: '/dashboard/leads',
    });
  });

  recentMessages?.forEach((msg) => {
    const ago = getTimeAgo(new Date(msg.created_at));
    activities.push({
      id: `msg-${msg.id}`,
      type: 'message',
      title: `Message from ${msg.sender_name || 'Buyer'}`,
      description: msg.content?.slice(0, 60) || 'New message',
      time: ago,
      href: '/dashboard/messages',
    });
  });

  // Sort by most recent and take top 8
  activities.sort((a, b) => {
    const timeOrder = ['just now', '1m', '2m', '5m', '10m', '30m', '1h', '2h', '3h', '5h', '12h', '1d', '2d', '3d', '5d', '1w', '2w'];
    return timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time);
  });
  const feedActivities = activities.slice(0, 8);

  // Build AI insights
  const insights: { type: 'inventory' | 'lead' | 'market'; title: string; description: string; action: string; href: string }[] = [];

  if (staleListings && staleListings.length > 0) {
    const stale = staleListings[0];
    const daysListed = Math.floor((now.getTime() - new Date(stale.created_at).getTime()) / (1000 * 60 * 60 * 24));
    insights.push({
      type: 'inventory',
      title: 'Inventory Alert',
      description: `"${stale.title}" has been listed for ${daysListed} days. Consider adjusting the price to increase demand.`,
      action: 'Edit',
      href: `/dashboard/listings/${stale.id}/edit`,
    });
  }

  if (newLeads && newLeads > 0) {
    insights.push({
      type: 'lead',
      title: 'Lead Opportunity',
      description: `You have ${newLeads} new lead${newLeads > 1 ? 's' : ''} waiting for a response. Quick follow-ups close 3x more deals.`,
      action: 'View',
      href: '/dashboard/leads',
    });
  }

  if (topViewedListings && topViewedListings.length > 0 && topViewedListings[0].views_count > 5) {
    const top = topViewedListings[0];
    insights.push({
      type: 'market',
      title: 'High Demand',
      description: `"${top.title}" has ${top.views_count} views — your most popular listing. Consider featuring it for more exposure.`,
      action: 'View',
      href: `/listing/${top.id}`,
    });
  }

  // Dealer dashboard
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Trial Conversion Banner */}
      {showTrialBanner && (
        <TrialBanner
          trialDaysRemaining={trialDaysRemaining}
          trialEndsAt={trialEndDate.toISOString()}
          stats={{
            listingsCreated: totalListings,
            totalViews: totalViews,
            leadsCapured: newLeads,
          }}
        />
      )}

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">
            Welcome back, {profile?.company_name || user.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Here&apos;s what&apos;s happening with your dealership today.
          </p>
        </div>
        <Button asChild size="sm" className="w-fit">
          <Link href="/dashboard/listings/new">
            <Plus className="w-4 h-4 mr-2" />
            New Listing
          </Link>
        </Button>
      </div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist
        hasListings={totalListings > 0}
        hasImported={totalListings >= 3}
        hasPhoneNumber={!!profile?.voice_phone_number}
        hasLeads={(newLeads || 0) > 0 || (pipeline.contacted || 0) > 0 || (pipeline.won || 0) > 0}
      />

      {/* AI Command Center */}
      <CommandCenter
        insights={insights}
        companyName={profile?.company_name || undefined}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Active Listings"
          value={activeListings || 0}
          icon={<Package className="w-5 h-5" />}
          description={`${totalListings || 0} total`}
        />
        <StatCard
          title="Total Views"
          value={totalViews}
          icon={<Eye className="w-5 h-5" />}
          description="Last 7 days"
          trend={viewsTrend || undefined}
        />
        <StatCard
          title="New Leads"
          value={newLeads || 0}
          icon={<Users className="w-5 h-5" />}
          description="Awaiting response"
          highlight={!!newLeads}
          trend={leadsTrend || undefined}
        />
        <StatCard
          title="Messages"
          value={unreadMessages || 0}
          icon={<MessageSquare className="w-5 h-5" />}
          description="Unread"
          highlight={!!unreadMessages}
        />
      </div>

      {/* Smart Import Card */}
      <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm md:text-base">Smart Import</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Switching from TruckPaper, Salesforce, or spreadsheets? Drop any file and AI imports your data automatically.
              </p>
            </div>
          </div>
          <SmartImportDropzone compact />
        </CardContent>
      </Card>

      {/* Pipeline + Activity Row */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-5">
            <LeadsPipeline pipeline={pipeline} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ActivityFeed activities={feedActivities} />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Listings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base md:text-lg">Recent Listings</CardTitle>
                <CardDescription>Your latest equipment listings</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/listings">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentListings && recentListings.length > 0 ? (
                <div className="space-y-2 md:space-y-3">
                  {recentListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-2.5 md:p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-sm md:text-base">{listing.title}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {listing.price
                            ? `$${listing.price.toLocaleString()}`
                            : 'No price set'}
                          {' · '}
                          {listing.views_count || 0} views
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 md:ml-4">
                        <StatusBadge status={listing.status} />
                        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                          <Link href={`/dashboard/listings/${listing.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No listings yet. Create your first listing!
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/listings/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <QuickActionButton
                href="/dashboard/listings/new"
                icon={<Plus className="w-4 h-4" />}
                label="Create New Listing"
              />
              <QuickActionButton
                href="/dashboard/leads"
                icon={<Users className="w-4 h-4" />}
                label="View Leads"
                badge={newLeads || undefined}
              />
              <QuickActionButton
                href="/dashboard/messages"
                icon={<MessageSquare className="w-4 h-4" />}
                label="View Messages"
                badge={unreadMessages || undefined}
              />
              <QuickActionButton
                href="/dashboard/analytics"
                icon={<BarChart3 className="w-4 h-4" />}
                label="View Analytics"
              />
              <QuickActionButton
                href="/dashboard/inventory"
                icon={<Warehouse className="w-4 h-4" />}
                label="Manage Inventory"
              />
              <QuickActionButton
                href="/dashboard/bulk"
                icon={<Upload className="w-4 h-4" />}
                label="Bulk Import"
              />
            </CardContent>
          </Card>

          {/* Upgrade Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm md:text-base">Upgrade to AXLON Platform</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    Get AI sales assistant, CRM, deal desk, and unlimited listings.
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/billing">
                      Upgrade Now
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  highlight = false,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? 'border-primary/50 bg-primary/5' : ''}>
      <CardContent className="p-3 md:p-6">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <span className="text-muted-foreground">{icon}</span>
          {trend !== undefined && (
            <span
              className={`flex items-center text-xs font-medium ${
                trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend >= 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {Math.abs(trend)}%
            </span>
          )}
          {highlight && (
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </div>
        <p className="text-xl md:text-3xl font-bold">{value.toLocaleString()}</p>
        <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 md:mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    sold: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    expired: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[status as keyof typeof styles] || styles.draft
      }`}
    >
      {status}
    </span>
  );
}

function QuickActionButton({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Button className="w-full justify-start text-sm" variant="outline" asChild>
      <Link href={href}>
        {icon}
        <span className="ml-2">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    </Button>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 14) return '1w';
  return '2w+';
}
