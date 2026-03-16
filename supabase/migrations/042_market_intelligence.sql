-- Market Intelligence Reports Storage
-- Stores weekly AI-generated market reports for dealers

CREATE TABLE IF NOT EXISTS dealer_market_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  report_data JSONB NOT NULL,
  report_html TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_reports_dealer ON dealer_market_reports(dealer_id, created_at DESC);

-- RLS
ALTER TABLE dealer_market_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can view own reports" ON dealer_market_reports
  FOR SELECT USING (auth.uid() = dealer_id);

CREATE POLICY "Service role can insert reports" ON dealer_market_reports
  FOR INSERT WITH CHECK (true);

-- Add market report preferences to dealer AI settings
ALTER TABLE dealer_ai_settings
  ADD COLUMN IF NOT EXISTS market_reports_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS market_report_frequency TEXT DEFAULT 'weekly'
    CHECK (market_report_frequency IN ('weekly', 'biweekly', 'monthly'));

COMMENT ON TABLE dealer_market_reports IS 'Weekly AI-generated market intelligence reports for dealers';
