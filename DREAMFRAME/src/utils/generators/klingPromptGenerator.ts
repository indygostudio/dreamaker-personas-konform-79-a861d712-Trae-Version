
import { PromptGenerationOptions } from "../../types/promptTypes";

export const generateKlingPrompt = (options: PromptGenerationOptions): string => {
  const { basePrompt, subjectMotion, sceneMotion, cameraMotion, styleDescriptors } = options;
  
  let parts = [];
  if (basePrompt) parts.push(basePrompt);
  if (subjectMotion) parts.push(`Subject motion: ${subjectMotion}`);
  if (sceneMotion) parts.push(`Scene motion: ${sceneMotion}`);
  if (cameraMotion) parts.push(`Camera: ${cameraMotion}`);
  if (styleDescriptors) parts.push(`Style: ${styleDescriptors}`);
  
  return parts.join(", ");
};
