import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { enforceFeature } from '@/lib/entitlements';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, createCrmActivitySchema } from '@/lib/validations/api';

export const GET = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'crm');
  if (gateError) return gateError;

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
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-crm-activities' } });

export const POST = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'crm');
  if (gateError) return gateError;

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
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-crm-activities' } });
