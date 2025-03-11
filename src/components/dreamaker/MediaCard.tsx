
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Lock } from "lucide-react";
import type { SubscriptionTier } from "@/types/subscription";
import { VideoBackground } from "./VideoBackground";
import { useNavigate } from "react-router-dom";
import { MediaCardActions } from "./media/MediaCardActions";
import { MediaCardHeader } from "./media/MediaCardHeader";
import { MediaCardTechnicalInfo } from "./media/MediaCardTechnicalInfo";
import { ArtistCardActions } from "./ArtistCardActions";
import { useZoomStore } from "@/stores/useZoomStore";
import { toast } from "@/hooks/use-toast";

interface MediaCardProps {
  title: string;
  type: "loop" | "midi" | "plugin" | "patch" | "album" | "audio" | "video" | "image" | "preset" | "music" | "model" | "prompts";
  imageUrl: string;
  bpm?: number;
  musicalKey?: string;
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  onPlay?: () => void;
  onDownload?: () => void;
  id?: string;
  zoomLevel?: number;
}

export const MediaCard = ({
  title,
  type,
  imageUrl,
  bpm,
  musicalKey,
  requiredTier,
  currentTier,
  onPlay,
  onDownload,
  id,
  zoomLevel
}: MediaCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const storeZoomLevel = useZoomStore(state => state.zoomLevel);
  const effectiveZoomLevel = zoomLevel || storeZoomLevel || 60;
  
  const isLocked = (current: SubscriptionTier, required: SubscriptionTier) => {
    const tiers: Record<SubscriptionTier, number> = {
      'free': 0,
      'pro': 1,
      'enterprise': 2
    };
    return tiers[current] < tiers[required];
  };

  const locked = isLocked(currentTier, requiredTier);
  
  const getTypeColors = () => {
    switch (type) {
      case "loop":
        return {
          color: 'border-blue-500/20 group-hover:border-blue-500/60',
          bgColor: 'from-blue-900/40 to-black/40'
        };
      case "midi":
        return {
          color: 'border-sky-500/20 group-hover:border-sky-500/60',
          bgColor: 'from-sky-900/40 to-black/40'
        };
      case "plugin":
        return {
          color: 'border-cyan-500/20 group-hover:border-cyan-500/60',
          bgColor: 'from-cyan-900/40 to-black/40'
        };
      case "patch":
        return {
          color: 'border-teal-500/20 group-hover:border-teal-500/60',
          bgColor: 'from-teal-900/40 to-black/40'
        };
      case "album":
        return {
          color: 'border-indigo-500/20 group-hover:border-indigo-500/60',
          bgColor: 'from-indigo-900/40 to-black/40'
        };
      case "audio":
        return {
          color: 'border-blue-500/20 group-hover:border-blue-500/60',
          bgColor: 'from-blue-900/40 to-black/40'
        };
      case "video":
        return {
          color: 'border-purple-500/20 group-hover:border-purple-500/60',
          bgColor: 'from-purple-900/40 to-black/40'
        };
      case "image":
        return {
          color: 'border-green-500/20 group-hover:border-green-500/60',
          bgColor: 'from-green-900/40 to-black/40'
        };
      case "preset":
        return {
          color: 'border-amber-500/20 group-hover:border-amber-500/60',
          bgColor: 'from-amber-900/40 to-black/40'
        };
      case "music":
        return {
          color: 'border-pink-500/20 group-hover:border-pink-500/60',
          bgColor: 'from-pink-900/40 to-black/40'
        };
      case "model":
        return {
          color: 'border-violet-500/20 group-hover:border-violet-500/60',
          bgColor: 'from-violet-900/40 to-black/40'
        };
      case "prompts":
        return {
          color: 'border-orange-500/20 group-hover:border-orange-500/60',
          bgColor: 'from-orange-900/40 to-black/40'
        };
      default:
        return {
          color: 'border-blue-600/20 group-hover:border-blue-600/60',
          bgColor: 'from-blue-900/40 to-black/40'
        };
    }
  };

  const { color, bgColor } = getTypeColors();

  const handleNavigateToProfile = () => {
    if (id) {
      navigate(`/media/${id}`);
    } else {
      toast({
        title: "Media Profile",
        description: "This media doesn't have a profile yet."
      });
    }
  };

  return (
    <Card 
      onClick={handleNavigateToProfile}
      onDoubleClick={handleNavigateToProfile}
      className={`group overflow-hidden relative bg-black/80 backdrop-blur-md border ${color} transition-all duration-300 cursor-pointer w-full h-[280px] flex flex-col shadow-lg hover:shadow-lg transform hover:-translate-y-1`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <VideoBackground
          videoUrl="/Videos/Gen-3 Alpha 869480173, Vector simple illust, Cropped - imagewebp, M 5.mp4"
          isHovering={isHovering}
          fallbackImage={imageUrl || "/placeholder.svg"}
          continuePlayback={false}
          reverseOnEnd={true}
        />
        <div 
          className={`absolute inset-0 bg-gradient-to-b ${bgColor} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} 
        />
        {locked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <Lock className="w-12 h-12" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-1 relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-gray-300 mb-2 line-clamp-2 group-hover:text-white/90 transition-colors">
              {type.toUpperCase()} • {bpm ? `${bpm} BPM` : ''} {musicalKey ? `• ${musicalKey}` : ''}
            </p>
          </div>
        </div>
        
        <div className="mt-auto">
          <MediaCardActions 
            locked={locked} 
            onPlay={onPlay} 
            onDownload={onDownload} 
            requiredTier={requiredTier} 
            color={color} 
            zoomLevel={effectiveZoomLevel}
          />
        </div>
      </CardContent>

      <CardFooter className="bg-black/80 border-t border-dreamaker-purple/20 p-4 relative z-10">
        <ArtistCardActions 
          artistId={id || ""} 
          artistName={title} 
          artistBio={`${type} • ${bpm ? `${bpm} BPM` : ''} ${musicalKey ? `• ${musicalKey}` : ''}`}
        />
      </CardFooter>
    </Card>
  );
};
