-- Apply after the simplified Wynora contact form is deployed.
-- The current production form contains stale hard-coded package prices,
-- so applying these values before the code deployment would create
-- customer-visible pricing conflicts.

UPDATE public.company_services
SET
  price = CASE title
    WHEN 'Live Performance (Essential)' THEN 'Starting at $450'
    WHEN 'Live Performance (Premium)' THEN 'Starting at $850'
    WHEN 'Luxury Session' THEN 'Starting at $1,400'
    WHEN 'Piano Accompaniment' THEN '$75/hr or $150/session'
    WHEN 'Audio-Only Recording' THEN 'Starting at $200'
    WHEN 'Simple Arrangement' THEN 'Starting at $200'
    ELSE price
  END,
  updated_at = now()
WHERE company_id = (
  SELECT id
  FROM public.companies
  WHERE slug = 'wynora'
  LIMIT 1
)
AND title IN (
  'Live Performance (Essential)',
  'Live Performance (Premium)',
  'Luxury Session',
  'Piano Accompaniment',
  'Audio-Only Recording',
  'Simple Arrangement'
);
