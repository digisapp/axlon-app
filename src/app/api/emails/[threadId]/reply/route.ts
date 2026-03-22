import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { sendTrackedEmail } from '@/lib/email/resend';
import { wrapInBrandedTemplate } from '@/lib/ai/email-classifier';

/**
 * POST /api/emails/[threadId]/reply - Reply to an email thread
 */
export const POST = withAdmin(
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

    // Get the last email in thread for reply headers + quoting
    const { data: lastEmail } = await supabase
      .from('emails')
      .select('resend_id, subject, html_body, text_body')
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
      const replyBody = html || `<p>${text}</p>`;
      const quotedOriginal = lastEmail?.html_body || lastEmail?.text_body || '';
      const brandedHtml = wrapInBrandedTemplate(replyBody, quotedOriginal);

      const result = await sendTrackedEmail({
        to: thread.participant_email,
        subject: replySubject,
        html: brandedHtml,
        headers,
        threadId: thread.id,
        userId: user.id,
        supabase,
      });

      // Mark thread as replied
      await supabase.from('email_threads').update({
        status: 'replied',
        updated_at: new Date().toISOString(),
      }).eq('id', threadId);

      return NextResponse.json({ data: { emailId: result.emailId } });
    } catch {
      return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
    }
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:emails:reply' } }
);
