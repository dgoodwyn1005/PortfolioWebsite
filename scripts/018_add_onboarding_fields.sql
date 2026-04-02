-- Add onboarding fields to contact_submissions table
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS project_type TEXT,
ADD COLUMN IF NOT EXISTS has_existing_website BOOLEAN,
ADD COLUMN IF NOT EXISTS budget_range TEXT,
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Add a comment to describe the new fields
COMMENT ON COLUMN contact_submissions.project_type IS 'Type of project/package the client is interested in';
COMMENT ON COLUMN contact_submissions.has_existing_website IS 'Whether the client has an existing website';
COMMENT ON COLUMN contact_submissions.budget_range IS 'Client budget range';
COMMENT ON COLUMN contact_submissions.timeline IS 'Expected project timeline';
COMMENT ON COLUMN contact_submissions.referral_source IS 'How the client heard about us';
