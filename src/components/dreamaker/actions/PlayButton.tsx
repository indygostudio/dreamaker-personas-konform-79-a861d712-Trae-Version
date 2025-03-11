
import { Button } from "@/components/ui/button";
import { Play, Volume2 } from "lucide-react";
import { useState } from "react";
import { MusicPlayer } from "@/components/artist-profile/MusicPlayer";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlayButtonProps {
  artistId: string;
  artistName: string;
  isIconOnly: boolean;
}

export const PlayButton = ({
  artistId,
  artistName,
  isIconOnly
}: PlayButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // Fetch the audio preview URL for this artist
  const { data: audioPreviewUrl, isLoading } = useQuery({
    queryKey: ['artist-audio-preview', artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personas')
        .select('audio_preview_url')
        .eq('id', artistId)
        .single();
      
      if (error) throw error;
      return data?.audio_preview_url || null;
    }
  });

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!audioPreviewUrl) {
      toast.error("No audio preview available for this persona");
      return;
    }
    
    setIsPlaying(!isPlaying);
    setShowPlayer(true); // Show player when play is clicked
  };

  const handleTransportClose = () => {
    setIsPlaying(false);
    setShowPlayer(false); // Hide player when transport is closed
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePlayClick}
        disabled={isLoading || !audioPreviewUrl}
        className="bg-transparent border-amber-500/50 hover:bg-amber-500/10 hover:border-amber-500 text-gray-300 hover:text-white transition-colors min-w-0 flex-shrink-0"
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      {/* Music player component that handles the audio playback and transport UI */}
      {audioPreviewUrl && showPlayer && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MusicPlayer
            audioUrl={audioPreviewUrl}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            trackTitle={`${artistName} Preview`}
            artistName={artistName}
            onTransportClose={handleTransportClose}
          />
        </div>
      )}
    </>
  );
};
