import { useState } from "react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { AudioVisualizerContainer } from "@/components/audio/visualizers/AudioVisualizerContainer";

interface EnhancedAudioPreviewProps {
  audioUrl: string;
  trackTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}

export const EnhancedAudioPreview = ({
  audioUrl,
  trackTitle = "Preview Track",
  artistName = "Artist",
  albumArtUrl = "/placeholder.svg"
}: EnhancedAudioPreviewProps) => {
  const [initialized, setInitialized] = useState(false);
  
  // Use the unified audio system
  const {
    currentTrack,
    isPlaying,
    handlePlayTrack,
    setIsPlaying
  } = useAudioPlayer();
  
  // Create a track object from the audio URL
  const track = {
    id: audioUrl, // Use URL as unique ID
    title: trackTitle,
    artist: artistName,
    audio_url: audioUrl,
    album_artwork_url: albumArtUrl,
    duration: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_public: true,
    order_index: 0,
    playlist_id: ""
  };
  
  // Check if this track is currently playing
  const isCurrentTrack = currentTrack?.audio_url === audioUrl;
  const isCurrentlyPlaying = isPlaying && isCurrentTrack;
  
  // Handle play/pause
  const handleAudioToggle = () => {
    if (!initialized) {
      handlePlayTrack(track);
      setInitialized(true);
    } else if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      handlePlayTrack(track);
    }
  };
  
  return (
    <div className="audio-preview rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-dreamaker-purple/20"
            onClick={handleAudioToggle}
          >
            {isCurrentlyPlaying ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4" />
            }
          </Button>
          
          <div className="text-sm">
            <p className="font-medium text-white">{trackTitle}</p>
            <p className="text-xs text-gray-400">{artistName}</p>
          </div>
        </div>
      </div>
      
      {isCurrentlyPlaying && (
        <div className="p-2">
          <AudioVisualizerContainer height={60} showControls={false} />
        </div>
      )}
    </div>
  );
};