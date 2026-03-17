-- Dealer sources: tracks external dealers/manufacturers we scrape inventory from
-- The user never sees the source — they see AXLON. Admin sees the source for brokering.

CREATE TABLE IF NOT EXISTS dealer_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                         -- "Big Tex Trailers", "Lamar Trailers"
  slug TEXT NOT NULL UNIQUE,                  -- "big-tex-trailers"
  website TEXT,                               -- "https://www.bigtextrailers.com"
  inventory_url TEXT,                         -- specific inventory page URL
  scrape_method TEXT DEFAULT 'auto',          -- 'auto', 'css', 'api', 'manual'
  scrape_config JSONB DEFAULT '{}',           -- CSS selectors, API endpoints, etc.
  contact_name TEXT,                          -- dealer contact person
  contact_phone TEXT,                         -- dealer phone
  contact_email TEXT,                         -- dealer email
  location_city TEXT,
  location_state TEXT,
  is_active BOOLEAN DEFAULT true,
  last_scraped_at TIMESTAMPTZ,
  last_scrape_count INT DEFAULT 0,            -- how many listings found last time
  total_listings INT DEFAULT 0,               -- total active listings from this source
  notes TEXT,                                 -- admin notes about this dealer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add source tracking to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source_dealer_id UUID REFERENCES dealer_sources(id);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source_url TEXT;          -- original listing URL on dealer site
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source_listing_id TEXT;   -- external ID for dedup

-- Index for dedup lookups and source filtering
CREATE INDEX IF NOT EXISTS idx_listings_source_dealer ON listings(source_dealer_id) WHERE source_dealer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_source_url ON listings(source_url) WHERE source_url IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_source_dedup ON listings(source_dealer_id, source_listing_id) WHERE source_dealer_id IS NOT NULL AND source_listing_id IS NOT NULL;

-- RLS: dealer_sources readable by admins only
ALTER TABLE dealer_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read dealer sources"
  ON dealer_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Service role full access to dealer sources"
  ON dealer_sources FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow service role to update listings source columns
-- (existing RLS on listings already allows service role)
