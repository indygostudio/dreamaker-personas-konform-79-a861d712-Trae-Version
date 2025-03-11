
export interface ArtistProfile {
  id: string;
  username?: string;
  user_bio?: string;
  genre?: string[];
  is_public?: boolean;
  persona_ids?: string[];
  persona_count?: number;
  avatar_url?: string;
  video_url?: string;
  model_url?: string | null;
  has_3d_model?: boolean;
  animation_preset?: string;
  banner_url?: string;
  banner_position: { x: number; y: number };
  privacy_settings?: Record<string, any>;
  notification_settings?: Record<string, any>;
  analytics?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  location?: string;
}
