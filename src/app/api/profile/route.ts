import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export const GET = withAuth(async (request, { user, supabase }) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, company_name, email, phone, location, avatar_url, is_business')
    .eq('id', user.id)
    .single();

  if (error) {
    logger.error('Failed to fetch profile', { error, userId: user.id });
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }

  return NextResponse.json(profile || {});
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:profile' } });
