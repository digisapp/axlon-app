-- RPC functions for outreach stats to avoid Supabase 1000-row default limit

CREATE OR REPLACE FUNCTION outreach_stats_by_source()
RETURNS TABLE(source TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT source, count(*) as count
  FROM outreach_contacts
  GROUP BY source;
$$;

CREATE OR REPLACE FUNCTION outreach_stats_by_status()
RETURNS TABLE(status TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT status, count(*) as count
  FROM outreach_contacts
  GROUP BY status;
$$;
