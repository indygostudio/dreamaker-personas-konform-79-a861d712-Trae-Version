
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
    // Initialize audio when new audio is loaded
    
    // Cleanup only when component is unmounted
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
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
          // Start playback
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
