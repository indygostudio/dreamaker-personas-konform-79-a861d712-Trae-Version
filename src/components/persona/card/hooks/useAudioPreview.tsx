
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface UseAudioPreviewOptions {
  showTransport?: boolean;
  personaName?: string;
}

export const useAudioPreview = (audioUrl: string | undefined, options?: UseAudioPreviewOptions) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { showTransport = true, personaName = "Audio Preview" } = options || {};

  useEffect(() => {
    // Clean up previous audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("ended", handleAudioEnded);
      audioRef.current.removeEventListener("error", handleAudioError);
      audioRef.current = null;
    }
    
    // Create new audio element if URL is available
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("ended", handleAudioEnded);
      audioRef.current.addEventListener("error", handleAudioError);
      
      // Preload the audio
      audioRef.current.preload = "metadata";
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        audioRef.current.removeEventListener("ended", handleAudioEnded);
        audioRef.current.removeEventListener("error", handleAudioError);
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  // Also ensure cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, []);

  const handleAudioError = (event: Event) => {
    console.error("Audio preview error:", event);
    setIsPlaying(false);
    toast.error("Error playing audio preview");
  };

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!audioUrl) {
      toast.error("No audio preview available");
      return;
    }

    // Toggle playing state
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    // Show music player transport when playing starts
    if (showTransport && newPlayingState) {
      setShowMusicPlayer(true);
    }

    if (audioRef.current) {
      if (!newPlayingState) {
        audioRef.current.pause();
      } else {
        // Reset to beginning if it was played before
        if (audioRef.current.currentTime > 0) {
          audioRef.current.currentTime = 0;
        }
        
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast.error("Error playing audio preview");
          setIsPlaying(false);
        });
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  const handleTransportClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setShowMusicPlayer(false);
  };

  return { 
    isPlaying, 
    handleAudioToggle, 
    showMusicPlayer, 
    handleTransportClose,
    audioUrl,
    personaName
  };
};
