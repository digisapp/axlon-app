-- Migration 032: Fix infinite recursion in profiles RLS policy
-- The policy "Profiles are viewable by everyone" references profiles table
-- in a subquery, causing infinite recursion when PostgreSQL evaluates the policy.
-- Fix: use a SECURITY DEFINER function to bypass RLS for the admin check.

-- Create a function that checks admin status without triggering RLS
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = user_id),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recreate the policy using the function instead of a subquery
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone'
  ) THEN
    DROP POLICY "Profiles are viewable by everyone" ON profiles;
  END IF;

  CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (deleted_at IS NULL OR is_admin(auth.uid()));
END $$;
