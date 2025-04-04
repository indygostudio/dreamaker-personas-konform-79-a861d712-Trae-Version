
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand } from "lucide-react"; // Removed Film icon
import { toast } from "sonner";
import { generateVideoFromImage } from "@/services/videoGenerationService";
import { useAIService } from "@/contexts/AIServiceContext";
import { Scene } from "@/types/storyboardTypes";

interface ImageToVideoConverterProps {
  scene: Scene;
  onVideoGenerated: (videoUrl: string) => void;
}

const ImageToVideoConverter = ({ scene, onVideoGenerated }: ImageToVideoConverterProps) => {
  const { selectedService } = useAIService();
  const [isGenerating, setIsGenerating] = useState(false);

  // Only render the button if there's an image and no video yet
  if (!scene.imageUrl || scene.videoUrl) {
    return null;
  }

  const handleConvertToVideo = async () => {
    try {
      setIsGenerating(true);
      toast.info(`Converting image to video using ${selectedService.name}...`);

      const videoUrl = await generateVideoFromImage(
        scene.imageUrl!,
        scene.prompt || "Generate a video from this image",
        selectedService.id
      );

      onVideoGenerated(videoUrl); // Call parent callback
      toast.success("Video generated successfully!");
    } catch (error) {
      console.error("Failed to convert image to video:", error);
      toast.error("Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-2">
      <Button
        variant="outline"
        size="sm"
        className="border-[#333] bg-[#1a1a1a] hover:bg-[#252525] text-white w-full"
        disabled={isGenerating}
        onClick={handleConvertToVideo}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating Video...
          </>
        ) : (
          <>
            <Wand className="h-4 w-4 mr-2" />
            Convert to Video with {selectedService.name}
          </>
        )}
      </Button>
      {/* REMOVED the video display section from here */}
    </div>
  );
};

export default ImageToVideoConverter;
