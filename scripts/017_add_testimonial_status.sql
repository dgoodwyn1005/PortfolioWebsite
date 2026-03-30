-- Add status column to company_testimonials for approval workflow
ALTER TABLE company_testimonials 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';

-- Update existing testimonials to be approved
UPDATE company_testimonials SET status = 'approved' WHERE status IS NULL;

-- Add policy to allow anyone to submit testimonials
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can submit testimonials'
  ) THEN
    CREATE POLICY "Anyone can submit testimonials" ON company_testimonials 
    FOR INSERT TO anon, authenticated 
    WITH CHECK (true);
  END IF;
END $$;
