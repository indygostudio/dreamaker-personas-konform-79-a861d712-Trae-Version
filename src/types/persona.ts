import type { MediaPosition } from './media';

export type MidjourneyAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:2';
export type MidjourneyProcessMode = 'relax' | 'fast' | 'turbo';
export type MidjourneyDimension = 'square' | 'portrait' | 'landscape';
export type MidjourneyUpscaleIndex = '1' | '2' | '3' | '4' | 'light' | 'beta' | '2x' | '4x' | 'subtle' | 'creative';
export type MidjourneyVariationIndex = '1' | '2' | '3' | '4' | 'high_variation' | 'low_variation';

export type PersonaType = "AI_CHARACTER" | "AI_VOCALIST" | "AI_INSTRUMENTALIST" | "AI_EFFECT" | "AI_SOUND" | "AI_MIXER" | "AI_WRITER" | "AI_PRODUCER" | "AI_COMPOSER" | "AI_ARRANGER" | "AI_DJ" | "AI_VISUAL_ARTIST" | "AI_AUDIO_ENGINEER";

export interface Persona {
  id: string;
  name: string;
  description?: string;
  type: PersonaType;
  avatar_url?: string;
  banner_url?: string;
  banner_position?: MediaPosition;
  video_url?: string;
  audio_preview_url?: string;
  voice_type?: string;
  vocal_style?: string;
  style?: string;
  age?: string;
  user_id: string;
  artist_profile_id?: string;
  creator_avatar_url?: string;
  creator_name?: string;
  is_public?: boolean;
  is_favorite?: boolean;
  is_collab?: boolean;
  is_label_artist?: boolean;
  likes_count?: number;
  user_count?: number;
  followers_count?: number;
  genre_specialties?: string[];
  instrument?: string;
  artist_category?: string;
  banner_darkness?: number;
  has_3d_model?: boolean;
  model_url?: string;
  animation_preset?: string;
  featured_works?: Array<{
    title: string;
    description?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}
