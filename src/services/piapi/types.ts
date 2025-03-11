
// Basic PIAPI model type
export interface PiapiModel {
  id: string;
  name: string;
  type: 'image' | 'text' | 'audio' | 'video' | 'music' | 'voice' | 'avatar';
  description?: string;
  capabilities?: string[];
  image_url?: string;
  organization?: string;
  requires_payment?: boolean;
}

// Define a GenerationStatus enum for consistent status handling
export enum GenerationStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}

// Midjourney types
export interface MidjourneyGenerationResult {
  task_id: string;
  status: GenerationStatus | string;
  image_url?: string;
  image_urls?: string[];
  output?: {
    image_url?: string;
    image_urls?: string[];
  };
  task_result?: Record<string, any>;
  error?: {
    message: string;
    code: string;
  };
  [key: string]: any;  // Add index signature to make it compatible with Json type
}

// Standard image generation result
export interface GenerationResult {
  status: 'complete' | 'processing' | 'failed';
  urls?: string[];
  url?: string;
  task_id?: string;
  text?: string;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  error?: string;
}

// Avatar generation params
export interface AvatarGenerationParams {
  model: string;
  prompt: string;
  gender?: "male" | "female" | "neutral";
  style?: string;
  image_url?: string;
  name?: string;
}

// Runway video generation params
export interface RunwayImageToVideoParams {
  model: string;
  prompt: string;
  image_url: string;
  motion_strength?: number;
  duration?: number;
}

// Music generation result
export interface MusicGenerationResult {
  task_id: string;
  status: string;
  audio_url?: string;
  error?: {
    message: string;
    code: string;
  };
}

// Midjourney options
export interface MidjourneyOptions {
  aspect_ratio?: string;
  process_mode?: string;
  webhook_url?: string;
  negative_prompt?: string;
}

// Face swap params
export interface FaceSwapParams {
  model: string;
  target_image: string;
  swap_image: string;
}

export interface FaceSwapVideoParams {
  model: string;
  target_video: string;
  swap_image: string;
  swap_faces_index?: string;
  target_faces_index?: string;
}

// Music related params
export interface SunoMusicParams {
  model: 'music-s';
  prompt: string;
  title?: string;
  tags?: string;
  negative_tags?: string;
}

export interface UdioMusicParams {
  model: 'music-u';
  prompt: string;
  title?: string;
}

export interface SongExtendParams {
  model: 'music-s' | 'music-u';
  prompt: string;
  audio_url: string;
  title?: string;
}

export interface UploadAudioParams {
  file_url: string;
  filename?: string;
}

export interface ConcatMusicParams {
  audio_urls: string[];
  title?: string;
}

export interface SunoLyricsParams {
  model: 'music-s' | 'gpt4-lyricist';
  prompt: string;
}

export interface UdioLyricsParams {
  model: 'music-u' | 'gpt4-lyricist';
  prompt: string;
}

// Define MusicModel type for the music generation forms
export type MusicModel = 'music-s' | 'music-u' | 'gpt4-lyricist';
