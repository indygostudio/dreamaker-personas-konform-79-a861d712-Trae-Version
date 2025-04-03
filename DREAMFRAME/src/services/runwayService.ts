
import { toast } from "sonner";

// The Runway Gen-4 API key
const RUNWAY_API_KEY = "key_06e09a68a812edef25e91c8a91b486c3a25829785fddab28db60294da9da2a530abd4c07a1792349c532555dd041a300b35f245743d05d3d539c5135e3c40478";
const RUNWAY_API_URL = "https://api.runwayml.com";

/**
 * Generates a video from an image using Runway Gen-4 API
 */
export const generateRunwayVideo = async (
  imageUrl: string,
  prompt: string
): Promise<string> => {
  try {
    console.log("Calling Runway Gen-4 API to convert image to video");
    console.log(`Prompt: ${prompt}`);
    
    toast.info("Connecting to Runway Gen-4 API...");
    
    // First, we need to check if the imageUrl is a base64 string or a URL
    let imageData: string | Blob;
    if (imageUrl.startsWith('data:')) {
      // It's a base64 string
      imageData = imageUrl;
    } else {
      // It's a URL, we need to fetch it and convert to blob
      const response = await fetch(imageUrl);
      imageData = await response.blob();
    }
    
    // Prepare the form data for the API request
    const formData = new FormData();
    formData.append("prompt", prompt);
    
    if (typeof imageData === 'string') {
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();
      formData.append("image", blob);
    } else {
      formData.append("image", imageData);
    }
    
    // Make the API request to Runway Gen-4
    const endpoint = "/v1/generation/motion";
    
    const response = await fetch(`${RUNWAY_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RUNWAY_API_KEY}`,
        "X-Api-Version": "2023-06-01"
      },
      body: formData
    });
    
    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || response.statusText;
        console.error("Runway API error details:", errorData);
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
      throw new Error(`Runway API error: ${errorMessage}`);
    }
    
    const data = await response.json();
    toast.success("Successfully generated video with Runway Gen-4!");
    
    // Return the video URL from the response
    return data.output.video_url;
  } catch (error) {
    console.error("Error calling Runway Gen-4 API:", error);
    toast.error(`Failed to connect to Runway Gen-4: ${error instanceof Error ? error.message : "Unknown error"}`);
    
    // For now, return a placeholder if the API fails
    const randomSeed = Math.floor(Math.random() * 1000);
    const placeholderVideoUrl = `https://assets.mixkit.co/videos/preview/mixkit-${randomSeed % 30 + 1}-small.mp4`;
    return placeholderVideoUrl;
  }
};

/**
 * Generates an image from a prompt using Runway Gen-4 API
 */
export const generateRunwayImage = async (
  prompt: string
): Promise<string> => {
  try {
    console.log("Calling Runway Gen-4 API to generate image");
    console.log(`Prompt: ${prompt}`);
    
    toast.info("Connecting to Runway Gen-4 API for image generation...");
    
    // Prepare the request body
    const requestBody = {
      prompt,
      num_samples: 1  // Generate one image
    };
    
    // Make the API request to Runway Gen-4
    const endpoint = "/v1/generation/image";
    
    const response = await fetch(`${RUNWAY_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RUNWAY_API_KEY}`,
        "Content-Type": "application/json",
        "X-Api-Version": "2023-06-01"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || response.statusText;
        console.error("Runway API error details:", errorData);
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
      throw new Error(`Runway API error: ${errorMessage}`);
    }
    
    const data = await response.json();
    toast.success("Successfully generated image with Runway Gen-4!");
    
    // Return the image URL from the response
    return data.output.image_url;
  } catch (error) {
    console.error("Error calling Runway Gen-4 API for image generation:", error);
    toast.error(`Failed to generate image with Runway Gen-4: ${error instanceof Error ? error.message : "Unknown error"}`);
    
    // Return a placeholder image if the API fails
    const randomSeed = Math.floor(Math.random() * 1000);
    const placeholderImageUrl = `https://picsum.photos/seed/runway${randomSeed}/800/600`;
    return placeholderImageUrl;
  }
};
