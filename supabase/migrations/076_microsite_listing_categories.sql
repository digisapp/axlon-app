-- Migration 076: filter microsite inventory by category, not just by make.
--
-- 075 gave each microsite one lever over its "Available now" grid:
-- `listing_make`, an ILIKE against listings.make. That works for a site built
-- around a manufacturer (xltrailers.com -> XL Specialized) but cannot express
-- a site built around a *category*. tagtrailer.com is exactly that: "tag
-- trailer" is a kind of trailer, not a brand, so there was no value of
-- listing_make that would select it. Left NULL, no filter applied at all and
-- the site advertised "Tag Trailers For Sale" above a grid of RGN lowboys,
-- hopper bottoms and a 120-ton Goldhofer.
--
-- Categories already exist and are already assigned (listings.category_id ->
-- categories.slug), so this stores the slugs the site cares about and lets the
-- listings query inner-join on them.

ALTER TABLE microsites
  ADD COLUMN IF NOT EXISTS listing_category_slugs TEXT[];

COMMENT ON COLUMN microsites.listing_category_slugs IS
  'Category slugs (categories.slug) whose listings this site shows, e.g. '
  '{tag-trailers,tilt-trailers}. NULL/empty = no category filter. Combined '
  'with listing_make as AND when both are set.';

-- An empty array is not the same as "no filter" and would silently select
-- nothing, so normalize it away rather than let it reach the query layer.
ALTER TABLE microsites DROP CONSTRAINT IF EXISTS microsites_listing_categories_not_empty;
ALTER TABLE microsites ADD CONSTRAINT microsites_listing_categories_not_empty
  CHECK (listing_category_slugs IS NULL OR cardinality(listing_category_slugs) > 0);

-- ---------------------------------------------------------------------------
-- Point each site at the inventory it actually claims to sell.
--
-- Every slug below is verified to exist in `categories`; an unknown slug would
-- inner-join to nothing and empty the grid without any error, which is the
-- failure mode this migration exists to remove. The DO block fails loudly
-- instead of shipping a site that silently shows zero units.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  wanted TEXT[] := ARRAY[
    'tag-trailers', 'tilt-trailers', 'gooseneck-trailers',
    'lowboy-trailers', 'step-deck-trailers', 'flatbed-trailers'
  ];
  missing TEXT[];
BEGIN
  SELECT array_agg(w) INTO missing
  FROM unnest(wanted) AS w
  WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = w);

  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'migration 076: unknown category slugs %', missing;
  END IF;
END $$;

-- Tag trailers: tag-along, tilt-deck and gooseneck equipment haulers. Both tag
-- domains pull the same categories but differ in catalog and copy below.
UPDATE microsites
SET listing_category_slugs = ARRAY['tag-trailers', 'tilt-trailers', 'gooseneck-trailers']
WHERE domain IN ('tagtrailer.com', 'tagtrailers.com');

-- Hale: general heavy haul, the broad deck categories.
UPDATE microsites
SET listing_category_slugs = ARRAY['lowboy-trailers', 'step-deck-trailers', 'flatbed-trailers']
WHERE domain = 'haletrailers.com';

-- The XL sites stay brand-filtered (listing_make), so they keep
-- listing_category_slugs NULL and are unaffected.

-- ---------------------------------------------------------------------------
-- Give each site its own catalog and copy, so the five are not five
-- identical pages on different domains.
-- ---------------------------------------------------------------------------

-- tagtrailer.com -> Felling's tag-along lineup (7 products), the closest
-- equivalent we have to felling.com's own product pages.
UPDATE microsites
SET manufacturer_id = (SELECT id FROM manufacturers WHERE slug = 'felling'),
    product_type    = 'tag-along',
    headline        = 'Tag-Along Trailers For Sale',
    subheadline     = 'Tag and tilt-deck trailers for hauling skid steers, '
                   || 'mini excavators and paving equipment. Compare models '
                   || 'and get pricing from dealers nationwide.'
WHERE domain = 'tagtrailer.com';

-- tagtrailers.com -> no single-brand catalog; positioned as the cross-brand
-- comparison site so it does not duplicate tagtrailer.com.
UPDATE microsites
SET manufacturer_id = NULL,
    product_type    = NULL,
    headline        = 'Tag Trailers For Sale',
    subheadline     = 'Compare tag-along and tilt-deck trailers from '
                   || 'Interstate, Talbert, Load King, Felling and more. '
                   || 'Tell us what you haul and we will source it.'
WHERE domain = 'tagtrailers.com';

-- xltrailers.com -> the full XL Specialized catalog (19 lowboy + 4 extendable).
UPDATE microsites
SET product_type = NULL,
    headline     = 'XL Specialized Trailers For Sale',
    subheadline  = 'Lowboys, extendables and step decks from XL Specialized. '
                || 'Compare models and get pricing from dealers nationwide.'
WHERE domain = 'xltrailers.com';

-- xltrailer.com -> narrowed to lowboys so it is a distinct page, not a
-- duplicate of the plural domain.
UPDATE microsites
SET product_type = 'lowboy',
    headline     = 'XL Specialized Lowboy Trailers',
    subheadline  = 'Heavy-haul lowboy trailers from XL Specialized, rated for '
                || 'the loads that will not go on a standard deck.'
WHERE domain = 'xltrailer.com';

-- haletrailers.com -> stays brand-neutral by design (no manufacturer link),
-- which is also what keeps it clear of Hale Trailer Brake & Wheel's marks.
UPDATE microsites
SET manufacturer_id = NULL,
    product_type    = NULL,
    headline        = 'Heavy Haul Trailers For Sale',
    subheadline     = 'New and used lowboys, step decks and flatbeds from '
                   || 'dealers across the country. Tell us what you need and '
                   || 'we will source it.'
WHERE domain = 'haletrailers.com';
