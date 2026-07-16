import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInternalRequest } from '@/lib/security/internal-auth';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { withAuth } from '@/lib/auth/with-auth';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, aiLeadUpdateSchema, aiLeadNotificationSchema } from '@/lib/validations/api';
import { sendEmail } from '@/lib/email/resend';
import { newLeadEmail } from '@/lib/email/templates';
import { enforceFeature } from '@/lib/entitlements';

// Get dealer's AI leads
export const GET = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'aiAssistant');
  if (gateError) return gateError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('dealer_ai_leads')
    .select(`
      *,
      conversation:chat_conversations(
        id,
        created_at,
        listing:listings(id, title)
      )
    `)
    .eq('dealer_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data: leads, error, count } = await query;

  if (error) {
    logger.error('Fetch leads error', { error });
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }

  // Get lead stats
  const { data: statsData } = await supabase
    .from('dealer_ai_leads')
    .select('status')
    .eq('dealer_id', user.id);

  const stats = {
    total: statsData?.length || 0,
    new: statsData?.filter(l => l.status === 'new').length || 0,
    contacted: statsData?.filter(l => l.status === 'contacted').length || 0,
    qualified: statsData?.filter(l => l.status === 'qualified').length || 0,
    converted: statsData?.filter(l => l.status === 'converted').length || 0,
  };

  return NextResponse.json({
    leads,
    stats,
    pagination: {
      total: count,
      limit,
      offset,
    },
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dealer-ai-leads' } });

// Update lead status
export const PATCH = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'aiAssistant');
  if (gateError) return gateError;

  const body = await request.json();
  let validatedData;
  try {
    validatedData = validateBody(aiLeadUpdateSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }
  const { leadId, status, notes } = validatedData;

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (status) {
    updateData.status = status;
    if (status === 'contacted') {
      updateData.contacted_at = new Date().toISOString();
    }
  }

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const { data: lead, error } = await supabase
    .from('dealer_ai_leads')
    .update(updateData)
    .eq('id', leadId)
    .eq('dealer_id', user.id)
    .select()
    .single();

  if (error) {
    logger.error('Update lead error', { error });
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }

  return NextResponse.json({ lead });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dealer-ai-leads' } });

// Send notification email for new lead (called internally)
// Requires HMAC signature verification via x-internal-signature header
export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:dealer-ai-leads',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify this is an authenticated internal request
    if (!verifyInternalRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - internal requests only' },
        { status: 401 }
      );
    }

    const body = await request.json();
    let validatedNotification;
    try {
      validatedNotification = validateBody(aiLeadNotificationSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }
    const { dealerId, leadId } = validatedNotification;

    const supabase = await createClient();

    // Get lead details
    const { data: lead } = await supabase
      .from('dealer_ai_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Get dealer's email settings
    const { data: aiSettings } = await supabase
      .from('dealer_ai_settings')
      .select('lead_notification_email')
      .eq('dealer_id', dealerId)
      .single();

    const { data: dealer } = await supabase
      .from('profiles')
      .select('email, company_name')
      .eq('id', dealerId)
      .single();

    const notificationEmail = aiSettings?.lead_notification_email || dealer?.email;

    if (!notificationEmail) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axleyard.com';

    // Send email notification via Resend
    try {
      const html = newLeadEmail({
        dealerName: dealer?.company_name || 'Team',
        buyerName: lead.visitor_name || 'Website Visitor',
        buyerEmail: lead.visitor_email || '',
        buyerPhone: lead.visitor_phone || undefined,
        listingTitle: lead.equipment_interest || undefined,
        message: lead.visitor_message || undefined,
        leadsUrl: `${baseUrl}/dashboard/ai-leads`,
      });

      await sendEmail({
        to: notificationEmail,
        subject: `New Lead: ${lead.visitor_name || 'Website Visitor'}${lead.equipment_interest ? ` — ${lead.equipment_interest}` : ''}`,
        html,
      });

      logger.info('AI Lead notification sent', { to: notificationEmail, leadId });
    } catch (emailError) {
      // Don't fail the request if email fails — lead is already saved
      logger.error('AI Lead email notification failed', { error: emailError, to: notificationEmail });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Send notification error', { error });
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
