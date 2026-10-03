import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { AdminInboxService } from '@/lib/email/admin-inbox';
import { getInboundAddress, isValidEmail } from '@/lib/email/inbound-address';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/inbox/test — send a round-trip test to the signed-in admin.
 *
 * Proves the whole loop, not just sending: the mail goes out through the
 * normal reply path (support From, per-thread Reply-To), so replying to it
 * from the admin's own mailbox must land back in /admin/email under the same
 * conversation. If the reply never shows up, receiving (DNS / webhook) is the
 * part that's broken — see /api/admin/inbox/status.
 */
export const POST = withAdmin(
  async (_request: NextRequest, { user }: AuthContext) => {
    // The admin's real mailbox: ADMIN_EMAIL is where the platform's own
    // notifications already go. The login address is the fallback — it can be
    // on a domain that receives no mail at all.
    const candidates = [process.env.ADMIN_EMAIL, user.email].map((v) => (v || '').trim().toLowerCase());
    const to = candidates.find((v) => isValidEmail(v));
    if (!to) {
      return NextResponse.json({ error: 'No admin email address to send the test to (set ADMIN_EMAIL)' }, { status: 400 });
    }

    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    const bodyText = [
      'This is a test from the Axleyard admin inbox.',
      '',
      'Reply to this email. Your reply should appear in /admin/email within a minute, in the same conversation as this message.',
      '',
      `Replies are routed through ${getInboundAddress()} (per-conversation plus address). If nothing arrives, receiving is not set up yet — the Email page shows what is missing.`,
    ].join('\n');

    const result = await AdminInboxService.sendNewEmail({
      to,
      subject: `Axleyard inbox test · ${stamp}`,
      bodyText,
      userId: user.id,
      test: true,
    });
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true, to, threadId: result.threadId, emailId: result.emailId });
  },
  { rateLimit: { ...RATE_LIMITS.auth, prefix: 'ratelimit:admin:inbox:test' } }
);
