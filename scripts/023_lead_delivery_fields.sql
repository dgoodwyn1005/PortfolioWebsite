-- Review and apply only if these fields are absent in the target database.
-- The supplied archive reports that equivalent live changes already exist.
-- Does not apply the separate staged Wynora pricing migration.
BEGIN;
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS selected_service text,
  ADD COLUMN IF NOT EXISTS owner_notification_status text,
  ADD COLUMN IF NOT EXISTS owner_notification_attempted_at timestamptz,
  ADD COLUMN IF NOT EXISTS acknowledgement_status text,
  ADD COLUMN IF NOT EXISTS acknowledgement_attempted_at timestamptz;

-- Replace only checks solely on the lead-status column, retaining RLS and
-- notification checks. Migrate legacy inbox stages before enforcing the stages.
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.contact_submissions'::regclass AND contype = 'c'
      AND conkey = ARRAY[(SELECT attnum FROM pg_attribute
        WHERE attrelid = 'public.contact_submissions'::regclass
          AND attname = 'status')]::smallint[]
  LOOP
    EXECUTE format('ALTER TABLE public.contact_submissions DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;
UPDATE public.contact_submissions SET status = 'contacted' WHERE status IN ('read', 'replied');
ALTER TABLE public.contact_submissions ADD CONSTRAINT contact_submissions_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost', 'archived'));
COMMIT;
