import { generatePromptForScene } from "./generators/scenePromptGenerator";

// Re-export generators
export { 
  generatePromptForScene
};

/**
 * Generates a prompt for a scene based on its description
 * This is a simplified version that just passes through to the scene prompt generator
 */
export function generatePromptForScene(sceneDescription: string): string {
  return generatePromptForScene(sceneDescription);
}

// Utility functions for prompt generation

/**
 * Generates a prompt for AI video generation based on a scene description
 * @param description The scene description
 * @returns A formatted prompt for video generation
 */
export const generatePromptForScene = (description: string): string => {
  // Add cinematography terms and high-quality descriptors
  return `Cinematic shot of ${description}. Detailed, high-quality, dramatic lighting, professional cinematography`;
};