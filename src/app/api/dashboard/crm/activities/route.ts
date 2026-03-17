import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, createCrmActivitySchema } from '@/lib/validations/api';

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:dashboard-crm-activities',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const contactId = searchParams.get('contact_id');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('crm_activities')
      .select('*')
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (contactId) {
      query = query.eq('contact_id', contactId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching CRM activities', { error });
      return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error in GET /api/dashboard/crm/activities', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:dashboard-crm-activities',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    let validatedData;
    try {
      validatedData = validateBody(createCrmActivitySchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }

    // Verify ownership of the contact
    const { data: contact } = await supabase
      .from('crm_contacts')
      .select('id')
      .eq('id', validatedData.contact_id)
      .eq('dealer_id', user.id)
      .single();

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('crm_activities')
      .insert({
        ...validatedData,
        dealer_id: user.id,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating CRM activity', { error });
      return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
    }

    // Update last_contact_at on the contact
    await supabase
      .from('crm_contacts')
      .update({ last_contact_at: new Date().toISOString() })
      .eq('id', validatedData.contact_id)
      .eq('dealer_id', user.id);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/dashboard/crm/activities', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
