import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, input } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    switch (operation) {
      case 'generate':
        prompt = `Create a unique virtual artist persona with the following details:
          Genre/Style: ${input.style || 'any'}
          Age Range: ${input.ageRange || 'any'}
          Voice Type: ${input.voiceType || 'any'}
          
          Include:
          - Artistic name
          - Detailed background story
          - Musical style description
          - Voice characteristics
          - Age
          - Unique traits`;
        break;
      case 'voice':
        prompt = `Suggest voice styles and characteristics for a virtual artist with the following traits:
          Style: ${input.style}
          Age: ${input.age}
          Description: ${input.description}`;
        break;
      case 'description':
        prompt = `Generate a compelling artistic description for a virtual artist with these characteristics:
          Name: ${input.name}
          Style: ${input.style}
          Voice Type: ${input.voiceType}
          Age: ${input.age}`;
        break;
      default:
        throw new Error('Invalid operation');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert in creating virtual artist personas and providing detailed musical recommendations.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ 
      result: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});