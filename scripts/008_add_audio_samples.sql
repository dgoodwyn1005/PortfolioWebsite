-- Create audio_samples table for service tier samples with waveform player
CREATE TABLE IF NOT EXISTS audio_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  service_tier TEXT NOT NULL CHECK (service_tier IN ('accompaniment', 'live_performance', 'arrangement')),
  duration TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE audio_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to audio_samples"
  ON audio_samples FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Allow authenticated users to manage audio_samples"
  ON audio_samples FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample audio entries for Wynora (you'll need to replace with actual audio URLs)
INSERT INTO audio_samples (company_id, title, description, audio_url, service_tier, duration, display_order)
SELECT 
  c.id,
  'Piano Accompaniment Sample',
  'A 45-second demonstration of professional piano accompaniment for vocalists and instrumentalists.',
  '/samples/accompaniment-sample.mp3',
  'accompaniment',
  '0:45',
  1
FROM companies c WHERE c.slug = 'wynora';

INSERT INTO audio_samples (company_id, title, description, audio_url, service_tier, duration, display_order)
SELECT 
  c.id,
  'Live Performance Excerpt',
  'Experience the energy and artistry of a live gospel piano performance.',
  '/samples/live-performance-sample.mp3',
  'live_performance',
  '0:55',
  2
FROM companies c WHERE c.slug = 'wynora';

INSERT INTO audio_samples (company_id, title, description, audio_url, service_tier, duration, display_order)
SELECT 
  c.id,
  'Custom Arrangement Preview',
  'Hear how we transform a simple melody into a rich, full arrangement.',
  '/samples/arrangement-sample.mp3',
  'arrangement',
  '0:50',
  3
FROM companies c WHERE c.slug = 'wynora';
