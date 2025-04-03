
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand, Film } from "lucide-react";
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

  if (!scene.imageUrl) {
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

      onVideoGenerated(videoUrl);
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
      {scene.videoUrl && (
        <div className="mt-2 p-2 bg-[#1a1a1a] rounded border border-[#333]">
          <div className="flex items-center text-sm text-green-400 mb-2">
            <Film className="h-4 w-4 mr-1" />
            Video generated
          </div>
          <video
            src={scene.videoUrl}
            controls
            className="w-full rounded"
            height={150}
          />
        </div>
      )}
    </div>
  );
};

export default ImageToVideoConverter;
