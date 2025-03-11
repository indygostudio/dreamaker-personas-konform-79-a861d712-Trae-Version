
import { Badge } from "@/components/ui/badge";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import type { MediaCollection } from "@/types/media";
import { MediaActionButtons } from "./MediaActionButtons";

interface MediaProfileHeaderProps {
  mediaCollection: MediaCollection;
  isHovering: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}

export const MediaProfileHeader = ({ mediaCollection, isHovering, isPlaying, onPlay }: MediaProfileHeaderProps) => {
  const { 
    media_type, 
    preview_image_url,
  } = mediaCollection;

  const getTypeColors = () => {
    switch (media_type) {
      case "loop":
        return 'from-blue-900/40 to-black/40 border-blue-500/20';
      case "midi":
        return 'from-sky-900/40 to-black/40 border-sky-500/20';
      case "plugin":
        return 'from-cyan-900/40 to-black/40 border-cyan-500/20';
      case "patch":
        return 'from-teal-900/40 to-black/40 border-teal-500/20';
      case "album":
        return 'from-indigo-900/40 to-black/40 border-indigo-500/20';
      case "audio":
        return 'from-blue-900/40 to-black/40 border-blue-500/20';
      case "video":
        return 'from-purple-900/40 to-black/40 border-purple-500/20';
      case "image":
        return 'from-green-900/40 to-black/40 border-green-500/20';
      case "preset":
        return 'from-amber-900/40 to-black/40 border-amber-500/20';
      case "music":
        return 'from-pink-900/40 to-black/40 border-pink-500/20';
      case "model":
        return 'from-violet-900/40 to-black/40 border-violet-500/20';
      case "prompts":
        return 'from-orange-900/40 to-black/40 border-orange-500/20';
      default:
        return 'from-blue-900/40 to-black/40 border-blue-500/20';
    }
  };

  return (
    <div className="relative aspect-video overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <VideoBackground
          videoUrl="/Videos/Gen-3 Alpha 869480173, Vector simple illust, Cropped - imagewebp, M 5.mp4" 
          isHovering={isHovering}
          fallbackImage={preview_image_url || "/placeholder.svg"}
          continuePlayback={true}
          reverseOnEnd={true}
          autoPlay={true}
          priority={true} // Prioritize loading for media headers
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${getTypeColors()} opacity-70`} />
      </div>
      
      {/* Media Type Badge */}
      <Badge
        className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm"
        variant="secondary"
      >
        {media_type?.toUpperCase() || 'MEDIA'}
      </Badge>
      
      {/* Action Buttons Overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <MediaActionButtons 
          mediaCollection={mediaCollection}
          isPlaying={isPlaying}
          onPlay={onPlay}
        />
      </div>
    </div>
  );
};
