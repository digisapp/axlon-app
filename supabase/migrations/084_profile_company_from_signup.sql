-- Carry the company name a dealer typed at signup into their profile.
--
-- /api/auth/signup sends company_name (and is_business) as user metadata on
-- the auth user, but handle_new_user() has only ever copied id and email into
-- profiles, so every account created through the signup form landed with no
-- company name. Of the 27 signups in the 60 days to 2026-10-06 that gave one,
-- 27 had company_name NULL on the profile; the admin users and dealers pages
-- showed a bare email for each.
--
-- Deliberately NOT copied: is_business. The signup form is being filled by
-- bots with random company names and strangers' addresses (26 of those 27),
-- and is_business = true is what makes a profile readable by the anon key
-- and counted as an active business. A business account is still turned on
-- by the person, after confirming, at /get-started — the same path the real
-- dealers on the platform took.
--
-- Additive and idempotent: CREATE OR REPLACE on the function, and the
-- backfill only fills profiles whose company_name is still NULL.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- Same bound as the signup form's validation; blank becomes NULL, and
  -- providers that send no company_name (Google OAuth) fall through to NULL.
  v_company_name text := NULLIF(left(btrim(NEW.raw_user_meta_data->>'company_name'), 200), '');
BEGIN
  INSERT INTO public.profiles (id, email, company_name)
  VALUES (NEW.id, NEW.email, v_company_name);
  RETURN NEW;
END;
$$;

-- The trigger itself already exists (001); recreate it only if it is missing
-- so this migration is safe to re-run.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass AND tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Backfill: profiles still without a company name whose signup supplied one.
UPDATE public.profiles p
SET
  company_name = NULLIF(left(btrim(u.raw_user_meta_data->>'company_name'), 200), ''),
  updated_at = now()
FROM auth.users u
WHERE u.id = p.id
  AND p.company_name IS NULL
  AND NULLIF(btrim(u.raw_user_meta_data->>'company_name'), '') IS NOT NULL;
