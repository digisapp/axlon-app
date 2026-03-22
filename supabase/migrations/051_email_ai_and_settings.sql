-- Add AI classification columns to emails table
ALTER TABLE emails ADD COLUMN IF NOT EXISTS ai_draft_html TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS ai_draft_text TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS ai_category TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS ai_confidence REAL;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMPTZ;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

-- Index for AI-processed emails
CREATE INDEX IF NOT EXISTS idx_emails_ai_category ON emails(ai_category) WHERE ai_category IS NOT NULL;

-- Platform settings table for toggles (e.g., auto-reply)
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT 'true',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed auto-reply setting (enabled by default)
INSERT INTO platform_settings (key, value)
VALUES ('ai_auto_reply_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- RLS for platform_settings (admin-only)
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select platform settings"
  ON platform_settings FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can update platform settings"
  ON platform_settings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can insert platform settings"
  ON platform_settings FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Add DELETE policy for emails (was missing)
CREATE POLICY "Admins can delete emails"
  ON emails FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Add DELETE policy for email_threads
CREATE POLICY "Admins can delete email threads"
  ON email_threads FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );
