-- Create table for Silent Pianist videos
CREATE TABLE IF NOT EXISTS silent_pianist_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'youtube',
  embed_id TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Silent Pianist videos for Wynora
INSERT INTO silent_pianist_videos (company_id, title, platform, embed_id, display_order, is_visible)
SELECT 
  id,
  'The Silent Pianist - Episode 1',
  'youtube',
  'dQw4w9WgXcQ',
  1,
  true
FROM companies WHERE slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO silent_pianist_videos (company_id, title, platform, embed_id, display_order, is_visible)
SELECT 
  id,
  'The Silent Pianist - Behind the Scenes',
  'youtube',
  'dQw4w9WgXcQ',
  2,
  true
FROM companies WHERE slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO silent_pianist_videos (company_id, title, platform, embed_id, display_order, is_visible)
SELECT 
  id,
  'The Silent Pianist - Live Performance',
  'tiktok',
  '7339123456789012345',
  3,
  true
FROM companies WHERE slug = 'wynora'
ON CONFLICT DO NOTHING;
