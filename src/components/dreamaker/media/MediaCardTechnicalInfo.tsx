
import { useZoomStore } from "@/stores/useZoomStore";

interface MediaCardTechnicalInfoProps {
  bpm?: number;
  musicalKey?: string;
  zoomLevel?: number;
}

export const MediaCardTechnicalInfo = ({ bpm, musicalKey, zoomLevel }: MediaCardTechnicalInfoProps) => {
  // Get zoom level from store if not provided
  const storeZoomLevel = useZoomStore(state => state.zoomLevel);
  const effectiveZoomLevel = zoomLevel || storeZoomLevel || 60;
  
  // Skip rendering if no technical info available
  if (!bpm && !musicalKey) return null;
  
  // Adjust text size based on zoom level
  const getTextSize = () => {
    if (effectiveZoomLevel <= 30) return 'text-[10px]';
    if (effectiveZoomLevel <= 50) return 'text-xs';
    if (effectiveZoomLevel <= 80) return 'text-sm';
    return 'text-base';
  };
  
  const getSpacing = () => {
    if (effectiveZoomLevel <= 40) return 'my-1 gap-1';
    if (effectiveZoomLevel <= 70) return 'my-2 gap-2';
    return 'my-3 gap-3';
  };

  return (
    <div className={`flex items-center ${getSpacing()} text-gray-400 ${getTextSize()}`}>
      {bpm && (
        <div className="flex items-center">
          <span className="font-medium">{bpm} BPM</span>
        </div>
      )}
      
      {bpm && musicalKey && (
        <div className="h-3 w-[1px] bg-gray-600 mx-1.5"></div>
      )}
      
      {musicalKey && (
        <div className="flex items-center">
          <span className="font-medium">Key: {musicalKey}</span>
        </div>
      )}
    </div>
  );
};
