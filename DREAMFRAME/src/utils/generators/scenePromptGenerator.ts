
// Generate a prompt specifically for a scene based on its description
export const generatePromptForScene = (sceneDescription: string): string => {
  // Create a basic prompt from the scene description
  const basePrompt = sceneDescription.trim();
  
  // Add some randomized camera movements to make it more dynamic
  const cameraMotions = [
    "tracking shot follows the action",
    "cinematic camera moves slowly",
    "handheld camera captures the motion",
    "smooth camera pan across the scene",
    "static camera observes the scene"
  ];
  
  // Add some style descriptors to enhance the visual quality
  const styles = [
    "cinematic lighting, detailed",
    "film grain, atmospheric",
    "high contrast, vivid colors",
    "shallow depth of field, bokeh",
    "dramatic lighting, high resolution"
  ];
  
  const randomCamera = cameraMotions[Math.floor(Math.random() * cameraMotions.length)];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  
  // Combine the elements into a Gen-4 style prompt
  return `${basePrompt}. ${randomCamera}. ${randomStyle}.`;
};
