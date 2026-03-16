-- Business directory: imported businesses from SCRA, ConExpo, scraped dealers, etc.
-- Used by admin to categorize, then invite to the platform.

CREATE TABLE IF NOT EXISTS business_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source tracking
  source TEXT NOT NULL, -- 'scra', 'conexpo', 'scraped', 'manual'
  source_id TEXT, -- original ID from source data

  -- Business info
  company_name TEXT NOT NULL,
  category TEXT DEFAULT 'uncategorized', -- trailer_dealer, crane_rigging, truck_manufacturer, trailer_manufacturer, transportation, equipment_dealer, parts_supplier, services, other, uncategorized

  -- Contact info
  email TEXT,
  phone TEXT,
  website TEXT,

  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',

  -- Additional data
  description TEXT,
  contact_name TEXT,
  contact_title TEXT,
  contact_email TEXT,
  brands TEXT[], -- associated brands
  equipment_types TEXT[], -- what they sell/haul
  tags TEXT[], -- service codes, keywords, etc.
  raw_data JSONB, -- full original record for reference

  -- Platform status
  invite_status TEXT DEFAULT 'none', -- none, invited, accepted, declined
  invited_at TIMESTAMPTZ,
  invite_email_id TEXT, -- Resend email ID
  profile_id UUID REFERENCES profiles(id), -- linked after they sign up

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_directory_source ON business_directory(source);
CREATE INDEX idx_business_directory_category ON business_directory(category);
CREATE INDEX idx_business_directory_state ON business_directory(state);
CREATE INDEX idx_business_directory_invite_status ON business_directory(invite_status);
CREATE INDEX idx_business_directory_email ON business_directory(email);

-- Prevent duplicate imports
CREATE UNIQUE INDEX idx_business_directory_source_id ON business_directory(source, source_id) WHERE source_id IS NOT NULL;

-- Stats function for admin dashboard
CREATE OR REPLACE FUNCTION get_directory_stats()
RETURNS JSON LANGUAGE SQL STABLE AS $$
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM business_directory),
    'with_email', (SELECT COUNT(*) FROM business_directory WHERE email IS NOT NULL),
    'by_source', (SELECT json_object_agg(source, cnt) FROM (SELECT source, COUNT(*)::INT AS cnt FROM business_directory GROUP BY source) s),
    'by_category', (SELECT json_object_agg(category, cnt) FROM (SELECT category, COUNT(*)::INT AS cnt FROM business_directory GROUP BY category) c),
    'by_invite_status', (SELECT json_object_agg(invite_status, cnt) FROM (SELECT invite_status, COUNT(*)::INT AS cnt FROM business_directory GROUP BY invite_status) i)
  );
$$;
