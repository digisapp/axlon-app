-- Migration 063: Idempotency marker for the dealer "new lead" alert
--
-- The lead-followups cron sent the dealer new-lead alert for every step-1 row in
-- the batch (even skipped/failed ones) and had no record it was sent, so a
-- reprocessed row (stale 'sending' recovery) re-alerted the dealer. The cron now
-- only alerts step-1 rows whose buyer email actually sent, and stamps this column
-- to send at most once.

ALTER TABLE lead_followup_queue
  ADD COLUMN IF NOT EXISTS dealer_alerted_at TIMESTAMPTZ;
