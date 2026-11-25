-- Add independent presentation and secondary source without replacing existing media.
alter table public.videos
  add column if not exists presentation_format text check (presentation_format in ('pov','performance')),
  add column if not exists youtube_video_id text check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  add column if not exists tiktok_video_id text check (tiktok_video_id ~ '^[0-9]+$');
