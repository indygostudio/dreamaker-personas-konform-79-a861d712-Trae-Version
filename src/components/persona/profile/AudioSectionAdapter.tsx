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
  
  // Local state to handle visibility, looping, and shuffle
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  
  // Get the unified audio player
  const { handlePlayTrack: unifiedPlayTrack } = useAudioPlayer();
  
  // Get the unified audio player
  const {
    initializeTracks,
    addToPlaylist,
    clearPlaylist
  } = useAudioPlayer();
  
  // Keep track lists in sync and handle initial state
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
      
      // Check for stored loop/shuffle state in session storage
      const storedLoopState = sessionStorage.getItem('audioPlayerLooping');
      const storedShuffleState = sessionStorage.getItem('audioPlayerShuffled');
      
      if (storedLoopState) {
        setIsLooping(storedLoopState === 'true');
      }
      
      if (storedShuffleState) {
        setIsShuffled(storedShuffleState === 'true');
      }
    }
  }, [tracks, currentTrack, initializeTracks]);
  
  // Save loop and shuffle state to session storage when they change
  useEffect(() => {
    sessionStorage.setItem('audioPlayerLooping', isLooping.toString());
    sessionStorage.setItem('audioPlayerShuffled', isShuffled.toString());
  }, [isLooping, isShuffled]);
  
  // Intercept track selection to route through the unified system
  const handleTrackSelect = (track: Track) => {
    // Call the original handler to maintain local state
    originalHandlePlayTrack(track);
    
    // Also play through the unified audio system
    unifiedPlayTrack(track);
  };
  
  // Only render the music player if there's a current track
  // We want to show the player even if not playing, as long as a track is selected
  if (!currentTrack) {
    return null;
  }
  
  // Function to handle shuffle toggle
  const handleSetIsShuffled = (shuffleState: boolean) => {
    setIsShuffled(shuffleState);
  };
  
  // Function to handle loop toggle
  const handleSetIsLooping = (loopState: boolean) => {
    setIsLooping(loopState);
  };

  return (
    <UnifiedMusicPlayer
      currentTrack={currentTrack}
      tracks={tracks || []}
      isPlaying={isPlaying}
      isShuffled={isShuffled}
      isLooping={isLooping}
      setIsPlaying={setIsPlaying}
      setIsShuffled={handleSetIsShuffled}
      setIsLooping={handleSetIsLooping}
      onTrackSelect={handleTrackSelect}
      onClose={() => {
        setIsPlaying(false);
        setIsMusicPlayerVisible(false);
        sessionStorage.removeItem('currentAudioTrack');
      }}
    />
  );
};
