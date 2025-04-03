
import { toast } from "sonner";
import { AI_SERVICES } from "../contexts/AIServiceContext";
import { generateRunwayImage } from "./runwayService";

// This would connect to the real APIs, but for now we'll simulate responses for non-Runway services
export const generateImageFromPrompt = async (
  prompt: string,
  serviceId: string
): Promise<string> => {
  try {
    console.log(`Generating image with ${serviceId} using prompt: ${prompt}`);
    
    // If using Runway, call the actual Runway service
    if (serviceId === "runway-gen4") {
      return await generateRunwayImage(prompt);
    }
    
    // For other services, simulate a delay and return a placeholder image
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Different placeholder based on service
    let placeholderUrl = "";
    const randomSeed = Math.floor(Math.random() * 1000);
    
    switch (serviceId) {
      case "kling":
        placeholderUrl = `https://picsum.photos/seed/kling${randomSeed}/800/600`;
        break;
      case "midjourney":
        placeholderUrl = `https://picsum.photos/seed/mid${randomSeed}/800/600`;
        break;
      case "leonardo":
        placeholderUrl = `https://picsum.photos/seed/leo${randomSeed}/800/600`;
        break;
      case "pika":
        placeholderUrl = `https://picsum.photos/seed/pika${randomSeed}/800/600`;
        break;
      default:
        placeholderUrl = `https://picsum.photos/seed/${randomSeed}/800/600`;
    }
    
    return placeholderUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error("Failed to generate image. Please try again.");
    throw error;
  }
};
