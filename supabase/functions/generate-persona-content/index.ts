
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, prompt: customPrompt } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAiKey) {
      throw new Error('OpenAI API key not found')
    }

    // Text Generation (Name/Description)
    if (type === 'name' || type === 'description') {
      const prompt = type === 'name' 
        ? 'Generate a creative AI music persona name that is 2-3 words long. The name should reflect an AI that creates or performs music. Only return the name, nothing else.'
        : 'Generate a creative 2-3 sentence description for an AI music persona. Focus on their unique musical style and creative capabilities. Only return the description, nothing else.'

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a creative AI that specializes in generating names and descriptions for AI music personas. Be concise and imaginative.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          max_tokens: 150
        }),
      })

      const data = await response.json()
      return new Response(
        JSON.stringify({ content: data.choices[0].message.content.trim() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Image Generation (Avatar/Banner)
    if (type === 'avatar' || type === 'banner') {
      const basePrompt = type === 'avatar' 
        ? 'Create a professional avatar image for an AI music persona. The image should be a creative, abstract representation of' 
        : 'Create a wide banner image for an AI music persona. The image should be an artistic, panoramic representation of'

      const prompt = customPrompt 
        ? `${basePrompt} ${customPrompt}` 
        : `${basePrompt} a futuristic music studio with abstract musical elements and digital artifacts.`

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: type === 'avatar' ? '1024x1024' : '1792x1024',
          quality: 'standard',
          style: 'vivid'
        }),
      })

      const data = await response.json()
      return new Response(
        JSON.stringify({ url: data.data[0].url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid generation type')
  } catch (error) {
    console.error('Error in generate-persona-content:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
