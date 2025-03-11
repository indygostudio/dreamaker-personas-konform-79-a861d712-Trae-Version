
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PIAPI_KEY = Deno.env.get('PIAPI_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate API key before proceeding
    if (!PIAPI_KEY) {
      console.error('PIAPI_KEY environment variable is not set')
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'API key configuration error. Please contact support.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { prompt, style, genre, theme, structure } = await req.json()
    console.log('Generating lyrics with params:', { prompt, style, genre, theme, structure })

    // Validate inputs
    if (!prompt) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Construct system prompt for better lyrics generation
    const systemPrompt = `You are an expert lyricist who specializes in writing song lyrics.
Format your response as clean lyrics text only, with no additional commentary.
Use line breaks to separate lines and double line breaks to separate stanzas.
Start with a title only if explicitly requested.`

    // Construct user prompt with detailed instructions
    let userPrompt = `Write song lyrics based on the following prompt: ${prompt}`
    if (style) userPrompt += `. Style: ${style}`
    if (genre) userPrompt += `. Genre: ${genre}`
    if (theme) userPrompt += `. Theme: ${theme}`
    
    // Add structure instructions if provided
    if (structure) {
      const structureInstructions = []
      if (structure.includeChorus !== undefined) {
        structureInstructions.push(structure.includeChorus ? 'include chorus' : 'no chorus')
      }
      if (structure.includeVerses !== undefined) {
        structureInstructions.push(structure.includeVerses ? 'include verses' : 'no verses')
      }
      if (structureInstructions.length > 0) {
        userPrompt += `. Structure: ${structureInstructions.join(', ')}`
      }
    }

    // Prepare request to PiAPI
    const params = {
      model: 'claude-3-opus-20240229',
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }

    console.log('Sending request to PiAPI with params:', JSON.stringify(params))

    // Make request to PiAPI
    const apiUrl = 'https://api.piapi.ai/v1/chat/completions'
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PIAPI_KEY}`
      },
      body: JSON.stringify(params)
    })

    // Handle HTTP errors from PiAPI
    if (!response.ok) {
      const errorText = await response.text()
      const statusCode = response.status
      console.error(`PiAPI error (${statusCode}):`, errorText)
      
      // Create user-friendly error messages based on status code
      let errorMessage = 'Failed to generate lyrics'
      if (statusCode === 401) {
        errorMessage = 'API key is invalid or has expired'
      } else if (statusCode === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later'
      } else if (statusCode === 402) {
        errorMessage = 'Insufficient credits. Please check your PiAPI account'
      }
      
      throw new Error(`${errorMessage} (${statusCode})`)
    }

    // Parse PiAPI response
    const result = await response.json()
    console.log('PiAPI response received:', JSON.stringify({
      id: result.id,
      model: result.model,
      status: 'success',
      content_length: result.choices?.[0]?.message?.content?.length || 0
    }))
    
    // Extract lyrics from response
    const lyricsText = result.choices?.[0]?.message?.content || "No lyrics generated."

    // Return success response
    return new Response(
      JSON.stringify({
        status: 'success',
        lyrics: lyricsText,
        task_id: result.id || null
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    // Log and return error response
    console.error('Error in generate-lyrics function:', error.message || error)
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
