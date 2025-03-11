
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Download, Copy, Share2, Image, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvatarContextMenuProps {
  children: React.ReactNode;
  onDownload: () => Promise<void>;
  onCopy: () => Promise<void>;
  onShare: () => Promise<void>;
  onAvatarSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onVideoSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  personaId?: string;
}

export const AvatarContextMenu = ({
  children,
  onDownload,
  onCopy,
  onShare,
  onAvatarSelect,
  onVideoSelect,
  isUploading,
  personaId,
}: AvatarContextMenuProps) => {
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!personaId) {
      toast.error("No persona ID provided");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
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

      await onAvatarSelect(e);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!personaId) {
      toast.error("No persona ID provided");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${personaId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_videos")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("personas")
        .update({ video_url: publicUrl })
        .eq("id", personaId);

      if (updateError) throw updateError;

      await onVideoSelect(e);
      toast.success("Video background uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video background");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-black/80 backdrop-blur-md border border-dreamaker-purple/20">
        <ContextMenuItem onClick={onDownload} className="hover:bg-dreamaker-purple/20 text-white">
          <Download className="mr-2 h-4 w-4" />
          Download
        </ContextMenuItem>
        <ContextMenuItem onClick={onCopy} className="hover:bg-dreamaker-purple/20 text-white">
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={onShare} className="hover:bg-dreamaker-purple/20 text-white">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </ContextMenuItem>
        <ContextMenuItem className="hover:bg-dreamaker-purple/20 text-white relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Image className="mr-2 h-4 w-4" />
          Upload Avatar
        </ContextMenuItem>
        <ContextMenuItem className="hover:bg-dreamaker-purple/20 text-white relative">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Video className="mr-2 h-4 w-4" />
          Upload Video Background
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
