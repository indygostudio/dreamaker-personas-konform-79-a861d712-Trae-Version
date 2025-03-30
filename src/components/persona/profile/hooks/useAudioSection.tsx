
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Track } from "@/types/track";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

interface Loop {
  id: string;
  title: string;
  audio_url: string;
  tempo?: number;
  musical_key?: string;
  meter?: string;
  sample_name?: string;
  token_cost?: number;
  created_at: string;
}

export const useAudioSection = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isAddAudioDialogOpen, setIsAddAudioDialogOpen] = useState(false);
  const [isLoopDialogOpen, setIsLoopDialogOpen] = useState(false);
  const [audioFileForLoop, setAudioFileForLoop] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: playlists, isLoading: isLoadingPlaylists, refetch: refetchPlaylists } = useQuery({
    queryKey: ['playlists', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('persona_id', id);

      if (error) {
        console.error('Error fetching playlists:', error);
        return [];
      }

      return data || [];
    },
  });

  // Set the first playlist as selected when playlists load or change
  useEffect(() => {
    if (playlists && playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [playlists, selectedPlaylistId]);

  const { data: tracks, isLoading: isLoadingTracks, refetch: refetchTracks } = useQuery({
    queryKey: ['persona_tracks', selectedPlaylistId],
    queryFn: async () => {
      if (!selectedPlaylistId) return [];

      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('playlist_id', selectedPlaylistId)
        .order('order_index');

      if (error) {
        console.error('Error fetching tracks:', error);
        return [];
      }

      return data as Track[];
    },
    enabled: Boolean(selectedPlaylistId),
  });

  // Fetch loops created by user
  const { data: loops, isLoading: isLoadingLoops, refetch: refetchLoops } = useQuery({
    queryKey: ['user_loops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_loops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loops:', error);
        return [];
      }

      return data as Loop[];
    },
  });

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      // If it's the same track, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // Set the new track immediately without delay
      setCurrentTrack(track);
      // Start playing immediately
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleUploadAudio = async (file: File, isLoop: boolean, loopData?: {
    title?: string;
    tempo?: number;
    musical_key?: string;
    meter?: string;
    sample_name?: string;
  }) => {
    if (!file || !selectedPlaylistId) {
      toast.error("No file or playlist selected");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to upload audio");
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `audio/${id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('audio_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio_files')
        .getPublicUrl(filePath);
      
      if (isLoop) {
        // If it's a loop, save to audio_loops table
        const { error: loopError } = await supabase
          .from('audio_loops')
          .insert({
            title: loopData?.title || file.name.replace(`.${fileExt}`, ''),
            audio_url: publicUrl,
            tempo: loopData?.tempo,
            musical_key: loopData?.musical_key,
            meter: loopData?.meter,
            sample_name: loopData?.sample_name,
            user_id: user.id
          });
          
        if (loopError) throw loopError;
        
        refetchLoops();
        toast.success("Loop added successfully");
      } else {
        // Otherwise, add to tracks table
        const { data: existingTracks } = await supabase
          .from('tracks')
          .select('id')
          .eq('playlist_id', selectedPlaylistId);
          
        const orderIndex = existingTracks ? existingTracks.length : 0;
        
        const { error: trackError } = await supabase
          .from('tracks')
          .insert({
            title: file.name.replace(`.${fileExt}`, ''),
            audio_url: publicUrl,
            playlist_id: selectedPlaylistId,
            order_index: orderIndex,
            is_public: false,
            persona_id: id,
            is_loop: false,
            user_id: user.id
          });
        
        if (trackError) throw trackError;
        
        refetchTracks();
        toast.success("Track added to playlist");
      }
    } catch (error: any) {
      console.error('Error uploading audio:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setIsAddAudioDialogOpen(false);
      setIsLoopDialogOpen(false);
      setAudioFileForLoop(null);
    }
  };

  const addLoopToPlaylist = async (loop: Loop) => {
    if (!selectedPlaylistId) {
      toast.error("No playlist selected");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add loops");
      return;
    }

    try {
      const { data: existingTracks } = await supabase
        .from('tracks')
        .select('id')
        .eq('playlist_id', selectedPlaylistId);
        
      const orderIndex = existingTracks ? existingTracks.length : 0;
      
      const { error } = await supabase
        .from('tracks')
        .insert({
          title: loop.title,
          audio_url: loop.audio_url,
          playlist_id: selectedPlaylistId,
          order_index: orderIndex,
          is_public: false,
          persona_id: id,
          is_loop: true,
          user_id: user.id
        });
      
      if (error) throw error;
      
      refetchTracks();
      toast.success("Loop added to playlist");
    } catch (error: any) {
      console.error('Error adding loop to playlist:', error);
      toast.error(`Failed to add loop: ${error.message}`);
    }
  };

  return {
    id,
    playlists,
    isLoadingPlaylists,
    refetchPlaylists,
    tracks,
    isLoadingTracks,
    refetchTracks,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    selectedPlaylistId,
    setSelectedPlaylistId,
    handlePlayTrack,
    handlePlayPause,
    isAddAudioDialogOpen,
    setIsAddAudioDialogOpen,
    isLoopDialogOpen,
    setIsLoopDialogOpen,
    handleUploadAudio,
    isUploading,
    audioFileForLoop,
    setAudioFileForLoop,
    loops,
    isLoadingLoops,
    refetchLoops,
    addLoopToPlaylist
  };
};
