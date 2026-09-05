-- Migration 070: track the pre-rehost origin of manufacturer catalog images
--
-- Catalog images are being moved from manufacturer websites into Supabase
-- Storage (listing-images/manufacturer-products/<product_id>/...). Keeping
-- the original external URL lets scraper re-runs reuse the stored copy
-- instead of re-downloading, and preserves provenance.
--
-- `source_url` already exists on this table but holds the PRODUCT PAGE the
-- image was scraped from, not the image itself — hence a separate column.

ALTER TABLE manufacturer_product_images
  ADD COLUMN IF NOT EXISTS original_url TEXT;

CREATE INDEX IF NOT EXISTS idx_mfr_product_images_original_url
  ON manufacturer_product_images(original_url);
