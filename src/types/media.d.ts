
export type MediaType = 'loop' | 'midi' | 'plugin' | 'patch';

export interface MediaCollection {
  id: string;
  title: string;
  type: MediaType;
  preview_image_url?: string;
  file_url?: string;
  bpm?: number;
  musical_key?: string;
  required_tier?: string;
  created_at: string;
  banner_position?: {
    x: number;
    y: number;
  };
  cover_image_url?: string;
  preview_url?: string;
  technical_specs?: {
    bpm?: number;
    key?: string;
  };
}
