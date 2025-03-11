
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoGrid } from './video/VideoGrid';
import { VideoDetails } from './video/VideoDetails';
import { useVideoSection } from './video/useVideoSection';
import { VideoUpload } from './video/VideoUpload';

interface VideoSectionProps {
  personaId: string;
  isOwner: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ personaId, isOwner }) => {
  const {
    activeTab,
    selectedVideo,
    videos,
    aiVideos,
    isLoadingVideos,
    isLoadingAiVideos,
    handleTabChange,
    setSelectedVideo,
    handleShareVideo,
    refreshVideos
  } = useVideoSection(personaId);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as 'regular' | 'ai')}>
        <TabsList className="mb-6">
          <TabsTrigger value="regular">Videos</TabsTrigger>
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <VideoDetails 
              selectedVideo={selectedVideo} 
              isOwner={isOwner} 
              onShareVideo={handleShareVideo} 
            />
          </div>

          <div className="space-y-4">
            {isOwner && activeTab === 'regular' && (
              <VideoUpload 
                personaId={personaId}
                onUploadComplete={refreshVideos}
              />
            )}
            
            <TabsContent value="regular" className="mt-0">
              <VideoGrid 
                videos={videos} 
                isLoading={isLoadingVideos} 
                selectedVideo={selectedVideo} 
                setSelectedVideo={setSelectedVideo} 
                isOwner={isOwner}
                activeTab="regular"
              />
            </TabsContent>
            <TabsContent value="ai" className="mt-0">
              <VideoGrid 
                videos={aiVideos} 
                isLoading={isLoadingAiVideos} 
                selectedVideo={selectedVideo} 
                setSelectedVideo={setSelectedVideo} 
                isOwner={isOwner}
                activeTab="ai"
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};
