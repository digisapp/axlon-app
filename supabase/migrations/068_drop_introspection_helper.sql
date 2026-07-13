-- Migration 068: Drop the temporary schema-introspection helper from 067.
-- The baseline reconciliation is complete; this function was only needed to read
-- the live column inventory (Docker wasn't available for `supabase db dump`).

DROP FUNCTION IF EXISTS public.__schema_snapshot();
