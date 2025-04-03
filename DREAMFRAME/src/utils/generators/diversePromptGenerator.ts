
import { shuffleArray } from '../arrayUtils';

// Generate diverse prompts for multiple scenes to ensure variety
export const generateDiversePrompts = (count: number) => {
  const cameraMotions = [
    "tracking shot follows the subject",
    "handheld camera moves with the action",
    "static camera observes the scene",
    "drone shot hovering above",
    "dolly zoom creates dramatic effect",
    "slow motion camera captures details",
    "panning shot reveals the environment"
  ];
  
  const subjectMotions = [
    "the subject walks slowly through the scene",
    "the character turns to face the camera",
    "the figure emerges from shadow",
    "the subject gestures expressively",
    "the character looks up in wonder",
    "the subject moves gracefully across the frame",
    "the figure stands motionless as the environment changes"
  ];
  
  const sceneMotions = [
    "wind blows through the scene",
    "leaves scatter across the ground",
    "water ripples and reflects the light",
    "dust particles float in the sunbeams",
    "shadows shift as clouds move overhead",
    "rain falls gently on the surface",
    "fog swirls around the environment"
  ];
  
  const styleDescriptors = [
    "cinematic lighting, 35mm film",
    "dramatic shadows, high contrast",
    "soft natural lighting, muted colors",
    "vivid colors, sharp details",
    "film grain, nostalgic atmosphere",
    "dreamy bokeh, shallow depth of field",
    "high-key lighting, minimalist aesthetic"
  ];
  
  // Shuffle and return diverse elements
  return {
    cameraMotions: shuffleArray([...cameraMotions]).slice(0, count),
    subjectMotions: shuffleArray([...subjectMotions]).slice(0, count),
    sceneMotions: shuffleArray([...sceneMotions]).slice(0, count),
    styleDescriptors: shuffleArray([...styleDescriptors]).slice(0, count)
  };
};
