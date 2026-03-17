-- Security hardening: RLS on business_directory, restrict stats function

-- 1. Enable RLS on business_directory (was missing)
ALTER TABLE business_directory ENABLE ROW LEVEL SECURITY;

-- Admin-only read access
CREATE POLICY "Admins can view directory"
  ON business_directory FOR SELECT
  USING (is_admin(auth.uid()));

-- Admin-only insert
CREATE POLICY "Admins can insert directory"
  ON business_directory FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Admin-only update
CREATE POLICY "Admins can update directory"
  ON business_directory FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Admin-only delete
CREATE POLICY "Admins can delete directory"
  ON business_directory FOR DELETE
  USING (is_admin(auth.uid()));

-- Service role full access (for scripts/cron)
CREATE POLICY "Service role full access to directory"
  ON business_directory FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. Restrict get_directory_stats to admin only
CREATE OR REPLACE FUNCTION get_directory_stats()
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RETURN '{}'::JSON;
  END IF;

  RETURN (
    SELECT json_build_object(
      'total', (SELECT COUNT(*) FROM business_directory),
      'with_email', (SELECT COUNT(*) FROM business_directory WHERE email IS NOT NULL),
      'by_source', (SELECT json_object_agg(source, cnt) FROM (SELECT source, COUNT(*)::INT AS cnt FROM business_directory GROUP BY source) s),
      'by_category', (SELECT json_object_agg(category, cnt) FROM (SELECT category, COUNT(*)::INT AS cnt FROM business_directory GROUP BY category) c),
      'by_invite_status', (SELECT json_object_agg(invite_status, cnt) FROM (SELECT invite_status, COUNT(*)::INT AS cnt FROM business_directory GROUP BY invite_status) i)
    )
  );
END;
$$;
