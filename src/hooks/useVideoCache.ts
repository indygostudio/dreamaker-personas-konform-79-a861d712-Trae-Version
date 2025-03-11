
import { useEffect, useState, useRef } from 'react';
import videoCache from '@/utils/VideoCache';

/**
 * Hook for working with cached video elements
 */
export const useVideoCache = (videoUrl: string | null) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Set up video element with cache
  useEffect(() => {
    if (!videoUrl) {
      setIsVideoLoaded(false);
      setThumbnailUrl("");
      return;
    }
    
    // Get video from cache
    const video = videoCache.getVideo(videoUrl);
    videoRef.current = video;
    
    // Handle load state
    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      
      // Generate thumbnail
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL());
      } catch (error) {
        console.error("Error creating thumbnail:", error);
      }
    };
    
    // Set up event listeners
    if (video.readyState >= 2) {
      // Already has enough data
      handleLoadedData();
    } else {
      video.addEventListener('loadeddata', handleLoadedData);
    }
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoUrl]);
  
  return {
    videoRef,
    isVideoLoaded,
    thumbnailUrl,
  };
};
