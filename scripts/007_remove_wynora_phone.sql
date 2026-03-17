-- Remove the public phone number from Wynora
UPDATE companies 
SET contact_phone = NULL 
WHERE slug = 'wynora';
