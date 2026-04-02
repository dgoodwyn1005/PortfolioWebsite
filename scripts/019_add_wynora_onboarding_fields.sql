-- Add Wynora-specific onboarding fields to contact_submissions

ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS event_date DATE,
ADD COLUMN IF NOT EXISTS event_location TEXT,
ADD COLUMN IF NOT EXISTS event_start_time TEXT,
ADD COLUMN IF NOT EXISTS event_end_time TEXT,
ADD COLUMN IF NOT EXISTS service_interest TEXT,
ADD COLUMN IF NOT EXISTS duration_needed TEXT,
ADD COLUMN IF NOT EXISTS piano_available TEXT,
ADD COLUMN IF NOT EXISTS within_50_miles TEXT,
ADD COLUMN IF NOT EXISTS song_requests TEXT;
