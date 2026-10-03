import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { AdminInboxService, isUuid } from '@/lib/email/admin-inbox';
import { getResendOrNull } from '@/lib/email/resend';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/inbox/[id]/attachments/[attachmentId]?email=<emailId>
 *
 * Attachment bytes never touch our storage: Resend keeps them with the
 * received email and hands out a short-lived download URL. We look the
 * attachment up (admin-only, only ids we recorded from the webhook) and
 * redirect to that URL.
 */
export const GET = withAdmin(
  async (request: NextRequest, { params }: AuthContext) => {
    const { id, attachmentId } = await params;
    const emailId = new URL(request.url).searchParams.get('email');
    if (!isUuid(id) || !isUuid(emailId) || !attachmentId) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    const resend = getResendOrNull();
    if (!resend) return NextResponse.json({ error: 'Resend is not configured' }, { status: 503 });

    const email = await AdminInboxService.getEmail(emailId);
    if (!email || email.thread_id !== id || email.direction !== 'inbound' || !email.resend_id) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }
    const known = (email.attachments ?? []).some((a) => a.id === attachmentId);
    if (!known) return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });

    const { data, error } = await resend.emails.receiving.attachments.get({ emailId: email.resend_id, id: attachmentId });
    if (error || !data?.download_url) {
      logger.error('Inbox: attachment lookup failed', { error: error?.message, emailId, attachmentId });
      return NextResponse.json({ error: 'Attachment is no longer available' }, { status: 502 });
    }

    return NextResponse.redirect(data.download_url, { status: 302, headers: { 'Cache-Control': 'no-store' } });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:attachment' } }
);
