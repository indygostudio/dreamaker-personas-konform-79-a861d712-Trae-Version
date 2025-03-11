
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ReactNode, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, RefreshCw, Video, Film } from "lucide-react";
import { toast } from "sonner";
import type { BannerPositionJson } from "@/types/types";

interface BannerContextMenuProps {
  children: ReactNode;
  personaId: string;
  bannerUrl?: string;
  onBannerChange?: (newUrl: string) => void;
  bannerPosition?: { x: number; y: number };
}

export const BannerContextMenu = ({
  children,
  personaId,
  bannerUrl,
  onBannerChange,
  bannerPosition = { x: 50, y: 50 }
}: BannerContextMenuProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast: useToastNotify } = useToast();

  const handleUpload = async () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    
    // When a file is selected
    input.onchange = async (e) => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setIsUploading(true);
        toast.info("Uploading banner...");
        
        // Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${personaId}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from("profile_assets")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true
          });
        
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("profile_assets")
          .getPublicUrl(filePath);
        
        // Update profile in database
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            banner_url: publicUrl,
            banner_position: {
              x: bannerPosition.x,
              y: bannerPosition.y
            } as BannerPositionJson
          })
          .eq("id", personaId);
        
        if (updateError) throw updateError;
        
        // Call the onBannerChange callback
        if (onBannerChange) {
          onBannerChange(publicUrl);
        }
        
        useToastNotify({
          description: "Banner updated successfully"
        });
        
        toast.success("Banner updated successfully!");
      } catch (error: any) {
        console.error("Error updating banner:", error);
        useToastNotify({
          variant: "destructive",
          description: `Failed to update banner: ${error.message || "Unknown error"}`
        });
        toast.error(`Failed to update banner: ${error.message || "Unknown error"}`);
      } finally {
        setIsUploading(false);
      }
    };
    
    // Trigger the file selection dialog
    input.click();
  };

  const handleSelectPreset = async (videoPath: string) => {
    try {
      toast.info("Applying banner preset...");
      
      // Update profile in database with preset video
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          banner_url: videoPath,
          banner_position: {
            x: bannerPosition.x,
            y: bannerPosition.y
          } as BannerPositionJson
        })
        .eq("id", personaId);
      
      if (updateError) throw updateError;
      
      // Call the onBannerChange callback
      if (onBannerChange) {
        onBannerChange(videoPath);
      }
      
      useToastNotify({
        description: "Banner updated successfully"
      });
      
      toast.success("Banner updated successfully!");
    } catch (error: any) {
      console.error("Error updating banner:", error);
      useToastNotify({
        variant: "destructive",
        description: `Failed to update banner: ${error.message || "Unknown error"}`
      });
      toast.error(`Failed to update banner: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={isUploading} className="w-full h-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-[#1A1F2C] border-dreamaker-purple/30">
        <ContextMenuItem 
          onClick={handleUpload}
          className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Custom Banner
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => handleSelectPreset("/Videos/DreamakerBanner_01.mp4")}
          className="flex items-center cursor-pointer text-gray-300 hover:text-white"
        >
          <Video className="mr-2 h-4 w-4" />
          Dreamaker Banner
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => handleSelectPreset("/Videos/KONFORM_BG_02.mp4")}
          className="flex items-center cursor-pointer text-gray-300 hover:text-white"
        >
          <Film className="mr-2 h-4 w-4" />
          Konform Background
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => handleSelectPreset("/Videos/Gen-3 Alpha 1222913568, Dreamlike clouds in , imagepng, M 5.mp4")}
          className="flex items-center cursor-pointer text-gray-300 hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Dreamlike Clouds
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
