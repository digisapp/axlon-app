-- Outreach contacts table for prospective dealer leads
-- Sourced from industry directories (SC&RA, CONEXPO, NTDA, etc.)

CREATE TABLE outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Company info
  name TEXT NOT NULL,
  website TEXT,
  email TEXT,
  phone TEXT,
  fax TEXT,
  toll_free TEXT,

  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,

  -- Classification
  source TEXT NOT NULL DEFAULT 'manual', -- scra, conexpo, ntda, manual
  source_id TEXT, -- ID from the source directory
  service_codes TEXT[], -- e.g., ['T-Transportation', 'C-Crane']

  -- Contact persons (JSONB array)
  personnel JSONB DEFAULT '[]'::jsonb,

  -- Outreach tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'not_interested', 'signed_up', 'archived')),
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,

  -- Meta
  member_since TEXT, -- year they joined the source org
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_outreach_contacts_source ON outreach_contacts(source);
CREATE INDEX idx_outreach_contacts_status ON outreach_contacts(status);
CREATE INDEX idx_outreach_contacts_state ON outreach_contacts(state);
CREATE INDEX idx_outreach_contacts_name ON outreach_contacts(name);
CREATE INDEX idx_outreach_contacts_created ON outreach_contacts(created_at DESC);

-- Full text search on name, email, city, state
CREATE INDEX idx_outreach_contacts_search ON outreach_contacts
  USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(city, '') || ' ' || coalesce(state, '')));

-- Prevent duplicate imports from same source
CREATE UNIQUE INDEX idx_outreach_contacts_source_unique
  ON outreach_contacts(source, source_id) WHERE source_id IS NOT NULL;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_outreach_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_outreach_contacts_updated_at
  BEFORE UPDATE ON outreach_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_outreach_contacts_updated_at();

-- RLS: Only authenticated users can access (admin feature)
ALTER TABLE outreach_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view outreach contacts"
  ON outreach_contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert outreach contacts"
  ON outreach_contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update outreach contacts"
  ON outreach_contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete outreach contacts"
  ON outreach_contacts FOR DELETE
  TO authenticated
  USING (true);
