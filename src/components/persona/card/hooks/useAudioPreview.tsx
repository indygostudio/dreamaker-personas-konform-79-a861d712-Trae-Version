
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export const useAudioPreview = (audioUrl: string | undefined) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Reset to beginning if it was played before
        if (audioRef.current.currentTime > 0) {
          audioRef.current.currentTime = 0;
        }
        
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast.error("Error playing audio preview");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return { isPlaying, handleAudioToggle };
};
