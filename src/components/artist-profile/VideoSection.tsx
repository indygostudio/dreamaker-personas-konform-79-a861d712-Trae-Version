
import React, { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { VideoItem } from './VideoItem';
import { MusicVideoCreator } from './MusicVideoCreator';
import { PlaylistCreator } from './PlaylistCreator';
import type { Persona } from "@/types/persona";

interface VideoSectionProps {
  artistId: string;
  persona?: Persona;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ artistId, persona }) => {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videos, setVideos] = useState([
    { 
      id: '1', 
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
      title: 'Never Gonna Give You Up',
      thumbnail_url: 'https://via.placeholder.com/640x360?text=Video',
      created_at: new Date().toISOString()
    },
    { 
      id: '2', 
      url: 'https://vimeo.com/123456789', 
      title: 'Cool Music Video',
      thumbnail_url: 'https://via.placeholder.com/640x360?text=Music+Video',
      created_at: new Date().toISOString()
    },
  ]);

  const handleVideoSelect = (video: any) => {
    setSelectedVideo(video);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Videos</h2>
      
      {selectedVideo && (
        <div className="mb-6">
          <h3 className="text-xl mb-2">{selectedVideo.title}</h3>
          <VideoPlayer url={selectedVideo.url} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map(video => (
          <VideoItem 
            key={video.id} 
            video={video} 
            onSelect={handleVideoSelect}
            isSelected={selectedVideo?.id === video.id}
          />
        ))}
      </div>

      <div className="space-y-6 mt-8">
        {persona && <MusicVideoCreator personaId={persona.id} />}
        {persona && <PlaylistCreator personaId={persona.id} onPlaylistCreated={() => {}} />}
      </div>
    </div>
  );
};
