
import React from 'react';
import { Card } from '@/components/ui/card';
import { VideoItem } from './types';
import { useZoomStore } from "@/stores/useZoomStore";

interface VideoGridProps {
  videos: VideoItem[] | undefined;
  isLoading: boolean;
  selectedVideo: VideoItem | null;
  setSelectedVideo: (video: VideoItem) => void;
  isOwner?: boolean;
  activeTab: 'regular' | 'ai';
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  isLoading,
  selectedVideo,
  setSelectedVideo,
  isOwner,
  activeTab
}) => {
  const zoomLevel = useZoomStore(state => state.zoomLevel);

  // Get appropriate grid columns based on zoom level
  const getGridCols = () => {
    if (zoomLevel <= 30) return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6';
    if (zoomLevel <= 60) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
  };

  // Get card text size based on zoom level
  const getTextSize = () => {
    if (zoomLevel <= 40) return 'text-xs';
    if (zoomLevel <= 70) return 'text-sm';
    return 'text-base';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading videos...</div>;
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="mb-4">No videos available.</p>
        {isOwner && activeTab === 'regular' && (
          <div className="flex justify-center">
            <div className="rounded-md border border-dashed border-gray-400 p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">Upload videos to see them here</p>
            </div>
          </div>
        )}
        {isOwner && activeTab === 'ai' && (
          <p>Generate videos in the AI Studio to see them here.</p>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {videos.map((video) => (
        <Card
          key={video.id}
          className={`overflow-hidden cursor-pointer transition-all hover:ring-1 hover:ring-dreamaker-purple glass-panel ${
            selectedVideo?.id === video.id ? 'ring-2 ring-dreamaker-purple' : ''
          }`}
          onClick={() => setSelectedVideo(video)}
        >
          <div className="aspect-video bg-black/40 relative">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Preview
              </div>
            )}
          </div>
          <div className="p-2">
            <h4 className={`${getTextSize()} font-medium truncate`}>{video.title}</h4>
            <p className={`${zoomLevel <= 40 ? 'text-[10px]' : 'text-xs'} text-gray-400 mt-1`}>
              {new Date(video.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
