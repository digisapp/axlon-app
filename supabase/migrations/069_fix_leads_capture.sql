-- Migration 069: repair the public lead-capture path
--
-- POST /api/leads has never successfully inserted a row in prod (the leads
-- table is empty). Verified live on 2026-08-10 with test inserts:
--   1. The route sends source 'contact_form' / 'axlonai_contact'; both are
--      rejected by 021's CHECK (website/phone_call/chat/referral/other) —
--      SQLSTATE 23514.
--   2. AXLON-AI leads (no seller) send user_id NULL, rejected by 004's
--      NOT NULL — SQLSTATE 23502.
-- The route now performs its writes with the service-role client, but the
-- schema must accept the values it sends.

-- 1. AXLON-AI leads have no receiving dealer.
ALTER TABLE leads ALTER COLUMN user_id DROP NOT NULL;

-- 2. Allow the two source values the app actually sends (keep the originals —
--    existing rows and any future channels remain valid).
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE leads ADD CONSTRAINT leads_source_check
  CHECK (source IN (
    'website', 'phone_call', 'chat', 'referral', 'other',
    'contact_form', 'axlonai_contact'
  ));

-- 3. Admins had no SELECT policy on leads, so /admin/leads and the admin
--    dashboard counts (session client) only ever matched the admin's own
--    rows. AXLON-AI leads (user_id NULL) are visible to admins only.
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update all leads" ON leads;
CREATE POLICY "Admins can update all leads"
  ON leads FOR UPDATE
  USING (is_admin(auth.uid()));
