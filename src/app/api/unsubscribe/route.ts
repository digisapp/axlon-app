import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limit';
import { normalizeEmail, verifyUnsubscribeToken } from '@/lib/email/unsubscribe-token';
import { suppressEmail } from '@/lib/email/suppression';

/**
 * Unsubscribe endpoint.
 *
 * Auth model: a valid HMAC token (embedded in every outbound email — see
 * src/lib/email/unsubscribe-token.ts) proves the caller received mail at
 * that address. No CSRF is required because the token itself is the
 * credential and is not guessable; requiring CSRF here would break RFC 8058
 * one-click unsubscribes from Gmail/Yahoo, which POST with no cookies.
 *
 * Accepted inputs:
 * - Query string `?email=..&token=..` — RFC 8058 one-click clients POST the
 *   form body `List-Unsubscribe=One-Click` to the List-Unsubscribe URL, so
 *   the identifying params must live in the URL.
 * - JSON body `{ email, token }` — used by the /unsubscribe page.
 */

interface UnsubscribeParams {
  email: string | null;
  token: string | null;
}

async function extractParams(request: NextRequest): Promise<UnsubscribeParams> {
  const sp = request.nextUrl.searchParams;
  let email = sp.get('email');
  let token = sp.get('token');

  if (!email || !token) {
    try {
      const body = await request.json();
      if (!email && typeof body?.email === 'string') email = body.email;
      if (!token && typeof body?.token === 'string') token = body.token;
    } catch {
      // Non-JSON body (e.g. one-click form-encoded "List-Unsubscribe=One-Click")
      // — params must come from the query string in that case.
    }
  }

  return { email, token };
}

async function processUnsubscribe(email: string): Promise<void> {
  const supabase = createAdminClient();

  // (0) Durable opt-out: record the address so future marketing sends are
  // suppressed even if a new drip/digest is enqueued later.
  await suppressEmail(email, 'unsubscribe');

  // (i) If a profile exists, turn off its email preferences. Match
  // case-insensitively — a profile stored with any uppercase (imported/edited)
  // would otherwise keep receiving alerts after a "successful" unsubscribe.
  // Escape LIKE metacharacters (_ and %) so an address containing them can't
  // match a different profile.
  const emailPattern = email.replace(/([\\%_])/g, '\\$1');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .ilike('email', emailPattern)
    .maybeSingle();
  if (profileError) {
    logger.error('Unsubscribe: profile lookup failed', { error: profileError });
  }

  if (profile) {
    const { error: reportsError } = await supabase
      .from('dealer_ai_settings')
      .update({ market_reports_enabled: false })
      .eq('dealer_id', profile.id);
    if (reportsError) {
      logger.error('Unsubscribe: failed to disable market reports', { error: reportsError });
    }

    const { error: alertsError } = await supabase
      .from('saved_searches')
      .update({ notify_email: false })
      .eq('user_id', profile.id);
    if (alertsError) {
      logger.error('Unsubscribe: failed to disable saved-search alerts', { error: alertsError });
    }
  }

  // (ii) Cancel pending follow-up drips regardless of profile — drip
  // recipients are anonymous chat visitors who usually have NO profile.
  // First: queue rows addressed directly to this email (ilike = case-insensitive
  // exact match; addresses were stored as typed by the visitor).
  const { error: queueError } = await supabase
    .from('lead_followup_queue')
    .update({ status: 'cancelled' })
    .eq('status', 'pending')
    .ilike('email_to', email);
  if (queueError) {
    logger.error('Unsubscribe: failed to cancel follow-ups by email_to', { error: queueError });
  }

  // Second: queue rows tied to leads captured with this email (covers rows
  // whose email_to was never populated). Column is visitor_email — NOT email.
  const { data: leads, error: leadsError } = await supabase
    .from('dealer_ai_leads')
    .select('id')
    .ilike('visitor_email', email);
  if (leadsError) {
    logger.error('Unsubscribe: lead lookup failed', { error: leadsError });
  }

  if (leads && leads.length > 0) {
    const { error: cancelError } = await supabase
      .from('lead_followup_queue')
      .update({ status: 'cancelled' })
      .eq('status', 'pending')
      .in('lead_id', leads.map((l) => l.id));
    if (cancelError) {
      logger.error('Unsubscribe: failed to cancel follow-ups by lead', { error: cancelError });
    }
  }

  // Note: dealer_ai_leads has no unsubscribed column/status (017 CHECK allows
  // new/contacted/qualified/converted/lost), so leads themselves are untouched.

  logger.info('User unsubscribed', { email });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: max 5 unsubscribe attempts per IP per minute to prevent bulk attacks
    const identifier = getClientIdentifier(request);
    const rl = await checkRateLimit(identifier, { limit: 5, windowSeconds: 60, prefix: 'ratelimit:unsubscribe' });
    if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const { email, token } = await extractParams(request);

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!token || !verifyUnsubscribeToken(email, token)) {
      return NextResponse.json(
        { error: 'Invalid or missing unsubscribe token. Please use the link from an AXLON email.' },
        { status: 403 }
      );
    }

    await processUnsubscribe(normalizeEmail(email));

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Unsubscribe error', { error });
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}

/**
 * Mail clients that don't support RFC 8058 present the List-Unsubscribe URL
 * as a plain link — send those browsers to the confirmation page.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const target = new URL('/unsubscribe', request.nextUrl.origin);
  const email = sp.get('email');
  const token = sp.get('token');
  if (email) target.searchParams.set('email', email);
  if (token) target.searchParams.set('token', token);
  return NextResponse.redirect(target);
}
