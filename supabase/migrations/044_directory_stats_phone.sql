-- Add with_phone to directory stats and index on phone
CREATE INDEX IF NOT EXISTS idx_business_directory_phone ON business_directory(phone) WHERE phone IS NOT NULL;

CREATE OR REPLACE FUNCTION get_directory_stats()
RETURNS JSON LANGUAGE SQL STABLE AS $$
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM business_directory),
    'with_email', (SELECT COUNT(*) FROM business_directory WHERE email IS NOT NULL),
    'with_phone', (SELECT COUNT(*) FROM business_directory WHERE phone IS NOT NULL),
    'by_source', (SELECT json_object_agg(source, cnt) FROM (SELECT source, COUNT(*)::INT AS cnt FROM business_directory GROUP BY source) s),
    'by_category', (SELECT json_object_agg(category, cnt) FROM (SELECT category, COUNT(*)::INT AS cnt FROM business_directory GROUP BY category) c),
    'by_invite_status', (SELECT json_object_agg(invite_status, cnt) FROM (SELECT invite_status, COUNT(*)::INT AS cnt FROM business_directory GROUP BY invite_status) i)
  );
$$;
