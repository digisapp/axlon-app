-- Migration 078: a hero on every microsite, and real search metadata.
--
-- 077 left xltrailer.com and haletrailers.com with text-only heroes because
-- there was no usable image for either. There is — the earlier search looked
-- only at dealer listing photos, which are shot in the selling dealer's yard
-- and mostly carry that dealer's signage. Manufacturer catalog photos do not,
-- and filtering `storage.objects.metadata->>'size'` before downloading finds
-- the large ones without guessing:
--
--   SELECT (o.metadata->>'size')::bigint, i.url
--   FROM manufacturer_product_images i
--   JOIN storage.objects o ON o.bucket_id = 'listing-images'
--     AND o.name = regexp_replace(i.url, '^.*/listing-images/', '')
--   WHERE (o.metadata->>'size')::bigint BETWEEN 250000 AND 3000000
--     AND (o.metadata->>'size')::bigint <> 262144   -- the truncated ones
--
-- Both new files were reviewed by eye, not by sort order, and verified to end
-- with a JPEG EOI marker.

UPDATE microsites
SET hero_image_url = 'https://mpchkzqkvkizxeokjhnp.supabase.co/storage/v1/object/public/listing-images/microsite-heroes/xltrailer-hero.jpg'
WHERE domain = 'xltrailer.com';

UPDATE microsites
SET hero_image_url = 'https://mpchkzqkvkizxeokjhnp.supabase.co/storage/v1/object/public/listing-images/microsite-heroes/haletrailers-hero.jpg'
WHERE domain = 'haletrailers.com';

-- ---------------------------------------------------------------------------
-- Search metadata.
--
-- generateMetadata falls back to headline/subheadline, which is why nothing
-- was broken without these — but those are page copy, written to be read on
-- the page, not result snippets written to be clicked. All five sites went
-- indexable today (robots.txt flipped to Allow: /), so this is the moment it
-- starts mattering.
--
-- Descriptions are kept near 155 characters: past roughly 160 Google truncates
-- the tail, and the call to action is what gets cut.
-- ---------------------------------------------------------------------------

UPDATE microsites SET
  meta_title = 'XL Specialized Trailers For Sale - Lowboys & Extendables',
  meta_description = 'Compare XL Specialized lowboys, extendables and step decks. '
                  || 'Real inventory from dealers nationwide, with pricing sent straight to you.'
WHERE domain = 'xltrailers.com';

UPDATE microsites SET
  meta_title = 'XL Specialized Lowboy Trailers - Heavy Haul Decks',
  meta_description = 'XL Specialized lowboy trailers for heavy haul. Compare hydraulic '
                  || 'and mechanical detachable goosenecks and get dealer pricing fast.'
WHERE domain = 'xltrailer.com';

UPDATE microsites SET
  meta_title = 'Tag-Along Trailers For Sale - Tilt Deck Equipment Haulers',
  meta_description = 'Tag-along and tilt-deck trailers for skid steers, mini excavators '
                  || 'and paving equipment. Compare models and get pricing nationwide.'
WHERE domain = 'tagtrailer.com';

UPDATE microsites SET
  meta_title = 'Tag Trailers For Sale - Compare Tilt Deck & Tag-Along',
  meta_description = 'Compare tag and tilt-deck trailers from Interstate, Talbert, Load '
                  || 'King and Felling. Tell us what you haul and we will source it.'
WHERE domain = 'tagtrailers.com';

UPDATE microsites SET
  meta_title = 'Heavy Haul Trailers For Sale - Lowboys & Step Decks',
  meta_description = 'New and used lowboys, step decks and flatbeds from dealers across '
                  || 'the country. Compare live inventory and get pricing fast.'
WHERE domain = 'haletrailers.com';
