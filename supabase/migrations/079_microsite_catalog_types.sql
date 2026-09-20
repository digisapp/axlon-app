-- Migration 079: let a category microsite draw on the whole catalog.
--
-- A microsite could only show catalog products by pinning one manufacturer_id.
-- That works for a brand domain (xltrailers.com -> XL Specialized) but leaves a
-- category domain empty: tagtrailers.com and haletrailers.com are not about a
-- maker, so they had no manufacturer, therefore no products, therefore a
-- one-URL sitemap on domains whose entire purpose is organic search.
--
-- `catalog_product_types` selects across every manufacturer instead. It is a
-- separate column from `listing_category_slugs` on purpose: that one filters
-- marketplace listings by the site's category taxonomy, this one filters the
-- manufacturer catalog by its own `product_type` vocabulary. They are genuinely
-- different vocabularies, and mapping one onto the other in code would be an
-- implicit coupling that breaks quietly the first time either list changes.

ALTER TABLE microsites
  ADD COLUMN IF NOT EXISTS catalog_product_types TEXT[];

COMMENT ON COLUMN microsites.catalog_product_types IS
  'manufacturer_products.product_type values this site lists, across all makers. Takes precedence over manufacturer_id when set.';

-- Guard against a typo silently emptying a site's catalog: every entry must be
-- a product_type the catalog actually uses. Listed explicitly rather than
-- validated by trigger so the failure is a loud constraint violation at write
-- time, not a blank page discovered weeks later.
ALTER TABLE microsites DROP CONSTRAINT IF EXISTS microsites_catalog_types_known;
ALTER TABLE microsites ADD CONSTRAINT microsites_catalog_types_known
  CHECK (
    catalog_product_types IS NULL
    OR catalog_product_types <@ ARRAY[
      'lowboy', 'rgn', 'step-deck', 'double-drop', 'extendable',
      'traveling-axle', 'tag-along', 'modular', 'flatbed', 'other'
    ]::TEXT[]
  );

-- Supports the `product_type = ANY(...)` scan the catalog query performs.
CREATE INDEX IF NOT EXISTS idx_mfr_products_type_active
  ON manufacturer_products(product_type)
  WHERE is_active = true;

-- ---------------------------------------------------------------------------
-- Seed the two thin sites.
--
-- haletrailers.com is a general heavy-haul domain: the deck types a buyer
-- searching for heavy haul actually wants. tagtrailers.com covers tag-alongs
-- and traveling-axle trailers, which is what "tag trailer" means in this trade
-- (a non-detachable trailer loaded over the rear rather than through a
-- dropped neck).
-- ---------------------------------------------------------------------------
UPDATE microsites
SET catalog_product_types = ARRAY['lowboy', 'rgn', 'step-deck', 'double-drop']
WHERE domain = 'haletrailers.com';

UPDATE microsites
SET catalog_product_types = ARRAY['tag-along', 'traveling-axle']
WHERE domain = 'tagtrailers.com';

-- tagtrailer.com keeps its manufacturer catalog but gains the same breadth;
-- 7 products from one maker is not a category page either.
UPDATE microsites
SET catalog_product_types = ARRAY['tag-along', 'traveling-axle'],
    manufacturer_id = NULL
WHERE domain = 'tagtrailer.com';
