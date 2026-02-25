-- Migration 031: Soft delete for profiles + missing composite indexes
-- Prevents accidental total data loss when deleting dealer accounts

-- 1. Add soft delete column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Index for filtering out deleted profiles efficiently
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at) WHERE deleted_at IS NULL;

-- 2. Add composite indexes for common query patterns

-- Listing search: status + featured + created_at (most common query)
CREATE INDEX IF NOT EXISTS idx_listings_search_composite
  ON listings(status, is_featured DESC, created_at DESC)
  WHERE status = 'active';

-- Chat conversations: dealer_id + status + created_at
CREATE INDEX IF NOT EXISTS idx_chat_conversations_dealer_recent
  ON chat_conversations(dealer_id, status, created_at DESC);

-- Chat messages: conversation_id + created_at for pagination
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_time
  ON chat_messages(conversation_id, created_at DESC);

-- Manufacturer products: active product browsing
CREATE INDEX IF NOT EXISTS idx_manufacturer_products_browse
  ON manufacturer_products(is_active, manufacturer_id, sort_order, name)
  WHERE is_active = true;

-- 3. Add limit to listing views to prevent unbounded growth per session
-- (Add a composite index for deduplication checks)
CREATE INDEX IF NOT EXISTS idx_listing_views_dedup
  ON listing_views(listing_id, ip_hash, view_date);

-- 4. Create a view for non-deleted profiles (convenience)
CREATE OR REPLACE VIEW active_profiles AS
  SELECT * FROM profiles WHERE deleted_at IS NULL;

-- 5. Add RLS policy to hide deleted profiles from normal queries
-- (Only admins can see deleted profiles)
DO $$
BEGIN
  -- Drop existing select policy if it exists, then recreate
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone'
  ) THEN
    DROP POLICY "Profiles are viewable by everyone" ON profiles;
  END IF;

  CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (deleted_at IS NULL OR auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    ));
END $$;
