-- Add metadata columns to company_portfolio for WynTech project details
ALTER TABLE company_portfolio ADD COLUMN IF NOT EXISTS problem_solved TEXT;
ALTER TABLE company_portfolio ADD COLUMN IF NOT EXISTS income_generated TEXT;
ALTER TABLE company_portfolio ADD COLUMN IF NOT EXISTS time_to_build TEXT;
ALTER TABLE company_portfolio ADD COLUMN IF NOT EXISTS technologies_used TEXT[];
ALTER TABLE company_portfolio ADD COLUMN IF NOT EXISTS key_features TEXT[];
ALTER TABLE company_portfolio ADD COLUMN IF NOT EXISTS lessons_learned TEXT;
ALTER TABLE company_portfolio ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
