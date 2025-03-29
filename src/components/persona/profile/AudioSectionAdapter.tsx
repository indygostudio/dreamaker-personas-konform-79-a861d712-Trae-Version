import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useAudioSection } from "./hooks/useAudioSection";
import { UnifiedMusicPlayer } from "@/components/audio/UnifiedMusicPlayer";
import type { Track } from "@/types/track";

/**
 * AudioSectionAdapter - A compatibility layer that bridges the existing
 * AudioSection implementation with the new unified audio system.
 * 
 * This adapter:
 * 1. Connects useAudioSection hook data with the unified audio system
 * 2. Provides the UnifiedMusicPlayer as a drop-in replacement
 * 3. Maintains backward compatibility with existing code
 */
export const AudioSectionAdapter = () => {
  const {
    currentTrack,
    tracks,
    isPlaying,
    setIsPlaying,
    handlePlayTrack: originalHandlePlayTrack,
    isAddAudioDialogOpen,
    setIsAddAudioDialogOpen
  } = useAudioSection();
  
  // Local state to handle visibility (since this was in the AudioSection component)
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
  
  // Get the unified audio player
  const { handlePlayTrack: unifiedPlayTrack } = useAudioPlayer();
  
  // Get the unified audio player
  const {
    initializeTracks,
    addToPlaylist,
    clearPlaylist
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
  
  // Intercept track selection to route through the unified system
  const handleTrackSelect = (track: Track) => {
    // Call the original handler to maintain local state
    originalHandlePlayTrack(track);
    
    // Also play through the unified audio system
    unifiedPlayTrack(track);
  };
  
  // Only render the music player if there's a current track and we're playing
  // or the music player should be visible
  if (!currentTrack) {
    return null;
  }
  
  return (
    <UnifiedMusicPlayer
      currentTrack={currentTrack}
      tracks={tracks || []}
      isPlaying={isPlaying}
      isShuffled={false} // Default to false as in the original component
      isLooping={false}  // Default to false as in the original component
      setIsPlaying={setIsPlaying}
      setIsShuffled={() => {}} // Not implemented in original component
      setIsLooping={() => {}}  // Not implemented in original component
      onTrackSelect={handleTrackSelect}
      onClose={() => {
        setIsPlaying(false);
        setIsMusicPlayerVisible(false);
        sessionStorage.removeItem('currentAudioTrack');
      }}
    />
  );
};