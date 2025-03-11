import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url).searchParams.get('url');
    if (!url) {
      return new Response('Missing URL parameter', {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Create a unique key for the URL
    const urlHash = encode(new TextEncoder().encode(url));
    const bucketPath = `cached/${urlHash}`;

    // Try to get cached content first
    const { data: cachedData, error: fetchError } = await supabaseClient
      .storage
      .from('web_proxy_cache')
      .download(bucketPath);

    if (!fetchError && cachedData) {
      return new Response(cachedData, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    }

    // If not cached, fetch and store
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'User-Agent': 'Supabase Edge Function Proxy',
      },
    });

    const content = await response.text();

    // Store in Supabase bucket
    const { error: uploadError } = await supabaseClient
      .storage
      .from('web_proxy_cache')
      .upload(bucketPath, new Blob([content]), {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      console.error('Error caching content:', uploadError);
    }

    const headers = new Headers(corsHeaders);
    headers.set('Content-Type', 'text/html');

    return new Response(content, {
      status: response.status,
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});