-- Restrict outreach_contacts to admin-only access
-- The outreach feature is exclusively for admins to manage prospective dealer leads

DROP POLICY IF EXISTS "Authenticated users can view outreach contacts" ON outreach_contacts;
DROP POLICY IF EXISTS "Authenticated users can insert outreach contacts" ON outreach_contacts;
DROP POLICY IF EXISTS "Authenticated users can update outreach contacts" ON outreach_contacts;
DROP POLICY IF EXISTS "Authenticated users can delete outreach contacts" ON outreach_contacts;

CREATE POLICY "Admins can view outreach contacts"
  ON outreach_contacts FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert outreach contacts"
  ON outreach_contacts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update outreach contacts"
  ON outreach_contacts FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete outreach contacts"
  ON outreach_contacts FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));
