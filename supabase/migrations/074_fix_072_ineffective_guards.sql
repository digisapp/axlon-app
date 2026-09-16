-- Migration 074: fix three defects in migration 072.
--
-- 072 was verified against production immediately after it was applied, and three
-- of its protections did not work. Two of them left a hole that 072 claimed to
-- have closed exploitable with nothing but the public anon key, which is worse
-- than not having claimed it: the audit trail said "fixed".

-- ---------------------------------------------------------------------------
-- 1. soft_delete_listing: the guard never fired for an anonymous caller.
--
--    072 wrote:
--      IF NOT (auth.role() = 'service_role' OR v_owner = auth.uid() OR is_admin(auth.uid()))
--
--    For anon, auth.uid() is NULL, so `v_owner = auth.uid()` is NULL, not false.
--    false OR NULL OR false = NULL; NOT NULL = NULL; and `IF NULL THEN` does not
--    execute. So the RAISE was skipped and the UPDATE ran. Three-valued logic
--    turned the guard into a no-op for exactly the caller it was written to stop.
--    Verified in production: an anon RPC call soft-deleted a listing.
--
--    Fixed two ways, so neither alone has to be right: the predicate is now
--    NULL-safe and requires an authenticated identity, AND the function is no
--    longer executable by anon at all. Nothing in the app calls this RPC (the
--    delete route does its own scoped UPDATE), so the revoke costs nothing.
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
  v_uid UUID := auth.uid();
  v_is_service BOOLEAN := (auth.role() = 'service_role');
BEGIN
  -- An anonymous caller has no business here at all.
  IF NOT v_is_service AND v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authorized to delete this listing';
  END IF;

  SELECT user_id INTO v_owner FROM listings WHERE id = p_listing_id;
  IF v_owner IS NULL THEN
    RETURN;
  END IF;

  -- COALESCE every term so a NULL can never make the whole test NULL.
  IF NOT COALESCE(
    v_is_service
    OR (v_owner = v_uid)
    OR COALESCE(is_admin(v_uid), false),
    false
  ) THEN
    RAISE EXCEPTION 'Not authorized to delete this listing';
  END IF;

  UPDATE listings
  SET
    deleted_at = now(),
    deleted_by = COALESCE(v_uid, p_deleted_by),
    status = 'deleted'
  WHERE id = p_listing_id
    AND deleted_at IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION soft_delete_listing(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION soft_delete_listing(UUID, UUID) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_listing(UUID, UUID) TO service_role;

-- restore_listing had the opposite problem: its guard is `IF NOT is_admin(auth.uid())`,
-- and auth.uid() is NULL for the service role, so no server-side script could
-- undo a mass delete. Recovery has to be scriptable.
CREATE OR REPLACE FUNCTION restore_listing(
  p_listing_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (auth.role() = 'service_role' OR COALESCE(is_admin(auth.uid()), false)) THEN
    RAISE EXCEPTION 'Only admins can restore listings';
  END IF;

  UPDATE listings
  SET
    deleted_at = NULL,
    deleted_by = NULL,
    status = 'draft'
  WHERE id = p_listing_id
    AND deleted_at IS NOT NULL;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Every REVOKE in 072 was inert.
--
--    Postgres grants EXECUTE on a new function to PUBLIC by default, and
--    `REVOKE ... FROM anon` does not remove a grant held through PUBLIC. anon
--    and authenticated inherit it, so all ten revokes changed nothing. Verified
--    in production: anon successfully called get_total_views_count (94),
--    get_active_listings_by_category, get_directory_stats,
--    outreach_stats_by_source (1,676 + 1,901 rows) and increment_views.
--    073 happened to get this right, which is the control that proves the
--    mechanism: anon gets 42501 on increment_storefront_views.
--
--    Counter helpers: service role only. The view batcher, the view-tracking
--    route and the dealer-chat route all call these with the service key.
-- ---------------------------------------------------------------------------
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
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon, authenticated', fn.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn.sig);
  END LOOP;
END $do$;

-- Platform-wide aggregates: closed to anonymous visitors, which was 072's stated
-- intent, but still reachable by a signed-in admin through their own session
-- (admin/page.tsx and the outreach route use the session client).
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
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', fn.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', fn.sig);
  END LOOP;
END $do$;

-- ---------------------------------------------------------------------------
-- 3. trade_in_requests still accepts anonymous INSERTs.
--
--    072 dropped two policy names that do not exist in this database, so the
--    real permissive policy survived untouched. The push output said
--    "policy ... does not exist, skipping" and that notice was the warning.
--
--    Drop by SHAPE rather than by guessed name: any INSERT policy on this table
--    that is granted to anon or to PUBLIC. A DO block runs inside Postgres, so
--    it can read pg_policies even though no SQL console is available here.
-- ---------------------------------------------------------------------------
DO $do$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname, roles
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'trade_in_requests'
      AND cmd IN ('INSERT', 'ALL')
      AND (roles && ARRAY['anon', 'public']::name[])
  LOOP
    RAISE NOTICE 'Dropping permissive trade_in_requests policy: % (roles %)', pol.policyname, pol.roles;
    EXECUTE format('DROP POLICY %I ON trade_in_requests', pol.policyname);
  END LOOP;
END $do$;

-- The public form posts through /api/trade-in, which validates, rate-limits and
-- then inserts with the service role, so no anon policy is needed. Make sure the
-- service-role policy really is there.
DROP POLICY IF EXISTS "Service role manages trade-in requests" ON trade_in_requests;
CREATE POLICY "Service role manages trade-in requests" ON trade_in_requests
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. The voice-agent freeze only covered UPDATE in practice: 072's INSERT branch
--    zeroed minutes_used but left plan_tier, minutes_included and the phone
--    number columns writable, so a dealer could create their agent pre-loaded
--    with an unlimited plan rather than upgrading to one.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION protect_voice_agent_billing_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR COALESCE(is_admin(auth.uid()), false) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- A dealer may create their own agent, but never on their own billing terms.
    NEW.plan_tier        := 'trial';
    NEW.minutes_included := 100;
    NEW.minutes_used     := 0;
    NEW.phone_number     := NULL;
    NEW.phone_number_id  := NULL;
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

-- ---------------------------------------------------------------------------
-- 5. 073 created a column the /dealers directory ranks on, and 058's profiles
--    freeze does not cover it, so an ordinary account could PATCH its own
--    storefront_views and rank itself to the top of the directory.
--    Only the service-role RPC should ever move it.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION protect_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR COALESCE(is_admin(auth.uid()), false) THEN
    RETURN NEW;
  END IF;

  NEW.subscription_tier        := OLD.subscription_tier;
  NEW.is_admin                 := OLD.is_admin;
  NEW.stripe_customer_id       := OLD.stripe_customer_id;
  NEW.business_status          := OLD.business_status;
  NEW.business_reviewed_at     := OLD.business_reviewed_at;
  NEW.business_reviewed_by     := OLD.business_reviewed_by;
  NEW.business_rejection_reason := OLD.business_rejection_reason;
  NEW.is_suspended             := OLD.is_suspended;
  NEW.suspended_at             := OLD.suspended_at;
  NEW.suspended_reason         := OLD.suspended_reason;
  NEW.deleted_at               := OLD.deleted_at;
  NEW.deleted_by               := OLD.deleted_by;
  -- Added in 074: the directory ranking column.
  NEW.storefront_views         := OLD.storefront_views;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. The listing-videos bucket advertises 500 MB, but this Supabase project has
--    a 50 MiB global upload ceiling, so anything larger fails with a 413 no
--    matter what the bucket row says. 072 set the bucket limit with raw SQL,
--    which bypasses the API validation that would have rejected it. Bring the
--    bucket in line with what the platform can actually accept, and accept AVI,
--    which the upload UI already offers.
-- ---------------------------------------------------------------------------
UPDATE storage.buckets
SET
  file_size_limit = 52428800, -- 50 MiB, the project's real ceiling
  allowed_mime_types = ARRAY[
    'video/mp4', 'video/quicktime', 'video/webm',
    'video/x-m4v', 'video/mpeg', 'video/x-msvideo'
  ]
WHERE id = 'listing-videos';
