-- AI Transformation Consulting Clients
-- Tracks Nathan's 12-month consulting engagements

CREATE TABLE consulting_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Company info
  company_name TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN (
    'Heavy Haul / Lowboy Carrier',
    'Equipment Dealer',
    'Crane & Rigging',
    'Regional Fleet Operator',
    'Equipment Rental',
    'Specialized Transport',
    'Other'
  )),

  -- Primary contact
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_title TEXT,

  -- Contract details
  monthly_rate INTEGER NOT NULL, -- in dollars
  contract_start DATE NOT NULL,
  contract_end DATE NOT NULL,
  scoping_fee INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('prospect', 'scoping', 'active', 'maintenance', 'churned')),

  -- Current phase (1=Foundation, 2=Core Automation, 3=Optimization, 4=Maintenance)
  current_phase INTEGER NOT NULL DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 4),

  -- AI systems delivered (array of system names)
  ai_systems_live TEXT[] DEFAULT '{}',
  ai_systems_pending TEXT[] DEFAULT '{}',

  -- Next milestone
  next_milestone TEXT,
  next_milestone_date DATE,

  -- Notes (internal)
  notes TEXT,

  -- Linked to Axlon platform user (if they have an account)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Source of acquisition
  acquisition_source TEXT CHECK (acquisition_source IN (
    'scra-outreach', 'conexpo-outreach', 'referral', 'inbound', 'cold-email', 'linkedin', 'other'
  )),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for common queries
CREATE INDEX consulting_clients_status_idx ON consulting_clients (status);
CREATE INDEX consulting_clients_contract_end_idx ON consulting_clients (contract_end);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_consulting_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER consulting_clients_updated_at
  BEFORE UPDATE ON consulting_clients
  FOR EACH ROW EXECUTE FUNCTION update_consulting_clients_updated_at();

-- Milestones / activity log per client
CREATE TABLE consulting_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES consulting_clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  phase INTEGER NOT NULL CHECK (phase BETWEEN 1 AND 4),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'complete')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX consulting_milestones_client_idx ON consulting_milestones (client_id);

-- RLS: admin-only access
ALTER TABLE consulting_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to consulting_clients"
  ON consulting_clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admin full access to consulting_milestones"
  ON consulting_milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
