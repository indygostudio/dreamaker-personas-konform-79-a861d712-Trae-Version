
import { useAvatarUpload } from "./avatar/useAvatarUpload";
import { useMediaActions } from "./avatar/useMediaActions";
import { AvatarContextMenu } from "./avatar/AvatarContextMenu";
import { SubscriptionBadge } from "./avatar/SubscriptionBadge";
import { AvatarDisplay } from "./avatar/AvatarDisplay";
import { AvatarActions } from "./avatar/AvatarActions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AvatarSectionProps {
  persona: {
    id: string;
    name: string;
  };
  avatarUrl: string;
  videoUrl?: string;
  isCollapsed?: boolean;
  subscription?: {
    type: string;
    renewalDate?: string;
    dataUsage?: {
      used: number;
      total: number;
    };
  };
  onAvatarUpdate?: (url: string) => void;
  onVideoUpdate?: (url: string) => void;
}

export const AvatarSection = ({ 
  persona, 
  avatarUrl: initialAvatarUrl,
  videoUrl: initialVideoUrl,
  isCollapsed = false,
  subscription,
  onAvatarUpdate,
  onVideoUpdate
}: AvatarSectionProps) => {
  const {
    avatarUrl,
    isUploading,
    isBannerUploading,
    handleFileUpload
  } = useAvatarUpload(persona, initialAvatarUrl, onAvatarUpdate);

  const {
    handleDownload,
    handleCopy,
    handleShare
  } = useMediaActions(avatarUrl);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${persona.id}/${crypto.randomUUID()}.${fileExt}`;

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
        .eq("id", persona.id);

      if (updateError) throw updateError;

      if (onVideoUpdate) {
        onVideoUpdate(publicUrl);
      }

      toast.success("Video background updated successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to update video background");
    }
  };

  const avatarSize = isCollapsed ? "h-[160px] w-[160px]" : "h-[320px] w-[320px]";

  return (
    <div className="relative">
      <AvatarContextMenu
        onDownload={handleDownload}
        onCopy={handleCopy}
        onShare={handleShare}
        onAvatarSelect={(e) => handleFileUpload(e, 'avatar')}
        onVideoSelect={handleVideoUpload}
        isUploading={isUploading || isBannerUploading}
        personaId={persona.id}
      >
        <AvatarDisplay
          avatarUrl={avatarUrl}
          name={persona.name}
          isUploading={isUploading}
          size={avatarSize}
        />
      </AvatarContextMenu>

      <AvatarActions
        isBannerUploading={isBannerUploading}
        onBannerUpload={(e) => handleFileUpload(e, 'banner')}
      />

      {subscription && (
        <SubscriptionBadge
          type={subscription.type}
          renewalDate={subscription.renewalDate}
          dataUsage={subscription.dataUsage}
        />
      )}
    </div>
  );
};
