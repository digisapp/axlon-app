-- Migration 072: close the RLS / RPC / constraint gaps found in the
-- 2026-09-15 full-platform audit.
--
-- Everything here is reachable with nothing but the public anon key that ships
-- in the browser bundle, or with an ordinary dealer's own JWT, so each item is
-- a hole that API-layer validation could not close.

-- ---------------------------------------------------------------------------
-- 1. soft_delete_listing() was an unauthenticated mass-delete button:
--    SECURITY DEFINER, no ownership check, and EXECUTE granted to anon by
--    Postgres' default. Listing ids are public in /api/listings, so anyone
--    could soft-delete every listing on the marketplace.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION soft_delete_listing(
  p_listing_id UUID,
  p_deleted_by UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner UUID;
BEGIN
  SELECT user_id INTO v_owner FROM listings WHERE id = p_listing_id;
  IF v_owner IS NULL THEN
    RETURN;
  END IF;

  -- Only the owner, an admin, or a trusted server process may delete.
  IF NOT (
    auth.role() = 'service_role'
    OR v_owner = auth.uid()
    OR is_admin(auth.uid())
  ) THEN
    RAISE EXCEPTION 'Not authorized to delete this listing';
  END IF;

  UPDATE listings
  SET
    deleted_at = now(),
    deleted_by = COALESCE(auth.uid(), p_deleted_by),
    status = 'deleted'
  WHERE id = p_listing_id
    AND deleted_at IS NULL;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Per-subject stats RPCs took the target id as a parameter and never
--    compared it to auth.uid(), so any caller could read another dealer's
--    pipeline value, monthly revenue, floor-plan balances, views and leads
--    (dealer UUIDs are public in /api/listings).
--
--    Switching them to SECURITY INVOKER makes RLS apply to the caller: asking
--    for someone else's id now returns zero rows instead of their financials,
--    while every legitimate "my own stats" call keeps working unchanged.
-- ---------------------------------------------------------------------------
DO $do$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND p.proname IN (
        'get_user_daily_views',
        'get_user_daily_leads',
        'get_user_view_stats',
        'get_user_lead_stats',
        'get_overdue_followups_count',
        'get_deal_metrics',
        'get_floor_plan_metrics'
      )
  LOOP
    EXECUTE format('ALTER FUNCTION %s SECURITY INVOKER', fn.sig);
  END LOOP;
END $do$;

-- Platform-wide aggregates stay SECURITY DEFINER (admins read them through
-- their own session, where RLS would otherwise hide other users' rows), but
-- they are no longer readable by anonymous visitors.
DO $do$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'get_daily_counts',
        'get_total_views_count',
        'get_active_listings_by_category',
        'get_directory_stats',
        'outreach_stats_by_source',
        'outreach_stats_by_status'
      )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', fn.sig);
  END LOOP;
END $do$;

-- Counter-bumping helpers are server-side plumbing: the Redis view batcher and
-- the dealer-chat route call them with the service role. Exposed to anon they
-- let anyone inflate views_count (which /api/listings sorts on) or a dealer's
-- AI message/lead usage counters.
DO $do$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'increment_views',
        'increment_views_by',
        'increment_dealer_ai_messages',
        'increment_dealer_ai_leads'
      )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon, authenticated', fn.sig);
  END LOOP;
END $do$;

-- ---------------------------------------------------------------------------
-- 3. `leads` INSERT was `WITH CHECK (true)`: anyone holding the anon key could
--    insert a lead into any dealer's pipeline with a chosen score/priority,
--    bypassing the rate limit, CSRF and AI scoring in /api/leads.
--    The dashboard's manual "add lead" runs as the signed-in dealer, so keep
--    an owner-scoped policy for that and let the service role do the rest.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Owners can create their own leads" ON leads;
CREATE POLICY "Owners can create their own leads" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Service role manages leads" ON leads;
CREATE POLICY "Service role manages leads" ON leads
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Leads move through 'negotiating' in the dashboard UI and the API schema, but
-- the CHECK rejected it.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads
  ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'negotiating', 'won', 'lost'));

-- ---------------------------------------------------------------------------
-- 4. `dealer_ai_leads` INSERT was also `WITH CHECK (true)`, and every insert
--    fires the 4-step follow-up drip (041) to whatever visitor_email it
--    carries — an open, dealer-branded email relay. All three code paths use
--    the service role, so anon/authenticated inserts are never legitimate.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can create leads" ON dealer_ai_leads;
DROP POLICY IF EXISTS "Service role manages dealer ai leads" ON dealer_ai_leads;
CREATE POLICY "Service role manages dealer ai leads" ON dealer_ai_leads
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Same shape for public trade-in requests: /api/trade-in inserts with the
-- service role after validating and rate-limiting the submission.
DROP POLICY IF EXISTS "Anyone can submit trade-in requests" ON trade_in_requests;
DROP POLICY IF EXISTS "Anyone can create trade-in requests" ON trade_in_requests;
DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trade_in_requests'
      AND policyname = 'Service role manages trade-in requests'
  ) THEN
    EXECUTE 'CREATE POLICY "Service role manages trade-in requests" ON trade_in_requests FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $do$;

-- ---------------------------------------------------------------------------
-- 5. The owner UPDATE policy on `listings` restricts which ROWS a dealer may
--    change but not which COLUMNS, so a dealer could hand themselves paid
--    placement (is_featured / featured_until), inflate views_count, fake the
--    "below market value" deal badge (ai_price_estimate) or reassign the
--    listing to another account — all through PostgREST with their own JWT.
--    Same approach as the profiles freeze in migration 058.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION protect_listing_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Stripe webhooks, crons, scrapers and admins may set anything.
  IF auth.role() = 'service_role' OR is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.is_featured         := false;
    NEW.featured_until      := NULL;
    NEW.views_count         := 0;
    NEW.ai_price_estimate   := NULL;
    NEW.ai_price_confidence := NULL;
    NEW.source_dealer_id    := NULL;
    NEW.source_listing_id   := NULL;
    NEW.source_url          := NULL;
    NEW.deleted_by          := NULL;
    RETURN NEW;
  END IF;

  NEW.user_id             := OLD.user_id;
  NEW.is_featured         := OLD.is_featured;
  NEW.featured_until      := OLD.featured_until;
  NEW.views_count         := OLD.views_count;
  NEW.ai_price_estimate   := OLD.ai_price_estimate;
  NEW.ai_price_confidence := OLD.ai_price_confidence;
  NEW.source_dealer_id    := OLD.source_dealer_id;
  NEW.source_listing_id   := OLD.source_listing_id;
  NEW.source_url          := OLD.source_url;
  NEW.deleted_by          := OLD.deleted_by;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_listing_privileged_columns ON listings;
CREATE TRIGGER trg_protect_listing_privileged_columns
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION protect_listing_privileged_columns();

-- The year CHECK was hard-capped at 2028 while the API accepts current+2, so
-- from 2027 a model-year 2029 listing would have failed at the DB with a 500.
-- The API schema stays the real gate.
ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_year;
ALTER TABLE listings
  ADD CONSTRAINT check_year CHECK (year IS NULL OR (year > 1900 AND year <= 2100));

-- ---------------------------------------------------------------------------
-- 6. dealer_voice_agents: dealers had UPDATE with no column restriction (so
--    plan_tier 'unlimited' and minutes_used 0 were self-serve) and no INSERT
--    policy at all, so creating an agent from the dashboard always failed.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Dealers can create own voice agent" ON dealer_voice_agents;
CREATE POLICY "Dealers can create own voice agent" ON dealer_voice_agents
  FOR INSERT TO authenticated
  WITH CHECK (dealer_id = auth.uid());

CREATE OR REPLACE FUNCTION protect_voice_agent_billing_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.minutes_used := 0;
    RETURN NEW;
  END IF;

  NEW.dealer_id        := OLD.dealer_id;
  NEW.plan_tier        := OLD.plan_tier;
  NEW.minutes_included := OLD.minutes_included;
  NEW.minutes_used     := OLD.minutes_used;
  NEW.phone_number     := OLD.phone_number;
  NEW.phone_number_id  := OLD.phone_number_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_voice_agent_billing_columns ON dealer_voice_agents;
CREATE TRIGGER trg_protect_voice_agent_billing_columns
  BEFORE INSERT OR UPDATE ON dealer_voice_agents
  FOR EACH ROW
  EXECUTE FUNCTION protect_voice_agent_billing_columns();

-- ---------------------------------------------------------------------------
-- 7. dealer_staff.voice_pin is NOT NULL, but PINs are stored hashed in
--    pin_hash and the insert path sends no plaintext — so adding a staff
--    member always failed with 23502. The column stays for legacy rows.
-- ---------------------------------------------------------------------------
DO $do$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dealer_staff'
      AND column_name = 'voice_pin' AND is_nullable = 'NO'
  ) THEN
    EXECUTE 'ALTER TABLE dealer_staff ALTER COLUMN voice_pin DROP NOT NULL';
  END IF;
END $do$;

COMMENT ON COLUMN dealer_staff.voice_pin IS
  'DEPRECATED — legacy plaintext PIN. New rows store only pin_hash; never write this column.';

-- ---------------------------------------------------------------------------
-- 8. The `documents` bucket (deal quotes and signed paperwork) is public and
--    the deal-desk routes handed out getPublicUrl() links, so any deal
--    document was readable by URL with no session. Make it private and give it
--    the owner-scoped policies it never had; the routes now issue signed URLs.
--    Paths are `deal-documents/<user id>/<deal id>/...`.
-- ---------------------------------------------------------------------------
UPDATE storage.buckets SET public = false WHERE id = 'documents';

DROP POLICY IF EXISTS "Owners can read their deal documents" ON storage.objects;
CREATE POLICY "Owners can read their deal documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'deal-documents'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "Owners can upload their deal documents" ON storage.objects;
CREATE POLICY "Owners can upload their deal documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'deal-documents'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "Owners can replace their deal documents" ON storage.objects;
CREATE POLICY "Owners can replace their deal documents"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'deal-documents'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "Owners can delete their deal documents" ON storage.objects;
CREATE POLICY "Owners can delete their deal documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'deal-documents'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- ---------------------------------------------------------------------------
-- 9. Listing walkaround videos had no bucket at all: both upload paths wrote
--    to a `listings` bucket that does not exist, and `listing-images` caps
--    uploads at 10 MB and image mime types only. Give videos their own public
--    bucket with owner-scoped writes; paths are `<user id>/<file>`.
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-videos',
  'listing-videos',
  true,
  524288000, -- 500 MB
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v', 'video/mpeg']
)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 524288000,
      allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v', 'video/mpeg'];

DROP POLICY IF EXISTS "Anyone can view listing videos" ON storage.objects;
CREATE POLICY "Anyone can view listing videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-videos');

DROP POLICY IF EXISTS "Authenticated users can upload listing videos" ON storage.objects;
CREATE POLICY "Authenticated users can upload listing videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'listing-videos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Owners can replace their listing videos" ON storage.objects;
CREATE POLICY "Owners can replace their listing videos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'listing-videos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Owners can delete their listing videos" ON storage.objects;
CREATE POLICY "Owners can delete their listing videos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'listing-videos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
