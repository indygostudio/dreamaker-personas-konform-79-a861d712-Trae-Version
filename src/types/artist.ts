
export interface ArtistProfile {
  id: string;
  username: string | null;
  user_bio: string | null;
  genre: string[] | null;
  is_public: boolean;
  persona_ids: string[];
  persona_count: number;
  avatar_url: string | null;
  video_url: string | null;
  model_url: string | null;
  has_3d_model: boolean;
  animation_preset: string;
  banner_url: string | null;
  banner_position: {
    x: number;
    y: number;
  };
  location: string | null;
  created_at: string;
  updated_at: string;
  analytics: Record<string, any>;
  privacy_settings: Record<string, any>;
  notification_settings: Record<string, any>;
}
