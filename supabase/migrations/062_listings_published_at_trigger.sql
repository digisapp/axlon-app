-- Migration 062: Make listings.published_at authoritative for "became available"
--
-- Saved-search email alerts matched on created_at, so a listing that was drafted
-- and later published (via the editor or the publish_scheduled_listings() cron
-- RPC, which sets status='active' but never touched published_at) was never
-- alerted — its created_at predated the check window. This makes published_at
-- reliably reflect when a listing went active, via a trigger that catches EVERY
-- publish path (direct insert-active, draft->active update, and the cron RPC's
-- bulk UPDATE, since a row-level trigger fires per affected row).

-- 1) Backfill: existing active listings with no published_at get their created_at
--    (they are old, so this won't retro-spam alerts, but keeps the column complete).
UPDATE listings
SET published_at = created_at
WHERE status = 'active' AND published_at IS NULL;

-- 2) Trigger: stamp published_at the first time a row is active without one.
--    Only fills a NULL, so explicit published_at set by app code is preserved and
--    a re-publish (active -> draft -> active) keeps the original date (no re-alert).
CREATE OR REPLACE FUNCTION set_listing_published_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'active' AND NEW.published_at IS NULL THEN
    NEW.published_at := NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_listing_published_at ON listings;
CREATE TRIGGER trg_set_listing_published_at
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION set_listing_published_at();
