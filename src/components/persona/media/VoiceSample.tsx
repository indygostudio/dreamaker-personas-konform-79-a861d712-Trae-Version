import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface VoiceSampleProps {
  personaId: string;
  voiceSampleUrl?: string;
  onUpdate: (url: string) => void;
}

export const VoiceSample = ({ personaId, voiceSampleUrl, onUpdate }: VoiceSampleProps) => {
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
      const filePath = `${personaId}/voice_sample_${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      await supabase
        .from("personas")
        .update({ voice_sample_url: publicUrl })
        .eq("id", personaId);

      onUpdate(publicUrl);
      toast({
        title: "Success",
        description: "Voice sample uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading voice sample:", error);
      toast({
        title: "Error",
        description: "Failed to upload voice sample",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlay = () => {
    if (!voiceSampleUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(voiceSampleUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .catch(error => {
          console.error("Error playing audio:", error);
          toast({
            title: "Error",
            description: "Failed to play audio",
            variant: "destructive"
          });
          setIsPlaying(false);
        });
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {voiceSampleUrl ? (
        <Button
          onClick={togglePlay}
          variant="outline"
          className="w-32"
        >
          <Play className={`h-4 w-4 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
          {isPlaying ? "Playing..." : "Play"}
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