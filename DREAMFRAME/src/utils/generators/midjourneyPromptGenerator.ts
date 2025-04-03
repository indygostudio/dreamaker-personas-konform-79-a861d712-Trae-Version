
import { PromptGenerationOptions } from "../../types/promptTypes";

export const generateMidjourneyPrompt = (options: PromptGenerationOptions): string => {
  const { basePrompt, subjectMotion, sceneMotion, cameraMotion, styleDescriptors } = options;
  
  let prompt = basePrompt;
  if (styleDescriptors) prompt += ` --style ${styleDescriptors}`;
  if (subjectMotion) prompt += ` --motion ${subjectMotion}`;
  if (cameraMotion) prompt += ` --camera ${cameraMotion}`;
  if (sceneMotion) prompt += ` --scene ${sceneMotion}`;
  
  return prompt;
};
