-- Add Calendly URLs for booking discovery calls
-- Update these with your actual Calendly URLs

-- Add scheduling_url column if it doesn't exist
ALTER TABLE companies ADD COLUMN IF NOT EXISTS scheduling_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS calendly_url TEXT;

-- Set placeholder URLs (update with your real Calendly links)
UPDATE companies 
SET scheduling_url = 'https://calendly.com/wynora/discovery-call'
WHERE slug = 'wynora';

UPDATE companies 
SET scheduling_url = 'https://calendly.com/wyntech/discovery-call'
WHERE slug = 'wyntech';
