-- CRM Contacts and Activities tables
-- Separate from leads table which tracks incoming buyer inquiries tied to listings.
-- CRM contacts track business relationships independently.

-- ============================================================================
-- CRM CONTACTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai_chat', 'website', 'storefront', 'outreach', 'referral')),
  notes TEXT,
  deal_value DECIMAL(12, 2) DEFAULT 0,
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_contacts_dealer_id ON crm_contacts(dealer_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_created_at ON crm_contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_dealer_status ON crm_contacts(dealer_id, status);

-- Updated_at trigger
CREATE TRIGGER set_crm_contacts_updated_at
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can view their own contacts"
  ON crm_contacts FOR SELECT
  USING (auth.uid() = dealer_id);

CREATE POLICY "Dealers can create contacts"
  ON crm_contacts FOR INSERT
  WITH CHECK (auth.uid() = dealer_id);

CREATE POLICY "Dealers can update their own contacts"
  ON crm_contacts FOR UPDATE
  USING (auth.uid() = dealer_id);

CREATE POLICY "Dealers can delete their own contacts"
  ON crm_contacts FOR DELETE
  USING (auth.uid() = dealer_id);

-- ============================================================================
-- CRM ACTIVITIES TABLE (activity log for contacts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  dealer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('note', 'call', 'email', 'meeting', 'deal_update')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_activities_contact_id ON crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_dealer_id ON crm_activities(dealer_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created_at ON crm_activities(created_at DESC);

-- RLS
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can view their own activities"
  ON crm_activities FOR SELECT
  USING (auth.uid() = dealer_id);

CREATE POLICY "Dealers can create activities"
  ON crm_activities FOR INSERT
  WITH CHECK (auth.uid() = dealer_id);

CREATE POLICY "Dealers can delete their own activities"
  ON crm_activities FOR DELETE
  USING (auth.uid() = dealer_id);
