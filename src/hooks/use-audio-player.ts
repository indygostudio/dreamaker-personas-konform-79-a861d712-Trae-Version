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
    console.log('[DEBUG] Attempting to play track:', {
      trackId: track.id,
      title: track.title,
      audioUrl: track.audio_url,
      personaId: track.persona_id
    });
    console.log('[DEBUG] Current audio state:', {
      playbackStatus: playbackState.status,
      currentTrackId: currentTrack?.id,
      currentTrackTitle: currentTrack?.title,
      audioElement: document.querySelector('audio[data-priority="high"]') ? 'exists' : 'not found'
    });
    
    // Validate audio URL
    fetch(track.audio_url, { method: 'HEAD' })
      .then(response => {
        console.log('[DEBUG] Audio URL validation:', {
          url: track.audio_url,
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        });
      })
      .catch(err => {
        console.error('[DEBUG] Audio URL validation error:', err);
      });
    
    if (currentTrack?.id === track.id) {
      // Toggle play/pause for current track
      if (playbackState.status === 'playing') {
        console.log('[DEBUG] Pausing current track');
        pause();
      } else {
        console.log('[DEBUG] Resuming current track');
        // Try creating a test audio element to see if playback is possible
        const testAudio = new Audio(track.audio_url);
        testAudio.volume = 0;
        
        testAudio.addEventListener('canplaythrough', () => {
          console.log('[DEBUG] Test audio can play through');
          // Now try the actual play
          play().catch(err => {
            console.error('[DEBUG] Error resuming track:', err);
          });
        });
        
        testAudio.addEventListener('error', (e) => {
          console.error('[DEBUG] Test audio error:', testAudio.error);
        });
        
        // Load but don't play the test audio
        testAudio.load();
      }
    } else {
      // Play new track
      console.log('[DEBUG] Playing new track:', track.title);
      
      // Try with a direct Audio element first to test
      const testAudio = new Audio(track.audio_url);
      testAudio.volume = 0;
      
      testAudio.addEventListener('canplaythrough', () => {
        console.log('[DEBUG] New track test audio can play through');
        // Now try the actual play
        play(track).catch(err => {
          console.error('[DEBUG] Error playing new track:', err);
        });
      });
      
      testAudio.addEventListener('error', (e) => {
        console.error('[DEBUG] New track test audio error:', testAudio.error);
      });
      
      // Load but don't play the test audio
      testAudio.load();
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
    visualizationMode: globalAudioState.visualization.mode,
    
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