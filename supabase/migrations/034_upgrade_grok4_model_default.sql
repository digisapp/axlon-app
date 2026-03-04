-- Migration: Upgrade default AI model from grok-2-public to grok-4-1-fast-non-reasoning
-- Updates the column default and migrates existing rows still on old models

-- Update column default
ALTER TABLE ai_agent_settings
  ALTER COLUMN model SET DEFAULT 'grok-4-1-fast-non-reasoning';

-- Migrate existing rows from legacy models to grok-4
UPDATE ai_agent_settings
SET model = 'grok-4-1-fast-non-reasoning'
WHERE model IN ('grok-2-public', 'grok-2-latest');
