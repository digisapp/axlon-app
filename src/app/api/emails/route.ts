import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { sendTrackedEmail } from '@/lib/email/resend';

/**
 * GET /api/emails - List email threads for the current user
 * POST /api/emails - Compose a new email (creates thread + sends)
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
      query = query.or(
        `subject.ilike.%${search}%,participant_email.ilike.%${search}%,participant_name.ilike.%${search}%`
      );
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

    // Send via Resend and track
    try {
      const result = await sendTrackedEmail({
        to,
        subject,
        html: html || `<p>${text}</p>`,
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
