import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();

  // Fetch all generated reports (most recent first)
  const { data: reports } = await supabase
    .from('dealer_market_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // Fetch all dealer AI settings with profile info
  const { data: aiSettings } = await supabase
    .from('dealer_ai_settings')
    .select('dealer_id, is_enabled, market_reports_enabled, market_report_frequency');

  // Get profile info for all dealers with AI settings
  const dealerIds = (aiSettings || []).map(s => s.dealer_id);
  const { data: profiles } = dealerIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, email, company_name, city, state')
        .in('id', dealerIds)
    : { data: [] };

  const profileMap = new Map((profiles || []).map(p => [p.id, p]));

  const subscribers = (aiSettings || []).map(s => ({
    ...s,
    profile: profileMap.get(s.dealer_id) || null,
  }));

  // Sort: subscribed first, then by company name
  subscribers.sort((a, b) => {
    if (a.market_reports_enabled !== b.market_reports_enabled) {
      return a.market_reports_enabled ? -1 : 1;
    }
    return (a.profile?.company_name || '').localeCompare(b.profile?.company_name || '');
  });

  return NextResponse.json({
    reports: reports || [],
    subscribers,
  });
}
