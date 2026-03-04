-- Migration: Dealer Knowledge Base (xAI Collections Integration)
-- Adds tables and columns to support per-dealer xAI Collections for AI chat

-- Add collection tracking columns to dealer_ai_settings
ALTER TABLE dealer_ai_settings
  ADD COLUMN IF NOT EXISTS xai_collection_id TEXT,
  ADD COLUMN IF NOT EXISTS xai_collection_status TEXT DEFAULT 'none'
    CHECK (xai_collection_status IN ('none', 'creating', 'active', 'error')),
  ADD COLUMN IF NOT EXISTS xai_collection_error TEXT,
  ADD COLUMN IF NOT EXISTS knowledge_base_enabled BOOLEAN DEFAULT false;

-- Track synced listing documents in xAI
CREATE TABLE IF NOT EXISTS dealer_kb_listing_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  xai_file_id TEXT NOT NULL,
  content_hash TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error')),
  sync_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dealer_id, listing_id)
);

-- Track dealer-uploaded custom documents
CREATE TABLE IF NOT EXISTS dealer_kb_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  xai_file_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT DEFAULT 'general'
    CHECK (document_type IN ('spec_sheet', 'warranty', 'policy', 'brochure', 'price_list', 'general')),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  storage_path TEXT,
  upload_status TEXT DEFAULT 'pending'
    CHECK (upload_status IN ('pending', 'uploading', 'synced', 'error')),
  upload_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dealer_kb_listing_docs_dealer ON dealer_kb_listing_docs(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_kb_listing_docs_listing ON dealer_kb_listing_docs(listing_id);
CREATE INDEX IF NOT EXISTS idx_dealer_kb_documents_dealer ON dealer_kb_documents(dealer_id);

-- RLS
ALTER TABLE dealer_kb_listing_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_kb_documents ENABLE ROW LEVEL SECURITY;

-- Dealers can view own KB listing docs
CREATE POLICY "dealers_view_own_kb_listing_docs" ON dealer_kb_listing_docs
  FOR SELECT USING (auth.uid() = dealer_id);

-- Dealers can view own KB documents
CREATE POLICY "dealers_view_own_kb_documents" ON dealer_kb_documents
  FOR SELECT USING (auth.uid() = dealer_id);

CREATE POLICY "dealers_insert_own_kb_documents" ON dealer_kb_documents
  FOR INSERT WITH CHECK (auth.uid() = dealer_id);

CREATE POLICY "dealers_update_own_kb_documents" ON dealer_kb_documents
  FOR UPDATE USING (auth.uid() = dealer_id);

CREATE POLICY "dealers_delete_own_kb_documents" ON dealer_kb_documents
  FOR DELETE USING (auth.uid() = dealer_id);

-- Service role policies for sync operations (listing docs are managed server-side)
CREATE POLICY "service_role_manage_kb_listing_docs" ON dealer_kb_listing_docs
  FOR ALL USING (auth.role() = 'service_role');

-- Storage bucket for dealer documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dealer-documents',
  'dealer-documents',
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "dealers_view_own_storage_docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'dealer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "dealers_upload_own_storage_docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dealer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "dealers_delete_own_storage_docs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dealer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Updated_at triggers
CREATE TRIGGER trigger_dealer_kb_listing_docs_updated_at
  BEFORE UPDATE ON dealer_kb_listing_docs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_dealer_kb_documents_updated_at
  BEFORE UPDATE ON dealer_kb_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
