import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe/config';
import { createAdminClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    logger.error('Webhook signature verification failed', { error });
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Idempotency check - skip events we have already fully processed.
  // The record is only written AFTER successful processing (below), so a
  // handler failure leaves no record and Stripe's retry will reprocess.
  const { data: existingEvent } = await supabase
    .from('stripe_webhook_events')
    .select('id')
    .eq('event_id', event.id)
    .single();

  if (existingEvent) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { user_id, product, listing_id } = session.metadata || {};

        // Validate required metadata fields
        const validProducts = [
          'featured_week',
          'featured_month',
          'bump',
          'platform_monthly',
          'platform_yearly',
          'voice_addon_monthly',
          'voice_addon_yearly',
          'guided_setup',
          'enterprise_onboarding',
          // Legacy product names kept for back-compat with old sessions
          'dealer_pro',
          'dealer_pro_annual',
        ];
        if (product && !validProducts.includes(product)) {
          logger.error('Invalid product in webhook metadata', { product });
          break;
        }

        // Validate UUID format for IDs
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (user_id && !uuidRegex.test(user_id)) {
          logger.error('Invalid user_id in webhook metadata', { user_id });
          break;
        }
        if (listing_id && !uuidRegex.test(listing_id)) {
          logger.error('Invalid listing_id in webhook metadata', { listing_id });
          break;
        }

        // Verify user exists before processing any actions
        if (user_id) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user_id)
            .single();

          if (!userProfile) {
            logger.error('Webhook user_id does not match any profile', { user_id, product });
            break;
          }
        }

        // Verify listing exists and belongs to user before modifying it
        if (listing_id && user_id) {
          const { data: listing } = await supabase
            .from('listings')
            .select('id')
            .eq('id', listing_id)
            .eq('user_id', user_id)
            .single();

          if (!listing) {
            logger.error('Webhook listing_id not found or does not belong to user', { listing_id, user_id, product });
            break;
          }
        }

        if (product?.startsWith('featured') && listing_id && user_id) {
          // Feature the listing
          const days = product === 'featured_week' ? 7 : 30;
          const featuredUntil = new Date();
          featuredUntil.setDate(featuredUntil.getDate() + days);

          await supabase
            .from('listings')
            .update({
              is_featured: true,
              featured_until: featuredUntil.toISOString(),
            })
            .eq('id', listing_id)
            .eq('user_id', user_id);
        }

        if (product === 'bump' && listing_id && user_id) {
          // Bump the listing (update timestamp)
          await supabase
            .from('listings')
            .update({
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', listing_id)
            .eq('user_id', user_id);
        }

        if ((product?.startsWith('platform_') || product?.startsWith('dealer_pro')) && user_id) {
          // Grant business status AND the paid tier — feature gates key off subscription_tier.
          // Also make sure the Stripe customer is linked so subscription
          // lifecycle events (updated/deleted) can find this profile.
          const platformCustomerId = typeof session.customer === 'string' ? session.customer : null;
          await supabase
            .from('profiles')
            .update({
              is_business: true,
              subscription_tier: 'pro',
              ...(platformCustomerId && { stripe_customer_id: platformCustomerId }),
            })
            .eq('id', user_id);
        }

        if (product?.startsWith('voice_addon') && user_id) {
          // Record the voice add-on subscription on the dealer's voice agent
          // row (dealer_voice_agents.stripe_subscription_id) so billing state
          // is tied to the agent and provisioning can pick it up.
          const voiceSubscriptionId = typeof session.subscription === 'string' ? session.subscription : null;

          const { data: voiceAgent } = await supabase
            .from('dealer_voice_agents')
            .select('id')
            .eq('dealer_id', user_id)
            .maybeSingle();

          if (voiceAgent) {
            await supabase
              .from('dealer_voice_agents')
              .update({ stripe_subscription_id: voiceSubscriptionId })
              .eq('id', voiceAgent.id);
          } else {
            // No agent yet — create an unprovisioned row so the purchase is
            // recorded and the provisioning flow can activate it later
            const { error: voiceInsertError } = await supabase
              .from('dealer_voice_agents')
              .insert({
                dealer_id: user_id,
                stripe_subscription_id: voiceSubscriptionId,
              });

            if (voiceInsertError) {
              logger.warn('Voice add-on purchased but could not record voice agent row', {
                user_id,
                product,
                subscriptionId: voiceSubscriptionId,
                error: voiceInsertError,
              });
            }
          }
        }

        if ((product === 'guided_setup' || product === 'enterprise_onboarding') && user_id) {
          // One-time service payments — no tier change; record for follow-up
          logger.info('One-time service purchased', {
            user_id,
            product,
            sessionId: session.id,
            amountTotal: session.amount_total,
          });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Voice add-on subscriptions don't affect the platform tier
        if (await isVoiceAddonSubscription(supabase, subscription)) {
          logger.info('Voice add-on subscription updated', {
            subscriptionId: subscription.id,
            status: subscription.status,
          });
          break;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) {
          logger.warn('Subscription updated for unknown Stripe customer', {
            customerId,
            subscriptionId: subscription.id,
          });
          break;
        }

        if (subscription.status === 'active') {
          // Plan change or reactivation — (re)grant the paid tier
          await supabase
            .from('profiles')
            .update({ is_business: true, subscription_tier: 'pro' })
            .eq('id', profile.id);
        } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          // Dunning exhausted or canceled — downgrade to free
          await supabase
            .from('profiles')
            .update({ is_business: false, subscription_tier: 'free' })
            .eq('id', profile.id);
        } else {
          // past_due / incomplete etc. — keep current tier while Stripe retries
          logger.info('Subscription status changed, no tier change', {
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Canceling the voice add-on must not revoke the platform tier
        if (await isVoiceAddonSubscription(supabase, subscription)) {
          logger.info('Voice add-on subscription deleted', {
            subscriptionId: subscription.id,
          });
          break;
        }

        // Find user by customer ID and revoke dealer status
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ is_business: false, subscription_tier: 'free' })
            .eq('id', profile.id);
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Keep the paid tier during Stripe's dunning window — the downgrade
        // happens via customer.subscription.updated/deleted when dunning
        // exhausts (status becomes canceled/unpaid)
        logger.warn('Payment failed for invoice, tier retained during dunning', {
          invoiceId: invoice.id,
          customerId: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id,
          attemptCount: invoice.attempt_count,
          nextPaymentAttempt: invoice.next_payment_attempt,
        });
        break;
      }
    }

    // Mark the event processed only after the handler succeeded, so a failure
    // above leaves no record and Stripe's retry is not skipped as a duplicate.
    // The unique event_id makes this atomic; a concurrent duplicate delivery
    // surfaces as a 23505 conflict, which we treat as already processed.
    const { error: recordError } = await supabase
      .from('stripe_webhook_events')
      .insert({
        event_id: event.id,
        event_type: event.type,
        processed_at: new Date().toISOString(),
      });

    if (recordError && recordError.code !== '23505') {
      // Table may not exist yet — processing already succeeded, so still ack
      logger.warn('Failed to record processed webhook event', {
        eventId: event.id,
        error: recordError,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error', { error });
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * A customer can hold both a platform subscription and a voice add-on
 * subscription. Identify voice add-ons via subscription metadata (set at
 * checkout) with a fallback to the dealer_voice_agents record for
 * subscriptions created before metadata was added.
 */
async function isVoiceAddonSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
): Promise<boolean> {
  if (subscription.metadata?.product?.startsWith('voice_addon')) {
    return true;
  }

  const { data: voiceAgent } = await supabase
    .from('dealer_voice_agents')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .maybeSingle();

  return !!voiceAgent;
}
