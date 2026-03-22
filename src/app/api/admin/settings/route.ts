import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';

/**
 * GET /api/admin/settings?key=ai_auto_reply_enabled — Get a setting
 * PUT /api/admin/settings — Upsert a setting { key, value }
 */

export const GET = withAdmin(
  async (request: NextRequest, { supabase }: AuthContext) => {
    const key = new URL(request.url).searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      return NextResponse.json({ value: null });
    }

    return NextResponse.json({ value: data.value });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:settings:get' } }
);

export const PUT = withAdmin(
  async (request: NextRequest, { supabase }: AuthContext) => {
    const { key, value } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    const { error } = await supabase
      .from('platform_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:settings:put' } }
);
