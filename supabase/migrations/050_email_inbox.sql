-- Email Inbox System (Admin-only)
-- Stores all sent and received emails with threading and status tracking

-- Email threads group related emails together
CREATE TABLE email_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  -- The admin user who owns this thread
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Last activity timestamp for sorting
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Number of emails in thread
  message_count INT NOT NULL DEFAULT 0,
  -- Whether thread has unread inbound emails
  is_unread BOOLEAN NOT NULL DEFAULT false,
  -- Thread status: open (sent), received (has inbound reply), read, replied, archived, trash
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'received', 'read', 'replied', 'archived', 'trash')),
  -- The external email address this thread is with
  participant_email TEXT NOT NULL,
  participant_name TEXT,
  -- Optional link to a listing or lead
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES dealer_ai_leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual emails (both sent and received)
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES email_threads(id) ON DELETE CASCADE,
  -- Resend email ID for tracking
  resend_id TEXT,
  -- Direction
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  -- Addresses
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  to_name TEXT,
  reply_to TEXT,
  -- Content
  subject TEXT NOT NULL,
  html_body TEXT,
  text_body TEXT,
  -- Delivery status
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed', 'received')),
  -- Metadata
  headers JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  -- Read tracking
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_email_threads_owner ON email_threads(owner_id, status, last_message_at DESC);
CREATE INDEX idx_email_threads_participant ON email_threads(participant_email);
CREATE INDEX idx_email_threads_status ON email_threads(status, last_message_at DESC);
CREATE INDEX idx_emails_thread ON emails(thread_id, created_at);
CREATE INDEX idx_emails_resend_id ON emails(resend_id) WHERE resend_id IS NOT NULL;
CREATE INDEX idx_emails_direction ON emails(direction, created_at DESC);

-- Auto-update thread on new email insert
CREATE OR REPLACE FUNCTION update_email_thread_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE email_threads SET
    last_message_at = NEW.created_at,
    message_count = message_count + 1,
    is_unread = CASE WHEN NEW.direction = 'inbound' THEN true ELSE is_unread END,
    status = CASE
      WHEN NEW.direction = 'inbound' THEN 'received'
      WHEN NEW.direction = 'outbound' AND status = 'received' THEN 'replied'
      ELSE status
    END,
    updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_thread_on_email
AFTER INSERT ON emails
FOR EACH ROW EXECUTE FUNCTION update_email_thread_on_insert();

-- ─── RLS: Admin-only access ─────────────────────────────

ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Admins can do everything on email_threads
CREATE POLICY "Admins can select email threads"
  ON email_threads FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can insert email threads"
  ON email_threads FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can update email threads"
  ON email_threads FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can delete email threads"
  ON email_threads FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Admins can do everything on emails
CREATE POLICY "Admins can select emails"
  ON emails FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can insert emails"
  ON emails FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can update emails"
  ON emails FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );
