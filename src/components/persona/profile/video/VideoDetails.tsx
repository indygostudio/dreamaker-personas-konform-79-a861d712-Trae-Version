import React from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/ui/video-player';
import { VideoItem } from './types';

interface VideoDetailsProps {
  selectedVideo: VideoItem | null;
  isOwner: boolean;
  onShareVideo: (videoId: string) => void;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({ 
  selectedVideo, 
  isOwner, 
  onShareVideo 
}) => {
  if (!selectedVideo) {
    return (
      <div className="bg-black/40 rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-400">Select a video to play</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <VideoPlayer src={selectedVideo.video_url} />
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{selectedVideo.title}</h3>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShareVideo(selectedVideo.id)}
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </div>
      
      <div className="text-sm text-gray-400">
        Added on {new Date(selectedVideo.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};
