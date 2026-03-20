-- Add scheduling_url column to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS scheduling_url TEXT;
