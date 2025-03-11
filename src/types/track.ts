
export interface Track {
  id: string;
  title: string;
  audio_url: string;
  album_artwork_url: string;
  created_at: string;
  updated_at: string;
  order_index: number;
  is_public: boolean;
  playlist_id: string;
  user_id?: string;
  persona_id?: string;
  duration: number;
  artist?: string;
  writers?: string[];
  collaborators?: string[];
  mixer?: string;
  is_loop?: boolean;
}
