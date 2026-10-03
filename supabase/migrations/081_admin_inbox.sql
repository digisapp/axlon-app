-- Admin email inbox: folders, threading and attachments.
--
-- The inbox on /admin/email grows the digis-style feature set: starred and
-- spam folders, exact threading through a per-thread Reply-To plus-address
-- (support+<threadId>@<receiving domain>), In-Reply-To matching on the real
-- RFC Message-ID, attachment metadata, a one-line preview per thread, and a
-- shared (not per-admin) inbox.
--
-- Everything is additive and idempotent. No row is deleted or rewritten
-- except the backfills marked below, which only fill NULLs.

-- ─── Threads ───────────────────────────────────────────

ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS is_starred BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS is_spam BOOLEAN NOT NULL DEFAULT false;
-- One-line preview of the newest message, maintained by the trigger below so
-- the list view never has to join emails.
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS last_preview TEXT;
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS last_direction TEXT
  CHECK (last_direction IS NULL OR last_direction IN ('inbound', 'outbound'));
-- How many messages we sent in the thread; the Sent folder is outbound_count > 0.
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS outbound_count INT NOT NULL DEFAULT 0;
-- Sender matched to a platform account by email, when there is one.
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS linked_profile_id UUID
  REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_email_threads_starred
  ON email_threads(last_message_at DESC) WHERE is_starred = true AND is_spam = false;
CREATE INDEX IF NOT EXISTS idx_email_threads_spam
  ON email_threads(last_message_at DESC) WHERE is_spam = true;
CREATE INDEX IF NOT EXISTS idx_email_threads_inbox
  ON email_threads(last_message_at DESC) WHERE is_spam = false;
CREATE INDEX IF NOT EXISTS idx_email_threads_sent
  ON email_threads(last_message_at DESC) WHERE outbound_count > 0 AND is_spam = false;
CREATE INDEX IF NOT EXISTS idx_email_threads_linked_profile
  ON email_threads(linked_profile_id) WHERE linked_profile_id IS NOT NULL;

-- ─── Emails ────────────────────────────────────────────

-- The RFC Message-ID header of the message (angle brackets stripped). Inbound
-- replies carry it in In-Reply-To, which is how a reply finds its thread when
-- the plus-address tag is missing. Was buried in headers->>'message_id'.
ALTER TABLE emails ADD COLUMN IF NOT EXISTS message_id TEXT;
-- Attachment metadata from Resend: [{ id, filename, content_type, size }].
-- The bytes stay with Resend; /api/admin/inbox/[id]/attachments/[aid]
-- redirects to a short-lived signed download URL.
ALTER TABLE emails ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE emails
   SET message_id = NULLIF(regexp_replace(headers->>'message_id', '[<>\s]', '', 'g'), '')
 WHERE message_id IS NULL
   AND headers ? 'message_id'
   AND headers->>'message_id' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_emails_message_id ON emails(message_id) WHERE message_id IS NOT NULL;
-- Inbound dedup on webhook retries is keyed by Resend's received-email id.
CREATE INDEX IF NOT EXISTS idx_emails_inbound_resend_id
  ON emails(resend_id) WHERE direction = 'inbound' AND resend_id IS NOT NULL;

-- The status CHECK predates delivery failures reported by Resend; 'failed'
-- was already allowed, 'complained' too. Nothing to change there.

-- ─── Thread bookkeeping trigger ────────────────────────

-- One line of readable text out of an email body, for the thread list.
-- Prefers the text part; otherwise strips the HTML (style/script/head blocks
-- first, so CSS never shows up as the preview) and decodes the common entities.
CREATE OR REPLACE FUNCTION email_preview_text(text_body TEXT, html_body TEXT)
RETURNS TEXT AS $$
  SELECT NULLIF(btrim(left(regexp_replace(
    COALESCE(
      NULLIF(btrim(text_body), ''),
      replace(replace(replace(replace(replace(replace(
        regexp_replace(
          regexp_replace(COALESCE(html_body, ''), '<(style|script|head|title)[^>]*>.*?</\1>', ' ', 'gi'),
          '<[^>]+>', ' ', 'g'),
        '&nbsp;', ' '), '&amp;', '&'), '&lt;', '<'), '&gt;', '>'), '&quot;', '"'), '&#39;', '''')
    ),
    '\s+', ' ', 'g'), 200)), '');
$$ LANGUAGE sql IMMUTABLE SET search_path = public;

-- Extends the original 050 trigger: also records a preview, the direction of
-- the newest message and how many messages we sent. Same status rules as before.
CREATE OR REPLACE FUNCTION update_email_thread_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE email_threads SET
    last_message_at = NEW.created_at,
    message_count = message_count + 1,
    outbound_count = outbound_count + CASE WHEN NEW.direction = 'outbound' THEN 1 ELSE 0 END,
    last_preview = email_preview_text(NEW.text_body, NEW.html_body),
    last_direction = NEW.direction,
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Backfill the outbound counter (threads created before this column existed).
UPDATE email_threads t
   SET outbound_count = c.n
  FROM (SELECT thread_id, count(*)::int AS n FROM emails WHERE direction = 'outbound' GROUP BY thread_id) c
 WHERE c.thread_id = t.id
   AND t.outbound_count = 0;

-- Backfill preview/direction for existing threads from their newest email.
UPDATE email_threads t
   SET last_preview = email_preview_text(e.text_body, e.html_body),
       last_direction = e.direction
  FROM (
    SELECT DISTINCT ON (thread_id) thread_id, text_body, html_body, direction
      FROM emails
     ORDER BY thread_id, created_at DESC
  ) e
 WHERE e.thread_id = t.id
   AND t.last_direction IS NULL;

-- ─── platform_settings ─────────────────────────────────

-- The inbox reads/writes only its own keys through /api/admin/inbox/settings
-- (whitelisted in code). The row seeded by 051 is left as it is — turning
-- auto-reply on or off is an admin decision made in the UI, with confirmation.

-- RLS: the admin-only policies from 050/051 cover the new columns. The
-- webhook and the inbox service use the service role.
