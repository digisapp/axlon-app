-- Migration 073: make the storefront view counter actually work.
--
-- The storefront page incremented profiles.storefront_views with a
-- read-modify-write issued as the VISITOR. `profiles` has UPDATE policies only
-- for self and admins, so the statement matched zero rows on every public view:
-- the column sat at 0 forever and the /dealers directory, which orders by it,
-- was sorting an all-zero column. It was also a lost-update pattern.
--
-- This RPC does it atomically in one statement. EXECUTE is granted only to the
-- service role, so a visitor cannot inflate another business's view count.

CREATE OR REPLACE FUNCTION increment_storefront_views(p_profile_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET storefront_views = COALESCE(storefront_views, 0) + 1
  WHERE id = p_profile_id
    AND is_business = true;
END;
$$;

REVOKE ALL ON FUNCTION increment_storefront_views(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION increment_storefront_views(UUID) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_storefront_views(UUID) TO service_role;

COMMENT ON FUNCTION increment_storefront_views(UUID) IS
  'Atomically bumps a business profile storefront_views. Service role only — called from the storefront page.';

-- Index supporting the /dealers directory ordering.
CREATE INDEX IF NOT EXISTS idx_profiles_storefront_views
  ON profiles(storefront_views DESC)
  WHERE is_business = true AND slug IS NOT NULL;
