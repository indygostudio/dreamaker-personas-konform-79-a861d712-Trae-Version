
import { PromptInputs, PromptGenerationOptions } from "../../types/promptTypes";

export const generateGen4Prompt = (options: PromptInputs | PromptGenerationOptions): string => {
  const { basePrompt, subjectMotion, sceneMotion, cameraMotion, styleDescriptors } = options;
  
  // Build the prompt parts
  let promptParts = [];
  
  // Start with base prompt
  if (basePrompt && basePrompt.trim()) {
    promptParts.push(basePrompt.trim());
  }
  
  // Add subject motion if provided
  if (subjectMotion && subjectMotion.trim()) {
    promptParts.push(subjectMotion);
  }
  
  // Add scene motion if provided
  if (sceneMotion && sceneMotion.trim()) {
    promptParts.push(sceneMotion);
  }
  
  // Add camera motion if provided
  if (cameraMotion && cameraMotion.trim()) {
    promptParts.push(cameraMotion);
  }
  
  // Add style descriptors if provided
  if (styleDescriptors && styleDescriptors.trim()) {
    promptParts.push(styleDescriptors);
  }
  
  // Join all parts with proper formatting
  return promptParts.join(". ");
};
