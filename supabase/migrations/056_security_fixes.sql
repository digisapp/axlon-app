-- Migration 056: Security fixes (RLS hardening)
--
-- Fixes a batch of verified Row Level Security holes discovered in an audit.
-- Every statement is written to be idempotent and re-runnable:
--   * DROP POLICY IF EXISTS before every CREATE POLICY
--   * ENABLE ROW LEVEL SECURITY is safe to run repeatedly
--   * constraint change is wrapped in a DO block that looks up the real name
--
-- What this migration fixes:
--   1. Eight "service role" policies written as FOR ALL USING (true) WITH CHECK (true)
--      with NO `TO service_role` clause. Without the role restriction these grant
--      full read/write to anon + authenticated. Recreated with FOR ALL TO service_role.
--      Where a PUBLIC page reads the table via the anon key, the pre-existing public
--      SELECT policies are left intact (they already exist) so the site keeps working.
--   3. Draft/sold listings were publicly visible: 054 dropped listings SELECT policies
--      by names that never existed, so 001's "Active listings are viewable by everyone"
--      survived and OR'd with 054's "Listings are viewable by everyone" (deleted_at IS
--      NULL). The union exposed EVERY non-deleted listing, including drafts. Replaced
--      with a single correct public policy (status='active' AND deleted_at IS NULL),
--      plus owner-can-see-own and service_role full access.
--   4. Tables that never had RLS enabled: categories, search_history (policies added in
--      030 but ENABLE was never run so they were inert), industries, listing_industries,
--      weight_calculations. RLS enabled + appropriate policies added.
--   5. Listing soft-delete violated a CHECK constraint: status IN
--      ('draft','active','sold','expired') has no 'deleted', but the soft_delete RPC and
--      DELETE /api/listings/[id] write status='deleted'. Constraint extended to allow it.
--   6. Forgeable "system" INSERT policies scoped correctly:
--        - floor_plan_alerts / dealer_market_reports: only cron (service role) inserts ->
--          scoped to service_role.
--        - deal_activities: inserted by authenticated dealer routes (NOT service role) ->
--          scoped to the authenticated owner of the parent deal (not left wide open).
--
-- Item 2 (visitor chat transcripts) is intentionally NOT changed here -- see the note at
-- the bottom of this file for why removing that public policy would break a live flow.

-- ============================================================================
-- ITEM 1: Fix ungated "service role" policies (add TO service_role)
-- ============================================================================

-- 022_manufacturers.sql:56-57  (table: manufacturers)
-- Public read already exists via "Active manufacturers are viewable by everyone".
DROP POLICY IF EXISTS "Service role has full access" ON manufacturers;
CREATE POLICY "Service role has full access" ON manufacturers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 023_dealer_voice_agents.sql:65-66  (table: dealer_voice_agents)
DROP POLICY IF EXISTS "Service role has full access to voice agents" ON dealer_voice_agents;
CREATE POLICY "Service role has full access to voice agents" ON dealer_voice_agents
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 029_manufacturer_products.sql:128-135  (3 tables)
-- Public read already exists on all three (used by the anon-key /new-trailers pages),
-- so tightening the service-role policy does NOT break the public browse experience.
DROP POLICY IF EXISTS "Service role has full access to products" ON manufacturer_products;
CREATE POLICY "Service role has full access to products" ON manufacturer_products
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to product images" ON manufacturer_product_images;
CREATE POLICY "Service role has full access to product images" ON manufacturer_product_images
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to product specs" ON manufacturer_product_specs;
CREATE POLICY "Service role has full access to product specs" ON manufacturer_product_specs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 041_lead_followup_queue.sql:53-54  (table: lead_followup_queue)
DROP POLICY IF EXISTS "Service role can manage follow-ups" ON lead_followup_queue;
CREATE POLICY "Service role can manage follow-ups" ON lead_followup_queue
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 046_dealer_sources.sql:47-50  (table: dealer_sources)
DROP POLICY IF EXISTS "Service role full access to dealer sources" ON dealer_sources;
CREATE POLICY "Service role full access to dealer sources" ON dealer_sources
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 048_security_hardening.sql:28-31  (table: business_directory)
-- This one re-opened business_directory to anon/authenticated right after 048 locked it
-- down for admin-only. Restrict it to service_role so admin-only reads/writes hold.
DROP POLICY IF EXISTS "Service role full access to directory" ON business_directory;
CREATE POLICY "Service role full access to directory" ON business_directory
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- ITEM 3: Listings public SELECT hole (drafts/sold were visible)
-- ============================================================================
-- Drop ALL existing public/owner SELECT policies on listings by their REAL names,
-- then recreate a single correct public policy + explicit owner + service_role.

DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON listings; -- 001:225
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;        -- 054:50

-- Public: only active, non-deleted listings.
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT
  USING (status = 'active' AND deleted_at IS NULL);

-- Owner / admin: can always see their own (including drafts) and admins see all,
-- but soft-deleted rows stay hidden unless owner/admin (matches 054's intent).
DROP POLICY IF EXISTS "Owners and admins can view listings" ON listings;
CREATE POLICY "Owners and admins can view listings" ON listings
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_admin(auth.uid())
  );

-- Service role full access (RLS-bypassing role, kept explicit for clarity).
DROP POLICY IF EXISTS "Service role full access to listings" ON listings;
CREATE POLICY "Service role full access to listings" ON listings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- NOTE: owner INSERT/UPDATE/DELETE policies from 001 (Users can create/update/delete
-- own listings) are intentionally left untouched.


-- ============================================================================
-- ITEM 4: Tables missing RLS
-- ============================================================================

-- categories: public reference data. Read via anon key (GET /api/categories,
-- /categories page, listing forms). Public SELECT + service_role write.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role can manage categories" ON categories;
CREATE POLICY "Service role can manage categories" ON categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- industries: public reference data. Read via anon key (GET /api/industries).
-- Guarded with to_regclass: this table is absent in environments where migration 011
-- was never applied (production drift). Applies only where the table exists.
DO $do$
BEGIN
  IF to_regclass('public.industries') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE industries ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Industries are viewable by everyone" ON industries';
    EXECUTE 'CREATE POLICY "Industries are viewable by everyone" ON industries FOR SELECT USING (true)';
    EXECUTE 'DROP POLICY IF EXISTS "Service role can manage industries" ON industries';
    EXECUTE 'CREATE POLICY "Service role can manage industries" ON industries FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $do$;

-- listing_industries: junction table, read publicly alongside active listings; written
-- by the authenticated listing owner (POST /api/listings, clone). Allow public SELECT,
-- allow owner INSERT/DELETE for rows whose listing they own, service_role full access.
-- Guarded: absent under the same drift as industries.
DO $do$
BEGIN
  IF to_regclass('public.listing_industries') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE listing_industries ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Listing industries are viewable by everyone" ON listing_industries';
    EXECUTE 'CREATE POLICY "Listing industries are viewable by everyone" ON listing_industries FOR SELECT USING (true)';
    EXECUTE 'DROP POLICY IF EXISTS "Owners can manage listing industries" ON listing_industries';
    EXECUTE 'CREATE POLICY "Owners can manage listing industries" ON listing_industries FOR ALL USING (EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_industries.listing_id AND listings.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_industries.listing_id AND listings.user_id = auth.uid()))';
    EXECUTE 'DROP POLICY IF EXISTS "Service role can manage listing industries" ON listing_industries';
    EXECUTE 'CREATE POLICY "Service role can manage listing industries" ON listing_industries FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $do$;

-- search_history: has user_id. 030 added owner policies but never ran ENABLE, so they
-- were inert (table was fully open). Enable RLS now. No app code in src/ reads or writes
-- this table via the anon key, so owner-only + service_role is safe and does not need an
-- anon INSERT path. Guarded: table is absent in production drift.
DO $do$
BEGIN
  IF to_regclass('public.search_history') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE search_history ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own search history" ON search_history';
    EXECUTE 'CREATE POLICY "Users can view own search history" ON search_history FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own search history" ON search_history';
    EXECUTE 'CREATE POLICY "Users can insert own search history" ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own search history" ON search_history';
    EXECUTE 'CREATE POLICY "Users can delete own search history" ON search_history FOR DELETE USING (auth.uid() = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "Service role can manage search history" ON search_history';
    EXECUTE 'CREATE POLICY "Service role can manage search history" ON search_history FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $do$;

-- weight_calculations: has user_id. No app code in src/ references it; owner-only.
ALTER TABLE weight_calculations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own weight calculations" ON weight_calculations;
CREATE POLICY "Users can manage own weight calculations" ON weight_calculations
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role can manage weight calculations" ON weight_calculations;
CREATE POLICY "Service role can manage weight calculations" ON weight_calculations
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- ITEM 5: Add 'deleted' to the listings status CHECK constraint
-- ============================================================================
-- The inline constraint from 001:71 is unnamed by us; Postgres named it
-- listings_status_check by default. Find the actual constraint on `listings` whose
-- definition references `status` and lists the old status set, drop it, and recreate
-- with 'deleted' included. Done in a DO block so it is name-agnostic and idempotent.
DO $$
DECLARE
  v_conname TEXT;
BEGIN
  SELECT conname INTO v_conname
  FROM pg_constraint
  WHERE conrelid = 'listings'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%status%'
    AND pg_get_constraintdef(oid) ILIKE '%draft%'
    AND pg_get_constraintdef(oid) ILIKE '%active%'
    AND pg_get_constraintdef(oid) NOT ILIKE '%deleted%'
  LIMIT 1;

  IF v_conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE listings DROP CONSTRAINT %I', v_conname);
  END IF;

  -- (Re)create the constraint with the full status set, only if not already present.
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'listings'::regclass
      AND conname = 'listings_status_check'
  ) THEN
    ALTER TABLE listings
      ADD CONSTRAINT listings_status_check
      CHECK (status IN ('draft', 'active', 'sold', 'expired', 'deleted'));
  END IF;
END $$;


-- ============================================================================
-- ITEM 6: Forgeable "system" INSERT policies
-- ============================================================================

-- floor_plan_alerts: only cron/floor-plan/alerts inserts these, using the service-role
-- admin client. Scope INSERT to service_role so visitors can't forge alerts.
DROP POLICY IF EXISTS "System can create alerts" ON floor_plan_alerts;
CREATE POLICY "System can create alerts" ON floor_plan_alerts
  FOR INSERT TO service_role WITH CHECK (true);

-- dealer_market_reports: only cron/market-reports inserts these, service-role admin
-- client. Scope INSERT to service_role.
DROP POLICY IF EXISTS "Service role can insert reports" ON dealer_market_reports;
CREATE POLICY "Service role can insert reports" ON dealer_market_reports
  FOR INSERT TO service_role WITH CHECK (true);

-- deal_activities: inserted by AUTHENTICATED dealer routes (deal-desk/*), NOT the service
-- role. Do NOT restrict to service_role or activity logging breaks. Instead require the
-- caller to own the parent deal. Service role also gets full access for cron/server code.
DROP POLICY IF EXISTS "System can create activities" ON deal_activities;
CREATE POLICY "Owners can create deal activities" ON deal_activities
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_activities.deal_id
        AND deals.dealer_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Service role can manage deal activities" ON deal_activities;
CREATE POLICY "Service role can manage deal activities" ON deal_activities
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- ITEM 2 (chat transcripts): DELIBERATELY LEFT PERMISSIVE -- documented, not changed
-- ============================================================================
-- 006_dealer_storefronts.sql exposes chat_messages / chat_conversations to any anon
-- reader (the SELECT policy passes when visitor_fingerprint IS NOT NULL, which is true
-- for every visitor row). The audit note assumed all reads go through service-role or
-- authenticated dealer-scoped routes -- that is TRUE for the newer POST/PUT
-- /api/ai/dealer-chat route (it uses createAdminClient / service role with its own
-- httpOnly-cookie fingerprint ownership check, so it bypasses RLS and does NOT need the
-- public policy).
--
-- HOWEVER, the older storefront ChatWidget path is still live: components/storefront/
-- ChatWidget.tsx -> POST /api/chat (src/app/api/chat/route.ts) uses the ANON session
-- client and directly:
--   * INSERTs chat_conversations then .select('id') back (needs anon SELECT of the row)
--   * INSERTs chat_messages
--   * SELECTs chat_messages by conversation_id to rebuild history (needs anon SELECT)
-- This route does not pass a fingerprint/cookie filter, so narrowing the SELECT policy
-- to dealer-owner + service_role only would break the storefront chat widget.
--
-- Per the migration guardrail (do not drop a policy a live app flow depends on), the
-- public chat read policies are LEFT AS-IS in this migration. Closing this hole safely
-- requires first migrating /api/chat to the service-role admin client (like dealer-chat)
-- or adding cookie-based visitor scoping to it; that is an app-code change, out of scope
-- for a pure SQL migration. Flagged for follow-up.
