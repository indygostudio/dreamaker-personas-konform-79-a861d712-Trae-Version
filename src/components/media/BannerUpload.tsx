
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface BannerUploadProps {
  onBannerUpload: (url: string) => void;
}

export const BannerUpload = ({ onBannerUpload }: BannerUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const isVideo = file.type.startsWith('video');
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("media_banners")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media_banners")
        .getPublicUrl(filePath);

      onBannerUpload(publicUrl);
      toast.success("Banner uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload banner: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        disabled={isUploading}
      />
      <Button
        variant="outline"
        className="relative z-0 bg-black/50 hover:bg-black/70"
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Banner"}
      </Button>
    </div>
  );
};
