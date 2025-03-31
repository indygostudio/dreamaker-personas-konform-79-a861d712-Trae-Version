import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Image } from "lucide-react";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export const ImageUploadDialog = ({ 
  isOpen, 
  onOpenChange, 
  onImageUploaded,
  currentImageUrl 
}: ImageUploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('track-artworks')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('track-artworks')
        .getPublicUrl(fileName);

      onImageUploaded(publicUrl);
      toast.success("Image uploaded successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border-dreamaker-purple/30 max-w-md mx-auto draggable-dialog">
        <DialogHeader>
          <DialogTitle className="text-white">Update Track Artwork</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div 
            className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden"
            onClick={handleBrowseClick}
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Track artwork preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <Image className="w-12 h-12 mb-2" />
                <span>Click to browse image</span>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-dreamaker-purple/30">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleBrowseClick}
              disabled={isUploading}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/80"
            >
              {isUploading ? "Uploading..." : "Browse Image"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};