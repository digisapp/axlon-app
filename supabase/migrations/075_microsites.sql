-- Migration 075: lead-generation microsites.
--
-- Each microsite is one domain we own (xltrailers.com, tagtrailers.com, ...)
-- served by this same Next app. The domain is aliased to the Vercel project;
-- src/proxy.ts rewrites any non-app host to /sites/<host>, and the page
-- resolves the host to a row here.
--
-- Three things are stored: what the site renders (a manufacturer's catalog
-- and/or a slice of marketplace listings), where its leads go, and every
-- visit it receives so /admin/microsites can show real traffic numbers.

-- ---------------------------------------------------------------------------
-- 1. The sites themselves.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS microsites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Apex host, lowercase, no scheme/port/www ('xltrailers.com'). The resolver
  -- strips a leading 'www.' before matching, so only the apex is stored.
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'paused')),

  -- What it shows. A microsite pulls from the manufacturer catalog
  -- (manufacturer_products) and, when show_listings is on, live marketplace
  -- inventory filtered by make/product type.
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE SET NULL,
  product_type TEXT,
  listing_make TEXT,
  show_listings BOOLEAN NOT NULL DEFAULT true,

  -- Copy + presentation.
  headline TEXT,
  subheadline TEXT,
  hero_image_url TEXT,
  accent_color TEXT NOT NULL DEFAULT '#1d4ed8',
  cta_label TEXT NOT NULL DEFAULT 'Get Pricing',
  phone TEXT,

  -- Required disclosure. These domains are not owned by the manufacturers
  -- whose equipment they list, and the site must say so on every page — the
  -- renderer falls back to a generated sentence if this is left null, but it
  -- is editable so legal wording can be set per site.
  disclaimer TEXT,

  -- Where leads go. Both optional: with neither set the lead is still stored
  -- and shows up in /admin/leads, it just isn't forwarded or assigned.
  lead_recipient_email TEXT,
  assigned_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- SEO.
  meta_title TEXT,
  meta_description TEXT,

  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per host. Case-insensitive so 'XLTrailers.com' can't be inserted
-- alongside 'xltrailers.com' and shadow it.
CREATE UNIQUE INDEX IF NOT EXISTS idx_microsites_domain
  ON microsites (LOWER(domain));

-- Reject anything that isn't a bare apex host: no scheme, port, path or
-- leading 'www.' — all of which would silently never match a request.
ALTER TABLE microsites DROP CONSTRAINT IF EXISTS microsites_domain_format;
ALTER TABLE microsites ADD CONSTRAINT microsites_domain_format
  CHECK (domain ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$'
         AND domain NOT LIKE 'www.%');

CREATE INDEX IF NOT EXISTS idx_microsites_status ON microsites(status);

DROP TRIGGER IF EXISTS update_microsites_updated_at ON microsites;
CREATE TRIGGER update_microsites_updated_at
  BEFORE UPDATE ON microsites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 2. Traffic.
--
-- One row per page view. Written only by the service role (POST
-- /api/microsites/track), never by the visitor's own key — otherwise anyone
-- could inflate or poison the numbers the dashboard reports.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS microsite_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microsite_id UUID NOT NULL REFERENCES microsites(id) ON DELETE CASCADE,

  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  referrer_host TEXT,

  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  device TEXT CHECK (device IN ('mobile', 'tablet', 'desktop')),
  country TEXT,
  ip_hash TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_microsite_visits_site_date
  ON microsite_visits(microsite_id, visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_microsite_visits_created
  ON microsite_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_microsite_visits_session
  ON microsite_visits(microsite_id, session_id);

-- ---------------------------------------------------------------------------
-- 3. Attach leads to the site that produced them.
-- ---------------------------------------------------------------------------
ALTER TABLE leads ADD COLUMN IF NOT EXISTS microsite_id UUID
  REFERENCES microsites(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_path TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS session_id TEXT;
-- Free text: which trailer the visitor was looking at when they converted.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_interest TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_microsite_id
  ON leads(microsite_id, created_at DESC)
  WHERE microsite_id IS NOT NULL;

-- 069 rebuilt this CHECK to match what the app actually sends; microsite
-- leads add one more source. Keep every existing value valid.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE leads ADD CONSTRAINT leads_source_check
  CHECK (source IN (
    'website', 'phone_call', 'chat', 'referral', 'other',
    'contact_form', 'axlonai_contact', 'microsite'
  ));

-- ---------------------------------------------------------------------------
-- 4. RLS.
--
-- Microsite config carries lead-routing addresses, so it is admin-only. The
-- public site itself renders server-side through the service-role client and
-- does not need an anon SELECT policy.
-- ---------------------------------------------------------------------------
ALTER TABLE microsites ENABLE ROW LEVEL SECURITY;
ALTER TABLE microsite_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage microsites" ON microsites;
CREATE POLICY "Admins manage microsites"
  ON microsites FOR ALL
  USING (COALESCE(is_admin(auth.uid()), false))
  WITH CHECK (COALESCE(is_admin(auth.uid()), false));

DROP POLICY IF EXISTS "Admins read microsite visits" ON microsite_visits;
CREATE POLICY "Admins read microsite visits"
  ON microsite_visits FOR SELECT
  USING (COALESCE(is_admin(auth.uid()), false));

-- No INSERT policy for anon/authenticated on purpose: the tracking endpoint
-- writes as the service role, which bypasses RLS. Revoke the table grants too
-- so a policy added later can't accidentally re-open direct writes.
REVOKE ALL ON microsite_visits FROM anon, authenticated;
REVOKE ALL ON microsites FROM anon;
GRANT SELECT ON microsite_visits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON microsites TO authenticated;

-- Grant the service role explicitly rather than leaning on the project's
-- ALTER DEFAULT PRIVILEGES. Both the tracking endpoint and the public page
-- resolver run as service_role, and if the ambient default is ever missing
-- the failure is silent in exactly the worst way: visits insert nothing,
-- every microsite reports zero traffic, and the dashboard looks merely
-- unpopular rather than broken. Migration 073 fixed that same shape of bug
-- in the storefront view counter.
GRANT SELECT, INSERT, UPDATE, DELETE ON microsite_visits TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON microsites TO service_role;

-- ---------------------------------------------------------------------------
-- 5. Analytics.
--
-- The dashboard needs per-day series and per-site rollups. Doing that by
-- pulling raw visit rows into the app breaks down as soon as a site gets real
-- traffic, so aggregate in the database. Both are admin-gated inside the
-- function: SECURITY DEFINER over a table the caller cannot read would
-- otherwise hand any authenticated user the full traffic log.
-- ---------------------------------------------------------------------------

-- Daily series for one site: visits, unique sessions and leads per day.
CREATE OR REPLACE FUNCTION get_microsite_daily_stats(
  p_microsite_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  day DATE,
  visits BIGINT,
  visitors BIGINT,
  lead_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_days INTEGER := LEAST(GREATEST(COALESCE(p_days, 30), 1), 365);
  v_from DATE := CURRENT_DATE - (v_days - 1);
BEGIN
  IF NOT COALESCE(auth.role() = 'service_role', false)
     AND NOT COALESCE(is_admin(auth.uid()), false) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  WITH days AS (
    SELECT generate_series(v_from, CURRENT_DATE, '1 day')::DATE AS day
  ),
  v AS (
    SELECT visit_date AS day,
           COUNT(*) AS visits,
           COUNT(DISTINCT session_id) AS visitors
    FROM microsite_visits
    WHERE microsite_id = p_microsite_id AND visit_date >= v_from
    GROUP BY visit_date
  ),
  l AS (
    SELECT ld.created_at::DATE AS day, COUNT(*) AS n
    FROM leads ld
    WHERE ld.microsite_id = p_microsite_id AND ld.created_at::DATE >= v_from
    GROUP BY ld.created_at::DATE
  )
  SELECT days.day,
         COALESCE(v.visits, 0),
         COALESCE(v.visitors, 0),
         COALESCE(l.n, 0)
  FROM days
  LEFT JOIN v ON v.day = days.day
  LEFT JOIN l ON l.day = days.day
  ORDER BY days.day;
END;
$$;

-- One row per site for the index page.
CREATE OR REPLACE FUNCTION get_microsite_overview(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  microsite_id UUID,
  visits BIGINT,
  visitors BIGINT,
  lead_count BIGINT,
  last_visit_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_days INTEGER := LEAST(GREATEST(COALESCE(p_days, 30), 1), 365);
  v_from DATE := CURRENT_DATE - (v_days - 1);
BEGIN
  IF NOT COALESCE(auth.role() = 'service_role', false)
     AND NOT COALESCE(is_admin(auth.uid()), false) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT m.id,
         COALESCE(v.visits, 0),
         COALESCE(v.visitors, 0),
         COALESCE(l.n, 0),
         v.last_visit_at
  FROM microsites m
  LEFT JOIN (
    SELECT mv.microsite_id,
           COUNT(*) AS visits,
           COUNT(DISTINCT mv.session_id) AS visitors,
           MAX(mv.created_at) AS last_visit_at
    FROM microsite_visits mv
    WHERE mv.visit_date >= v_from
    GROUP BY mv.microsite_id
  ) v ON v.microsite_id = m.id
  LEFT JOIN (
    SELECT ld.microsite_id, COUNT(*) AS n
    FROM leads ld
    WHERE ld.microsite_id IS NOT NULL AND ld.created_at::DATE >= v_from
    GROUP BY ld.microsite_id
  ) l ON l.microsite_id = m.id;
END;
$$;

-- Top traffic sources for one site (referrer host, falling back to utm_source).
CREATE OR REPLACE FUNCTION get_microsite_sources(
  p_microsite_id UUID,
  p_days INTEGER DEFAULT 30,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (source TEXT, visits BIGINT, visitors BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_days INTEGER := LEAST(GREATEST(COALESCE(p_days, 30), 1), 365);
  v_limit INTEGER := LEAST(GREATEST(COALESCE(p_limit, 10), 1), 100);
  v_from DATE := CURRENT_DATE - (v_days - 1);
BEGIN
  IF NOT COALESCE(auth.role() = 'service_role', false)
     AND NOT COALESCE(is_admin(auth.uid()), false) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT COALESCE(NULLIF(mv.utm_source, ''), NULLIF(mv.referrer_host, ''), 'direct')::TEXT,
         COUNT(*),
         COUNT(DISTINCT mv.session_id)
  FROM microsite_visits mv
  WHERE mv.microsite_id = p_microsite_id AND mv.visit_date >= v_from
  GROUP BY 1
  ORDER BY 2 DESC
  LIMIT v_limit;
END;
$$;

-- Most-viewed paths for one site.
CREATE OR REPLACE FUNCTION get_microsite_pages(
  p_microsite_id UUID,
  p_days INTEGER DEFAULT 30,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (path TEXT, visits BIGINT, visitors BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_days INTEGER := LEAST(GREATEST(COALESCE(p_days, 30), 1), 365);
  v_limit INTEGER := LEAST(GREATEST(COALESCE(p_limit, 10), 1), 100);
  v_from DATE := CURRENT_DATE - (v_days - 1);
BEGIN
  IF NOT COALESCE(auth.role() = 'service_role', false)
     AND NOT COALESCE(is_admin(auth.uid()), false) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT mv.path, COUNT(*), COUNT(DISTINCT mv.session_id)
  FROM microsite_visits mv
  WHERE mv.microsite_id = p_microsite_id AND mv.visit_date >= v_from
  GROUP BY mv.path
  ORDER BY 2 DESC
  LIMIT v_limit;
END;
$$;

REVOKE ALL ON FUNCTION get_microsite_daily_stats(UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_microsite_overview(INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_microsite_sources(UUID, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_microsite_pages(UUID, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_microsite_daily_stats(UUID, INTEGER) FROM anon;
REVOKE ALL ON FUNCTION get_microsite_overview(INTEGER) FROM anon;
REVOKE ALL ON FUNCTION get_microsite_sources(UUID, INTEGER, INTEGER) FROM anon;
REVOKE ALL ON FUNCTION get_microsite_pages(UUID, INTEGER, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION get_microsite_daily_stats(UUID, INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_microsite_overview(INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_microsite_sources(UUID, INTEGER, INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_microsite_pages(UUID, INTEGER, INTEGER) TO authenticated, service_role;

COMMENT ON TABLE microsites IS
  'Lead-gen landing domains served by this app. Host is resolved in src/proxy.ts -> /sites/<host>.';
COMMENT ON TABLE microsite_visits IS
  'Page views on microsite domains. Written by the service role only (POST /api/microsites/track).';

-- ---------------------------------------------------------------------------
-- 6. Seed the domains we already own, as drafts.
--
-- Draft means the resolver serves a 404 until someone reviews the copy and
-- flips it live in /admin/microsites — pointing DNS at the app should never
-- silently publish an unreviewed page.
-- ---------------------------------------------------------------------------
INSERT INTO microsites (domain, name, status, manufacturer_id, listing_make, headline, subheadline, cta_label)
SELECT d.domain, d.name, 'draft', m.id, d.listing_make, d.headline, d.subheadline, 'Get Pricing'
FROM (VALUES
  ('xltrailers.com', 'XL Trailers', 'xl-specialized', 'XL Specialized',
   'XL Specialized Trailers For Sale',
   'Lowboys, extendables and step decks from XL Specialized — compare models and get pricing from dealers nationwide.'),
  ('xltrailer.com', 'XL Trailer', 'xl-specialized', 'XL Specialized',
   'XL Specialized Trailers For Sale',
   'Lowboys, extendables and step decks from XL Specialized — compare models and get pricing from dealers nationwide.'),
  ('tagtrailers.com', 'Tag Trailers', NULL, NULL,
   'Tag Trailers For Sale',
   'Tag-along and tilt-deck trailers for construction and heavy equipment. Compare models and get pricing fast.'),
  ('tagtrailer.com', 'Tag Trailer', NULL, NULL,
   'Tag Trailers For Sale',
   'Tag-along and tilt-deck trailers for construction and heavy equipment. Compare models and get pricing fast.'),
  ('haletrailers.com', 'Hale Trailers', NULL, NULL,
   'Heavy Haul Trailers For Sale',
   'New and used lowboys, step decks and flatbeds from dealers across the country. Tell us what you need and we will source it.')
) AS d(domain, name, mfr_slug, listing_make, headline, subheadline)
LEFT JOIN manufacturers m ON m.slug = d.mfr_slug
ON CONFLICT DO NOTHING;
