
import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useZoomStore } from "@/stores/useZoomStore";

interface GridLayoutProps {
  children: ReactNode;
  zoomLevel?: number;
}

export const GridLayout = ({ children, zoomLevel }: GridLayoutProps) => {
  const storeZoomLevel = useZoomStore(state => state.zoomLevel);
  const effectiveZoomLevel = zoomLevel || storeZoomLevel || 60;
  
  const getGridClass = () => {
    // Changed to maintain consistent gap while only adjusting columns
    // Zoom levels 1 and 2 show text in buttons
    // Zoom levels 3, 4, and 5 switch to icon-only mode
    switch (effectiveZoomLevel) {
      case 20: // Level 1 - smallest zoom (more columns)
        return 'grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
      case 40: // Level 2
        return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      case 60: // Level 3
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 80: // Level 4
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 100: // Level 5 - largest zoom (fewer columns)
        return 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <ScrollArea className="h-full pr-4">
      <div className={`grid ${getGridClass()} gap-4 pb-8`}>
        {children}
      </div>
    </ScrollArea>
  );
};
