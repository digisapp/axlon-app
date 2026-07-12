-- Migration 061: Repair the missing trade_in_requests table (history drift)
--
-- Migration 011 shows as applied in prod but the table does not exist there
-- (the migration history was reconciled at some point without the DDL running).
-- The public trade-in submission and the admin/dealer review flows both query
-- this table and were 500'ing. This migration (re)creates it to match what the
-- CURRENT app code uses — the 011 base schema PLUS offer_amount and admin_notes,
-- which the admin routes write (src/app/api/admin/trade-ins/[id]/route.ts and
-- .../offer/route.ts) but 011 never defined.

CREATE TABLE IF NOT EXISTS trade_in_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User info (can be anonymous or logged in)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,

  -- Equipment being traded in
  equipment_year INT,
  equipment_make TEXT NOT NULL,
  equipment_model TEXT NOT NULL,
  equipment_vin TEXT,
  equipment_mileage INT,
  equipment_hours INT,
  equipment_condition TEXT,
  equipment_description TEXT,

  -- Photos (JSON array of URLs)
  photos JSONB DEFAULT '[]',

  -- Interest (optional)
  interested_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  interested_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  purchase_timeline TEXT,

  -- Dealer assignment
  assigned_dealer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Valuation (dealer-facing, from 011)
  estimated_value DECIMAL(12,2),
  valuation_notes TEXT,

  -- Admin review (used by current code, absent from 011)
  offer_amount DECIMAL(12,2),
  admin_notes TEXT,

  -- Status: pending, reviewing, contacted, offered, accepted, rejected, completed
  status TEXT DEFAULT 'pending',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  valued_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ
);

-- Backfill the extra columns in case a partial table somehow exists.
ALTER TABLE trade_in_requests ADD COLUMN IF NOT EXISTS offer_amount DECIMAL(12,2);
ALTER TABLE trade_in_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trade_in_status ON trade_in_requests(status);
CREATE INDEX IF NOT EXISTS idx_trade_in_user ON trade_in_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_in_dealer ON trade_in_requests(assigned_dealer_id);
CREATE INDEX IF NOT EXISTS idx_trade_in_created ON trade_in_requests(created_at DESC);

-- RLS
ALTER TABLE trade_in_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own trade-ins" ON trade_in_requests;
CREATE POLICY "Users can view own trade-ins" ON trade_in_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone (incl. anonymous) may submit a trade-in request.
DROP POLICY IF EXISTS "Users can create trade-ins" ON trade_in_requests;
CREATE POLICY "Users can create trade-ins" ON trade_in_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Dealers can view assigned trade-ins" ON trade_in_requests;
CREATE POLICY "Dealers can view assigned trade-ins" ON trade_in_requests
  FOR SELECT USING (auth.uid() = assigned_dealer_id);

DROP POLICY IF EXISTS "Dealers can update assigned trade-ins" ON trade_in_requests;
CREATE POLICY "Dealers can update assigned trade-ins" ON trade_in_requests
  FOR UPDATE USING (auth.uid() = assigned_dealer_id);

-- Admins (session client) can view and action every request, including
-- unassigned ones — this is what the admin routes need to not 500.
DROP POLICY IF EXISTS "Admins can manage trade-in requests" ON trade_in_requests;
CREATE POLICY "Admins can manage trade-in requests" ON trade_in_requests
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

COMMENT ON TABLE trade_in_requests IS 'Trade-in/buyback requests from customers';
