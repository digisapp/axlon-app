import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, savedSearchSchema } from '@/lib/validations/api';

const rateLimitConfig = { ...RATE_LIMITS.standard, prefix: 'ratelimit:saved-searches' };

export const GET = withAuth(async (request, { user, supabase }) => {
  const { data: searches, error } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching saved searches', { error });
    return NextResponse.json({ error: 'Failed to fetch saved searches' }, { status: 500 });
  }

  return NextResponse.json({ searches });
}, { rateLimit: rateLimitConfig });

export const POST = withAuth(async (request, { user, supabase }) => {
  const body = await request.json();
  let validatedData;
  try {
    validatedData = validateBody(savedSearchSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }
  const { name, query, filters, notify_email, notify_frequency } = validatedData;

  const { data: search, error } = await supabase
    .from('saved_searches')
    .insert({
      user_id: user.id,
      name,
      query: query || null,
      filters: filters || {},
      notify_email: notify_email !== false,
      notify_frequency: notify_frequency || 'daily',
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating saved search', { error });
    return NextResponse.json({ error: 'Failed to save search' }, { status: 500 });
  }

  return NextResponse.json({ search });
}, { rateLimit: rateLimitConfig });
