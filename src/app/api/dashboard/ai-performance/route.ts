import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';

// Minutes saved per AI action — used for time-saved estimate
const TIME_SAVED = {
  autoReply: 18,      // avg manual reply time
  followUpEmail: 12,  // avg manual follow-up draft + send
  chatResponse: 3,    // avg time to handle a chat message manually
};

export const GET = withAuth(async (request, { user, supabase }) => {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const [
    leadsResult,
    leadsThisPeriodResult,
    leadsByStatusResult,
    highPriorityResult,
    followUpsResult,
    conversationsResult,
    listingsResult,
    topListingsResult,
  ] = await Promise.all([
    // All-time lead totals
    supabase
      .from('leads')
      .select('id, status, priority, score, created_at', { count: 'exact' })
      .eq('user_id', user.id),

    // Leads in current period
    supabase
      .from('leads')
      .select('id, status, priority, score, created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', sinceIso),

    // Lead breakdown by status (all time)
    supabase
      .from('leads')
      .select('status')
      .eq('user_id', user.id),

    // High priority leads this period
    supabase
      .from('leads')
      .select('id', { count: 'exact' })
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
      .eq('user_id', user.id),

    // Top performing listings
    supabase
      .from('listings')
      .select('id, title, views_count, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('views_count', { ascending: false })
      .limit(5),
  ]);

  const allLeads = leadsResult.data || [];
  const periodLeads = leadsThisPeriodResult.data || [];
  const allStatuses = leadsByStatusResult.data || [];
  const followUps = followUpsResult.data || [];
  const conversations = conversationsResult.data || [];
  const listings = listingsResult.data || [];

  // Lead pipeline counts
  const pipeline = {
    new: allStatuses.filter(l => l.status === 'new').length,
    contacted: allStatuses.filter(l => l.status === 'contacted').length,
    qualified: allStatuses.filter(l => l.status === 'qualified').length,
    converted: allStatuses.filter(l => l.status === 'converted' || l.status === 'won').length,
    lost: allStatuses.filter(l => l.status === 'lost').length,
  };

  // Auto-replies sent = every lead gets one now, so equals period lead count
  const autoRepliesSent = periodLeads.length;

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
  const scoredLeads = periodLeads.filter(l => l.score > 0);
  const avgScore = scoredLeads.length > 0
    ? Math.round(scoredLeads.reduce((sum, l) => sum + l.score, 0) / scoredLeads.length)
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
  const conversionRate = allLeads.length > 0
    ? Math.round((pipeline.converted / allLeads.length) * 100)
    : 0;

  // Previous period comparison for leads
  const prevSince = new Date();
  prevSince.setDate(prevSince.getDate() - days * 2);
  const { count: prevLeadCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', prevSince.toISOString())
    .lt('created_at', sinceIso);

  const leadTrend = (prevLeadCount || 0) > 0
    ? Math.round(((periodLeads.length - (prevLeadCount || 0)) / (prevLeadCount || 1)) * 100)
    : 0;

  return NextResponse.json({
    period: { days, since: sinceIso },
    summary: {
      totalLeadsAllTime: allLeads.length,
      leadsThisPeriod: periodLeads.length,
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
