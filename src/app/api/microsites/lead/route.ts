import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { escapeHtml } from '@/lib/utils/html-escape';
import { getResend } from '@/lib/email/resend';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

const FALLBACK_LEAD_EMAIL = process.env.ADMIN_EMAIL || 'sales@axlon.ai';

const leadSchema = z.object({
  microsite_id: z.string().uuid(),
  buyer_name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  buyer_email: z.string().email('Enter a valid email address').max(200),
  buyer_phone: z.string().max(20).nullish(),
  message: z.string().max(2000).nullish(),
  product_interest: z.string().max(200).nullish(),
  timeframe: z.string().max(60).nullish(),
  landing_path: z.string().max(512).nullish(),
  referrer: z.string().max(1000).nullish(),
  session_id: z.string().max(64).nullish(),
  utm_source: z.string().max(200).nullish(),
  utm_medium: z.string().max(200).nullish(),
  utm_campaign: z.string().max(200).nullish(),
  utm_term: z.string().max(200).nullish(),
  utm_content: z.string().max(200).nullish(),
});

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const limit = await checkRateLimit(identifier, {
      ...RATE_LIMITS.leads,
      prefix: 'ratelimit:ms-lead',
    });
    if (!limit.success) return rateLimitResponse(limit);

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const parsed = leadSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }
    const input = parsed.data;

    // Service role: the submitter is anonymous, and the row belongs to whoever
    // the microsite routes leads to. Rate-limited, CSRF-checked and validated
    // above.
    const supabase = createAdminClient();

    const { data: site } = await supabase
      .from('microsites')
      .select('id, name, domain, status, lead_recipient_email, assigned_user_id')
      .eq('id', input.microsite_id)
      .maybeSingle();

    if (!site || site.status !== 'live') {
      return NextResponse.json({ error: 'This form is not accepting submissions.' }, { status: 400 });
    }

    // Timeframe is a qualifier, not its own column — fold it into the message
    // so it reaches whoever works the lead.
    const messageParts = [input.message?.trim(), input.timeframe ? `Timeframe: ${input.timeframe}` : null]
      .filter(Boolean);

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        microsite_id: site.id,
        user_id: site.assigned_user_id,
        source: 'microsite',
        status: 'new',
        buyer_name: input.buyer_name.trim(),
        buyer_email: input.buyer_email.trim().toLowerCase(),
        buyer_phone: input.buyer_phone?.trim() || null,
        message: messageParts.length ? messageParts.join('\n\n') : null,
        product_interest: input.product_interest?.trim() || null,
        landing_path: input.landing_path || null,
        referrer: input.referrer || null,
        session_id: input.session_id || null,
        utm_source: input.utm_source || null,
        utm_medium: input.utm_medium || null,
        utm_campaign: input.utm_campaign || null,
      })
      .select('id')
      .single();

    if (error) {
      logger.error('Microsite lead insert failed', { error, micrositeId: site.id });
      return NextResponse.json({ error: 'Could not submit your request. Please try again.' }, { status: 500 });
    }

    // Notify. A failed email must not fail the submission — the lead is
    // already saved and visible in /admin/leads.
    const recipient = site.lead_recipient_email || FALLBACK_LEAD_EMAIL;
    try {
      const rows: [string, string | null][] = [
        ['Name', input.buyer_name],
        ['Email', input.buyer_email],
        ['Phone', input.buyer_phone ?? null],
        ['Trailer', input.product_interest ?? null],
        ['Timeframe', input.timeframe ?? null],
        ['Page', input.landing_path ?? null],
        ['Campaign', input.utm_campaign ?? input.utm_source ?? null],
      ];

      const html = `
        <h2>New lead from ${escapeHtml(site.name)}</h2>
        <p><strong>${escapeHtml(site.domain)}</strong></p>
        <table cellpadding="6" style="border-collapse:collapse">
          ${rows
            .filter(([, v]) => v)
            .map(
              ([label, value]) =>
                `<tr><td style="border:1px solid #e5e7eb"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(String(value))}</td></tr>`
            )
            .join('')}
        </table>
        ${input.message ? `<p><strong>Message</strong><br>${escapeHtml(input.message).replace(/\n/g, '<br>')}</p>` : ''}
        <p><a href="https://axleyard.com/admin/leads">Open in admin</a></p>
      `;

      await getResend().emails.send({
        from: 'Axleyard Leads <leads@axlon.ai>',
        to: recipient,
        replyTo: input.buyer_email,
        subject: `New lead: ${input.buyer_name} — ${site.name}`,
        html,
      });
    } catch (emailError) {
      logger.error('Microsite lead notification failed', { emailError, leadId: lead.id });
    }

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    logger.error('Microsite lead error', { error });
    return NextResponse.json({ error: 'Could not submit your request. Please try again.' }, { status: 500 });
  }
}
