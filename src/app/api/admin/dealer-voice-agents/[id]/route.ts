import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, adminVoiceAgentUpdateSchema } from '@/lib/validations/api';
import { requireCsrf } from '@/lib/security/csrf';
import { validateE164Phone } from '../phone';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/dealer-voice-agents/[id] - Get specific dealer voice agent
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-dealer-voice-agents',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { id } = await params;
    const supabase = await createClient();

    // Check authentication and admin status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // dealer_voice_agents RLS is dealer-own only, so the session client would show
    // (and write) just this admin's own row. Admin verified above.
    const db = createAdminClient();

    // Get the voice agent
    const { data: agent, error } = await db
      .from('dealer_voice_agents')
      .select(`
        *,
        dealer:profiles!dealer_id(
          id, email, company_name, phone, avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error || !agent) {
      return NextResponse.json({ error: 'Voice agent not found' }, { status: 404 });
    }

    // Get call stats for this agent
    const { count: totalCalls } = await db
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_voice_agent_id', id);

    const { data: durationData } = await db
      .from('call_logs')
      .select('duration_seconds')
      .eq('dealer_voice_agent_id', id)
      .not('duration_seconds', 'is', null);

    const totalMinutes = durationData
      ? Math.round(durationData.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / 60)
      : 0;

    return NextResponse.json({
      data: {
        ...agent,
        stats: {
          total_calls: totalCalls || 0,
          total_minutes: totalMinutes,
        },
      },
    });
  } catch (error) {
    logger.error('Error in GET /api/admin/dealer-voice-agents/[id]', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/dealer-voice-agents/[id] - Update dealer voice agent
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-dealer-voice-agents',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { id } = await params;
    const supabase = await createClient();

    // Check authentication and admin status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    // dealer_voice_agents RLS is dealer-own only, so the session client would show
    // (and write) just this admin's own row. Admin verified above.
    const db = createAdminClient();

    const body = await request.json();
    let validatedData;
    try {
      validatedData = validateBody(adminVoiceAgentUpdateSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }

    // Admin can update all fields
    const allowedFields = [
      'phone_number',
      'phone_number_id',
      'agent_name',
      'voice',
      'greeting',
      'instructions',
      'business_name',
      'business_description',
      'business_hours',
      'after_hours_message',
      'can_search_inventory',
      'can_capture_leads',
      'can_transfer_calls',
      'transfer_phone_number',
      'plan_tier',
      'minutes_included',
      'minutes_used',
      'billing_cycle_start',
      'stripe_subscription_id',
      'is_active',
      'is_provisioned',
      'activated_at',
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if ((validatedData as Record<string, unknown>)[field] !== undefined) {
        updates[field] = (validatedData as Record<string, unknown>)[field];
      }
    }

    // The edit form sends '' for "no number". phone_number is UNIQUE, so
    // storing '' meant the second unprovisioned agent an admin saved failed
    // with a unique violation ("Failed to update voice agent"). Store NULL.
    for (const field of ['phone_number', 'phone_number_id', 'transfer_phone_number']) {
      if (typeof updates[field] === 'string' && (updates[field] as string).trim() === '') {
        updates[field] = null;
      }
    }

    // Validate and normalize phone numbers if provided
    if (updates.phone_number && typeof updates.phone_number === 'string') {
      const { valid, normalized } = validateE164Phone(updates.phone_number);
      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid phone number. Please use format: +1-XXX-XXX-XXXX' },
          { status: 400 }
        );
      }
      updates.phone_number = normalized;
    }

    if (updates.transfer_phone_number && typeof updates.transfer_phone_number === 'string') {
      const { valid, normalized } = validateE164Phone(updates.transfer_phone_number);
      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid transfer phone number. Please use format: +1-XXX-XXX-XXXX' },
          { status: 400 }
        );
      }
      updates.transfer_phone_number = normalized;
    }

    // Auto-set provisioned if phone number added
    if (updates.phone_number && !validatedData.is_provisioned) {
      updates.is_provisioned = true;
    }

    // Auto-set activated_at when activating
    if (validatedData.is_active === true) {
      const { data: current } = await db
        .from('dealer_voice_agents')
        .select('activated_at')
        .eq('id', id)
        .single();

      if (current && !current.activated_at) {
        updates.activated_at = new Date().toISOString();
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Update voice agent
    const { data: agent, error } = await db
      .from('dealer_voice_agents')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        dealer:profiles!dealer_id(
          id, email, company_name, phone
        )
      `)
      .single();

    if (error) {
      logger.error('Error updating dealer voice agent', { error });
      return NextResponse.json({ error: 'Failed to update voice agent' }, { status: 500 });
    }

    return NextResponse.json({ data: agent });
  } catch (error) {
    logger.error('Error in PATCH /api/admin/dealer-voice-agents/[id]', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/dealer-voice-agents/[id] - Delete dealer voice agent
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-dealer-voice-agents',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { id } = await params;
    const supabase = await createClient();

    // Check authentication and admin status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    // dealer_voice_agents RLS is dealer-own only, so the session client would show
    // (and write) just this admin's own row. Admin verified above.
    const db = createAdminClient();

    // Delete voice agent
    const { error } = await db
      .from('dealer_voice_agents')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting dealer voice agent', { error });
      return NextResponse.json({ error: 'Failed to delete voice agent' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error in DELETE /api/admin/dealer-voice-agents/[id]', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
