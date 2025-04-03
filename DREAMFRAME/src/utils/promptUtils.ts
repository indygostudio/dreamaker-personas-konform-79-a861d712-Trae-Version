
import { PromptVariation, PromptGenerationOptions } from "../types/promptTypes";
import { generateGen4Prompt } from "./generators/gen4PromptGenerator";
import { generateKlingPrompt } from "./generators/klingPromptGenerator";
import { generateMidjourneyPrompt } from "./generators/midjourneyPromptGenerator";
import { generatePromptForScene } from "./generators/scenePromptGenerator";
import { generateDiversePrompts } from "./generators/diversePromptGenerator";

// Re-export generators
export { 
  generateGen4Prompt,
  generateKlingPrompt,
  generateMidjourneyPrompt,
  generatePromptForScene,
  generateDiversePrompts
};

// Select the appropriate prompt generator based on the service
const getPromptGenerator = (serviceId: string) => {
  switch (serviceId) {
    case "runway-gen4":
      return generateGen4Prompt;
    case "kling":
      return generateKlingPrompt;
    case "midjourney":
      return generateMidjourneyPrompt;
    default:
      return generateGen4Prompt;
  }
};

// Main function to generate prompt variations
export const generatePromptVariations = (options: PromptGenerationOptions): PromptVariation[] => {
  const { basePrompt, serviceId = "runway-gen4" } = options;
  
  const promptGenerator = getPromptGenerator(serviceId);
  
  // Generate the main prompt
  const mainPrompt = promptGenerator(options);
  
  // Generate variations with different camera motions
  const cameraVariations = [
    { ...options, cameraMotion: "tracking shot" },
    { ...options, cameraMotion: "handheld camera" },
    { ...options, cameraMotion: "static camera" },
    { ...options, cameraMotion: "aerial view" },
  ];
  
  // Generate variations with different style descriptors
  const styleVariations = [
    { ...options, styleDescriptors: "cinematic, 35mm film" },
    { ...options, styleDescriptors: "slow motion, dramatic" },
    { ...options, styleDescriptors: "high contrast, vivid colors" },
    { ...options, styleDescriptors: "documentary style, natural lighting" },
  ];
  
  // Create the variations array
  const variations: PromptVariation[] = [
    {
      id: "main",
      text: mainPrompt,
      description: "Main Prompt",
      type: "main",
      category: "main",
      tags: ["generated"]
    },
    ...cameraVariations.map((variation, index) => ({
      id: `camera-${index}`,
      text: promptGenerator(variation),
      description: `Camera: ${variation.cameraMotion}`,
      type: "camera",
      category: "camera",
      tags: ["camera", "variation"]
    })),
    ...styleVariations.map((variation, index) => ({
      id: `style-${index}`,
      text: promptGenerator(variation),
      description: `Style: ${variation.styleDescriptors}`,
      type: "style",
      category: "style",
      tags: ["style", "variation"]
    }))
  ];
  
  return variations;
};
