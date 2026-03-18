-- Add start_time and end_time columns to videos table for YouTube clip embeds
ALTER TABLE videos ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Also add to silent_pianist_videos table
ALTER TABLE silent_pianist_videos ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE silent_pianist_videos ADD COLUMN IF NOT EXISTS end_time TEXT;
