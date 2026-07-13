-- Migration 067: TEMPORARY schema-introspection helper (dropped in 068)
--
-- Docker isn't available for `supabase db dump`, so this service-role-only
-- function returns the live column inventory to reconcile prod against the
-- migrations/code. It is dropped again in migration 068.

CREATE OR REPLACE FUNCTION public.__schema_snapshot()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_agg(
    jsonb_build_object(
      'table', c.table_name,
      'column', c.column_name,
      'type', c.data_type,
      'udt', c.udt_name,
      'nullable', c.is_nullable,
      'default', c.column_default
    )
    ORDER BY c.table_name, c.ordinal_position
  )
  FROM information_schema.columns c
  JOIN information_schema.tables t
    ON t.table_schema = c.table_schema AND t.table_name = c.table_name
  WHERE c.table_schema = 'public' AND t.table_type = 'BASE TABLE';
$$;

REVOKE ALL ON FUNCTION public.__schema_snapshot() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.__schema_snapshot() TO service_role;
