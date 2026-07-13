-- Migration 066: Recreate dealer_staff_access_logs to match migration 024
--
-- The prod table drifted to a fundamentally different schema (extra NOT NULL
-- columns like `action` that neither migration 024 nor the app code know about),
-- so every voice-agent access-log insert failed. The table is empty in prod, so
-- drop and recreate it to exactly the intended 024 shape.

DROP TABLE IF EXISTS dealer_staff_access_logs CASCADE;

CREATE TABLE dealer_staff_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES dealer_staff(id) ON DELETE SET NULL,
  access_type TEXT DEFAULT 'voice' CHECK (access_type IN ('voice', 'app', 'web')),
  caller_phone TEXT,
  session_id TEXT,
  query TEXT,
  query_type TEXT,
  response_summary TEXT,
  auth_success BOOLEAN DEFAULT true,
  auth_method TEXT DEFAULT 'pin',
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_access_logs_dealer ON dealer_staff_access_logs(dealer_id);
CREATE INDEX IF NOT EXISTS idx_staff_access_logs_staff ON dealer_staff_access_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_access_logs_date ON dealer_staff_access_logs(accessed_at);

ALTER TABLE dealer_staff_access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dealers can view their own access logs" ON dealer_staff_access_logs;
CREATE POLICY "Dealers can view their own access logs" ON dealer_staff_access_logs
  FOR SELECT USING (auth.uid() = dealer_id);

DROP POLICY IF EXISTS "Service role can manage access logs" ON dealer_staff_access_logs;
CREATE POLICY "Service role can manage access logs" ON dealer_staff_access_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);
