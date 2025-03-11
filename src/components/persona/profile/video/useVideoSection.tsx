
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { VideoItem } from './types';

export const useVideoSection = (personaId: string) => {
  const [activeTab, setActiveTab] = useState<'regular' | 'ai'>('regular');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const { user } = useUser();

  // Fetch regular videos
  const { 
    data: videos, 
    isLoading: isLoadingVideos,
    refetch: refetchVideos
  } = useQuery({
    queryKey: ['persona-videos', personaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('persona_id', personaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match VideoItem interface
      return (data || []).map((video): VideoItem => ({
        id: video.id,
        title: video.title || 'Untitled Video',
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url || '',
        created_at: video.created_at
      }));
    },
  });

  // Transform AI-generated video for consistent interface
  const transformAiVideo = (video: any): VideoItem => {
    const result = typeof video.result === 'string' ? JSON.parse(video.result) : video.result;
    return {
      id: video.id,
      title: video.title || 'AI Generated Video',
      video_url: video.generated_content || (result && (result.video_url || result.url)) || '',
      thumbnail_url: result && result.thumbnail_url || '',
      created_at: video.created_at
    };
  };

  // Fetch AI-generated videos
  const { 
    data: aiVideos, 
    isLoading: isLoadingAiVideos,
    refetch: refetchAiVideos
  } = useQuery({
    queryKey: ['ai-generated-videos', personaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('persona_id', personaId)
        .eq('generation_type', 'video')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(transformAiVideo);
    },
  });

  useEffect(() => {
    // Set the first video as selected when data loads
    if (activeTab === 'regular' && videos && videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    } else if (activeTab === 'ai' && aiVideos && aiVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(aiVideos[0]);
    }
  }, [videos, aiVideos, activeTab, selectedVideo]);

  const handleTabChange = (value: 'regular' | 'ai') => {
    setActiveTab(value);
    setSelectedVideo(null); // Reset selected video when changing tabs
  };

  const handleShareVideo = async (videoId: string) => {
    if (!user) {
      toast.error('You must be logged in to share videos');
      return;
    }

    try {
      const { error } = await supabase
        .from('shares')
        .insert({ 
          user_id: user.id,
          persona_id: personaId,
          video_id: videoId
        });

      if (error) throw error;
      toast.success('Video shared successfully');
    } catch (error) {
      console.error('Error sharing video:', error);
      toast.error('Failed to share video');
    }
  };

  const refreshVideos = useCallback(() => {
    if (activeTab === 'regular') {
      refetchVideos();
    } else {
      refetchAiVideos();
    }
  }, [activeTab, refetchVideos, refetchAiVideos]);

  return {
    activeTab,
    selectedVideo,
    videos,
    aiVideos,
    isLoadingVideos,
    isLoadingAiVideos,
    isOwner: user?.id === personaId,
    handleTabChange,
    setSelectedVideo,
    handleShareVideo,
    refreshVideos
  };
};
