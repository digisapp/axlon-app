import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { updateSavedSearchSchema } from '@/lib/validations/api';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const PATCH = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('saved-searches') + 1];

  if (!UUID_REGEX.test(id ?? '')) {
    return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
  }

  // Unvalidated body fields went straight into .update(): name:null or an
  // unknown notify_frequency hit NOT NULL / CHECK constraints and 500'd.
  const parsed = updateSavedSearchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { data: search, error } = await supabase
    .from('saved_searches')
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error('Error updating saved search', { error });
    return NextResponse.json({ error: 'Failed to update saved search' }, { status: 500 });
  }
  if (!search) {
    return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
  }

  return NextResponse.json({ search });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:saved-searches' } });

export const DELETE = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('saved-searches') + 1];

  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    logger.error('Error deleting saved search', { error });
    return NextResponse.json({ error: 'Failed to delete saved search' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:saved-searches' } });
