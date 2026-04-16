import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { requireCsrf } from '@/lib/security/csrf';

export async function POST(request: NextRequest) {
  try {
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Find the user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (profile) {
      // Disable market reports
      await supabase
        .from('dealer_ai_settings')
        .update({ market_reports_enabled: false })
        .eq('dealer_id', profile.id);

      // Cancel any pending follow-up emails for leads associated with this email
      const { data: leads } = await supabase
        .from('dealer_ai_leads')
        .select('id')
        .eq('email', email.toLowerCase().trim());

      if (leads && leads.length > 0) {
        await supabase
          .from('lead_followup_queue')
          .update({ status: 'cancelled' })
          .eq('status', 'pending')
          .in('lead_id', leads.map(l => l.id));
      }

      logger.info('User unsubscribed', { email });
    }

    // Always return success (don't reveal whether email exists)
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Unsubscribe error', { error });
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
