import { createClient } from '@supabase/supabase-js';

/**
 * Shared Supabase admin client using the service role key.
 * Use this for server-side operations that need to bypass RLS
 * (cron jobs, AI tools, background processing, admin operations).
 *
 * DO NOT use this in client-facing API routes where user auth is needed —
 * use createClient from '@/lib/supabase/server' instead.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
