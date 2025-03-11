
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Persona } from "../types";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";
import { ThreeDAvatar } from "@/components/dreamaker/ThreeDAvatar";

interface PersonaAvatarProps {
  artist: Persona;
  isHovering: boolean;
}

export const PersonaAvatar = ({ artist, isHovering }: PersonaAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(artist.avatar_url);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id ?? null);
    };
    getCurrentUser();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !artist.user_id) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${artist.user_id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("personas")
        .update({ avatar_url: publicUrl })
        .eq("id", artist.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-[80%] h-[80%] absolute inset-0 m-auto rounded-full overflow-hidden border-4 border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
      {artist.video_url && isHovering ? (
        <video
          src={artist.video_url}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="relative w-full h-full">
          <Avatar className="w-full h-full rounded-none">
            {isUploading ? (
              <div className="h-full w-full flex items-center justify-center bg-black/50">
                <Loader2Icon className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <>
                <AvatarImage 
                  src={avatarUrl} 
                  alt={artist.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                <AvatarFallback className="w-full h-full bg-dreamaker-gray">
                  {artist.name[0]}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          {artist.has_3d_model && (
            <ThreeDAvatar 
              modelUrl={artist.model_url} 
              animationPreset={artist.animation_preset}
              fallbackImageUrl={avatarUrl}
            />
          )}
          {artist.user_id === currentUserId && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          )}
        </div>
      )}
    </div>
  );
};
