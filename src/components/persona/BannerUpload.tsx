
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2Icon, ArrowUp, ArrowDown, MoveHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BannerUploadProps {
  value?: string;
  onChange: (url: string) => void;
  name: string;
  onPositionChange?: (position: { x: number; y: number }) => void;
  initialPosition?: { x: number; y: number };
}

export const BannerUpload = ({ 
  value, 
  onChange, 
  name,
  onPositionChange,
  initialPosition = { x: 50, y: 50 }
}: BannerUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
      // Reset position when new image is uploaded
      const defaultPosition = { x: 50, y: 50 };
      setPosition(defaultPosition);
      onPositionChange?.(defaultPosition);

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
    } finally {
      setIsUploading(false);
    }
  };

  const adjustPosition = (axis: 'x' | 'y', delta: number) => {
    const newPosition = {
      ...position,
      [axis]: Math.max(0, Math.min(100, position[axis] + delta))
    };
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleImageUpload}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-[1]"
        disabled={isUploading}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-24 flex flex-col items-center justify-center gap-2"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2Icon className="h-8 w-8 animate-spin text-dreamaker-purple" />
        ) : (
          <>
            <ImageIcon className="h-8 w-8 text-dreamaker-purple" />
            <span className="text-sm">Upload Banner</span>
          </>
        )}
      </Button>
      {value && (
        <div className="space-y-2">
          <div className="mt-2 rounded-lg overflow-hidden relative">
            {value.includes('.mp4') ? (
              <video 
                src={value} 
                className="w-full h-24 object-cover" 
                style={{ objectPosition: `${position.x}% ${position.y}%` }}
              />
            ) : (
              <img 
                src={value} 
                alt={name} 
                className="w-full h-24 object-cover"
                style={{ objectPosition: `${position.x}% ${position.y}%` }}
              />
            )}
          </div>
          <div className="flex justify-center gap-2 relative z-[2]">
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustPosition('y', -5);
                }}
                className="h-8 w-8 bg-black/60 hover:bg-black/80"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustPosition('y', 5);
                }}
                className="h-8 w-8 bg-black/60 hover:bg-black/80"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                adjustPosition('x', -5);
              }}
              className="h-8 w-8 bg-black/60 hover:bg-black/80"
            >
              <MoveHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
