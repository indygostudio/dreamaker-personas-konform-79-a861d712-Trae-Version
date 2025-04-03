
export interface PromptVariation {
  id: string;
  text: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
}

export interface PromptInputs {
  basePrompt: string;
  subjectMotion: string;
  sceneMotion: string;
  cameraMotion: string;
  styleDescriptors: string;
}

export interface MotionOption {
  value: string;
  label: string;
}

export const subjectMotionOptions: MotionOption[] = [
  { value: "the subject turns slowly", label: "Turns slowly" },
  { value: "the subject walks forward", label: "Walks forward" },
  { value: "the subject nods", label: "Nods" },
  { value: "the subject raises their hand", label: "Raises hand" },
  { value: "the subject smiles", label: "Smiles" },
  { value: "the subject looks around", label: "Looks around" },
  { value: "the subject dances", label: "Dances" },
  { value: "the subject runs", label: "Runs" },
  { value: "the subject jumps", label: "Jumps" },
  { value: "the subject sits down", label: "Sits down" },
];

export const sceneMotionOptions: MotionOption[] = [
  { value: "dust trails behind as they move", label: "Dust trails" },
  { value: "leaves rustle in the wind", label: "Rustling leaves" },
  { value: "rain falls gently", label: "Gentle rain" },
  { value: "clouds move across the sky", label: "Moving clouds" },
  { value: "water ripples outward", label: "Rippling water" },
  { value: "fog swirls around", label: "Swirling fog" },
  { value: "shadows stretch and move", label: "Moving shadows" },
  { value: "snow falls softly", label: "Falling snow" },
  { value: "light flickers", label: "Flickering light" },
  { value: "wind blows through the scene", label: "Blowing wind" },
];

export const cameraMotionOptions: MotionOption[] = [
  { value: "handheld camera follows", label: "Handheld follow" },
  { value: "locked camera", label: "Locked" },
  { value: "slow dolly in", label: "Slow dolly in" },
  { value: "slow dolly out", label: "Slow dolly out" },
  { value: "camera pans left to right", label: "Pan left to right" },
  { value: "camera pans right to left", label: "Pan right to left" },
  { value: "camera tilts up", label: "Tilt up" },
  { value: "camera tilts down", label: "Tilt down" },
  { value: "drone shot from above", label: "Drone shot" },
  { value: "rotating around the subject", label: "Orbit" },
];

export const styleDescriptorOptions: MotionOption[] = [
  { value: "cinematic live-action", label: "Cinematic live-action" },
  { value: "35mm film", label: "35mm film" },
  { value: "film noir", label: "Film noir" },
  { value: "documentary style", label: "Documentary" },
  { value: "slow motion", label: "Slow motion" },
  { value: "timelapse", label: "Timelapse" },
  { value: "golden hour lighting", label: "Golden hour" },
  { value: "neon lighting", label: "Neon lighting" },
  { value: "high contrast", label: "High contrast" },
  { value: "muted colors", label: "Muted colors" },
  { value: "vibrant colors", label: "Vibrant colors" },
  { value: "black and white", label: "Black and white" },
];

export interface PromptGenerationOptions {
  basePrompt: string;
  subjectMotion?: string;
  sceneMotion?: string;
  cameraMotion?: string;
  styleDescriptors?: string;
  serviceId?: string;
}
