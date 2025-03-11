
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Track } from "@/types/track";

export const useTrackLyrics = (track: Track, isActive: boolean, isPlaying: boolean) => {
  const [trackLyrics, setTrackLyrics] = useState<string>("");
  const [showLyrics, setShowLyrics] = useState(false);
  const [isLyricsEditorOpen, setIsLyricsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load lyrics when track changes or becomes active
  useEffect(() => {
    const loadLyrics = async () => {
      if (!track?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('track_lyrics')
          .select('content')
          .eq('track_id', track.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error loading lyrics:", error);
          return;
        }
        
        if (data?.content) {
          setTrackLyrics(data.content);
        } else {
          setTrackLyrics("");
        }
      } catch (error) {
        console.error("Failed to load lyrics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (track?.id && isActive) {
      loadLyrics();
    }
  }, [track?.id, isActive]);

  // Toggle lyrics display
  const handleLyricsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (trackLyrics) {
      // If we already have lyrics, toggle display
      setShowLyrics(!showLyrics);
    } else {
      // If no lyrics, open the editor
      setIsLyricsEditorOpen(true);
    }
  };

  // Callback when lyrics are saved in the editor
  const handleLyricsSaved = async () => {
    if (!track?.id) return;
    
    // Reload lyrics after saving
    try {
      const { data, error } = await supabase
        .from('track_lyrics')
        .select('content')
        .eq('track_id', track.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error reloading lyrics:", error);
        return;
      }
      
      if (data?.content) {
        setTrackLyrics(data.content);
        setShowLyrics(true); // Show lyrics after saving
      }
    } catch (error) {
      console.error("Failed to reload lyrics:", error);
    }
  };

  // Close lyrics display when track is not active
  useEffect(() => {
    if (!isActive) {
      setShowLyrics(false);
    }
  }, [isActive]);

  return {
    trackLyrics,
    showLyrics,
    isLyricsEditorOpen,
    setIsLyricsEditorOpen,
    isLoading,
    handleLyricsClick,
    handleLyricsSaved
  };
};
