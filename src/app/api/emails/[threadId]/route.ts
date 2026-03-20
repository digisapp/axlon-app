import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';

/**
 * GET /api/emails/[threadId] - Get thread details with all emails
 * PATCH /api/emails/[threadId] - Update thread (archive, mark read, etc)
 */

export const GET = withAdmin(
  async (
    request: NextRequest,
    { user, supabase }: AuthContext
  ) => {
    const threadId = request.url.split('/emails/')[1]?.split('/')[0]?.split('?')[0];

    // Get thread (RLS ensures owner access)
    const { data: thread, error: threadError } = await supabase
      .from('email_threads')
      .select('*')
      .eq('id', threadId)
      .single();

    if (threadError || !thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    // Get all emails in thread
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (emailsError) {
      return NextResponse.json({ error: emailsError.message }, { status: 500 });
    }

    // Mark thread and emails as read
    await supabase
      .from('email_threads')
      .update({ is_unread: false })
      .eq('id', threadId);

    await supabase
      .from('emails')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('thread_id', threadId)
      .eq('is_read', false);

    return NextResponse.json({ data: { thread, emails } });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:thread' } }
);

export const PATCH = withAdmin(
  async (
    request: NextRequest,
    { user, supabase }: AuthContext
  ) => {
    const threadId = request.url.split('/emails/')[1]?.split('/')[0]?.split('?')[0];
    const body = await request.json();

    const allowedFields: Record<string, boolean> = {
      status: true,
      is_unread: true,
    };

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields[key]) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data: thread, error } = await supabase
      .from('email_threads')
      .update(updates)
      .eq('id', threadId)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: thread });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:update' } }
);
