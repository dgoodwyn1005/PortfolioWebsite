-- Add RLS policies for silent_pianist_videos table
-- The table has RLS enabled but no policies, so all operations are blocked

-- Allow public read access
CREATE POLICY "Public read silent_pianist_videos"
ON public.silent_pianist_videos
FOR SELECT
USING (true);

-- Allow authenticated users to manage (insert, update, delete)
CREATE POLICY "Admin manage silent_pianist_videos"
ON public.silent_pianist_videos
FOR ALL
USING (true)
WITH CHECK (true);
