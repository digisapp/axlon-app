import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export const PATCH = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('saved-searches') + 1];

  const body = await request.json();
  const { name, notify_email, notify_frequency } = body;

  const { data: search, error } = await supabase
    .from('saved_searches')
    .update({
      name,
      notify_email,
      notify_frequency,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating saved search', { error });
    return NextResponse.json({ error: 'Failed to update saved search' }, { status: 500 });
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
