import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/config';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { logger } from '@/lib/logger';

/**
 * Create a Stripe Billing Portal session so subscribers can self-serve manage
 * their plan (update card, cancel, view invoices). Returns { url } to redirect to.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  const rl = await checkRateLimit(getClientIdentifier(request), {
    ...RATE_LIMITS.auth,
    prefix: 'ratelimit:stripe-portal',
  });
  if (!rl.success) return rateLimitResponse(rl);

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No billing account found for this user.' },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai';
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/dashboard/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error('Stripe billing portal error', { error, userId: user.id });
    return NextResponse.json(
      { error: 'Could not open the billing portal. Please try again.' },
      { status: 502 }
    );
  }
}
