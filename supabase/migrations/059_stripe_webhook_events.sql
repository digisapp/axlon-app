-- Migration 059: Stripe webhook idempotency ledger
--
-- The webhook handler (src/app/api/stripe/webhook/route.ts) pre-checks and then
-- inserts into `stripe_webhook_events` to make delivery idempotent, but no
-- migration ever created the table — so the select errored to null and the
-- insert failed with only a warning, silently disabling idempotency. Stripe
-- retries (on timeout/connection drop) could therefore reprocess an event:
-- re-grant tiers, re-apply featured windows, re-run bumps.

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id     TEXT PRIMARY KEY,
  event_type   TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only the service role (used by the webhook route via createAdminClient) ever
-- touches this table. Enable RLS with no anon/authenticated policies so it is
-- inaccessible to the public API surface.
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages webhook events" ON stripe_webhook_events;
CREATE POLICY "Service role manages webhook events"
  ON stripe_webhook_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Housekeeping index for pruning old rows by age.
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_processed_at
  ON stripe_webhook_events (processed_at);
