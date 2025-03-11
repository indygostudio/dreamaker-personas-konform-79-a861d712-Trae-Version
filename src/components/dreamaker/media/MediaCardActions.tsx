
import { Button } from "@/components/ui/button";
import type { SubscriptionTier } from "@/types/subscription";
import { useZoomStore } from "@/stores/useZoomStore";
import { PlayCircle, Download, Lock } from "lucide-react";

interface MediaCardActionsProps {
  locked: boolean;
  onPlay?: () => void;
  onDownload?: () => void;
  requiredTier: SubscriptionTier;
  color: string;
  zoomLevel?: number;
}

export const MediaCardActions = ({ 
  locked, 
  onPlay, 
  onDownload, 
  requiredTier, 
  color,
  zoomLevel
}: MediaCardActionsProps) => {
  // Get zoom level from store if not provided
  const storeZoomLevel = useZoomStore(state => state.zoomLevel);
  const effectiveZoomLevel = zoomLevel || storeZoomLevel || 60;
  
  // Adjust for smaller screens
  const isCompactMode = effectiveZoomLevel <= 50;
  
  // Icon-only buttons for compact mode
  const renderCompactButtons = () => (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
      {!locked ? (
        <>
          <Button 
            variant="glass" 
            size="icon"
            className="w-7 h-7 glass-button bg-black/30"
            onClick={(e) => {
              e.stopPropagation();
              if (onPlay) onPlay();
            }}
          >
            <PlayCircle className="h-3 w-3" />
          </Button>
          <Button 
            variant="glass" 
            size="icon"
            className={`w-7 h-7 glass-button bg-black/30`}
            onClick={(e) => {
              e.stopPropagation();
              if (onDownload) onDownload();
            }}
          >
            <Download className="h-3 w-3" />
          </Button>
        </>
      ) : (
        <Button 
          variant="glass" 
          size="sm"
          className="w-full h-7 glass-button bg-blue-600/30 text-[10px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Lock className="h-3 w-3 mr-1" />
          {requiredTier}
        </Button>
      )}
    </div>
  );
  
  // Regular buttons for normal mode
  const renderRegularButtons = () => (
    <div className="mt-auto opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
      {!locked ? (
        <div className="flex gap-2">
          <Button 
            variant="glass" 
            size="sm"
            className="flex-1 glass-button bg-black/40"
            onClick={(e) => {
              e.stopPropagation();
              if (onPlay) onPlay();
            }}
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            Play
          </Button>
          <Button 
            variant="glass" 
            size="sm"
            className={`flex-1 glass-button bg-black/40`}
            onClick={(e) => {
              e.stopPropagation();
              if (onDownload) onDownload();
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      ) : (
        <Button 
          variant="glass" 
          size="sm"
          className="w-full glass-button bg-blue-600/30"
          onClick={(e) => e.stopPropagation()}
        >
          <Lock className="h-4 w-4 mr-1" />
          Upgrade to {requiredTier}
        </Button>
      )}
    </div>
  );

  return isCompactMode ? renderCompactButtons() : renderRegularButtons();
};
