
-- Add RLS policies for track_lyrics table
ALTER TABLE IF EXISTS "public"."track_lyrics" ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Allow users to view track lyrics for tracks they have access to
CREATE POLICY "Users can view track lyrics" ON "public"."track_lyrics"
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM tracks t
    WHERE t.id = track_id AND 
    (t.user_id = auth.uid() OR t.is_public = true OR 
     EXISTS (
       SELECT 1 FROM playlists p
       JOIN personas per ON p.persona_id = per.id
       WHERE p.id = t.playlist_id AND per.is_public = true
     )
    )
  )
);

-- Policy for INSERT: Allow authenticated users to add lyrics for tracks
CREATE POLICY "Users can add track lyrics" ON "public"."track_lyrics"
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM tracks t
    WHERE t.id = track_id AND 
    (t.user_id = auth.uid() OR 
     EXISTS (
       SELECT 1 FROM playlists p
       JOIN personas per ON p.persona_id = per.id
       WHERE p.id = t.playlist_id AND per.user_id = auth.uid()
     )
    )
  )
);

-- Policy for UPDATE: Allow users to update lyrics for their own tracks
CREATE POLICY "Users can update track lyrics" ON "public"."track_lyrics"
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM tracks t
    WHERE t.id = track_id AND 
    (t.user_id = auth.uid() OR 
     EXISTS (
       SELECT 1 FROM playlists p
       JOIN personas per ON p.persona_id = per.id
       WHERE p.id = t.playlist_id AND per.user_id = auth.uid()
     )
    )
  )
);

-- Policy for DELETE: Allow users to delete lyrics for their own tracks
CREATE POLICY "Users can delete track lyrics" ON "public"."track_lyrics"
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM tracks t
    WHERE t.id = track_id AND 
    (t.user_id = auth.uid() OR 
     EXISTS (
       SELECT 1 FROM playlists p
       JOIN personas per ON p.persona_id = per.id
       WHERE p.id = t.playlist_id AND per.user_id = auth.uid()
     )
    )
  )
);
