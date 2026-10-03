import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logAdminAction } from '@/lib/admin/check-admin';
import { AdminInboxService, htmlToText, isUuid } from '@/lib/email/admin-inbox';
import { replySubject } from '@/lib/email/inbound-address';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET    /api/admin/inbox/[id]  — one conversation with all its emails
 * PATCH  /api/admin/inbox/[id]  — { isRead | isStarred | isSpam } flags, or
 *                                 { useAiDraft: true, emailId } to send the AI draft
 * DELETE /api/admin/inbox/[id]
 */

export const GET = withAdmin(
  async (_request: NextRequest, { params }: AuthContext) => {
    const { id } = await params;
    if (!isUuid(id)) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    const data = await AdminInboxService.getThread(id);
    if (!data) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    return NextResponse.json(data);
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:thread' } }
);

export const PATCH = withAdmin(
  async (request: NextRequest, { user, params }: AuthContext) => {
    const { id } = await params;
    if (!isUuid(id)) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    const body = await request.json().catch(() => ({}));

    if (body.useAiDraft) {
      if (!isUuid(body.emailId)) return NextResponse.json({ error: 'emailId is required' }, { status: 400 });
      const email = await AdminInboxService.getEmail(body.emailId);
      if (!email || email.thread_id !== id) return NextResponse.json({ error: 'Email not found' }, { status: 404 });
      if (email.direction !== 'inbound') return NextResponse.json({ error: 'Only inbound mail has a draft' }, { status: 400 });
      if (!email.ai_draft_html && !email.ai_draft_text) return NextResponse.json({ error: 'No AI draft available' }, { status: 400 });
      if (email.status === 'replied') return NextResponse.json({ error: 'This email was already answered' }, { status: 409 });

      // Always sent as text rebuilt into our own markup — model-written HTML is never mailed out.
      const result = await AdminInboxService.sendNewEmail({
        subject: replySubject(email.subject),
        bodyText: email.ai_draft_text?.trim() || htmlToText(email.ai_draft_html),
        replyToThreadId: id,
        userId: user.id,
      });
      if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });

      logAdminAction(user.id, 'inbox_send_ai_draft', 'email_thread', id, { emailId: result.emailId, inReplyTo: email.id }).catch(() => {});
      return NextResponse.json({ success: true, sent: true, emailId: result.emailId });
    }

    const flags: Array<[string, (_v: boolean) => Promise<void>]> = [
      ['isRead', (v) => AdminInboxService.markRead(id, v)],
      ['isStarred', (v) => AdminInboxService.setStar(id, v)],
      ['isSpam', (v) => AdminInboxService.setSpam(id, v)],
    ];
    let touched = 0;
    for (const [key, apply] of flags) {
      if (typeof body[key] === 'boolean') {
        await apply(body[key]);
        touched++;
      }
    }
    if (touched === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    return NextResponse.json({ success: true });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:patch' } }
);

export const DELETE = withAdmin(
  async (_request: NextRequest, { user, params }: AuthContext) => {
    const { id } = await params;
    if (!isUuid(id)) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    await AdminInboxService.deleteThread(id);
    logAdminAction(user.id, 'inbox_delete', 'email_thread', id).catch(() => {});
    return NextResponse.json({ success: true });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:delete-one' } }
);
