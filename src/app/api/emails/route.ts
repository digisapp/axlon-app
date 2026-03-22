import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { sendTrackedEmail } from '@/lib/email/resend';

import { wrapInBrandedTemplate } from '@/lib/ai/email-classifier';

/**
 * GET /api/emails - List email threads
 * POST /api/emails - Compose a new email (creates thread + sends)
 * DELETE /api/emails - Delete emails/threads (single or bulk)
 * PATCH /api/emails - Bulk actions (mark read, etc.)
 */

export const GET = withAdmin(
  async (request: NextRequest, { user, supabase }: AuthContext) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'open';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 30;
    const offset = (page - 1) * limit;

    // For "inbox" (received) we show threads with inbound replies
    // For "sent" (open) we show all outbound threads
    // Also support archived/trash
    let query = supabase
      .from('email_threads')
      .select('*', { count: 'exact' })
      .eq('owner_id', user.id);

    if (status === 'received') {
      // Inbox: threads that have received an inbound reply
      query = query.in('status', ['received', 'read']);
    } else if (status === 'open') {
      // Sent: threads we sent (open or replied)
      query = query.in('status', ['open', 'replied']);
    } else {
      query = query.eq('status', status);
    }

    query = query
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      // Sanitize search input — escape PostgREST special characters
      const sanitized = search.replace(/[%_,().*]/g, '');
      if (sanitized) {
        query = query.or(
          `subject.ilike.%${sanitized}%,participant_email.ilike.%${sanitized}%,participant_name.ilike.%${sanitized}%`
        );
      }
    }

    const { data: threads, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: threads,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:list' } }
);

export const POST = withAdmin(
  async (request: NextRequest, { user, supabase }: AuthContext) => {
    const body = await request.json();
    const { to, subject, html, text, listingId, leadId } = body;

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and html or text' },
        { status: 400 }
      );
    }

    // Create thread
    const { data: thread, error: threadError } = await supabase
      .from('email_threads')
      .insert({
        subject,
        owner_id: user.id,
        participant_email: to,
        participant_name: body.toName || null,
        listing_id: listingId || null,
        lead_id: leadId || null,
      })
      .select('id')
      .single();

    if (threadError) {
      return NextResponse.json({ error: threadError.message }, { status: 500 });
    }

    // Wrap in branded template
    const brandedHtml = wrapInBrandedTemplate(html || `<p>${text}</p>`);

    // Send via Resend and track
    try {
      const result = await sendTrackedEmail({
        to,
        subject,
        html: brandedHtml,
        threadId: thread.id,
        userId: user.id,
        supabase,
      });

      return NextResponse.json({ data: { threadId: thread.id, emailId: result.emailId } });
    } catch (error) {
      // Clean up thread on send failure
      await supabase.from('email_threads').delete().eq('id', thread.id);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:send' } }
);

/**
 * DELETE /api/emails - Delete email(s) or thread(s)
 * Body: { emailIds?: string[], threadIds?: string[] }
 */
export const DELETE = withAdmin(
  async (request: NextRequest, { supabase }: AuthContext) => {
    const body = await request.json();
    const { emailIds, threadIds } = body;

    if (threadIds?.length) {
      // Delete threads (cascade deletes emails)
      const { error } = await supabase
        .from('email_threads')
        .delete()
        .in('id', threadIds);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (emailIds?.length) {
      const { error } = await supabase
        .from('emails')
        .delete()
        .in('id', emailIds);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (!threadIds?.length && !emailIds?.length) {
      return NextResponse.json({ error: 'Provide emailIds or threadIds' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:delete' } }
);

/**
 * PATCH /api/emails - Bulk actions on threads
 * Body: { threadIds: string[], action: 'mark_read' | 'mark_unread' | 'archive' | 'restore' }
 */
export const PATCH = withAdmin(
  async (request: NextRequest, { supabase }: AuthContext) => {
    const body = await request.json();
    const { threadIds, action } = body;

    if (!threadIds?.length || !action) {
      return NextResponse.json({ error: 'Provide threadIds and action' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    switch (action) {
      case 'mark_read':
        updates.is_unread = false;
        break;
      case 'mark_unread':
        updates.is_unread = true;
        break;
      case 'archive':
        updates.status = 'archived';
        break;
      case 'restore':
        updates.status = 'open';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { error } = await supabase
      .from('email_threads')
      .update(updates)
      .in('id', threadIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also mark individual emails as read for mark_read action
    if (action === 'mark_read') {
      await supabase
        .from('emails')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('thread_id', threadIds)
        .eq('is_read', false);
    }

    return NextResponse.json({ success: true });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:bulk' } }
);
