import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface MoodBoardProps {
  personaId: string;
  moodImages?: string[] | null;
  onUpdate: (urls: string[]) => void;
}

export const MoodBoard = ({ personaId, moodImages = [], onUpdate }: MoodBoardProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${personaId}/mood_${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      const newMoodImages = [...(moodImages || []), publicUrl];

      await supabase
        .from("personas")
        .update({ mood_images: newMoodImages })
        .eq("id", personaId);

      onUpdate(newMoodImages);
      toast({
        title: "Success",
        description: "Mood image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading mood image:", error);
      toast({
        title: "Error",
        description: "Failed to upload mood image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    try {
      const currentImages = [...(moodImages || [])];
      const newMoodImages = currentImages.filter((_, i) => i !== index);
      
      await supabase
        .from("personas")
        .update({ mood_images: newMoodImages })
        .eq("id", personaId);

      onUpdate(newMoodImages);
      toast({
        title: "Success",
        description: "Mood image removed successfully",
      });
    } catch (error) {
      console.error("Error removing mood image:", error);
      toast({
        title: "Error",
        description: "Failed to remove mood image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(moodImages || []).map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Mood ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="relative">
          <Button
            variant="outline"
            className="w-full h-32 border-dashed"
            disabled={isUploading}
          >
            <ImagePlus className="h-6 w-6" />
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};