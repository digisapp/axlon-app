import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkIsAdmin, logAdminAction } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { logger } from '@/lib/logger';

/**
 * Apex host only: lowercase, no scheme, port, path or leading `www.` — the same
 * shape the DB CHECK enforces and the only shape the proxy resolver can match.
 */
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

const createSchema = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .max(253)
    .refine((d) => DOMAIN_RE.test(d), 'Enter a bare domain like xltrailers.com')
    .refine((d) => !d.startsWith('www.'), 'Enter the apex domain without www.'),
  name: z.string().trim().min(1).max(120),
});

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const limit = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-microsites',
    });
    if (!limit.success) return rateLimitResponse(limit);

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('microsites')
      .select('*, manufacturer:manufacturers(id, name, slug)')
      .order('domain');

    if (error) throw error;
    return NextResponse.json({ microsites: data ?? [] });
  } catch (error) {
    logger.error('Admin microsites list error', { error });
    return NextResponse.json({ error: 'Failed to load microsites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const limit = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-microsites',
    });
    if (!limit.success) return rateLimitResponse(limit);

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { isAdmin, userId } = await checkIsAdmin();
    if (!isAdmin || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const parsed = createSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('microsites')
      .insert({ domain: parsed.data.domain, name: parsed.data.name, status: 'draft' })
      .select('id, domain')
      .single();

    if (error) {
      // 23505: the unique index on LOWER(domain).
      if (error.code === '23505') {
        return NextResponse.json({ error: 'That domain already has a microsite' }, { status: 409 });
      }
      throw error;
    }

    await logAdminAction(userId, 'create', 'microsite', data.id, { domain: data.domain });

    return NextResponse.json({ id: data.id, domain: data.domain }, { status: 201 });
  } catch (error) {
    logger.error('Admin microsite create error', { error });
    return NextResponse.json({ error: 'Failed to create microsite' }, { status: 500 });
  }
}
