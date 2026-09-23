import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { enforceFeature } from '@/lib/entitlements';
import { RATE_LIMITS } from '@/lib/security/rate-limit';

// Minutes saved per AI action — used for time-saved estimate
const TIME_SAVED = {
  autoReply: 18,      // avg manual reply time
  followUpEmail: 12,  // avg manual follow-up draft + send
  chatResponse: 3,    // avg time to handle a chat message manually
};

export const GET = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'aiAssistant');
  if (gateError) return gateError;

  const { searchParams } = new URL(request.url);
  // Clamp: `?days=abc` made `since` an Invalid Date and toISOString() threw.
  const parsedDays = parseInt(searchParams.get('days') || '30');
  const days = Number.isFinite(parsedDays) ? Math.min(Math.max(parsedDays, 1), 365) : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();
  const prevSince = new Date();
  prevSince.setDate(prevSince.getDate() - days * 2);

  // Lead counts use head:true count queries. The previous version pulled every
  // lead row (three times) and counted them in JS, which both scaled with lead
  // volume and silently capped at PostgREST's 1000-row limit, so dealers past
  // 1000 leads saw wrong totals, pipeline and conversion rate.
  const leadCount = (status?: string[]) => {
    let q = supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);
    if (status) q = q.in('status', status);
    return q;
  };

  const [
    leadsResult,
    leadsThisPeriodResult,
    newCountResult,
    contactedCountResult,
    qualifiedCountResult,
    convertedCountResult,
    lostCountResult,
    highPriorityResult,
    followUpsResult,
    conversationsResult,
    listingsResult,
    topListingsResult,
    prevLeadsResult,
  ] = await Promise.all([
    // All-time lead total
    leadCount(),

    // Leads in current period (only score is needed)
    supabase
      .from('leads')
      .select('score', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', sinceIso),

    // Lead breakdown by status (all time)
    leadCount(['new']),
    leadCount(['contacted']),
    leadCount(['qualified']),
    leadCount(['converted', 'won']),
    leadCount(['lost']),

    // High priority leads this period
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('priority', 'high')
      .gte('created_at', sinceIso),

    // Follow-up emails sent this period
    supabase
      .from('lead_followup_queue')
      .select('id, step, status, sent_at', { count: 'exact' })
      .eq('dealer_id', user.id)
      .eq('status', 'sent')
      .gte('sent_at', sinceIso),

    // AI chat conversations this period
    supabase
      .from('chat_conversations')
      .select('id, lead_captured, status', { count: 'exact' })
      .eq('dealer_id', user.id)
      .gte('created_at', sinceIso),

    // Active listings + marketplace presence
    supabase
      .from('listings')
      .select('id, status, views_count, created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null),

    // Top performing listings
    supabase
      .from('listings')
      .select('id, title, views_count, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('views_count', { ascending: false })
      .limit(5),

    // Previous period, for the trend
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', prevSince.toISOString())
      .lt('created_at', sinceIso),
  ]);

  const totalLeads = leadsResult.count || 0;
  const periodLeads = leadsThisPeriodResult.data || [];
  const periodLeadCount = leadsThisPeriodResult.count ?? periodLeads.length;
  const followUps = followUpsResult.data || [];
  const conversations = conversationsResult.data || [];
  const listings = listingsResult.data || [];

  // Lead pipeline counts
  const pipeline = {
    new: newCountResult.count || 0,
    contacted: contactedCountResult.count || 0,
    qualified: qualifiedCountResult.count || 0,
    converted: convertedCountResult.count || 0,
    lost: lostCountResult.count || 0,
  };

  // Auto-replies sent = every lead gets one now, so equals period lead count
  const autoRepliesSent = periodLeadCount;

  // Follow-up steps breakdown
  const followUpsByStep = [1, 2, 3, 4].map(step => ({
    step,
    sent: followUps.filter(f => f.step === step).length,
  }));

  // Chat conversations with leads captured
  const chatLeadsCaptured = conversations.filter(c => c.lead_captured).length;

  // Marketplace stats
  const activeListings = listings.filter(l => l.status === 'active').length;
  const totalViews = listings.reduce((sum, l) => sum + (l.views_count || 0), 0);

  // Average lead score this period
  const scoredLeads = periodLeads.filter(l => (l.score || 0) > 0);
  const avgScore = scoredLeads.length > 0
    ? Math.round(scoredLeads.reduce((sum, l) => sum + (l.score || 0), 0) / scoredLeads.length)
    : 0;

  // High priority leads count
  const highPriorityCount = highPriorityResult.count || 0;

  // Total AI actions = auto-replies + follow-ups sent + chat responses (conversations × ~8 messages avg)
  const estimatedChatResponses = conversations.length * 8;
  const totalAIActions = autoRepliesSent + followUps.length + estimatedChatResponses;

  // Time saved estimate (in minutes → convert to hours)
  const minutesSaved =
    (autoRepliesSent * TIME_SAVED.autoReply) +
    (followUps.length * TIME_SAVED.followUpEmail) +
    (estimatedChatResponses * TIME_SAVED.chatResponse);
  const hoursSaved = Math.round(minutesSaved / 60);

  // Conversion rate
  const conversionRate = totalLeads > 0
    ? Math.round((pipeline.converted / totalLeads) * 100)
    : 0;

  const prevLeadCount = prevLeadsResult.count;

  const leadTrend = (prevLeadCount || 0) > 0
    ? Math.round(((periodLeadCount - (prevLeadCount || 0)) / (prevLeadCount || 1)) * 100)
    : 0;

  return NextResponse.json({
    period: { days, since: sinceIso },
    summary: {
      totalLeadsAllTime: totalLeads,
      leadsThisPeriod: periodLeadCount,
      leadTrend,
      highPriorityLeads: highPriorityCount,
      avgLeadScore: avgScore,
      autoRepliesSent,
      followUpEmailsSent: followUps.length,
      chatConversations: conversations.length,
      chatLeadsCaptured,
      totalAIActions,
      hoursSaved,
      conversionRate,
      activeListings,
      totalMarketplaceViews: totalViews,
    },
    pipeline,
    followUpsByStep,
    topListings: topListingsResult.data || [],
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:ai-performance' } });
