import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAvatarUpload = (
  persona: { id: string },
  initialAvatarUrl: string,
  onAvatarUpdate?: (url: string) => void
) => {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isUploading = type === 'avatar' ? setIsUploading : setIsBannerUploading;

    try {
      isUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${persona.id}/${type}_${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      const updateField = type === 'avatar' ? { avatar_url: publicUrl } : { video_url: publicUrl };

      const { error: updateError } = await supabase
        .from("personas")
        .update(updateField)
        .eq("id", persona.id);

      if (updateError) throw updateError;

      if (type === 'avatar') {
        setAvatarUrl(publicUrl);
        if (onAvatarUpdate) {
          onAvatarUpdate(publicUrl);
        }
      }

      toast({
        title: "Success",
        description: `${type === 'avatar' ? 'Avatar' : 'Banner'} updated successfully`,
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${type}`,
        variant: "destructive",
      });
    } finally {
      isUploading(false);
    }
  };

  return {
    avatarUrl,
    isUploading,
    isBannerUploading,
    handleFileUpload
  };
};