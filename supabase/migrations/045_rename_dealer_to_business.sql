-- Rename dealer columns to business on profiles table
-- This is a pre-launch cleanup: "dealer" → "business" for all account types

-- Rename columns
ALTER TABLE profiles RENAME COLUMN is_dealer TO is_business;
ALTER TABLE profiles RENAME COLUMN dealer_status TO business_status;
ALTER TABLE profiles RENAME COLUMN dealer_applied_at TO business_applied_at;
ALTER TABLE profiles RENAME COLUMN dealer_reviewed_at TO business_reviewed_at;
ALTER TABLE profiles RENAME COLUMN dealer_reviewed_by TO business_reviewed_by;
ALTER TABLE profiles RENAME COLUMN dealer_rejection_reason TO business_rejection_reason;

-- Update check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_dealer_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_business_status_check
  CHECK (business_status IN ('none', 'pending', 'approved', 'rejected'));

-- Drop old indexes and create new ones
DROP INDEX IF EXISTS idx_profiles_is_dealer;
DROP INDEX IF EXISTS idx_profiles_dealer_status;

CREATE INDEX idx_profiles_is_business ON profiles(is_business) WHERE is_business = true;
CREATE INDEX idx_profiles_business_status ON profiles(business_status) WHERE business_status = 'pending';
