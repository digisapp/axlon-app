import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Package,
  Eye,
  Users,
  Phone,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/ActivityFeed';
import { AskAxlon } from '@/components/dashboard/AskAxlon';
import { Greeting } from '@/components/dashboard/Greeting';
import { NeedsAttention, type AttentionItem } from '@/components/dashboard/NeedsAttention';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { RoiSnapshot } from '@/components/dashboard/RoiSnapshot';
import { TrialBanner } from '@/components/dashboard/TrialBanner';
import { panelClass } from '@/components/dashboard/panel';
import { getEffectiveTier, isFeatureUnlocked } from '@/lib/plans';
import { cn } from '@/lib/utils';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_ATTENTION_ITEMS = 6;
const PHOTO_CHECK_LIMIT = 60;

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Time windows
  const now = new Date();
  const nowIso = now.toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS).toISOString();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * DAY_MS).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS).toISOString();
  const sixtyDaysAgo = new Date(now.getTime() - 60 * DAY_MS).toISOString();
  const fortyFiveDaysAgo = new Date(now.getTime() - 45 * DAY_MS).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Listing ids first (the views queries need them). Every listings read here
  // skips soft-deleted rows — the owner can still see them under RLS, so
  // deleted listings used to reappear in counts, views and "Recent Listings".
  const { data: userListingIds } = await supabase
    .from('listings')
    .select('id')
    .eq('user_id', user.id)
    .is('deleted_at', null);
  const listingIds = userListingIds?.map(l => l.id) || [];

  const [
    { count: unreadMessages },
    { count: total },
    { count: active },
    { count: listingsThisMonth },
    { data: viewsData },
    { count: views30 },
    { count: viewsPrev30 },
    { count: leads },
    { count: leadsTotal },
    { count: leadsLast7 },
    { count: leadsPrev7 },
    { data: newLeadRows },
    { data: overdueFollowups },
    { count: pendingAiInbox },
    { count: missedCalls7 },
    { count: calls30 },
    { data: photoCheckListings },
    { data: listings },
    { data: staleListings },
    { data: recentLeads },
    { data: recentMessages },
    { count: leadsThisMonth },
    { count: aiLeadsThisMonth },
    { count: callsThisMonth },
    { count: aiDraftsThisMonth },
    { data: openLeadListings },
    { data: openDeals },
    { data: voiceAgent },
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
      .eq('user_id', user.id)
      .is('deleted_at', null),
    // Active listings
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .eq('status', 'active'),
    // Listings added this month
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', monthStart),
    // All-time views
    supabase
      .from('listings')
      .select('views_count')
      .eq('user_id', user.id)
      .is('deleted_at', null),
    // Views last 30 days (listing_views timestamps are viewed_at, not created_at)
    supabase
      .from('listing_views')
      .select('*', { count: 'exact', head: true })
      .in('listing_id', listingIds)
      .gte('viewed_at', thirtyDaysAgo),
    // Views previous 30 days
    supabase
      .from('listing_views')
      .select('*', { count: 'exact', head: true })
      .in('listing_id', listingIds)
      .gte('viewed_at', sixtyDaysAgo)
      .lt('viewed_at', thirtyDaysAgo),
    // New (unanswered) leads
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'new'),
    // Leads ever — the setup checklist's "first lead" step
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
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
    // Newest unanswered leads, for the attention list
    supabase
      .from('leads')
      .select('id, buyer_name, source, created_at, listings(title)')
      .eq('user_id', user.id)
      .eq('status', 'new')
      .order('created_at', { ascending: false })
      .limit(3),
    // Follow-ups whose date has passed on a lead that's still open
    supabase
      .from('leads')
      .select('id, buyer_name, follow_up_date, listings(title)')
      .eq('user_id', user.id)
      .in('status', ['new', 'contacted', 'qualified'])
      .lte('follow_up_date', nowIso)
      .order('follow_up_date', { ascending: true })
      .limit(3),
    // AI drafts waiting for approval
    supabase
      .from('ai_inbox_items')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', user.id)
      .eq('status', 'pending'),
    // Calls the voice agent missed this week
    supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', user.id)
      .eq('status', 'missed')
      .gte('started_at', sevenDaysAgo),
    // Calls answered, last 30 days
    supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', user.id)
      .neq('status', 'missed')
      .gte('started_at', thirtyDaysAgo),
    // Newest active listings with their image ids — anything with none needs photos
    supabase
      .from('listings')
      .select('id, title, images:listing_images(id)')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(PHOTO_CHECK_LIMIT),
    // Recent listings
    supabase
      .from('listings')
      .select('id, title, price, status, views_count, created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    // Stale listing (>45 days, still active)
    supabase
      .from('listings')
      .select('id, title, created_at, price')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .eq('status', 'active')
      .lt('created_at', fortyFiveDaysAgo)
      .order('created_at', { ascending: true })
      .limit(1),
    // Recent leads for the activity feed
    supabase
      .from('leads')
      .select('id, buyer_name, source, created_at, listing_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    // Recent messages for the activity feed
    // messages has no sender_name column — embed the sender profile instead
    supabase
      .from('messages')
      .select('id, content, created_at, listing_id, sender:profiles!messages_sender_id_fkey(company_name, email)')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    // AXLON this month: form leads
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', monthStart),
    // AXLON this month: AI chat leads
    supabase
      .from('dealer_ai_leads')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', user.id)
      .gte('created_at', monthStart),
    // AXLON this month: calls answered
    supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', user.id)
      .gte('started_at', monthStart),
    // AXLON this month: AI-drafted responses
    supabase
      .from('ai_inbox_items')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', user.id)
      .gte('created_at', monthStart),
    // Pipeline value: open leads with attached listing prices
    supabase
      .from('leads')
      .select('id, listings(price)')
      .eq('user_id', user.id)
      .in('status', ['new', 'contacted', 'qualified'])
      .limit(500),
    // Pipeline value: open deals
    supabase
      .from('deals')
      .select('sale_price')
      .eq('dealer_id', user.id)
      .in('status', ['quote', 'negotiation', 'pending_approval'])
      .limit(500),
    // Setup: the AI phone number lives on dealer_voice_agents
    supabase
      .from('dealer_voice_agents')
      .select('phone_number')
      .eq('dealer_id', user.id)
      .maybeSingle(),
  ]);

  // Trial status
  const trialStartDate = profile?.created_at ? new Date(profile.created_at) : new Date();
  const trialEndDate = new Date(trialStartDate.getTime() + 30 * DAY_MS);
  const trialDaysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / DAY_MS));
  const isOnTrial = (!profile?.subscription_tier || profile.subscription_tier === 'free') && trialDaysRemaining > 0;
  // The sidebar carries the countdown; the overview only speaks up in the last days.
  const showTrialBanner = isOnTrial && trialDaysRemaining <= 9;

  // Same gate as <FeatureGate> on /dashboard/ai-assistant: the prompt used to
  // render for everyone, so after the trial a free dealer's first question
  // came back as a raw "upgrade_required".
  const effectiveTier = profile?.is_admin
    ? 'enterprise'
    : getEffectiveTier(profile?.subscription_tier, profile?.created_at);
  const canAskAssistant = isFeatureUnlocked('aiAssistant', effectiveTier);

  // Derived numbers
  const totalListings = total || 0;
  const activeListings = active || 0;
  const totalViews = viewsData?.reduce((sum, l) => sum + (l.views_count || 0), 0) || 0;
  const newLeads = leads || 0;
  const recentListings = listings || [];
  const hasVoiceAgent = !!voiceAgent?.phone_number;

  const leadsTrend = leadsPrev7 && leadsPrev7 > 0
    ? Math.round(((leadsLast7 || 0) - leadsPrev7) / leadsPrev7 * 100)
    : null;
  const viewsTrend = viewsPrev30 && viewsPrev30 > 0
    ? Math.round(((views30 || 0) - viewsPrev30) / viewsPrev30 * 100)
    : null;

  // AXLON this month
  const roiLeadsCaptured = (leadsThisMonth || 0) + (aiLeadsThisMonth || 0);
  const leadPipelineValue = (openLeadListings || []).reduce((sum, lead) => {
    const listing = lead.listings as { price: number | null } | { price: number | null }[] | null;
    const price = Array.isArray(listing) ? listing[0]?.price : listing?.price;
    return sum + (price || 0);
  }, 0);
  const dealPipelineValue = (openDeals || []).reduce((sum, d) => sum + (Number(d.sale_price) || 0), 0);
  const pipelineValue = leadPipelineValue + dealPipelineValue;
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hasRoiActivity = roiLeadsCaptured > 0 || pipelineValue > 0 || (callsThisMonth || 0) > 0 || (aiDraftsThisMonth || 0) > 0;

  // Needs your attention — priority order, newest lead first
  const attention: AttentionItem[] = [];

  (newLeadRows || []).forEach((lead) => {
    const title = embeddedTitle(lead.listings);
    attention.push({
      id: `lead-${lead.id}`,
      kind: 'lead',
      title: `New inquiry · ${title || lead.buyer_name}`,
      description: title ? `${lead.buyer_name} · ${sourceLabel(lead.source)}` : sourceLabel(lead.source),
      href: '/dashboard/leads',
      time: getTimeAgo(new Date(lead.created_at)),
    });
  });

  (overdueFollowups || []).forEach((lead) => {
    const title = embeddedTitle(lead.listings);
    attention.push({
      id: `followup-${lead.id}`,
      kind: 'followup',
      title: `Follow-up due · ${lead.buyer_name}`,
      description: title ? `About ${title}` : 'Lead waiting for a response',
      href: '/dashboard/leads',
      time: lead.follow_up_date ? getTimeAgo(new Date(lead.follow_up_date)) : undefined,
    });
  });

  if (pendingAiInbox && pendingAiInbox > 0) {
    attention.push({
      id: 'ai-drafts',
      kind: 'draft',
      title: `${pendingAiInbox} AI ${pendingAiInbox === 1 ? 'reply' : 'replies'} ready to send`,
      description: 'AXLON drafted answers to your leads. Review and approve.',
      href: '/dashboard/ai-inbox',
    });
  }

  if (unreadMessages && unreadMessages > 0) {
    attention.push({
      id: 'unread',
      kind: 'message',
      title: `${unreadMessages} unread message${unreadMessages === 1 ? '' : 's'}`,
      description: 'Buyers are waiting on a reply',
      href: '/dashboard/messages',
    });
  }

  if (missedCalls7 && missedCalls7 > 0) {
    attention.push({
      id: 'missed-calls',
      kind: 'call',
      title: `${missedCalls7} missed call${missedCalls7 === 1 ? '' : 's'} this week`,
      description: 'Callers AXLON could not reach — worth a call back',
      href: '/dashboard/calls',
    });
  }

  const listingsWithoutPhotos = (photoCheckListings || []).filter((l) => {
    const images = l.images as { id: string }[] | null;
    return !images || images.length === 0;
  });
  listingsWithoutPhotos.slice(0, 2).forEach((listing) => {
    attention.push({
      id: `photos-${listing.id}`,
      kind: 'photos',
      title: 'Listing needs photos',
      description: listing.title,
      href: `/dashboard/listings/${listing.id}/edit`,
    });
  });

  const stale = staleListings?.[0];
  if (stale) {
    const daysListed = Math.floor((now.getTime() - new Date(stale.created_at).getTime()) / DAY_MS);
    attention.push({
      id: `stale-${stale.id}`,
      kind: 'stale',
      title: `Listed ${daysListed} days without a sale`,
      description: `${stale.title} — consider a price change`,
      href: `/dashboard/listings/${stale.id}/edit`,
    });
  }

  // Count everything outstanding, not just the rows we show
  const pendingCount =
    attention.length
    + Math.max(0, newLeads - (newLeadRows?.length || 0))
    + Math.max(0, listingsWithoutPhotos.length - 2);
  const attentionItems = attention.slice(0, MAX_ATTENTION_ITEMS);

  // Ask AXLON prompts that fit today
  const suggestions = [
    newLeads > 0 ? 'Which leads need follow-up?' : 'How do I get more leads?',
    activeListings > 0 ? 'Top listings this week' : 'How do I add my inventory?',
    stale ? 'Which listings should I reprice?' : 'What should I price my trailer at?',
  ];

  // Activity feed. Keep each row's real timestamp: getTimeAgo() emits labels
  // like "3h"/"2w+" that don't sort chronologically on their own.
  const activities: { at: number; item: ActivityItem }[] = [];

  recentLeads?.forEach((lead) => {
    activities.push({
      at: new Date(lead.created_at).getTime(),
      item: {
        id: `lead-${lead.id}`,
        type: lead.source === 'phone_call' ? 'call' : 'lead',
        title: `New lead: ${lead.buyer_name}`,
        description: lead.source === 'phone_call' ? 'Inbound phone call' : 'Submitted inquiry',
        time: getTimeAgo(new Date(lead.created_at)),
        href: '/dashboard/leads',
      },
    });
  });

  recentMessages?.forEach((msg) => {
    const sender = Array.isArray(msg.sender) ? msg.sender[0] : msg.sender;
    const senderName = sender?.company_name || sender?.email?.split('@')[0] || 'Buyer';
    activities.push({
      at: new Date(msg.created_at).getTime(),
      item: {
        id: `msg-${msg.id}`,
        type: 'message',
        title: `Message from ${senderName}`,
        description: msg.content?.slice(0, 60) || 'New message',
        time: getTimeAgo(new Date(msg.created_at)),
        href: '/dashboard/messages',
      },
    });
  });

  const feedActivities = activities
    .sort((a, b) => b.at - a.at)
    .slice(0, 6)
    .map((row) => row.item);

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={<Greeting name={profile?.company_name} />}
        description="Here's what's happening at your dealership."
      />

      {showTrialBanner && (
        <TrialBanner
          trialDaysRemaining={trialDaysRemaining}
          trialEndsAt={trialEndDate.toISOString()}
        />
      )}

      {/* Setup — compact, collapsible, gone once every step is done */}
      <OnboardingChecklist
        hasCompanyName={!!profile?.company_name}
        hasListings={totalListings > 0}
        hasImported={totalListings >= 3}
        hasPhoneNumber={hasVoiceAgent}
        hasLeads={(leadsTotal || 0) > 0}
      />

      {/* How is my equipment business doing? */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <KpiCard
          title="Active Listings"
          value={activeListings}
          icon={<Package className="w-4 h-4" />}
          sub={
            listingsThisMonth && listingsThisMonth > 0
              ? `+${listingsThisMonth} this month`
              : `${totalListings} total`
          }
          tone={listingsThisMonth && listingsThisMonth > 0 ? 'up' : 'neutral'}
          href="/dashboard/listings"
        />
        <KpiCard
          title="New Leads"
          value={newLeads}
          icon={<Users className="w-4 h-4" />}
          sub={
            leadsLast7 && leadsLast7 > 0
              ? `+${leadsLast7} this week${leadsTrend !== null ? ` · ${formatTrend(leadsTrend)}` : ''}`
              : 'Awaiting your reply'
          }
          tone={leadsLast7 && leadsLast7 > 0 ? (leadsTrend !== null && leadsTrend < 0 ? 'down' : 'up') : 'neutral'}
          href="/dashboard/leads"
          highlight={newLeads > 0}
        />
        <KpiCard
          title="AI Calls Answered"
          value={calls30 || 0}
          icon={<Phone className="w-4 h-4" />}
          sub={hasVoiceAgent ? 'Last 30 days' : 'Turn on AXLON Voice'}
          tone="neutral"
          href={hasVoiceAgent ? '/dashboard/calls' : '/dashboard/voice-agent'}
        />
        <KpiCard
          title="Equipment Views"
          value={totalViews}
          icon={<Eye className="w-4 h-4" />}
          sub={
            viewsTrend !== null
              ? `${formatTrend(viewsTrend)} vs prior 30 days`
              : `${(views30 || 0).toLocaleString()} in the last 30 days`
          }
          tone={viewsTrend === null ? 'neutral' : viewsTrend < 0 ? 'down' : 'up'}
          href="/dashboard/analytics"
        />
      </div>

      {/* What is AXLON doing for me? */}
      {hasRoiActivity && (
        <RoiSnapshot
          monthLabel={monthLabel}
          leadsCaptured={roiLeadsCaptured}
          pipelineValue={pipelineValue}
          callsAnswered={callsThisMonth || 0}
          aiDrafts={aiDraftsThisMonth || 0}
        />
      )}

      {/* What needs my attention right now? */}
      <NeedsAttention items={attentionItems} pendingCount={pendingCount} />

      <AskAxlon suggestions={suggestions} locked={!canAskAssistant} />

      {/* Recent activity + recent listings */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <section className={panelClass} aria-labelledby="recent-activity-heading">
          <div className="flex items-center justify-between px-4 pt-4 md:px-5 md:pt-5">
            <h2 id="recent-activity-heading" className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="w-4 h-4 text-muted-foreground" />
              Recent Activity
            </h2>
            {feedActivities.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/dashboard/leads">
                  View all
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            )}
          </div>
          <div className="px-2 pb-2 pt-2 md:px-3 md:pb-3">
            <ActivityFeed activities={feedActivities} />
          </div>
        </section>

        <section className={panelClass} aria-labelledby="recent-listings-heading">
          <div className="flex items-center justify-between px-4 pt-4 md:px-5 md:pt-5">
            <h2 id="recent-listings-heading" className="flex items-center gap-2 text-sm font-semibold">
              <Package className="w-4 h-4 text-muted-foreground" />
              Recent Listings
            </h2>
            {recentListings.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/dashboard/listings">
                  View all
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            )}
          </div>
          <div className="px-4 pb-4 pt-3 md:px-5 md:pb-5">
            {recentListings.length > 0 ? (
              <ul className="space-y-1.5">
                {recentListings.map((listing) => (
                  <li
                    key={listing.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{listing.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {listing.price ? `$${listing.price.toLocaleString()}` : 'No price set'}
                        {' · '}
                        {(listing.views_count || 0).toLocaleString()} views
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={listing.status} />
                      <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                        <Link href={`/dashboard/listings/${listing.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center">
                <Package className="mx-auto mb-3 w-10 h-10 text-muted-foreground/50" />
                <p className="mb-3 text-sm text-muted-foreground">
                  No listings yet. Put your first piece of equipment in front of buyers.
                </p>
                <Button size="sm" asChild>
                  <Link href="/dashboard/listings/new">
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create Listing
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  sub,
  tone,
  href,
  highlight = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  sub: string;
  tone: 'up' | 'down' | 'neutral';
  href: string;
  highlight?: boolean;
}) {
  const subColor =
    tone === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground';

  return (
    <Link
      href={href}
      className={cn(
        panelClass,
        'block p-4 md:p-5 transition-colors hover:border-primary/40',
        highlight && 'border-primary/30'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs md:text-sm text-muted-foreground">{title}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
      <p className={cn('mt-1 text-xs md:text-sm', subColor)}>{sub}</p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    draft: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    sold: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
    expired: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize whitespace-nowrap ${
        styles[status as keyof typeof styles] || styles.expired
      }`}
    >
      {status}
    </span>
  );
}

function formatTrend(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct}%`;
}

function sourceLabel(source: string | null | undefined): string {
  switch (source) {
    case 'phone_call':
      return 'Called your AI line';
    case 'chat':
      return 'Asked AXLON on your storefront';
    case 'referral':
      return 'Referred';
    default:
      return 'Sent an inquiry';
  }
}

/** Supabase embeds a to-one relation as an object or a one-element array depending on the FK shape. */
function embeddedTitle(rel: unknown): string | null {
  const row = Array.isArray(rel) ? rel[0] : rel;
  const title = (row as { title?: string | null } | null)?.title;
  return title || null;
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
