
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { personaId } = await req.json()

    if (!personaId) {
      throw new Error('No persona ID provided')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get voice samples
    const { data: samples, error: samplesError } = await supabaseClient
      .from('voice_samples')
      .select('file_url')
      .eq('persona_id', personaId)

    if (samplesError) throw samplesError
    if (!samples?.length) throw new Error('No voice samples found')

    // Create voice training record
    const { error: trainingError } = await supabaseClient
      .from('voice_training')
      .insert({
        persona_id: personaId,
        status: 'started',
        progress: 0
      })

    if (trainingError) throw trainingError

    // Start ElevenLabs voice cloning
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Persona_${personaId}`,
        files: samples.map(s => s.file_url),
        description: `Voice clone for persona ${personaId}`,
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${await response.text()}`)
    }

    const result = await response.json()

    // Update training record with success
    await supabaseClient
      .from('voice_training')
      .update({
        status: 'completed',
        progress: 100,
        model_version: result.voice_id
      })
      .eq('persona_id', personaId)

    return new Response(
      JSON.stringify({ success: true, voice_id: result.voice_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Voice cloning error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
