
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Configure CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Enhanced error handling
const handleApiResponse = async (response: Response, actionName: string) => {
  const data = await response.json();
  
  console.log(`${actionName} response:`, JSON.stringify(data));
  
  if (data.code !== 200) {
    // Log the full error for debugging
    console.error(`PiAPI ${actionName} error:`, JSON.stringify(data));
    
    let errorMessage = data.message || `Failed to execute ${actionName}`;
    
    // Check for specific error types
    if (data.message?.includes('insufficient credits')) {
      errorMessage = 'Your PiAPI account has insufficient credits remaining. Please add credits to your account.';
    } else if (data.message?.includes('invalid api key')) {
      errorMessage = 'The provided PiAPI key is invalid or has expired.';
    } else if (data.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    }
    
    throw new Error(errorMessage);
  }
  
  return data.data;
};

// Serve HTTP requests
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Get PiAPI key from environment
    const PIAPI_KEY = Deno.env.get('PIAPI_KEY');
    if (!PIAPI_KEY) {
      console.error('PIAPI_KEY environment variable is not set');
      throw new Error('PIAPI_KEY is not set in the environment variables');
    }

    // Parse request
    let action, params;
    try {
      const body = await req.json();
      action = body.action;
      params = body.params;
      console.log(`Processing ${action} with params:`, JSON.stringify(params));
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid request body. Expected JSON with action and params fields.');
    }
    
    // Process different actions
    let response;
    
    switch (action) {
      // Midjourney actions
      case 'generateMidjourneyImage':
        response = await handleMidjourneyGenerate(PIAPI_KEY, params);
        break;
      case 'upscaleMidjourneyImage':
        response = await handleMidjourneyUpscale(PIAPI_KEY, params);
        break;
      case 'createMidjourneyVariation':
        response = await handleMidjourneyVariation(PIAPI_KEY, params);
        break;
      case 'rerollMidjourneyImage':
        response = await handleMidjourneyReroll(PIAPI_KEY, params);
        break;
      case 'describeMidjourneyImage':
        response = await handleMidjourneyDescribe(PIAPI_KEY, params);
        break;
      case 'blendMidjourneyImages':
        response = await handleMidjourneyBlend(PIAPI_KEY, params);
        break;
      case 'getMidjourneyTaskSeed':
        response = await handleMidjourneyGetSeed(PIAPI_KEY, params);
        break;
      case 'cancelMidjourneyTask':
        response = await handleMidjourneyCancel(PIAPI_KEY, params.taskId);
        break;
      case 'checkMidjourneyTaskStatus':
        response = await checkTaskStatus(PIAPI_KEY, params.taskId);
        break;
      
      // Legacy Midjourney actions
      case 'imagine':
        response = await handleImagine(PIAPI_KEY, params);
        break;
      case 'upscale':
        response = await handleUpscale(PIAPI_KEY, params);
        break;
      case 'variation':
        response = await handleVariation(PIAPI_KEY, params);
        break;
      case 'checkTaskStatus':
        response = await checkTaskStatus(PIAPI_KEY, params.taskId);
        break;
      
      // Music generation actions
      case 'generateMusic':
        response = await generateMusic(PIAPI_KEY, params);
        break;
      case 'generateLyrics':
        response = await generateLyrics(PIAPI_KEY, params);
        break;
      case 'checkMusicTaskStatus':
        response = await checkMusicTaskStatus(PIAPI_KEY, params.taskId);
        break;
      
      // Face swap actions
      case 'swapFace':
        response = await swapFace(PIAPI_KEY, params);
        break;
      case 'swapFaceInVideo':
        response = await swapFaceInVideo(PIAPI_KEY, params);
        break;
      case 'checkFaceSwapTaskStatus':
        response = await checkFaceSwapTaskStatus(PIAPI_KEY, params.taskId);
        break;
        
      // Models list
      case 'getModels':
        response = await getModels(PIAPI_KEY);
        break;
        
      default:
        console.error(`Unknown action requested: ${action}`);
        throw new Error(`Unknown action: ${action}`);
    }

    // Return response with CORS headers
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({ 
        error: error.message,
        detail: error.stack
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Get available models
async function getModels(apiKey: string) {
  console.log('Fetching available models from PiAPI');
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    return await handleApiResponse(response, 'getModels');
  } catch (error) {
    console.error('Error fetching PiAPI models:', error);
    throw new Error(`Failed to fetch models: ${error.message}`);
  }
}

// Handle Midjourney generate image
async function handleMidjourneyGenerate(apiKey: string, params: any) {
  console.log('Generating Midjourney image with params:', JSON.stringify(params));
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "imagine",
        input: {
          prompt: params.prompt
        },
        config: {
          process_mode: params.process_mode || "fast",
          aspect_ratio: params.aspect_ratio || "1:1"
        }
      }),
    });

    return await handleApiResponse(response, 'generateMidjourneyImage');
  } catch (error) {
    console.error('Error generating Midjourney image:', error);
    throw error;
  }
}

// Handle Midjourney upscale
async function handleMidjourneyUpscale(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "upscale",
        input: {
          task_id: params.origin_task_id,
          index: params.index
        },
        config: params.config || {}
      }),
    });

    return await handleApiResponse(response, 'handleMidjourneyUpscale');
  } catch (error) {
    console.error('Error upscaling Midjourney image:', error);
    throw error;
  }
}

// Handle Midjourney variation
async function handleMidjourneyVariation(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "variation",
        input: {
          task_id: params.origin_task_id,
          index: params.index,
          prompt: params.prompt
        },
        config: {
          process_mode: params.process_mode || "fast",
          aspect_ratio: params.aspect_ratio || "1:1",
          skip_prompt_check: params.skip_prompt_check || false
        }
      }),
    });

    return await handleApiResponse(response, 'handleMidjourneyVariation');
  } catch (error) {
    console.error('Error creating Midjourney variation:', error);
    throw error;
  }
}

// Handle Midjourney reroll
async function handleMidjourneyReroll(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "reroll",
        input: {
          task_id: params.origin_task_id,
          prompt: params.prompt
        },
        config: {
          process_mode: params.process_mode || "fast",
          aspect_ratio: params.aspect_ratio || "1:1",
          skip_prompt_check: params.skip_prompt_check || false
        }
      }),
    });

    return await handleApiResponse(response, 'handleMidjourneyReroll');
  } catch (error) {
    console.error('Error creating Midjourney reroll:', error);
    throw error;
  }
}

// Handle Midjourney describe image
async function handleMidjourneyDescribe(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "describe",
        input: {
          image_url: params.image_url
        },
        config: {
          process_mode: params.process_mode || "fast"
        }
      }),
    });

    return await handleApiResponse(response, 'handleMidjourneyDescribe');
  } catch (error) {
    console.error('Error describing Midjourney image:', error);
    throw error;
  }
}

// Handle Midjourney blend images
async function handleMidjourneyBlend(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "blend",
        input: {
          image_urls: params.image_urls
        },
        config: {
          process_mode: params.process_mode || "fast",
          dimension: params.dimension || "square"
        }
      }),
    });

    return await handleApiResponse(response, 'handleMidjourneyBlend');
  } catch (error) {
    console.error('Error creating Midjourney blend:', error);
    throw error;
  }
}

// Handle Midjourney get seed
async function handleMidjourneyGetSeed(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "seed",
        input: {
          task_id: params.origin_task_id
        },
        config: params.config || {}
      }),
    });

    return await handleApiResponse(response, 'handleMidjourneyGetSeed');
  } catch (error) {
    console.error('Error getting Midjourney seed:', error);
    throw error;
  }
}

// Handle Midjourney cancel task
async function handleMidjourneyCancel(apiKey: string, taskId: string) {
  try {
    const response = await fetch(`https://api.piapi.ai/api/v1/task/${taskId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      }
    });

    return await handleApiResponse(response, 'handleMidjourneyCancel');
  } catch (error) {
    console.error('Error cancelling Midjourney task:', error);
    throw error;
  }
}

// Handle Midjourney imagine requests (legacy)
async function handleImagine(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "imagine",
        input: {
          prompt: params.prompt
        },
        config: {
          process_mode: params.processMode || "fast"
        }
      }),
    });

    return await handleApiResponse(response, 'handleImagine');
  } catch (error) {
    console.error('Error creating imagine task:', error);
    throw error;
  }
}

// Handle Midjourney upscale requests (legacy)
async function handleUpscale(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "upscale",
        input: {
          task_id: params.taskId,
          index: params.index
        },
        config: {
          process_mode: params.processMode || "fast"
        }
      }),
    });

    return await handleApiResponse(response, 'handleUpscale');
  } catch (error) {
    console.error('Error creating upscale task:', error);
    throw error;
  }
}

// Handle Midjourney variation requests (legacy)
async function handleVariation(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "midjourney",
        task_type: "variation",
        input: {
          task_id: params.taskId,
          index: params.index
        },
        config: {
          process_mode: params.processMode || "fast"
        }
      }),
    });

    return await handleApiResponse(response, 'handleVariation');
  } catch (error) {
    console.error('Error creating variation task:', error);
    throw error;
  }
}

// Check task status
async function checkTaskStatus(apiKey: string, taskId: string) {
  try {
    const response = await fetch(`https://api.piapi.ai/api/v1/task/${taskId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    return await handleApiResponse(response, 'checkTaskStatus');
  } catch (error) {
    console.error('Error checking task status:', error);
    throw error;
  }
}

// Music generation functions
async function generateMusic(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: params.model || "suno/v3",
        task_type: "generate_music",
        input: {
          prompt: params.prompt
        }
      }),
    });

    return await handleApiResponse(response, 'generateMusic');
  } catch (error) {
    console.error('Error creating music generation task:', error);
    throw error;
  }
}

async function generateLyrics(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: "suno/v3",
        task_type: "generate_lyrics",
        input: {
          prompt: params.prompt
        }
      }),
    });

    return await handleApiResponse(response, 'generateLyrics');
  } catch (error) {
    console.error('Error creating lyrics generation task:', error);
    throw error;
  }
}

async function checkMusicTaskStatus(apiKey: string, taskId: string) {
  // Reuse the existing task status check function
  return await checkTaskStatus(apiKey, taskId);
}

// Face swap functions
async function swapFace(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: params.model || "Qubico/image-toolkit",
        task_type: "face-swap",
        input: {
          target_image: params.target_image,
          swap_image: params.swap_image
        }
      }),
    });

    return await handleApiResponse(response, 'swapFace');
  } catch (error) {
    console.error('Error creating face swap task:', error);
    throw error;
  }
}

async function swapFaceInVideo(apiKey: string, params: any) {
  try {
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: params.model || "Qubico/video-toolkit",
        task_type: "face-swap",
        input: {
          target_video: params.target_video,
          swap_image: params.swap_image,
          swap_faces_index: params.swap_faces_index,
          target_faces_index: params.target_faces_index
        }
      }),
    });

    return await handleApiResponse(response, 'swapFaceInVideo');
  } catch (error) {
    console.error('Error creating video face swap task:', error);
    throw error;
  }
}

async function checkFaceSwapTaskStatus(apiKey: string, taskId: string) {
  // Reuse the existing task status check function
  return await checkTaskStatus(apiKey, taskId);
}
