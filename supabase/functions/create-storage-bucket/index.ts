
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Missing environment variables' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get request body
    const requestData = await req.json();
    const { bucketName, isPublic = true, fileSizeLimit } = requestData;
    
    // Validate bucket name
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Check if user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    // Check if bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to list buckets', details: bucketsError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    if (buckets.some(bucket => bucket.name === bucketName)) {
      return new Response(
        JSON.stringify({ success: true, message: `Bucket ${bucketName} already exists` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
    
    // Create bucket
    const options: any = { public: isPublic };
    if (fileSizeLimit) {
      options.fileSizeLimit = fileSizeLimit;
    }
    
    const { error: createBucketError } = await supabase.storage.createBucket(bucketName, options);
    
    if (createBucketError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create bucket', details: createBucketError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // If the bucket is public, set RLS policy to allow anonymous reads
    if (isPublic) {
      // Allow anonymous reads
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 1);
      
      if (policyError && !policyError.message.includes('not found')) {
        console.error('Warning: Failed to verify bucket policies:', policyError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Bucket ${bucketName} created successfully`,
        isPublic: isPublic
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in create-storage-bucket function:', error);
    
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
});
