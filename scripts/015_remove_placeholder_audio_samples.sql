-- Remove placeholder audio samples that have invalid URLs
-- The section will only show when real audio samples are uploaded via admin
DELETE FROM audio_samples 
WHERE audio_url LIKE '/samples/%' 
   OR audio_url LIKE '%sample%'
   OR audio_url LIKE '%placeholder%';
