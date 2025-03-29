import { useEffect } from "react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { UnifiedMusicPlayer } from "@/components/audio/UnifiedMusicPlayer";
import type { Track } from "@/types/track";

/**
 * ArtistAudioPlayerAdapter - A compatibility layer for artist profiles
 * that integrates with the new unified audio system.
 * 
 * This adapter manages the connection between artist profile audio state
 * and the unified audio architecture.
 */
interface ArtistAudioPlayerAdapterProps {
  currentTrack: Track;
  tracks: Track[];
  isPlaying: boolean;
  isShuffled: boolean;
  isLooping: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsShuffled: (isShuffled: boolean) => void;
  setIsLooping: (isLooping: boolean) => void;
  onTrackSelect: (track: Track) => void;
  trimStart?: number;
  trimEnd?: number;
}

export const ArtistAudioPlayerAdapter = ({
  currentTrack,
  tracks,
  isPlaying,
  isShuffled,
  isLooping,
  setIsPlaying,
  setIsShuffled,
  setIsLooping,
  onTrackSelect,
  trimStart,
  trimEnd
}: ArtistAudioPlayerAdapterProps) => {
  // Get the unified audio player
  const {
    initializeTracks,
    handlePlayTrack,
  } = useAudioPlayer();
  
  // Keep track lists in sync
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      // Find current track index
      const currentIndex = currentTrack 
        ? tracks.findIndex(t => t.id === currentTrack.id)
        : 0;
      
      // Initialize tracks in the unified system
      initializeTracks(
        tracks,
        currentIndex >= 0 ? currentIndex : 0,
        false // Don't autoplay when initializing
      );
    }
  }, [tracks, currentTrack, initializeTracks]);
  
  // Handle track selection with both local and global state
  const handleTrackSelection = (track: Track) => {
    // Update local state through the onTrackSelect callback
    onTrackSelect(track);
    
    // Update the unified audio system
    handlePlayTrack(track);
  };
  
  return (
    <UnifiedMusicPlayer
      currentTrack={currentTrack}
      tracks={tracks}
      isPlaying={isPlaying}
      isShuffled={isShuffled}
      isLooping={isLooping}
      setIsPlaying={setIsPlaying}
      setIsShuffled={setIsShuffled}
      setIsLooping={setIsLooping}
      onTrackSelect={handleTrackSelection}
      trimStart={trimStart}
      trimEnd={trimEnd}
    />
  );
};