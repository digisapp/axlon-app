-- Migration 064: Reconcile schema drift found by the July 2026 audit
--
-- Prod migration history shows 011/024 applied, but several of their tables and
-- columns never actually landed (the same drift that hid trade_in_requests). The
-- app code depends on them, so those paths were erroring. This migration is
-- idempotent (CREATE/ADD ... IF NOT EXISTS) and safe to run against a DB that
-- already has some of these objects.

-- ── industries + listing_industries (migration 011 drift) ──────────────────
CREATE TABLE IF NOT EXISTS industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO industries (name, slug, icon, description, sort_order) VALUES
  ('Agriculture', 'agriculture', 'wheat', 'Farming, ranching, and agricultural operations', 1),
  ('Construction', 'construction', 'building', 'Building, roadwork, and site development', 2),
  ('Forestry & Logging', 'forestry', 'trees', 'Timber harvesting and forest management', 3),
  ('Heavy Haul', 'heavy-haul', 'container', 'Oversized and overweight freight transport', 4),
  ('Waste & Recycling', 'waste-recycling', 'recycle', 'Trash collection and recycling operations', 5),
  ('Intermodal', 'intermodal', 'ship', 'Container shipping and port operations', 6),
  ('Oil & Gas', 'oil-gas', 'fuel', 'Energy sector and oilfield services', 7),
  ('Mining', 'mining', 'pickaxe', 'Mineral extraction and quarry operations', 8),
  ('Food & Beverage', 'food-beverage', 'utensils', 'Food transport and cold chain logistics', 9),
  ('General Freight', 'general-freight', 'truck', 'Standard commercial hauling', 10),
  ('Landscaping', 'landscaping', 'flower', 'Lawn care and landscape services', 11),
  ('Utilities', 'utilities', 'zap', 'Power, water, and infrastructure services', 12)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS listing_industries (
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, industry_id)
);

-- RLS (migration 056 added these guarded on table existence, but the tables
-- were absent then, so re-apply now).
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Industries are viewable by everyone" ON industries;
CREATE POLICY "Industries are viewable by everyone" ON industries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role can manage industries" ON industries;
CREATE POLICY "Service role can manage industries" ON industries FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE listing_industries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Listing industries are viewable by everyone" ON listing_industries;
CREATE POLICY "Listing industries are viewable by everyone" ON listing_industries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners can manage listing industries" ON listing_industries;
CREATE POLICY "Owners can manage listing industries" ON listing_industries FOR ALL
  USING (EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_industries.listing_id AND listings.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_industries.listing_id AND listings.user_id = auth.uid()));
DROP POLICY IF EXISTS "Service role can manage listing industries" ON listing_industries;
CREATE POLICY "Service role can manage listing industries" ON listing_industries FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── dealer_staff usage-tracking columns (migration 024 drift) ──────────────
ALTER TABLE dealer_staff ADD COLUMN IF NOT EXISTS last_access_at TIMESTAMPTZ;
ALTER TABLE dealer_staff ADD COLUMN IF NOT EXISTS access_count INT DEFAULT 0;
ALTER TABLE dealer_staff ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0;
ALTER TABLE dealer_staff ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- ── dealer_staff_access_logs columns (migration 024 drift) ─────────────────
-- The prod table exists but with only a subset of columns, so every access-log
-- insert (and the voice-agent staff-auth flow) errored. Add all columns the code
-- writes; nullable so we don't fight an unknown existing NOT NULL layout.
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES dealer_staff(id) ON DELETE SET NULL;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'voice';
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS caller_phone TEXT;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS query TEXT;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS query_type TEXT;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS response_summary TEXT;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS auth_success BOOLEAN DEFAULT true;
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'pin';
ALTER TABLE dealer_staff_access_logs ADD COLUMN IF NOT EXISTS accessed_at TIMESTAMPTZ DEFAULT NOW();

-- ── trade_in_requests.offer_sent_at (admin "send offer" action) ────────────
ALTER TABLE trade_in_requests ADD COLUMN IF NOT EXISTS offer_sent_at TIMESTAMPTZ;
