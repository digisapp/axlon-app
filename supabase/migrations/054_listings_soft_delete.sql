-- Migration 054: Soft deletes for listings
-- Prevents permanent data loss when dealers delete listings.
-- Deleted listings are hidden from all queries but recoverable by admins.

-- 1. Add soft-delete columns
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Partial index: fast filtering of non-deleted listings (the hot path)
CREATE INDEX IF NOT EXISTS idx_listings_not_deleted
  ON listings(deleted_at)
  WHERE deleted_at IS NULL;

-- Index for admins querying deleted listings
CREATE INDEX IF NOT EXISTS idx_listings_deleted
  ON listings(deleted_at, user_id)
  WHERE deleted_at IS NOT NULL;

-- 2. Update active-listing search index to also exclude soft-deleted
DROP INDEX IF EXISTS idx_listings_search_composite;
CREATE INDEX IF NOT EXISTS idx_listings_search_composite
  ON listings(status, is_featured DESC, created_at DESC)
  WHERE status = 'active' AND deleted_at IS NULL;

-- 3. RLS: hide soft-deleted listings from everyone except admins
--    Re-create the select policy to include the deleted_at filter.

-- Drop existing policies that don't account for soft deletes
DO $$
BEGIN
  -- Public select policy
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listings' AND policyname = 'Listings are viewable by everyone'
  ) THEN
    DROP POLICY "Listings are viewable by everyone" ON listings;
  END IF;

  -- Owner select policy (if separate)
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listings' AND policyname = 'Users can view own listings'
  ) THEN
    DROP POLICY "Users can view own listings" ON listings;
  END IF;
END $$;

-- Public can only see non-deleted listings
CREATE POLICY "Listings are viewable by everyone"
  ON listings FOR SELECT
  USING (
    deleted_at IS NULL
    OR is_admin(auth.uid())
    OR user_id = auth.uid()
  );

-- 4. Helper function: soft-delete a listing
CREATE OR REPLACE FUNCTION soft_delete_listing(
  p_listing_id UUID,
  p_deleted_by UUID
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE listings
  SET
    deleted_at = now(),
    deleted_by = p_deleted_by,
    status = 'deleted'
  WHERE id = p_listing_id
    AND deleted_at IS NULL;
END;
$$;

-- 5. Helper function: restore a soft-deleted listing (admin only)
CREATE OR REPLACE FUNCTION restore_listing(
  p_listing_id UUID
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can restore listings';
  END IF;

  UPDATE listings
  SET
    deleted_at = NULL,
    deleted_by = NULL,
    status = 'draft'  -- restore to draft so owner can review before republishing
  WHERE id = p_listing_id
    AND deleted_at IS NOT NULL;
END;
$$;
