
-- This SQL will create appropriate policies for the profile_assets bucket
BEGIN;
  -- Insert the bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile_assets', 'profile_assets', true)
  ON CONFLICT DO NOTHING;

  -- Create a policy that allows users to read from profile_assets
  CREATE POLICY "Public Read Access" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'profile_assets');

  -- Create a policy that allows users to insert their own files to profile_assets
  CREATE POLICY "Auth Users Can Upload" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'profile_assets' AND 
    auth.uid() = owner
  );

  -- Create a policy that allows users to update their own files
  CREATE POLICY "Auth Users Can Update Their Files" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'profile_assets' AND 
    auth.uid() = owner
  );

  -- Create a policy that allows users to delete their own files
  CREATE POLICY "Auth Users Can Delete Their Files" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'profile_assets' AND 
    auth.uid() = owner
  );
COMMIT;
