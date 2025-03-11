
export type ImageSize = "1024x1024" | "1792x1024" | "1024x1792";
export type ImageRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

// Make this consistent with the persona.ts MidjourneyAspectRatio
export type MidjourneyAspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:2" | "2:3";
export type MidjourneyProcessMode = "fast" | "relax" | "turbo";
export type MidjourneyUpscaleIndex = 1 | 2 | 3 | 4;
export type MidjourneyVariationIndex = 1 | 2 | 3 | 4;
export type MidjourneyDimension = "square" | "portrait" | "landscape";

// Add AIImage and ImageFilters types that are missing
export interface AIImage {
  id?: string;
  user_id: string;
  persona_id?: string;
  title: string;
  prompt: string;
  image_url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  tags?: string[];
  is_liked?: boolean;
  is_hidden?: boolean;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface ImageFilters {
  searchTerm?: string;
  searchQuery?: string; // Adding this to match the code
  sortBy?: 'newest' | 'oldest' | 'popular';
  personaId?: string;
  isLiked?: boolean;
  isHidden?: boolean;
  tags?: string[];
  type?: 'all' | 'generated' | 'uploaded';
  ratio?: string;
  size?: string;
}

export interface AIImageTask {
  id?: string;
  user_id: string;
  persona_id?: string;
  task_id: string;
  title: string;
  prompt: string;
  status: 'pending' | 'completed' | 'failed';
  service: 'midjourney' | 'openai' | 'stability';
  result_url?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

// Midjourney account credentials interface
export interface MidjourneyAccount {
  username: string;
  password: string;
  isConnected: boolean;
}
