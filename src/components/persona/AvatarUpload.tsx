
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import type { BannerPosition } from "@/types/types";

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
  name: string;
  onPositionChange?: (position: { x: number; y: number }) => void;
  initialPosition?: { x: number; y: number };
}

export const AvatarUpload = ({ 
  value, 
  onChange, 
  name,
  onPositionChange,
  initialPosition = { x: 50, y: 50 }
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
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
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    setIsDragging(true);
    const rect = imageRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Calculate new position as percentage
    const newX = ((e.clientX - rect.left) / containerWidth) * 100;
    const newY = ((e.clientY - rect.top) / containerHeight) * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));

    const newPosition = { x: clampedX, y: clampedY };
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
          <div className="animate-spin h-8 w-8 border-2 border-dreamaker-purple border-t-transparent rounded-full" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-dreamaker-purple" />
            <span className="text-sm">Upload Image</span>
          </>
        )}
      </Button>
      {value && (
        <div className="space-y-2">
          <div 
            className="mt-2 rounded-full overflow-hidden relative h-24 w-24 mx-auto cursor-move ring-2 ring-dreamaker-purple ring-offset-2 ring-offset-dreamaker-gray"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              ref={imageRef}
              src={value} 
              alt={name} 
              className="w-full h-full object-cover"
              style={{ objectPosition: `${position.x}% ${position.y}%` }}
              draggable={false}
            />
            {isDragging && (
              <div className="absolute inset-0 bg-black/20 transition-colors" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
