-- Update WynTech with new logo and color scheme (silver/charcoal theme)
UPDATE companies
SET 
  logo_url = '/logos/wyntech-logo.png',
  primary_color = '#9ca3af'
WHERE slug = 'wyntech';

-- Update Wynora with new logo and color scheme (muted purple/mauve theme)
UPDATE companies
SET 
  logo_url = '/logos/wynora-logo.png',
  primary_color = '#8b7b8b'
WHERE slug = 'wynora';
