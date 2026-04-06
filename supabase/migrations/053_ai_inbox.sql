-- AI Inbox
-- Holds AI-drafted responses for human review before sending.
-- High-confidence replies auto-send; lower-confidence ones queue here.

CREATE TABLE ai_inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Which dealer this belongs to
  dealer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Source lead (if from contact form / listing inquiry)
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Inbound inquiry details
  channel TEXT NOT NULL DEFAULT 'form' CHECK (channel IN ('form', 'email', 'sms', 'chat', 'phone')),
  from_name TEXT NOT NULL,
  from_email TEXT,
  from_phone TEXT,
  inquiry_text TEXT NOT NULL,

  -- AI-generated response
  ai_subject TEXT NOT NULL,
  ai_draft TEXT NOT NULL,           -- plain text version
  ai_draft_html TEXT NOT NULL,      -- HTML email version
  confidence FLOAT NOT NULL DEFAULT 0.0 CHECK (confidence BETWEEN 0 AND 1),
  confidence_reasons JSONB DEFAULT '[]', -- array of strings explaining the score

  -- Status flow: pending → approved/rejected/edited → sent
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'edited', 'sent', 'rejected')),

  -- Human editing
  edited_draft TEXT,                -- if the human edited before sending
  edited_subject TEXT,

  -- Feedback for learning
  feedback TEXT CHECK (feedback IN ('positive', 'negative')),
  feedback_note TEXT,

  -- Timing
  sent_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ai_inbox_dealer_idx ON ai_inbox_items (dealer_id, status, created_at DESC);
CREATE INDEX ai_inbox_lead_idx ON ai_inbox_items (lead_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER ai_inbox_items_updated_at
  BEFORE UPDATE ON ai_inbox_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: dealers see only their own inbox items
ALTER TABLE ai_inbox_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers access own ai_inbox_items"
  ON ai_inbox_items FOR ALL
  USING (dealer_id = auth.uid());

CREATE POLICY "Admins access all ai_inbox_items"
  ON ai_inbox_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
