-- Migration 065: dealer_staff_access_logs.staff_id must be nullable
--
-- Prod drifted staff_id to NOT NULL, but the voice-agent auth FAILURE path logs
-- an attempt with no matching staff (staff_id null). That insert violated the
-- constraint and 500'd. The intended schema (migration 024) had staff_id
-- nullable with ON DELETE SET NULL, so restore that.

ALTER TABLE dealer_staff_access_logs ALTER COLUMN staff_id DROP NOT NULL;
