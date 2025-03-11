
import { Badge } from "@/components/ui/badge";
import { useZoomStore } from "@/stores/useZoomStore";

interface MediaCardHeaderProps {
  title: string;
  type: string;
  zoomLevel?: number;
}

export const MediaCardHeader = ({ title, type, zoomLevel }: MediaCardHeaderProps) => {
  // Get zoom level from store if not provided
  const storeZoomLevel = useZoomStore(state => state.zoomLevel);
  const effectiveZoomLevel = zoomLevel || storeZoomLevel || 60;
  
  // Refined text size adjustments based on zoom level
  const getTitleSize = () => {
    if (effectiveZoomLevel <= 30) return 'text-xs font-medium line-clamp-1';
    if (effectiveZoomLevel <= 50) return 'text-sm font-medium line-clamp-1';
    if (effectiveZoomLevel <= 80) return 'text-base font-medium line-clamp-2';
    return 'text-lg font-semibold';
  };
  
  const getBadgeSize = () => {
    if (effectiveZoomLevel <= 40) return 'text-[8px] px-1 py-0';
    if (effectiveZoomLevel <= 70) return 'text-[10px] px-1.5 py-0';
    return 'text-xs px-2 py-0.5';
  };

  // Get badge color based on type
  const getBadgeColor = () => {
    switch (type) {
      case "loop":
        return "bg-blue-500/20 text-blue-300";
      case "midi":
        return "bg-sky-500/20 text-sky-300";
      case "plugin":
        return "bg-cyan-500/20 text-cyan-300";
      case "patch":
        return "bg-teal-500/20 text-teal-300";
      case "album":
        return "bg-indigo-500/20 text-indigo-300";
      case "audio":
        return "bg-blue-500/20 text-blue-300";
      case "video":
        return "bg-purple-500/20 text-purple-300";
      case "image":
        return "bg-green-500/20 text-green-300";
      case "preset":
        return "bg-amber-500/20 text-amber-300";
      case "music":
        return "bg-pink-500/20 text-pink-300";
      case "model":
        return "bg-violet-500/20 text-violet-300";
      case "prompts":
        return "bg-orange-500/20 text-orange-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="mb-1">
      <div className="flex items-start justify-between">
        <h3 className={`${getTitleSize()} text-white mb-1 flex-1`}>{title}</h3>
        <Badge 
          variant="outline" 
          className={`${getBadgeSize()} ${getBadgeColor()} uppercase tracking-wide ml-1 mt-0.5 flex-shrink-0`}
        >
          {type}
        </Badge>
      </div>
    </div>
  );
};
