
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Track } from "@/types/track";

export const uploadTrack = async (file: File, profileId: string, tracksCount: number) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${profileId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('audio_files')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('audio_files')
    .getPublicUrl(filePath);

  // Get or create playlist
  const { data: playlists, error: playlistError } = await supabase
    .from('playlists')
    .select('id')
    .eq('persona_id', profileId)
    .limit(1);

  if (playlistError) throw playlistError;

  let playlistId;

  if (!playlists || playlists.length === 0) {
    const { data: newPlaylist, error: createError } = await supabase
      .from('playlists')
      .insert([{ persona_id: profileId }])
      .select()
      .single();
      
    if (createError) throw createError;
    playlistId = newPlaylist.id;
  } else {
    playlistId = playlists[0].id;
  }

  const { error: trackError } = await supabase
    .from('tracks')
    .insert([{
      playlist_id: playlistId,
      title: file.name.replace(`.${fileExt}`, ''),
      audio_url: publicUrl,
      is_public: true,
      order_index: tracksCount
    }]);

  if (trackError) throw trackError;
};

export const fetchTracks = async (profileId: string) => {
  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return tracks;
};
