
import { useEffect, useRef, useState } from 'react';
import { EnhancedMusicPlayer } from './EnhancedMusicPlayer';

interface MusicPlayerProps {
  audioUrl: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  trackTitle?: string;
  artistName?: string;
  onTransportClose?: () => void; // Callback prop for notifying parent
  trimStart?: number; // Start time in seconds for trimmed playback
  trimEnd?: number; // End time in seconds for trimmed playback
}

export const MusicPlayer = ({ 
  audioUrl, 
  isPlaying, 
  onPlayPause,
  trackTitle,
  artistName,
  onTransportClose,
  trimStart,
  trimEnd
}: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // If no audioUrl is provided or player is hidden, don't render the player
  if (!audioUrl || !isVisible) {
    return null;
  }
  
  // Initialize or update audio element
  useEffect(() => {
    if (!audioUrl) return;
    
    const setupAudio = () => {
      // Create new audio element if none exists
      if (!audioRef.current) {
        const audio = new Audio(audioUrl);
        
        audio.addEventListener('ended', () => {
          console.log('Audio ended, calling onPlayPause');
          onPlayPause();
        });
        
        audio.addEventListener('canplaythrough', () => {
          setIsAudioReady(true);
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Audio element error:', e);
          setIsAudioReady(false);
        });
        
        audioRef.current = audio;
      } 
      // Update source if URL changed
      else if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
    };
    
    setupAudio();
    setIsVisible(true); // Show player when new audio is loaded
    
    return () => {
      closeTransport();
    };
  }, [audioUrl, onPlayPause]);
  
  // Handle trim end point for playback
  useEffect(() => {
    if (!audioRef.current || !isAudioReady || trimEnd === undefined) return;
    
    const handleTimeUpdate = () => {
      if (audioRef.current && trimEnd !== undefined && audioRef.current.currentTime >= trimEnd) {
        audioRef.current.pause();
        onPlayPause(); // Toggle playback state
      }
    };
    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [trimEnd, isAudioReady, onPlayPause]);
  
  // Handle play/pause state changes and trim points
  useEffect(() => {
    if (!audioRef.current || !isAudioReady) return;
    
    // Set trim points if provided
    if (trimStart !== undefined && audioRef.current) {
      audioRef.current.currentTime = trimStart;
    }
    
    const playAudio = async () => {
      if (isPlaying) {
        try {
          await audioRef.current?.play();
          // Reset auto-hide timer when playback starts
          startAutoHideTimer();
        } catch (error) {
          console.error('Error playing audio:', error);
          onPlayPause(); // Toggle back to paused state on error
        }
      } else {
        audioRef.current?.pause();
      }
    };
    
    playAudio();
  }, [isPlaying, isAudioReady, onPlayPause, trimStart]);
  
  // Set up auto-hide functionality
  useEffect(() => {
    // Add event listeners for user activity
    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      // Only start the inactivity timer if audio is playing
      if (isPlaying) {
        startAutoHideTimer();
      }
    };
    
    // Listen for user interactions to reset the timer
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('mousedown', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    window.addEventListener('touchstart', resetInactivityTimer);
    
    // Start the initial timer if playing
    if (isPlaying) {
      startAutoHideTimer();
    }
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('mousedown', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
      window.removeEventListener('touchstart', resetInactivityTimer);
      
      // Clear any existing timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [isPlaying]);
  
  // Function to start the auto-hide timer
  const startAutoHideTimer = () => {
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Set a new timer - hide after 10 seconds of inactivity
    inactivityTimerRef.current = setTimeout(() => {
      // Only auto-hide if still playing
      if (isPlaying && audioRef.current) {
        setIsVisible(false);
        // Notify parent component that transport is closed
        if (onTransportClose) {
          onTransportClose();
        }
      }
    }, 10000); // 10 seconds
  };
  
  // Function to close the transport - stop playback, release audio, etc.
  const closeTransport = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeEventListener('ended', onPlayPause);
      audioRef.current.src = ''; // Release the audio file
      setIsAudioReady(false);
    }
    
    // Hide the player
    setIsVisible(false);
    
    // Notify parent component that transport is closed
    if (onTransportClose) {
      onTransportClose();
    }
    
    // Clear any timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }
  };
  
  // Only render EnhancedMusicPlayer if audioUrl exists and player is visible
  return (
    <EnhancedMusicPlayer
      audioUrl={audioUrl}
      isPlaying={isPlaying}
      onPlayPause={onPlayPause}
      trackTitle={trackTitle || 'Preview Track'}
      artistName={artistName}
      audioRef={audioRef}
      isAudioReady={isAudioReady}
      closeTransport={closeTransport}
      trimStart={trimStart}
      trimEnd={trimEnd}
    />
  );
};
