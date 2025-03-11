
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play } from "lucide-react";

interface VideoItemProps {
  video: {
    id: string;
    title: string;
    url: string;
    thumbnail_url?: string;
    created_at: string;
  };
  onSelect: (video: any) => void;
  isSelected: boolean;
}

export const VideoItem: React.FC<VideoItemProps> = ({ video, onSelect, isSelected }) => {
  return (
    <div
      className={`cursor-pointer rounded-lg overflow-hidden relative group ${isSelected ? 'ring-2 ring-dreamaker-purple' : ''}`}
      onClick={() => onSelect(video)}
    >
      <AspectRatio ratio={16/9}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img
          src={video.thumbnail_url || 'https://via.placeholder.com/640x360?text=Video'}
          alt={video.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-dreamaker-purple/80 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
          <h4 className="font-medium text-white truncate">{video.title}</h4>
          <p className="text-xs text-gray-300">
            {new Date(video.created_at).toLocaleDateString()}
          </p>
        </div>
      </AspectRatio>
    </div>
  );
};
