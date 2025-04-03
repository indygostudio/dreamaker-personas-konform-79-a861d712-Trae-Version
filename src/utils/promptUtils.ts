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