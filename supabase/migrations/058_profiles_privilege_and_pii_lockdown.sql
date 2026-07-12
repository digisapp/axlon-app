-- Migration 058: Lock down profiles against privilege escalation and PII harvesting
--
-- Problems fixed:
--  1. The "Users can update own profile" policy (USING auth.uid() = id, no WITH CHECK,
--     no column protection) let any authenticated user set their own subscription_tier,
--     is_admin, stripe_customer_id, business_status, is_suspended, etc. via the anon key.
--  2. There was no admin UPDATE policy, so admin approve/suspend/grant-admin routes
--     (which use the session client) silently updated 0 rows and returned success.
--  3. The public SELECT policy (USING deleted_at IS NULL) let the anon key read EVERY
--     profile row and column, exposing all users' email/phone/stripe_customer_id.
--  4. is_admin() was SECURITY DEFINER without a pinned search_path.

-- ---------------------------------------------------------------------------
-- 1. Harden the admin-check function (pin search_path, schema-qualify).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Freeze privileged columns for ordinary self-updates.
--    Service role (webhooks, cron, admin API using service key) and admins
--    bypass the freeze. Ordinary users keep the columns they legitimately own
--    (company_name, phone, storefront fields, is_business onboarding, etc.).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION protect_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role and admins may change anything.
  IF auth.role() = 'service_role' OR is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- Otherwise, keep all privileged columns at their existing values.
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
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_columns ON profiles;
CREATE TRIGGER trg_protect_profile_privileged_columns
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_privileged_columns();

-- ---------------------------------------------------------------------------
-- 3. Add an admin UPDATE policy so admin moderation routes actually take effect.
--    (The session-client admin routes were matching 0 rows before this.)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Also give admins UPDATE on trade_in_requests (admin trade-in actions 500'd
-- on rows with no assigned dealer because RLS blocked the .select().single()).
DROP POLICY IF EXISTS "Admins can manage trade-in requests" ON trade_in_requests;
CREATE POLICY "Admins can manage trade-in requests"
  ON trade_in_requests FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 4. Split the public SELECT policy by role.
--    - anon (logged-out, incl. the client bundle's anon key): only business
--      (dealer storefront) profiles, which are public by design.
--    - authenticated: any non-deleted profile (needed for messaging, seller
--      names, admin views); admins additionally see soft-deleted rows.
--    This stops anonymous enumeration of every consumer account's email/phone.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

CREATE POLICY "Public can view business profiles"
  ON profiles FOR SELECT
  TO anon
  USING (deleted_at IS NULL AND is_business = true);

CREATE POLICY "Authenticated can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL OR is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 5. Never expose payment/tax/license identifiers to the anon key. These are
--    only used by service-role paths (webhook) and admin views. The storefront
--    over-fetch (select('*')) is fixed in app code to stop selecting them.
-- ---------------------------------------------------------------------------
REVOKE SELECT (stripe_customer_id, business_license, tax_id) ON profiles FROM anon;
