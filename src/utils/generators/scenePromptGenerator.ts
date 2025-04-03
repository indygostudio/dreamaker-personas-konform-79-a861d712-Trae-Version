/**
 * Generates a prompt for a scene based on its description
 * This is a simplified version that focuses on creating a visual prompt
 */
export function generatePromptForScene(sceneDescription: string): string {
  if (!sceneDescription || sceneDescription.trim() === "") {
    return "";
  }
  
  // Clean up the description
  const cleanDescription = sceneDescription.trim();
  
  // Add cinematic quality descriptors
  const cinematicQuality = "cinematic quality, detailed, high resolution";
  
  // Add visual style descriptors
  const visualStyle = "professional cinematography, film grain, depth of field";
  
  // Combine into a complete prompt
  return `${cleanDescription}. ${cinematicQuality}, ${visualStyle}`;
}