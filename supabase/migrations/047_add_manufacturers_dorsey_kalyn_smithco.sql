-- Add Kalyn Siebert and SmithCo manufacturers, update Dorsey with full info
-- Dorsey already exists (slug='dorsey' from migration 012) but needs website/description

-- Update Dorsey with full product catalog info
UPDATE manufacturers SET
  canonical_name = 'Dorsey Trailer',
  name_variations = ARRAY['dorsey trailer', 'dorsey trailers', 'dorsey trailer mfg'],
  equipment_types = ARRAY['trailers'],
  country = 'USA',
  headquarters = 'Elba, Alabama',
  short_description = 'Manufacturer of aluminum, steel, and combo flatbed trailers, drop decks, beavertails, chip vans, and lowboy trailers.',
  website = 'https://dorseytrailer.net'
WHERE slug = 'dorsey';

-- Insert Kalyn Siebert (if not exists)
INSERT INTO manufacturers (name, slug, canonical_name, name_variations, equipment_types, country, headquarters, founded_year, short_description, website)
VALUES (
  'Kalyn Siebert',
  'kalyn-siebert',
  'Kalyn Siebert',
  ARRAY['kalyn siebert', 'kalyn/siebert', 'ks trailers'],
  ARRAY['trailers'],
  'USA',
  'Gatesville, Texas',
  1969,
  'Manufacturer of heavy-haul lowboy trailers, removable gooseneck trailers, oilfield equipment, and defense tactical trailers.',
  'https://kalynsiebert.com'
)
ON CONFLICT (slug) DO UPDATE SET
  canonical_name = EXCLUDED.canonical_name,
  name_variations = EXCLUDED.name_variations,
  short_description = EXCLUDED.short_description,
  website = EXCLUDED.website;

-- Insert SmithCo (if not exists)
INSERT INTO manufacturers (name, slug, canonical_name, name_variations, equipment_types, country, headquarters, founded_year, short_description, website)
VALUES (
  'SmithCo',
  'smithco',
  'SmithCo',
  ARRAY['smithco', 'smithco mfg', 'smithco side dump', 'side dump'],
  ARRAY['trailers'],
  'USA',
  'Le Mars, Iowa',
  1994,
  'Manufacturer of side dump trailers for construction, agriculture, mining, and demolition industries.',
  'https://sidedump.com'
)
ON CONFLICT (slug) DO UPDATE SET
  canonical_name = EXCLUDED.canonical_name,
  name_variations = EXCLUDED.name_variations,
  short_description = EXCLUDED.short_description,
  website = EXCLUDED.website;
