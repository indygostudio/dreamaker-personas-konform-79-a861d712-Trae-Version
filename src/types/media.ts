
export interface MediaPosition {
  x: number;
  y: number;
}

export type MediaType = "audio" | "video" | "image" | "midi" | "preset" | "loop" | "music" | "model" | "prompts" | "plugin" | "patch" | "album";

export interface MediaFile {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  duration?: number;
  metadata?: Record<string, any>;
  collection_id: string;
  created_at: string;
  updated_at: string;
}

export interface MediaCollection {
  id: string;
  title: string;
  description?: string;
  media_type: MediaType;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  banner_url?: string;
  banner_position?: MediaPosition;
  preview_url?: string;
  preview_image_url?: string;
  cover_image_url?: string;
  card_image_url?: string;
  likes_count?: number;
  downloads_count?: number;
  media_types?: MediaType[];
  technical_specs?: Record<string, any>;
  required_tier?: string;
}

export interface ArtistProfile {
  id: string;
  username?: string;
  user_bio?: string;
  title?: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
  video_url?: string;
  model_url?: string;
  banner_position?: MediaPosition;
  has_3d_model?: boolean;
  animation_preset?: string;
  persona_ids?: string[];
  persona_count?: number;
  created_at?: string;
  updated_at?: string;
  card_image_url?: string;
  likes_count?: number;
  downloads_count?: number;
  is_public?: boolean;
  tags?: string[];
  style_tags?: string[];
  genre?: string[];
  technical_level?: string;
  user_id?: string;
  analytics?: Record<string, any>;
}

export interface SupabaseArtistProfile extends Omit<ArtistProfile, 'banner_position'> {
  banner_position?: string | MediaPosition;
}
