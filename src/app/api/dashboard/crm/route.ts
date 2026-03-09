import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';
import { validateBody, ValidationError, createCrmContactSchema } from '@/lib/validations/api';

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:dashboard-crm',
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
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch contacts
    let query = supabase
      .from('crm_contacts')
      .select('*')
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      const s = sanitizeSearchFilter(search);
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,company.ilike.%${s}%,phone.ilike.%${s}%`);
    }

    const { data: contacts, error } = await query;

    if (error) {
      logger.error('Error fetching CRM contacts', { error });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch pipeline stats (all contacts for this dealer, grouped by status)
    const { data: allContacts, error: pipelineError } = await supabase
      .from('crm_contacts')
      .select('status, deal_value')
      .eq('dealer_id', user.id);

    if (pipelineError) {
      logger.error('Error fetching pipeline stats', { error: pipelineError });
      return NextResponse.json({ error: pipelineError.message }, { status: 500 });
    }

    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
    const pipeline: Record<string, number> = {};
    const pipelineValues: Record<string, number> = {};

    for (const stage of stages) {
      pipeline[stage] = 0;
      pipelineValues[stage] = 0;
    }

    for (const c of allContacts || []) {
      pipeline[c.status] = (pipeline[c.status] || 0) + 1;
      pipelineValues[c.status] = (pipelineValues[c.status] || 0) + Number(c.deal_value || 0);
    }

    const totalValue = Object.values(pipelineValues).reduce((a, b) => a + b, 0);
    const totalContacts = allContacts?.length || 0;
    const wonValue = pipelineValues['won'] || 0;

    return NextResponse.json({
      contacts,
      pipeline,
      pipelineValues,
      stats: {
        totalContacts,
        totalValue,
        wonValue,
        conversionRate: totalContacts > 0
          ? Math.round(((pipeline['won'] || 0) / totalContacts) * 100)
          : 0,
      },
    });
  } catch (error) {
    logger.error('Error in GET /api/dashboard/crm', { error });
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
      prefix: 'ratelimit:dashboard-crm',
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
      validatedData = validateBody(createCrmContactSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }

    const { data, error } = await supabase
      .from('crm_contacts')
      .insert({
        ...validatedData,
        dealer_id: user.id,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        notes: validatedData.notes || null,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating CRM contact', { error });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/dashboard/crm', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
