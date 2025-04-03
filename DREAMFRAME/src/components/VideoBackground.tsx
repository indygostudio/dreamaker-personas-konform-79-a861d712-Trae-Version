
import React, { useRef, useEffect } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
  opacity?: number; // Add the opacity prop
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoSrc, 
  className = "",
  opacity = 0.5 // Default opacity
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Slow down the video playback
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div 
        className="absolute inset-0 backdrop-blur-xl" 
        style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
      ></div>
    </div>
  );
};

export default VideoBackground;
