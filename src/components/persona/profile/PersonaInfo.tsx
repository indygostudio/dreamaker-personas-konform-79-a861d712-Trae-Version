
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarContextMenu } from "@/components/artist-profile/avatar/AvatarContextMenu";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

interface PersonaInfoProps {
  name: string;
  description?: string;
  avatar_url?: string;
  isHeaderExpanded: boolean;
}

export const PersonaInfo = ({
  name,
  description,
  avatar_url,
  isHeaderExpanded,
}: PersonaInfoProps) => {
  const { id: personaId } = useParams();
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!personaId) {
      toast.error("No persona ID found");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${personaId}/${crypto.randomUUID()}.${fileExt}`;

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
        .eq("id", personaId);

      if (updateError) throw updateError;

      window.location.reload();
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarDownload = async () => {
    try {
      if (!avatar_url) return;
      const response = await fetch(avatar_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}-avatar.${avatar_url.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Avatar downloaded successfully");
    } catch (error) {
      console.error("Error downloading avatar:", error);
      toast.error("Failed to download avatar");
    }
  };

  const handleAvatarCopy = async () => {
    try {
      if (!avatar_url) return;
      await navigator.clipboard.writeText(avatar_url);
      toast.success("Avatar URL copied to clipboard");
    } catch (error) {
      console.error("Error copying avatar URL:", error);
      toast.error("Failed to copy avatar URL");
    }
  };

  const handleAvatarShare = async () => {
    try {
      if (!avatar_url) return;
      if (navigator.share) {
        await navigator.share({
          title: `${name}'s avatar`,
          text: `Check out ${name}'s avatar`,
          url: avatar_url,
        });
      } else {
        await navigator.clipboard.writeText(avatar_url);
        toast.success("Avatar URL copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing avatar:", error);
      toast.error("Failed to share avatar");
    }
  };

  return (
    <div className={`absolute left-0 right-0 transition-all duration-300 ${
      isHeaderExpanded 
        ? 'bottom-0 p-8 flex justify-between items-end' 
        : 'top-1/2 -translate-y-1/2 p-8 flex justify-center items-center'
    }`}>
      <div className={`${isHeaderExpanded ? '' : 'text-center'}`}>
        <div className="flex items-center gap-4">
          {isHeaderExpanded && (
            <AvatarContextMenu
              onDownload={handleAvatarDownload}
              onCopy={handleAvatarCopy}
              onShare={handleAvatarShare}
              onVideoSelect={async () => {}}
              onAvatarSelect={handleAvatarUpload}
              isUploading={isUploading}
              personaId={personaId}
            >
              <Avatar className="h-24 w-24 border-2 border-white/20 cursor-pointer">
                <AvatarImage 
                  src={avatar_url} 
                  alt={name}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="bg-black/40">
                  {name?.[0]?.toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
            </AvatarContextMenu>
          )}
          <div>
            <h1 className="text-4xl font-bold text-white">{name}</h1>
            {isHeaderExpanded && description && (
              <p className="text-white/60 mt-2">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
