-- Migration 060: Persistent email suppression list (CAN-SPAM)
--
-- Unsubscribe previously only flipped current preference flags and cancelled
-- pending drip rows — so a buyer who unsubscribed and later triggered a NEW
-- drip (chatting with another dealer) would resume receiving marketing email.
-- This table is the durable opt-out record checked before every marketing send.

CREATE TABLE IF NOT EXISTS email_suppressions (
  email      TEXT PRIMARY KEY,
  reason     TEXT NOT NULL DEFAULT 'unsubscribe',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only service-role paths (unsubscribe route, email senders) touch this.
ALTER TABLE email_suppressions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages email suppressions" ON email_suppressions;
CREATE POLICY "Service role manages email suppressions"
  ON email_suppressions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
