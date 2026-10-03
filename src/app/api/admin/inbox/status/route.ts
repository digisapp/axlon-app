import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logAdminAction } from '@/lib/admin/check-admin';
import { enableReceiving, getInboxStatus } from '@/lib/email/inbox-status';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/inbox/status[?fresh=1] — can this inbox receive mail right now? */
export const GET = withAdmin(
  async (request: NextRequest) => {
    const fresh = new URL(request.url).searchParams.get('fresh') === '1';
    const status = await getInboxStatus({ fresh });
    return NextResponse.json(status);
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:status' } }
);

/**
 * POST /api/admin/inbox/status — turn receiving on for the inbound domain in
 * Resend. Only works once the MX record is live in public DNS.
 */
export const POST = withAdmin(
  async (_request: NextRequest, { user }: AuthContext) => {
    const result = await enableReceiving();
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });
    // target_id is a UUID column: the acting admin, with the domain in details.
    logAdminAction(user.id, 'inbox_enable_receiving', 'resend_domain', user.id, { domain: result.status.inboundDomain }).catch(() => {});
    return NextResponse.json(result.status);
  },
  { rateLimit: { ...RATE_LIMITS.auth, prefix: 'ratelimit:admin:inbox:enable-receiving' } }
);
