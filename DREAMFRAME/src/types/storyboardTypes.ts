
export interface Scene {
  id: string;
  imageUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  prompt: string;
  description: string;
  durationInSeconds: number;
  startTimeOffset?: number; // Time offset from the beginning of the story
}

// Renamed from Story to SceneContainer
export interface SceneContainer {
  id: string;
  title: string;
  description: string;
  scenes: Scene[];
  createdAt: Date;
  updatedAt: Date;
  totalDuration?: number; // Optional global duration for all scenes
  audioTrack?: string | null; // Global audio track for the entire scene
}

export interface StoryProject {
  id: string;
  name: string;
  stories: SceneContainer[]; // We'll keep this as stories in the backend but display as scenes in UI
}

export interface ProjectMedia {
  id: string;
  url: string;
  name: string;
  type: "image" | "video" | "audio";
  dateAdded: Date;
  source?: string;
  tags?: string[]; // New: Array of tags for filtering
  category?: string; // New: Category for organizing media
  description?: string; // New: Additional description for search
  favorite?: boolean; // New: Mark favorite media items
}

// New: Types for media organization
export interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

// New: Search parameters for media gallery
export interface MediaSearchParams {
  query?: string;
  type?: "image" | "video" | "audio" | "all";
  tags?: string[];
  category?: string;
  favorites?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  sortBy?: "dateAdded" | "name" | "type";
  sortDirection?: "asc" | "desc";
}
