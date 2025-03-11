
import { Track } from "@/types/track";

export const transformTrackData = (trackData: any): Track => ({
  id: trackData.id,
  title: trackData.title,
  audio_url: trackData.audio_url,
  album_artwork_url: trackData.album_artwork_url || '',
  created_at: trackData.created_at,
  updated_at: trackData.updated_at,
  order_index: trackData.order_index || 0,
  is_public: trackData.is_public || false,
  playlist_id: trackData.playlist_id,
  user_id: trackData.user_id,
  persona_id: trackData.persona_id,
  duration: trackData.duration || 0,
  writers: trackData.writers || [],
  collaborators: trackData.collaborators || [],
  mixer: trackData.mixer || ''
});
