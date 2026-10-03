import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { AdminInboxService } from '@/lib/email/admin-inbox';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/inbox/unread — unread, non-spam conversations. */
export const GET = withAdmin(
  async () => {
    const count = await AdminInboxService.getUnreadCount();
    return NextResponse.json({ count });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:unread' } }
);
