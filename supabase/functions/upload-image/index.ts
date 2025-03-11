
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('image')
    const title = formData.get('title') as string || 'Uploaded Image'
    const personaId = formData.get('personaId') as string
    const tags = formData.get('tags') as string || ''
    const bucketName = formData.get('bucket') as string || 'ai_images'
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No image uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing upload request for bucket: ${bucketName}, file type: ${file.type}`)
    
    // Check file size - 100MB limit for videos, 10MB for images
    const maxSize = file.type.startsWith('video/') ? 104857600 : 10485760
    if (file.size > maxSize) {
      const sizeInMB = Math.round(file.size / 1048576)
      const maxSizeInMB = Math.round(maxSize / 1048576)
      return new Response(
        JSON.stringify({ 
          error: `File too large (${sizeInMB}MB). Maximum size is ${maxSizeInMB}MB.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: userError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check if both ai_images and profile_assets buckets exist, create them if they don't
    const { data: buckets, error: bucketsError } = await supabase.storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Failed to list storage buckets:', bucketsError);
      return new Response(
        JSON.stringify({ error: 'Failed to list storage buckets', details: bucketsError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Create ai_images bucket if it doesn't exist
    if (!buckets.some(bucket => bucket.name === 'ai_images')) {
      const { error: createBucketError } = await supabase.storage.createBucket('ai_images', {
        public: true
      });
      
      if (createBucketError) {
        console.error('Failed to create ai_images bucket:', createBucketError);
        return new Response(
          JSON.stringify({ error: 'Failed to create ai_images bucket', details: createBucketError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      console.log('Successfully created ai_images bucket');
    }
    
    // Create profile_assets bucket if it doesn't exist
    if (!buckets.some(bucket => bucket.name === 'profile_assets')) {
      const { error: createBucketError } = await supabase.storage.createBucket('profile_assets', {
        public: true,
        fileSizeLimit: 104857600 // 100MB to allow videos
      });
      
      if (createBucketError) {
        console.error('Failed to create profile_assets bucket:', createBucketError);
        return new Response(
          JSON.stringify({ error: 'Failed to create profile_assets bucket', details: createBucketError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      console.log('Successfully created profile_assets bucket');
    }

    // Process file name and extension
    const fileName = file.name || 'image.jpg'
    const fileExt = fileName.split('.').pop()
    const sanitizedName = fileName.replace(/[^\x00-\x7F]/g, '')
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`

    console.log(`Uploading file to ${bucketName} bucket, path: ${filePath}, type: ${file.type}`);

    // Upload to storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error(`Failed to upload to ${bucketName}:`, uploadError);
      return new Response(
        JSON.stringify({ error: `Failed to upload to ${bucketName}`, details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath)
    
    // For this example, we'll use the same image as its own thumbnail
    const thumbnailUrl = publicUrl
    
    // Process tags
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)

    if (bucketName === 'ai_images') {
      // Save to database only for ai_images
      const { data: imageData, error: dbError } = await supabase
        .from('ai_images')
        .insert({
          user_id: user.id,
          persona_id: personaId || null,
          title: title,
          image_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          metadata: { 
            fileName: sanitizedName,
            contentType: file.type,
            uploaded: true
          },
          tags: tagArray
        })
        .select()

      if (dbError) {
        console.error('Failed to save image metadata:', dbError);
        return new Response(
          JSON.stringify({ error: 'Failed to save image metadata', details: dbError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    // If we're here, the upload succeeded
    console.log('Upload successful, returning URL:', publicUrl);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        image: {
          url: publicUrl,
          thumbnail: thumbnailUrl,
          title: title,
          bucket: bucketName
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in upload-image function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
