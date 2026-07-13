# Self-serve Stripe Checkout — go-live guide

The full self-serve checkout flow is built but **gated OFF by default**. Until you
enable it, the dashboard billing plan buttons keep routing to `/contact` (sales),
exactly as before.

## What's already built

- **Backend:** `POST /api/stripe/checkout` (auth + CSRF + Zod, inline `price_data`,
  subscription & one-time modes) → returns `{ url }`. The webhook
  (`/api/stripe/webhook`) grants the plan after payment — idempotent
  (`stripe_webhook_events`), only on `payment_status = paid`, and never clobbers an
  `enterprise` tier. Prices match the pages: Platform $499/mo, Voice $299/mo.
- **Billing portal:** `POST /api/stripe/portal` + the "Manage billing" button, so
  subscribers can update card / cancel / view invoices.
- **Frontend:** `CheckoutButton` on the dashboard billing page (Platform for free
  accounts; Voice add-on for existing Platform accounts). Success/cancel banners
  read `?checkout=success|cancelled`.

## Go-live checklist

1. **Set the live secret** — `STRIPE_SECRET_KEY` in the Vercel project env
   (start with a **test-mode** key to rehearse).
2. **Register the webhook** in the Stripe Dashboard → Developers → Webhooks:
   endpoint `https://www.axlon.ai/api/stripe/webhook`, events at minimum
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.payment_failed`. Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
3. **Rehearse in test mode** — set `NEXT_PUBLIC_ENABLE_SELF_SERVE_CHECKOUT=true`,
   deploy, and run a full purchase with a Stripe test card (`4242 4242 4242 4242`).
   Confirm: session created → redirect to Stripe → pay → redirected back to
   `/dashboard/billing?checkout=success` → the webhook fires → `subscription_tier`
   flips to `pro` (check the profile) → "Manage billing" opens the portal.
4. **Flip to live** — swap `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` to live-mode
   values and re-register the webhook against the live endpoint. Keep
   `NEXT_PUBLIC_ENABLE_SELF_SERVE_CHECKOUT=true`.

## To turn it back off

Unset `NEXT_PUBLIC_ENABLE_SELF_SERVE_CHECKOUT` (or set it to anything but `true`)
and redeploy — the buttons revert to the `/contact` sales funnel. No code change.

## Notes

- The **bundle** (Platform + Voice) and **non-Platform → Voice** paths intentionally
  stay on `/contact` — there is no single "bundle" checkout product.
- The public `/pricing` page still `redirect()`s to `/transform`; re-enabling it as a
  self-serve pricing page is a separate marketing decision.
