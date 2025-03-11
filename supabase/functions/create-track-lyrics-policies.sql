
-- Create a helper function to check track permissions
CREATE OR REPLACE FUNCTION check_track_lyrics_permission(track_id_param UUID, operation TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  track_owner UUID;
  playlist_id UUID;
  persona_id UUID;
  persona_owner UUID;
  result BOOLEAN;
BEGIN
  -- Get track info
  SELECT t.user_id, t.playlist_id, t.is_public 
  INTO track_owner, playlist_id, result
  FROM tracks t
  WHERE t.id = track_id_param;
  
  -- For SELECT operations, we also allow public tracks
  IF operation = 'SELECT' AND result = TRUE THEN
    RETURN TRUE;
  END IF;
  
  -- Check direct ownership
  IF track_owner = auth.uid() THEN
    RETURN TRUE;
  END IF;
  
  -- Check playlist ownership via persona
  IF playlist_id IS NOT NULL THEN
    SELECT p.persona_id INTO persona_id
    FROM playlists p
    WHERE p.id = playlist_id;
    
    IF persona_id IS NOT NULL THEN
      SELECT per.user_id INTO persona_owner
      FROM personas per
      WHERE per.id = persona_id;
      
      IF persona_owner = auth.uid() THEN
        RETURN TRUE;
      END IF;
    END IF;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace existing policies with updated ones
DROP POLICY IF EXISTS "Users can view track lyrics" ON "public"."track_lyrics";
DROP POLICY IF EXISTS "Users can add track lyrics" ON "public"."track_lyrics";
DROP POLICY IF EXISTS "Users can update track lyrics" ON "public"."track_lyrics";
DROP POLICY IF EXISTS "Users can delete track lyrics" ON "public"."track_lyrics";

-- Policy for SELECT
CREATE POLICY "Users can view track lyrics" ON "public"."track_lyrics"
FOR SELECT 
USING (check_track_lyrics_permission(track_id, 'SELECT'));

-- Policy for INSERT
CREATE POLICY "Users can add track lyrics" ON "public"."track_lyrics"
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND
  check_track_lyrics_permission(track_id, 'INSERT')
);

-- Policy for UPDATE
CREATE POLICY "Users can update track lyrics" ON "public"."track_lyrics"
FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND
  check_track_lyrics_permission(track_id, 'UPDATE')
);

-- Policy for DELETE
CREATE POLICY "Users can delete track lyrics" ON "public"."track_lyrics"
FOR DELETE 
USING (
  auth.role() = 'authenticated' AND
  check_track_lyrics_permission(track_id, 'DELETE')
);
