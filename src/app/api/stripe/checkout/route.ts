import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe, PRICING } from '@/lib/stripe/config';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, stripeCheckoutSchema } from '@/lib/validations/api';

function isAllowedRedirect(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai');
    return parsed.hostname === appUrl.hostname;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.auth,
      prefix: 'ratelimit:stripe',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const rawBody = await request.json();
    let validatedData;
    try {
      validatedData = validateBody(stripeCheckoutSchema, rawBody);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }
    const { product, listingId, successUrl, cancelUrl } = validatedData;

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    const stripe = getStripe();

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Determine pricing based on product
    let lineItems;
    let mode: 'payment' | 'subscription' = 'payment';

    switch (product) {
      case 'featured_week':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRICING.FEATURED_LISTING_WEEK.label,
              description: PRICING.FEATURED_LISTING_WEEK.description,
            },
            unit_amount: PRICING.FEATURED_LISTING_WEEK.amount,
          },
          quantity: 1,
        }];
        break;

      case 'featured_month':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRICING.FEATURED_LISTING_MONTH.label,
              description: PRICING.FEATURED_LISTING_MONTH.description,
            },
            unit_amount: PRICING.FEATURED_LISTING_MONTH.amount,
          },
          quantity: 1,
        }];
        break;

      case 'bump':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRICING.BUMP_LISTING.label,
              description: PRICING.BUMP_LISTING.description,
            },
            unit_amount: PRICING.BUMP_LISTING.amount,
          },
          quantity: 1,
        }];
        break;

      case 'platform_monthly':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRICING.PLATFORM.label,
              description: PRICING.PLATFORM.features.join(', '),
            },
            unit_amount: PRICING.PLATFORM.monthly,
            recurring: {
              interval: 'month' as const,
            },
          },
          quantity: 1,
        }];
        mode = 'subscription';
        break;

      case 'platform_yearly':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${PRICING.PLATFORM.label} (Annual)`,
              description: PRICING.PLATFORM.features.join(', '),
            },
            unit_amount: PRICING.PLATFORM.yearly,
            recurring: {
              interval: 'year' as const,
            },
          },
          quantity: 1,
        }];
        mode = 'subscription';
        break;

      case 'voice_addon_monthly':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRICING.VOICE_ADDON.label,
              description: PRICING.VOICE_ADDON.features.join(', '),
            },
            unit_amount: PRICING.VOICE_ADDON.monthly,
            recurring: {
              interval: 'month' as const,
            },
          },
          quantity: 1,
        }];
        mode = 'subscription';
        break;

      case 'voice_addon_yearly':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${PRICING.VOICE_ADDON.label} (Annual)`,
              description: PRICING.VOICE_ADDON.features.join(', '),
            },
            unit_amount: PRICING.VOICE_ADDON.yearly,
            recurring: {
              interval: 'year' as const,
            },
          },
          quantity: 1,
        }];
        mode = 'subscription';
        break;

      case 'guided_setup':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRICING.GUIDED_SETUP.label,
              description: PRICING.GUIDED_SETUP.description,
            },
            unit_amount: PRICING.GUIDED_SETUP.amount,
          },
          quantity: 1,
        }];
        break;

      case 'enterprise_onboarding':
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRICING.ENTERPRISE_ONBOARDING.label,
              description: PRICING.ENTERPRISE_ONBOARDING.description,
            },
            unit_amount: PRICING.ENTERPRISE_ONBOARDING.amount,
          },
          quantity: 1,
        }];
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid product' },
          { status: 400 }
        );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode,
      success_url: isAllowedRedirect(successUrl) ? successUrl : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: isAllowedRedirect(cancelUrl) ? cancelUrl : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        user_id: user.id,
        product,
        listing_id: listingId || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error('Stripe checkout error', { error });
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
