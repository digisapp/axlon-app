import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { sendTrackedEmail } from '@/lib/email/resend';

/**
 * POST /api/emails/[threadId]/reply - Reply to an email thread
 */
export const POST = withAuth(
  async (
    request: NextRequest,
    { user, supabase }: AuthContext
  ) => {
    const threadId = request.url.split('/emails/')[1]?.split('/')[0];
    const body = await request.json();
    const { html, text } = body;

    if (!html && !text) {
      return NextResponse.json(
        { error: 'Missing required field: html or text' },
        { status: 400 }
      );
    }

    // Get thread (RLS ensures owner access)
    const { data: thread, error: threadError } = await supabase
      .from('email_threads')
      .select('*')
      .eq('id', threadId)
      .single();

    if (threadError || !thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    // Get the last email in thread for reply headers
    const { data: lastEmail } = await supabase
      .from('emails')
      .select('resend_id, subject')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const replySubject = `Re: ${thread.subject}`;
    const headers: Record<string, string> = {};
    if (lastEmail?.resend_id) {
      headers['In-Reply-To'] = `<${lastEmail.resend_id}>`;
      headers['References'] = `<${lastEmail.resend_id}>`;
    }

    try {
      const result = await sendTrackedEmail({
        to: thread.participant_email,
        subject: replySubject,
        html: html || `<p>${text}</p>`,
        headers,
        threadId: thread.id,
        userId: user.id,
        supabase,
      });

      return NextResponse.json({ data: { emailId: result.emailId } });
    } catch {
      return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
    }
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:reply' } }
);
