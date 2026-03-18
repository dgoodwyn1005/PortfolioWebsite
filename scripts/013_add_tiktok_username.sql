-- Add tiktok_username column to silent_pianist_videos table
ALTER TABLE silent_pianist_videos 
ADD COLUMN IF NOT EXISTS tiktok_username TEXT DEFAULT 'TheSilentPianist';
