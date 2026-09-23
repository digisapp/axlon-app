-- 080: Catalog and listing data cleanup (2026-09-22)
--
-- The code already hides all of this at render time (src/lib/catalog/quality.ts,
-- src/lib/microsites/resolve.ts rankListings). This makes the data itself right,
-- so every reader — including ones added later — gets it without the guard.
-- Idempotent; safe to re-run.

BEGIN;

-- 1. Scraped pages that are not products: a consultation form, service and
--    parts pages, a colour chart, a scraped 404, a "Translate:" widget, and two
--    rows lifted from Hale Trailer's (a real dealer's) website with their copy
--    and photo. Deactivated, not deleted.
UPDATE manufacturer_products
SET is_active = false, updated_at = now()
WHERE is_active
  AND id IN (SELECT id FROM (VALUES
  ('587c05e2-9f87-4f0d-8db5-3428fb5e2a97'::uuid),  -- Faymonville MegaMAX
  ('b2abbf97-5048-43e2-ab98-1ff021bbb4ae'::uuid),  -- Faymonville HighwayMAX
  ('9c103a59-a339-4a79-9aa0-1ac713309289'::uuid),  -- Loadstar: "Book Your Consultation!"
  ('95044af2-f230-4f08-890e-a9db25fcbd7d'::uuid),  -- Loadstar: service department
  ('c3c1faa5-a19e-409d-89d4-f93f25f64c0c'::uuid),  -- Loadstar: parts
  ('f5fb43f2-0d0e-4913-8575-a1dc71ca2137'::uuid),  -- Loadstar: custom-build pitch
  ('fd349e96-31a8-4aa6-853e-58384469f3da'::uuid),  -- Globe: buying-guide article
  ('a6892e36-0ffd-4f7b-8f20-2514d9e68058'::uuid),  -- Globe: category index
  ('ec0c18ce-3e80-41e0-b8c7-1e16b31d0d16'::uuid),  -- Witzco: "Translate:" widget
  ('62d0445b-5c20-45e3-a285-b75dd73158c4'::uuid),  -- Kalyn Siebert: division page
  ('664621ed-49c2-4402-92ac-7d80bd3584f4'::uuid),  -- Kalyn Siebert: division page
  ('571c715e-2745-4076-8cea-1d7db32e0262'::uuid),  -- Kalyn Siebert: refurbishment programme
  ('6522d3b1-331c-4e5c-b78a-884f72e575dc'::uuid),  -- Faymonville: scraped 404 page
  ('4b396dc4-266c-451f-a786-9a03275590c5'::uuid),  -- Faymonville: brand overview
  ('f06bb4df-f94a-45e2-88bc-3c9745787c5a'::uuid),  -- Faymonville: "Built for everyday heroes."
  ('4b67222b-13b5-4598-8851-57b442c7ed3d'::uuid),  -- Felling: category index
  ('069ecd9e-f2f0-429f-94d8-b050d11feb82'::uuid),  -- Felling: category index
  ('6a6186b0-5290-453a-9aea-f7cac6470db6'::uuid),  -- Felling: government sales
  ('e7796113-0fb5-4414-a099-eec241d404ff'::uuid),  -- Felling: ramp options
  ('b7669a76-d43e-4d87-bb9d-242c13b16c64'::uuid),  -- Felling: hitch option
  ('a3d21e9c-8cc1-4527-88c3-e6068bf7da4d'::uuid),  -- Felling: OEM division
  ('672ba9ec-46a0-4771-b3ef-2269b6274d08'::uuid),  -- Felling: OEM division
  ('31ba749f-77bd-4be9-b332-1250e8c7cc77'::uuid),  -- Felling: division index
  ('2c601e03-0189-4eb6-a1e0-2b651013d4a0'::uuid),  -- Felling: colour chart
  ('9ee67cd9-6e74-4e5d-8c6f-0fc37fd65eb1'::uuid),  -- Felling: galvanizing process
  ('8c533f1d-fd5c-4f2c-92b5-9cd792fce1ed'::uuid)  -- Felling: dump-gate options
  ) AS v(id));

-- 2. Listings filed under a heavy-haul category they are not. One-off January
--    imports with no source_url, so no scraper will overwrite the fix.
UPDATE listings l
SET category_id = c.id, updated_at = now()
FROM (VALUES
  ('1789d250-397e-4dcd-bcdd-7424c8f43258'::uuid, 'reefer-trailers'),   -- 2008 Utility 53' reefer (was flatbed)
  ('bafd46b8-377c-4676-afef-a839c2e4c883'::uuid, 'reefer-trailers'),   -- 2011 Wabash 53' reefer (was flatbed)
  ('7f62f677-61c8-4f30-840e-e0137b8d2667'::uuid, 'dry-van-trailers'),  -- 2009 Utility 53' dry van (was flatbed)
  ('5d999c62-92c1-431c-a612-bfd37fae4d17'::uuid, 'components-parts'),  -- 22.5 x 8.25 wheels (was lowboy)
  ('4c34e83e-2d97-42fb-ba5d-fecf167ee54a'::uuid, 'components-parts'),  -- 17.5 x 6.75 wheels (was lowboy)
  ('6c4109fd-8e4a-4694-b282-238b41228fae'::uuid, 'dump-trailers')      -- Doolittle 14' dump (was flatbed)
) AS m(id, slug)
JOIN categories c ON c.slug = m.slug
WHERE l.id = m.id AND l.category_id IS DISTINCT FROM c.id;

-- Keep manufacturers.product_count honest after the deactivations.
UPDATE manufacturers m
SET product_count = sub.n
FROM (
  SELECT manufacturer_id, count(*) FILTER (WHERE is_active) AS n
  FROM manufacturer_products GROUP BY manufacturer_id
) sub
WHERE sub.manufacturer_id = m.id AND m.product_count IS DISTINCT FROM sub.n;

COMMIT;
