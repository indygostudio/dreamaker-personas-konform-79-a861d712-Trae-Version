
import React from 'react';

interface VideoPlayerProps {
  url: string;
  controls?: boolean;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  controls = true,
  autoPlay = false 
}) => {
  // Parse URL to add loop parameter if it's a supported platform
  const getUrlWithLoop = (url: string) => {
    try {
      // If it's a YouTube URL, add loop parameter
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Add loop=1 to the URL parameters
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}loop=1&playlist=VIDEO_ID`;
      }
      // For Vimeo
      if (url.includes('vimeo.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}loop=1`;
      }
      return url;
    } catch (err) {
      console.error("Error processing video URL:", err instanceof Error ? err.message : "Unknown error");
      return url;
    }
  };

  return (
    <div className="w-full h-0 pt-[56.25%] relative rounded-lg overflow-hidden bg-black">
      <iframe
        src={getUrlWithLoop(url)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};
