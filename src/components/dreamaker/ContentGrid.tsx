
import { GridLayout } from "./grid/GridLayout";
import { GridItemWrapper } from "./grid/GridItemWrapper";
import { ContentRenderer } from "./grid/ContentRenderer";
import { useZoomStore } from "@/stores/useZoomStore";
import type { SubscriptionTier } from "@/types/subscription";
import { useEffect } from "react";
import videoCache from "@/utils/VideoCache";

interface ContentGridProps {
  activeTab: string;
  items: any[];
  zoomLevel: number;
  subscriptionTier?: SubscriptionTier;
  onAudioPlay: (fileUrl: string) => void;
}

export const ContentGrid = ({
  activeTab,
  items,
  zoomLevel,
  subscriptionTier,
  onAudioPlay
}: ContentGridProps) => {
  // Use the zoom from props but fallback to store if available
  const storeZoomLevel = useZoomStore(state => state.zoomLevel);
  const effectiveZoomLevel = zoomLevel || storeZoomLevel;
  
  // Extract video URLs for preloading
  useEffect(() => {
    if (items && items.length > 0) {
      // Collect all video URLs
      const videoUrls = items
        .map(item => {
          // For personas and collaborations
          if (activeTab === 'personas' || activeTab === 'collaborations') {
            return item.video_url || '/Videos/PERSONAS_01.mp4';
          }
          return null;
        })
        .filter(Boolean);
      
      // Preload videos
      if (videoUrls.length > 0) {
        videoCache.preloadVideos(videoUrls);
      }
    }
  }, [items, activeTab]);
  
  return (
    <GridLayout zoomLevel={effectiveZoomLevel}>
      {items.map((item) => (
        <GridItemWrapper 
          key={item.id} 
          itemId={item.id}
          zoomLevel={effectiveZoomLevel}
        >
          <ContentRenderer
            item={item}
            activeTab={activeTab}
            zoomLevel={effectiveZoomLevel}
            subscriptionTier={subscriptionTier}
            onAudioPlay={onAudioPlay}
          />
        </GridItemWrapper>
      ))}
    </GridLayout>
  );
};
