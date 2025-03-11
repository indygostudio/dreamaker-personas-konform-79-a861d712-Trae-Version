
export interface BannerPosition {
  x: number;
  y: number;
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Make sure BannerPosition is compatible with Json type
export type BannerPositionJson = {
  x: number;
  y: number;
};

export interface Profile {
  id: string;
  username?: string;
  display_name?: string;
  user_bio?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  banner_position?: BannerPositionJson; // Updated to use Json-compatible type
  banner_darkness?: number;
  darkness_factor?: number;
  is_public?: boolean;
  video_url?: string;
  audio_preview_url?: string;
  audio_trim_start?: number;
  audio_trim_end?: number;
  genre?: string[];
  location?: string;
  profile_type?: string;
  created_at?: string;
  updated_at?: string;
}
