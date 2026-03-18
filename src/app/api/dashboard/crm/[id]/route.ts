import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, updateCrmContactSchema } from '@/lib/validations/api';

export const PATCH = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('crm') + 1];

  const body = await request.json();

  let validatedData;
  try {
    validatedData = validateBody(updateCrmContactSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }

  // Convert empty strings to null for optional fields
  const updateData: Record<string, unknown> = { ...validatedData };
  for (const key of ['email', 'phone', 'company', 'notes']) {
    if (key in updateData && updateData[key] === '') {
      updateData[key] = null;
    }
  }

  const { data, error } = await supabase
    .from('crm_contacts')
    .update(updateData)
    .eq('id', id)
    .eq('dealer_id', user.id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating CRM contact', { error });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-crm' } });

export const DELETE = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('crm') + 1];

  const { error } = await supabase
    .from('crm_contacts')
    .delete()
    .eq('id', id)
    .eq('dealer_id', user.id);

  if (error) {
    logger.error('Error deleting CRM contact', { error });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-crm' } });
