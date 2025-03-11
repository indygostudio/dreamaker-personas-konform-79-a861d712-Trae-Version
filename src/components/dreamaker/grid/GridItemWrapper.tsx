
import { ReactNode } from "react";
import { useZoomStore } from "@/stores/useZoomStore";

interface GridItemWrapperProps {
  children: ReactNode;
  itemId: string;
  zoomLevel?: number;
}

export const GridItemWrapper = ({ children, itemId, zoomLevel }: GridItemWrapperProps) => {
  const storeZoomLevel = useZoomStore(state => state.zoomLevel);
  const effectiveZoomLevel = zoomLevel || storeZoomLevel || 60;
  
  // Calculate scale based on zoom level - without affecting spacing between cards
  const calculateScale = () => {
    switch (effectiveZoomLevel) {
      case 20:
        return 'transform-gpu min-w-full'; // No scaling to avoid affecting spacing
      case 40:
        return 'transform-gpu min-w-full';
      case 60:
        return 'transform-gpu min-w-full';
      case 80:
        return 'transform-gpu min-w-full';
      case 100:
        return 'transform-gpu min-w-full';
      default:
        return 'transform-gpu min-w-full';
    }
  };

  return (
    <div 
      key={itemId} 
      className={`transition-all duration-300 ${calculateScale()}`}
    >
      {children}
    </div>
  );
};
