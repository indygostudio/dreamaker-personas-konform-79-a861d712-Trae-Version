import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Upload, Pause } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface BackgroundMusicProps {
  personaId: string;
  backgroundMusicUrl?: string;
  onUpdate: (url: string) => void;
}

export const BackgroundMusic = ({ personaId, backgroundMusicUrl, onUpdate }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${personaId}/background_${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      await supabase
        .from("personas")
        .update({ background_music_url: publicUrl })
        .eq("id", personaId);

      onUpdate(publicUrl);
      toast({
        title: "Success",
        description: "Background music uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading background music:", error);
      toast({
        title: "Error",
        description: "Failed to upload background music",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get the unified audio player hook
  const { handlePlayTrack, currentTrack, isPlaying: isAudioPlaying } = useAudioPlayer();
  
  // Update local playing state when global state changes
  useEffect(() => {
    // Check if the current track is this background music
    if (currentTrack && currentTrack.id === `background-music-${personaId}`) {
      setIsPlaying(isAudioPlaying);
    } else if (isPlaying) {
      // If another track is playing, update our local state
      setIsPlaying(false);
    }
  }, [currentTrack, isAudioPlaying, personaId, isPlaying]);

  const togglePlay = () => {
    if (!backgroundMusicUrl) return;
    
    // Create a track object for the unified audio player
    const backgroundTrack = {
      id: `background-music-${personaId}`,
      title: "Background Music",
      audio_url: backgroundMusicUrl,
      is_public: true,
      album_artwork_url: "/placeholder.svg"
    };
    
    // Use the unified audio player to handle playback
    handlePlayTrack(backgroundTrack);
  };

  return (
    <div className="flex items-center gap-4">
      {backgroundMusicUrl ? (
        <Button
          onClick={togglePlay}
          variant="outline"
          className="w-32"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2 animate-pulse" />
              Playing...
            </>
          ) : (
            <>
              <Music className="h-4 w-4 mr-2" />
              Play
            </>
          )}
        </Button>
      ) : (
        <div className="relative">
          <Button variant="outline" className="w-32" disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Input
            type="file"
            accept="audio/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};