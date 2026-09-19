-- Migration 077: give each microsite its own accent colour, hero and CTA.
--
-- 076 made the five sites differ in what they *sell*. They still looked
-- identical: the same #1d4ed8 blue, no hero image, the same "Get Pricing"
-- button on all five. This is the visual half.
--
-- Accent colours are used two ways by the page — as a button background under
-- white text, and as price text on the light card background — so each one has
-- to clear WCAG AA (4.5:1) against white in both roles. Measured:
--   #1d4ed8 blue   6.70:1    #0f766e teal  5.47:1    #b45309 amber 5.02:1
--   #b91c1c red    6.47:1    #334155 slate 10.35:1
-- Replacing any of these means re-checking the ratio, not eyeballing it.

-- Heroes live under a dedicated microsite-heroes/ prefix rather than pointing
-- at a listing's photo. A dealer deleting their listing would otherwise take a
-- microsite's hero down with it. The files are copies, verified complete
-- (JPEG EOI present) — note that a handful of re-hosted listing images in
-- storage are truncated at exactly 262144 bytes, which is how the first two
-- candidates were caught and discarded.

-- XL Specialized, full catalog. Keeps the original blue; the hero is XL's own
-- detachable-gooseneck lowboy, a product shot rather than a dealer yard photo.
UPDATE microsites
SET accent_color   = '#1d4ed8',
    hero_image_url = 'https://mpchkzqkvkizxeokjhnp.supabase.co/storage/v1/object/public/listing-images/microsite-heroes/xltrailers-hero.webp',
    cta_label      = 'Get Pricing'
WHERE domain = 'xltrailers.com';

-- XL Specialized, narrowed to lowboys. Deliberately has no hero image: the
-- text hero reads as a different page from its plural sibling, which is the
-- point, and there is no second XL photo in storage worth using (the rest are
-- 256px thumbnails).
UPDATE microsites
SET accent_color   = '#0f766e',
    hero_image_url = NULL,
    cta_label      = 'Check Availability'
WHERE domain = 'xltrailer.com';

-- Tag trailers, Felling catalog. Amber reads as construction/equipment rather
-- than the marketplace blue. Hero is a white Interstate 40TDL tilt-deck.
UPDATE microsites
SET accent_color   = '#b45309',
    hero_image_url = 'https://mpchkzqkvkizxeokjhnp.supabase.co/storage/v1/object/public/listing-images/microsite-heroes/tagtrailer-hero.jpg',
    cta_label      = 'Get Pricing'
WHERE domain = 'tagtrailer.com';

-- Tag trailers, cross-brand. Hero is a black Interstate 50DLA, so the two tag
-- domains are immediately distinguishable from one another.
UPDATE microsites
SET accent_color   = '#b91c1c',
    hero_image_url = 'https://mpchkzqkvkizxeokjhnp.supabase.co/storage/v1/object/public/listing-images/microsite-heroes/tagtrailers-hero.jpg',
    cta_label      = 'Request a Quote'
WHERE domain = 'tagtrailers.com';

-- General heavy haul. Neutral slate and no hero: this is the one domain whose
-- name echoes a real dealer (Hale Trailer Brake & Wheel), so it stays visually
-- plain and brand-neutral rather than adopting anything that reads as theirs.
UPDATE microsites
SET accent_color   = '#334155',
    hero_image_url = NULL,
    cta_label      = 'Tell Us What You Need'
WHERE domain = 'haletrailers.com';
