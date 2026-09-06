-- Migration 071: let a dealer claim the inventory scraped from their site
--
-- Scraped listings are owned by the admin account and tagged with
-- listings.source_dealer_id. The claim flow (/claim + POST /api/dealer/claim)
-- moves those rows to the dealer's own account; record who claimed the
-- source and when so it can only happen once and so scraper re-runs can
-- keep assigning new units to the right owner.

ALTER TABLE dealer_sources
  ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_dealer_sources_claimed_by ON dealer_sources(claimed_by);
