
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
  // If no audioUrl is provided, don't render the player
  if (!audioUrl) {
    return null;
  }
  
  // Initialize or update audio element with robust error handling and continuous playback
  useEffect(() => {
    if (!audioUrl) return;
    
    const setupAudio = () => {
      // Create new audio element if none exists
      if (!audioRef.current) {
        const audio = new Audio(audioUrl);
        
        // Set up audio context for better playback control
        audio.preload = 'auto';
        
        audio.addEventListener('ended', () => {
          onPlayPause();
        });
        
        audio.addEventListener('canplaythrough', () => {
          setIsAudioReady(true);
          // Attempt to resume playback if it was playing
          if (isPlaying) {
            audio.play().catch(() => {});
          }
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Audio element error:', e);
          setIsAudioReady(false);
          onPlayPause(); // Ensure UI state reflects playback state
        });
        
        // Handle unexpected pauses
        audio.addEventListener('pause', () => {
          if (isPlaying && !audio.ended) {
            audio.play().catch(() => {});
          }
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
    
    // Cleanup only when component is unmounted
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [audioUrl, onPlayPause, isPlaying]);
  
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
          // Add a small delay to ensure UI changes don't interfere with playback
          await new Promise(resolve => setTimeout(resolve, 10));
          await audioRef.current?.play();
          // Ensure playback continues by setting priority
          if (audioRef.current) {
            // These attributes help maintain playback during UI changes
            audioRef.current.preservesPitch = true;
            audioRef.current.setAttribute('data-priority', 'high');
          }
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
  
  // Add event listener to handle any external interference with audio playback
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When tab becomes visible again, check if playback should be running
      if (document.visibilityState === 'visible' && isPlaying && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };
    
    // Handle potential external pauses (like from header interactions)
    const handleExternalPause = () => {
      if (isPlaying && audioRef.current && audioRef.current.paused) {
        // Try to resume playback if it should be playing but was paused externally
        audioRef.current.play().catch(() => {});
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up an interval to check playback status and correct if needed
    const playbackCheckInterval = setInterval(handleExternalPause, 500);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(playbackCheckInterval);
    };
  }, [isPlaying]);
  

  
  // Function to handle transport close and cleanup
  const closeTransport = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (onTransportClose) {
      onTransportClose();
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
