
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    const baseUrl = 'https://api.elevenlabs.io/v1'

    switch (action) {
      case 'getModels':
        const modelsResponse = await fetch(`${baseUrl}/models`, {
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        })
        return new Response(await modelsResponse.text(), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })

      case 'getProfessionalVoices':
        const voicesResponse = await fetch(`${baseUrl}/voices`, {
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        })
        return new Response(await voicesResponse.text(), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })

      case 'generatePreview':
        const { text, voice_id, settings, model_id } = data
        const previewResponse = await fetch(`${baseUrl}/text-to-speech/${voice_id}`, {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id,
            voice_settings: settings
          }),
        })

        if (!previewResponse.ok) {
          throw new Error(`Failed to generate preview: ${await previewResponse.text()}`)
        }

        const audioBlob = await previewResponse.blob()
        const audioBase64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(audioBlob)
        })

        return new Response(
          JSON.stringify({ audio_url: audioBase64 }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'editVoice':
        const { voice_id: editVoiceId, name, description, labels } = data
        const editResponse = await fetch(`${baseUrl}/voices/${editVoiceId}`, {
          method: 'PATCH',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description, labels }),
        })
        return new Response(await editResponse.text(), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })

      case 'deleteVoice':
        const { voice_id: deleteVoiceId } = data
        const deleteResponse = await fetch(`${baseUrl}/voices/${deleteVoiceId}`, {
          method: 'DELETE',
          headers: {
            'xi-api-key': apiKey,
          },
        })
        return new Response(await deleteResponse.text(), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('ElevenLabs API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
