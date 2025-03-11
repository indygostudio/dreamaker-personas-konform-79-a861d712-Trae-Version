
export interface Playlist {
  id: string;
  name: string;
  album_title?: string;
  album_artwork_url?: string;
  persona_id: string;
  created_at: string;
  updated_at: string;
  album_order?: number;
  is_default?: boolean;
}
