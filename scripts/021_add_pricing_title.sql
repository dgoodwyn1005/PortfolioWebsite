-- Add title column to pricing table
ALTER TABLE pricing 
ADD COLUMN IF NOT EXISTS title TEXT;

-- Set default titles based on service_type
UPDATE pricing 
SET title = CASE 
  WHEN service_type = 'music' THEN 'Music Services'
  WHEN service_type = 'basketball' THEN 'Basketball Training'
  ELSE INITCAP(REPLACE(service_type, '_', ' '))
END
WHERE title IS NULL;
