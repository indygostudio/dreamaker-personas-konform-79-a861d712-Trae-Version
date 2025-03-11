
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, MoveVertical, MoveHorizontal } from "lucide-react";
import type { BannerPosition } from "@/types/types";

interface BannerUploadProps {
  bannerUrl: string;
  bannerPosition: BannerPosition;
  onBannerUrlChange: (url: string) => void;
  onBannerPositionChange: (position: BannerPosition) => void;
  darknessFactor?: number;
  onDarknessChange?: (value: number) => void;
}

export const BannerUpload = ({
  bannerUrl,
  bannerPosition,
  onBannerUrlChange,
  onBannerPositionChange,
  darknessFactor = 50,
  onDarknessChange,
}: BannerUploadProps) => {
  const { toast } = useToast();

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      onBannerUrlChange(publicUrl);
      onBannerPositionChange({ x: 50, y: 50 });
      toast({
        title: "Success",
        description: "Banner uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Error",
        description: "Failed to upload banner",
        variant: "destructive",
      });
    }
  };

  const adjustPosition = (axis: 'x' | 'y', delta: number) => {
    onBannerPositionChange({
      ...bannerPosition,
      [axis]: Math.max(0, Math.min(100, bannerPosition[axis] + delta))
    });
  };

  const isVideo = bannerUrl?.toLowerCase().endsWith('.mp4');
  const isGif = bannerUrl?.toLowerCase().endsWith('.gif');

  return (
    <div className="space-y-4">
      <Label htmlFor="banner">Banner Image/Video</Label>
      <div className="relative">
        <input
          type="file"
          accept="image/*,video/*,.gif"
          onChange={handleBannerUpload}
          className="hidden"
          id="banner-upload"
        />
        <Label
          htmlFor="banner-upload"
          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-dreamaker-purple/50 relative overflow-hidden"
        >
          {bannerUrl ? (
            <>
              {isVideo ? (
                <video 
                  src={bannerUrl} 
                  className="w-full h-full object-cover rounded-lg"
                  style={{ 
                    objectPosition: `${bannerPosition.x}% ${bannerPosition.y}%` 
                  }}
                />
              ) : (
                <img 
                  src={bannerUrl} 
                  alt="Banner" 
                  className={`w-full h-full object-cover rounded-lg ${isGif ? 'pointer-events-none' : ''}`}
                  style={{ 
                    objectPosition: `${bannerPosition.x}% ${bannerPosition.y}%` 
                  }}
                />
              )}
              <div className="absolute bottom-2 right-2 flex gap-2 bg-black/60 p-2 rounded-lg">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => adjustPosition('y', -5)}
                  className="h-8 w-8"
                >
                  <MoveVertical className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => adjustPosition('y', 5)}
                  className="h-8 w-8"
                >
                  <MoveVertical className="h-4 w-4 rotate-180" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => adjustPosition('x', -5)}
                  className="h-8 w-8"
                >
                  <MoveHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"
                style={{ 
                  opacity: darknessFactor / 100 
                }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm text-gray-400">Upload Banner</span>
            </div>
          )}
        </Label>
      </div>

      {bannerUrl && (
        <div className="space-y-2">
          <Label htmlFor="darkness">Gradient Darkness</Label>
          <Slider
            id="darkness"
            min={0}
            max={100}
            step={1}
            value={[darknessFactor]}
            onValueChange={(value) => onDarknessChange?.(value[0])}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
