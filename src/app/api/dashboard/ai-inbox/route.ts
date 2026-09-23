import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { enforceFeature } from '@/lib/entitlements';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { Resend } from 'resend';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { escapeHtml } from '@/lib/utils/html-escape';

const actionSchema = z.object({
  action: z.enum(['approve', 'reject', 'edit', 'feedback']),
  edited_subject: z.string().max(200).optional(),
  edited_draft: z.string().max(10000).optional(),
  feedback: z.enum(['positive', 'negative']).optional(),
  feedback_note: z.string().max(500).optional(),
});

export const GET = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'aiInbox');
  if (gateError) return gateError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  let query = supabase
    .from('ai_inbox_items')
    .select('*, lead:leads(buyer_name, buyer_email, listing_id, score, priority)')
    .eq('dealer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status === 'sent') {
    // 'sent' tab = items that were approved or edited (both result in email being sent)
    query = query.in('status', ['approved', 'edited']);
  } else if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) {
    logger.error('Error fetching AI inbox', { error });
    return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 });
  }

  // Counts for badge/tabs
  const { data: counts } = await supabase
    .from('ai_inbox_items')
    .select('status')
    .eq('dealer_id', user.id);

  const rawSummary = (counts || []).reduce((acc: Record<string, number>, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  // Merge approved + edited into 'sent' for the tab badge
  const summary = {
    ...rawSummary,
    sent: (rawSummary.approved || 0) + (rawSummary.edited || 0),
  };

  return NextResponse.json({ items: data, summary });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:ai-inbox-get' } });

export const PATCH = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'aiInbox');
  if (gateError) return gateError;

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const body = await request.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
  }

  const { action, edited_subject, edited_draft, feedback, feedback_note } = parsed.data;

  // Fetch the inbox item
  const { data: item, error: fetchError } = await supabase
    .from('ai_inbox_items')
    .select('*')
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (fetchError || !item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  if (action === 'feedback') {
    const { data, error } = await supabase
      .from('ai_inbox_items')
      .update({ feedback, feedback_note, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  }

  // Approve/edit/reject only make sense for a draft still awaiting review.
  // Without this, a second Approve (another tab, a stale list, a retried
  // request) emailed the buyer the same reply again.
  if (item.status !== 'pending') {
    return NextResponse.json({ error: 'This draft has already been handled' }, { status: 409 });
  }

  if (action === 'reject') {
    const { data, error } = await supabase
      .from('ai_inbox_items')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  }

  // approve or edit — both send the email
  const finalSubject = (action === 'edit' && edited_subject) ? edited_subject : item.ai_subject;
  const finalDraft = (action === 'edit' && edited_draft) ? edited_draft : item.ai_draft;
  const finalHtml = (action === 'edit' && edited_draft)
    ? buildSimpleHtml(edited_draft, item.from_name)
    : item.ai_draft_html;

  // Claim the send atomically so two concurrent approvals can't both email
  // the buyer: only the request that flips sent_at from NULL proceeds.
  const claimedAt = new Date().toISOString();
  const { data: claimed, error: claimError } = await supabase
    .from('ai_inbox_items')
    .update({ sent_at: claimedAt })
    .eq('id', id)
    .eq('dealer_id', user.id)
    .eq('status', 'pending')
    .is('sent_at', null)
    .select('id');
  if (claimError) throw claimError;
  if (!claimed || claimed.length === 0) {
    return NextResponse.json({ error: 'This draft has already been handled' }, { status: 409 });
  }

  // Get seller profile for reply-to
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, company_name')
    .eq('id', user.id)
    .single();

  try {
    if (process.env.RESEND_API_KEY && item.from_email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `${profile?.company_name || 'AXLON'} via AXLON <leads@axlon.ai>`,
        to: item.from_email,
        replyTo: profile?.email || undefined,
        subject: finalSubject,
        html: finalHtml,
      });
    }
  } catch (sendError) {
    logger.error('Failed to send AI inbox email', { error: sendError });
    // Release the claim so the dealer can retry.
    await supabase
      .from('ai_inbox_items')
      .update({ sent_at: null })
      .eq('id', id)
      .eq('sent_at', claimedAt);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  const updatePayload: Record<string, unknown> = {
    status: action === 'edit' ? 'edited' : 'approved',
    sent_at: claimedAt,
    reviewed_at: new Date().toISOString(),
    feedback: 'positive', // implicit positive feedback for approvals
  };
  if (action === 'edit') {
    updatePayload.edited_subject = finalSubject;
    updatePayload.edited_draft = finalDraft;
  }

  const { data, error } = await supabase
    .from('ai_inbox_items')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json(data);
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:ai-inbox-patch' } });

function buildSimpleHtml(plainText: string, fromName: string): string {
  const bodyHtml = plainText
    .split('\n')
    .map(line => line.trim() === '' ? '<br>' : `<p style="margin:0 0 10px 0;line-height:1.6;color:#1f2937;">${escapeHtml(line)}</p>`)
    .join('');
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:24px;">${bodyHtml}<p style="font-size:12px;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:12px;">Sent via <a href="https://axleyard.com" style="color:#9ca3af;">AXLON AI</a></p></body></html>`;
}
