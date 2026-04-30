-- 1. Add identity_hash column to leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS identity_hash TEXT UNIQUE;

-- 2. Drop the old UNIQUE(name, city) constraint since we use identity_hash now
ALTER TABLE leads
DROP CONSTRAINT IF EXISTS leads_name_city_key;

-- 3. Modify the status column to support the new state machine
-- Note: Postgres requires dropping the old CHECK constraint before adding a new one
ALTER TABLE leads
DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE leads
ADD CONSTRAINT leads_status_check CHECK (status IN (
  'INGESTED', 
  'TRANSFORMED_LLM', 
  'ASSET_GENERATED', 
  'READY_FOR_OUTREACH', 
  'PITCHED',
  'FAILED'
));

-- Update any existing rows to match the new schema states
UPDATE leads SET status = 'INGESTED' WHERE status = 'new';
UPDATE leads SET status = 'PITCHED' WHERE status IN ('messaged', 'replied');

-- 4. Add structured JSON storage for LLM outputs
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS llm_structured_data JSONB;
