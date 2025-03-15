
import { useState, useEffect, useRef } from "react";
import { useVideoCache } from "@/hooks/useVideoCache";
import type { BannerPosition } from "@/types/types";

interface VideoBackgroundProps {
  videoUrl: string | null;
  isHovering: boolean;
  fallbackImage?: string;
  continuePlayback?: boolean; 
  reverseOnEnd?: boolean;
  position?: BannerPosition;
  darkness?: number;
  autoPlay?: boolean;
  priority?: boolean; // Added priority prop
}

export const VideoBackground = ({ 
  videoUrl, 
  isHovering, 
  fallbackImage,
  continuePlayback = false,
  reverseOnEnd = true,
  position = { x: 50, y: 50 },
  darkness = 0.4,
  autoPlay = false,
  priority = false, // Default to false
}: VideoBackgroundProps) => {
  // Log the fallbackImage for debugging
  console.log('VideoBackground fallbackImage:', fallbackImage);
  const { videoRef, isVideoLoaded, thumbnailUrl } = useVideoCache(videoUrl);
  const [isReversed, setIsReversed] = useState(false);
  const [lastPlaybackRate, setLastPlaybackRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const playAttemptedRef = useRef(false);

  // Handle autoplay when video is loaded
  useEffect(() => {
    if (videoUrl && videoRef.current && autoPlay && !playAttemptedRef.current) {
      playAttemptedRef.current = true;
      const video = videoRef.current;
      
      // If video is loaded enough to play
      if (video.readyState >= 2) {
        video.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.log("Autoplay prevented, waiting for user interaction");
            setIsPlaying(false);
          });
      } else {
        // Wait for it to load enough data
        const handleCanPlay = () => {
          video.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.log("Delayed autoplay error:", err));
          video.removeEventListener('canplay', handleCanPlay);
        };
        video.addEventListener('canplay', handleCanPlay);
        
        return () => {
          video.removeEventListener('canplay', handleCanPlay);
        };
      }
    }
  }, [videoUrl, videoRef, autoPlay, isVideoLoaded]);

  // Handle playback direction changes
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      const video = videoRef.current;
      
      if (reverseOnEnd) {
        const handleTimeUpdate = () => {
          // Check if we're approaching the end or beginning of the video
          if (!isReversed && video.currentTime >= video.duration - 0.1) {
            // Near the end, reverse playback
            video.playbackRate = -1;
            setIsReversed(true);
            setLastPlaybackRate(-1);
          } else if (isReversed && video.currentTime <= 0.1) {
            // Near the beginning, play forward
            video.playbackRate = 1;
            setIsReversed(false);
            setLastPlaybackRate(1);
            
            // If not supposed to continue playing
            if (!continuePlayback && !autoPlay && !isHovering) {
              video.pause();
              setIsPlaying(false);
            }
          }
        };
        
        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
          video.removeEventListener('timeupdate', handleTimeUpdate);
        };
      }
    }
  }, [videoUrl, reverseOnEnd, isReversed, continuePlayback, autoPlay, isHovering]);

  // Handle hover behavior 
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      const video = videoRef.current;
      
      if (isHovering && !autoPlay) {
        // Only play on hover if not set to autoPlay
        const playTimer = setTimeout(() => {
          if (reverseOnEnd && lastPlaybackRate !== 0) {
            // Resume in the same direction
            video.playbackRate = lastPlaybackRate;
          }
          video.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.log("Hover play error:", err));
        }, 50);
        
        return () => clearTimeout(playTimer);
      } else if (!isHovering && !continuePlayback) {
        // Always pause when mouse leaves unless explicitly set to continue
        video.pause();
        setIsPlaying(false);
        
        // Reset to beginning when mouse leaves
        video.currentTime = 0;
      }
    }
  }, [videoUrl, isHovering, continuePlayback, reverseOnEnd, lastPlaybackRate, autoPlay]);

  if (!videoUrl && !fallbackImage) {
    console.log('No video or fallback image provided');
    return <div className="w-full h-full bg-gradient-to-b from-black/20 to-black/60" />;
  }

  // Calculate opacity based on darkness factor (0-1)
  const opacityClass = `opacity-${Math.min(Math.floor(darkness * 100), 90)}`;

  return (
    <div className="relative w-full h-full">
      {thumbnailUrl && !isHovering && !isPlaying && (
        <div className="absolute inset-0 transition-opacity duration-300 opacity-50">
          <img 
            src={thumbnailUrl} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover"
            style={{ objectPosition: `${position.x}% ${position.y}%` }}
            loading={priority ? "eager" : "lazy"} // Use 'eager' for priority loading of images
          />
        </div>
      )}
      {videoUrl ? (
        <video
          ref={(el) => {
            if (el && videoRef.current && el !== videoRef.current) {
              // Copy properties if DOM swaps the element
              el.currentTime = videoRef.current.currentTime;
              el.playbackRate = videoRef.current.playbackRate;
              if (!videoRef.current.paused) el.play();
            }
          }}
          src={videoUrl}
          crossOrigin="anonymous"
          muted
          loop={!reverseOnEnd}
          playsInline
          autoPlay={autoPlay}
          preload={priority ? "auto" : "metadata"} // Use 'auto' for priority loading
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition: `${position.x}% ${position.y}%` }}
        />
      ) : fallbackImage && (
        <img
          src={fallbackImage}
          alt="Background"
          className="w-full h-full object-cover"
          style={{ objectPosition: `${position.x}% ${position.y}%` }}
          loading={priority ? "eager" : "lazy"} // Use 'eager' for priority loading of images
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black ${opacityClass} group-hover:opacity-90 transition-opacity duration-300`} />
    </div>
  );
};
