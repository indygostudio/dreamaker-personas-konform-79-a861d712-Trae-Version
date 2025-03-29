import { useCallback } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import type { Track } from '@/types/track';

/**
 * A compatibility hook that bridges the existing audio implementations 
 * with the new centralized audio system.
 * 
 * This hook provides an API that matches the existing implementations
 * while leveraging the new unified audio architecture underneath.
 */
export const useAudioPlayer = () => {
  const {
    globalAudioState,
    play,
    pause,
    seek,
    next,
    previous,
    setVolume,
    toggleMute,
    shufflePlaylist,
    setRepeatMode,
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    setVisualizationMode
  } = useAudio();
  
  const { currentTrack, playbackState, playlist } = globalAudioState;
  
  // Compatibility with existing MusicPlayer components
  const handlePlayTrack = useCallback((track: Track) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause for current track
      if (playbackState.status === 'playing') {
        pause();
      } else {
        play();
      }
    } else {
      // Play new track
      play(track);
    }
  }, [currentTrack, playbackState.status, play, pause]);
  
  const handlePlayPause = useCallback(() => {
    if (playbackState.status === 'playing') {
      pause();
    } else if (currentTrack) {
      play();
    }
  }, [currentTrack, playbackState.status, play, pause]);
  
  const setIsPlaying = useCallback((isPlaying: boolean) => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);
  
  const setIsShuffled = useCallback((isShuffled: boolean) => {
    shufflePlaylist(isShuffled);
  }, [shufflePlaylist]);
  
  const setIsLooping = useCallback((isLooping: boolean) => {
    setRepeatMode(isLooping ? 'track' : 'none');
  }, [setRepeatMode]);
  
  // Helper for converting a single track to a playlist
  const initializeTrack = useCallback((track: Track, autoPlay: boolean = true) => {
    setPlaylist([track], 0, autoPlay);
  }, [setPlaylist]);
  
  // Helper for converting an array of tracks to a playlist
  const initializeTracks = useCallback((tracks: Track[], currentIndex: number = 0, autoPlay: boolean = true) => {
    setPlaylist(tracks, currentIndex, autoPlay);
  }, [setPlaylist]);
  
  return {
    // Current state
    currentTrack,
    isPlaying: playbackState.status === 'playing',
    isShuffled: playlist.isShuffled,
    isLooping: playlist.repeatMode === 'track',
    currentTime: playbackState.currentTime,
    duration: playbackState.duration,
    progress: playbackState.duration > 0 ? (playbackState.currentTime / playbackState.duration) * 100 : 0,
    volume: playbackState.volume,
    isMuted: playbackState.isMuted,
    visualizationMode: visualization.mode,
    
    // Existing API methods (for backward compatibility)
    handlePlayTrack,
    handlePlayPause,
    setIsPlaying,
    setIsShuffled,
    setIsLooping,
    
    // New enhanced API methods
    initializeTrack,
    initializeTracks,
    seek,
    next,
    previous,
    setVolume,
    toggleMute,
    
    // Playlist management
    tracks: playlist.tracks,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    setVisualizationMode
  };
};