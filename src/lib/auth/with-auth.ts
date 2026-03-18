import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseClient, User } from '@supabase/supabase-js';
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMITS,
  rateLimitResponse,
} from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export interface AuthContext {
  user: User;
  supabase: SupabaseClient;
}

interface RateLimitOption {
  limit: number;
  windowSeconds: number;
  prefix: string;
}

interface WithAuthOptions {
  rateLimit?: RateLimitOption;
}

/**
 * Wraps an API route handler with rate limiting + user authentication.
 * Eliminates the repeated boilerplate of:
 *   1. Rate limit check
 *   2. createClient()
 *   3. supabase.auth.getUser()
 *   4. 401 if not authenticated
 *
 * Usage:
 *   export const GET = withAuth(async (request, { user, supabase }) => {
 *     // user is guaranteed to exist here
 *     return NextResponse.json({ userId: user.id });
 *   }, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:my-route' } });
 */
export function withAuth(
  handler: (request: NextRequest, ctx: AuthContext) => Promise<NextResponse>,
  options: WithAuthOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Rate limiting
      if (options.rateLimit) {
        const identifier = getClientIdentifier(request);
        const result = await checkRateLimit(identifier, options.rateLimit);
        if (!result.success) {
          return rateLimitResponse(result);
        }
      }

      // Authentication
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      return await handler(request, { user, supabase });
    } catch (error) {
      logger.error('API route error', { error, url: request.url });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

/**
 * Wraps an API route handler with rate limiting + admin authentication.
 * Checks both user auth and is_admin flag in profiles table.
 *
 * Usage:
 *   export const GET = withAdmin(async (request, { user, supabase }) => {
 *     return NextResponse.json({ admin: true });
 *   }, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin' } });
 */
export function withAdmin(
  handler: (request: NextRequest, ctx: AuthContext) => Promise<NextResponse>,
  options: WithAuthOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Rate limiting
      if (options.rateLimit) {
        const identifier = getClientIdentifier(request);
        const result = await checkRateLimit(identifier, options.rateLimit);
        if (!result.success) {
          return rateLimitResponse(result);
        }
      }

      // Authentication
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Admin check
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      return await handler(request, { user, supabase });
    } catch (error) {
      logger.error('Admin API route error', { error, url: request.url });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
