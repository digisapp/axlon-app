import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logAdminAction } from '@/lib/admin/check-admin';
import { AdminInboxService, idList, isBulkAction, isInboxFolder } from '@/lib/email/admin-inbox';
import { checkOutgoingAttachments } from '@/lib/email/compose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET    /api/admin/inbox?folder=inbox|unread|starred|sent|spam&search=&page=&limit=
 * POST   /api/admin/inbox   — compose { to, toName?, subject, bodyText, attachments? } or reply { replyToThreadId, bodyText, attachments? }
 * PUT    /api/admin/inbox   — bulk { ids, action }
 * DELETE /api/admin/inbox   — bulk delete { ids }
 */

export const GET = withAdmin(
  async (request: NextRequest) => {
    const url = new URL(request.url);
    const folderParam = url.searchParams.get('folder') || 'inbox';
    const folder = isInboxFolder(folderParam) ? folderParam : 'inbox';
    const search = (url.searchParams.get('search') || '').slice(0, 200);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10) || 25));

    const [list, counts] = await Promise.all([
      AdminInboxService.listThreads({ folder, search: search || undefined, page, limit }),
      AdminInboxService.getFolderCounts(),
    ]);

    return NextResponse.json({ ...list, folder, counts });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:list' } }
);

export const POST = withAdmin(
  async (request: NextRequest, { user }: AuthContext) => {
    const body = await request.json().catch(() => ({}));
    const to = typeof body.to === 'string' ? body.to : '';
    const toName = typeof body.toName === 'string' ? body.toName : null;
    const subject = typeof body.subject === 'string' ? body.subject : '';
    const bodyText = typeof body.bodyText === 'string' ? body.bodyText : '';
    const replyToThreadId = typeof body.replyToThreadId === 'string' ? body.replyToThreadId : null;

    if (!bodyText.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (!replyToThreadId && (!to.trim() || !subject.trim())) {
      return NextResponse.json({ error: 'To, subject and message are required' }, { status: 400 });
    }
    const files = checkOutgoingAttachments(body.attachments);
    if (!files.ok) return NextResponse.json({ error: files.error }, { status: 400 });

    const result = await AdminInboxService.sendNewEmail({
      to,
      toName,
      subject: subject || undefined,
      bodyText,
      replyToThreadId,
      userId: user.id,
      attachments: files.files,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    logAdminAction(user.id, replyToThreadId ? 'inbox_reply' : 'inbox_send', 'email_thread', result.threadId, {
      emailId: result.emailId,
      to: to.trim().toLowerCase() || undefined,
      subject: subject.trim().slice(0, 200) || undefined,
      attachments: files.files.map((f) => f.filename),
    }).catch(() => { /* audit is best-effort */ });

    return NextResponse.json({ success: true, emailId: result.emailId, threadId: result.threadId });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:send' } }
);

export const PUT = withAdmin(
  async (request: NextRequest) => {
    const body = await request.json().catch(() => ({}));
    const ids = idList(body.ids);
    if (!ids) return NextResponse.json({ error: 'ids must be 1–200 conversation ids' }, { status: 400 });
    if (!isBulkAction(body.action)) return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    await AdminInboxService.bulk(body.action, ids);
    return NextResponse.json({ success: true, count: ids.length });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:bulk' } }
);

export const DELETE = withAdmin(
  async (request: NextRequest, { user }: AuthContext) => {
    const body = await request.json().catch(() => ({}));
    const ids = idList(body.ids);
    if (!ids) return NextResponse.json({ error: 'ids must be 1–200 conversation ids' }, { status: 400 });
    await AdminInboxService.bulk('delete', ids);
    logAdminAction(user.id, 'inbox_delete', 'email_thread', ids[0], { ids }).catch(() => {});
    return NextResponse.json({ success: true, deleted: ids.length });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:delete' } }
);
