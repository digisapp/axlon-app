import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { Webhook } from 'svix';

/**
 * Resend Inbound Email Webhook — /api/webhooks/resend
 *
 * Receives inbound emails from Resend when someone replies to an email
 * sent from axlon.ai. Auto-threads using In-Reply-To/References headers
 * or falls back to sender matching.
 *
 * Setup:
 * 1. Add MX records for your domain pointing to Resend
 * 2. Configure inbound webhook URL in Resend dashboard: /api/webhooks/resend
 * 3. Set RESEND_WEBHOOK_SECRET env var with the signing secret from Resend
 */

interface ResendInboundPayload {
  type: 'email.received';
  data: {
    id: string;
    from: string;
    to: string[];
    subject: string;
    html?: string;
    text?: string;
    reply_to?: string;
    headers: Array<{ name: string; value: string }>;
    created_at: string;
  };
}

function parseEmailAddress(raw: string): { email: string; name: string | null } {
  const match = raw.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim().replace(/^["']|["']$/g, ''), email: match[2].trim() };
  }
  return { name: null, email: raw.trim() };
}

function extractHeader(headers: Array<{ name: string; value: string }>, name: string): string | null {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header?.value || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
      const svixId = request.headers.get('svix-id');
      const svixTimestamp = request.headers.get('svix-timestamp');
      const svixSignature = request.headers.get('svix-signature');

      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
      }

      try {
        const wh = new Webhook(webhookSecret);
        wh.verify(body, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        });
      } catch {
        logger.error('Webhook signature verification failed');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload: ResendInboundPayload = JSON.parse(body);

    if (payload.type !== 'email.received') {
      return NextResponse.json({ received: true });
    }

    const { data } = payload;
    const sender = parseEmailAddress(data.from);
    const inReplyTo = extractHeader(data.headers, 'in-reply-to');
    const references = extractHeader(data.headers, 'references');

    const supabase = createAdminClient();

    // --- Thread matching (3-tier) ---

    let threadId: string | null = null;

    // 1. Match by In-Reply-To / References header → resend_id
    const messageIds = [inReplyTo, ...(references?.split(/\s+/) || [])]
      .filter(Boolean)
      .map(id => id!.replace(/[<>]/g, ''));

    if (messageIds.length > 0) {
      const { data: existingEmail } = await supabase
        .from('emails')
        .select('thread_id')
        .in('resend_id', messageIds)
        .limit(1)
        .single();

      if (existingEmail) {
        threadId = existingEmail.thread_id;
      }
    }

    // 2. Match by sender email + normalized subject
    if (!threadId) {
      const normalizedSubject = data.subject.replace(/^(Re|Fwd|Fw):\s*/gi, '').trim();
      const { data: existingThread } = await supabase
        .from('email_threads')
        .select('id')
        .eq('participant_email', sender.email)
        .ilike('subject', `%${normalizedSubject}%`)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .single();

      if (existingThread) {
        threadId = existingThread.id;
      }
    }

    // 3. Match by sender email alone (most recent thread)
    if (!threadId) {
      const { data: existingThread } = await supabase
        .from('email_threads')
        .select('id')
        .eq('participant_email', sender.email)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .single();

      if (existingThread) {
        threadId = existingThread.id;
      }
    }

    // --- Determine owner ---
    let ownerId: string | null = null;

    if (threadId) {
      const { data: thread } = await supabase
        .from('email_threads')
        .select('owner_id')
        .eq('id', threadId)
        .single();
      ownerId = thread?.owner_id || null;
    }

    if (!ownerId) {
      // Default to first admin
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true)
        .limit(1)
        .single();
      ownerId = adminProfile?.id || null;
    }

    if (!ownerId) {
      logger.error('No owner found for inbound email', { from: sender.email });
      return NextResponse.json({ error: 'No owner found' }, { status: 422 });
    }

    // --- Create thread if needed ---
    if (!threadId) {
      const { data: newThread, error: threadError } = await supabase
        .from('email_threads')
        .insert({
          subject: data.subject.replace(/^(Re|Fwd|Fw):\s*/gi, '').trim(),
          owner_id: ownerId,
          participant_email: sender.email,
          participant_name: sender.name,
          is_unread: true,
          status: 'received',
        })
        .select('id')
        .single();

      if (threadError) {
        logger.error('Failed to create email thread', { error: threadError });
        return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
      }
      threadId = newThread.id;
    } else {
      // Update existing thread status
      await supabase
        .from('email_threads')
        .update({ is_unread: true, status: 'received' })
        .eq('id', threadId);
    }

    // --- Store inbound email ---
    const { error: emailError } = await supabase.from('emails').insert({
      thread_id: threadId,
      resend_id: data.id,
      direction: 'inbound',
      from_email: sender.email,
      from_name: sender.name,
      to_email: data.to[0],
      subject: data.subject,
      html_body: data.html || null,
      text_body: data.text || null,
      status: 'received',
      is_read: false,
      headers: Object.fromEntries(data.headers.map(h => [h.name, h.value])),
    });

    if (emailError) {
      logger.error('Failed to store inbound email', { error: emailError });
      return NextResponse.json({ error: 'Failed to store email' }, { status: 500 });
    }

    logger.info('Inbound email stored', { threadId, from: sender.email });
    return NextResponse.json({ success: true, threadId });
  } catch (error) {
    logger.error('Inbound webhook error', { error });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
