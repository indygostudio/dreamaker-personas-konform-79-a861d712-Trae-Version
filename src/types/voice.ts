
import type { Json } from './supabase';

export interface VoiceProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  voice_id: string;
  settings: Json;
  created_at: string;
  updated_at: string;
}

export interface VoiceHistory {
  id: string;
  user_id: string;
  project_id?: string;
  voice_id: string;
  input_audio_url?: string;
  output_audio_url: string;
  settings: Json;
  duration?: number;
  created_at: string;
}

export interface VoiceAnalytics {
  id: string;
  user_id: string;
  voice_id: string;
  total_conversions: number;
  total_duration: number;
  avg_conversion_time: number;
  created_at: string;
  updated_at: string;
}
