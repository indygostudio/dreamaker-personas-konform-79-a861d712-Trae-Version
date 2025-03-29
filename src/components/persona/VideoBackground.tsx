
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

  // Handle autoplay and initial video loading
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        if ((autoPlay || isHovering) && !playAttemptedRef.current) {
          playAttemptedRef.current = true;
          video.play()
            .then(() => setIsPlaying(true))
            .catch(err => {
              console.log("Video playback error:", err);
              setIsPlaying(false);
            });
        }
      };

      if (video.readyState >= 2) {
        handleCanPlay();
      } else {
        video.addEventListener('canplay', handleCanPlay);
        return () => {
          video.removeEventListener('canplay', handleCanPlay);
        };
      }
    }
  }, [videoUrl, videoRef, autoPlay, isHovering, isVideoLoaded]);

  // Reset playAttempted when video URL changes
  useEffect(() => {
    playAttemptedRef.current = false;
  }, [videoUrl]);

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
      
      // This is where the issue is happening - video playback is interfering with audio transport
      if (isHovering) {
        // Create a completely isolated play attempt that won't affect audio contexts
        const playTimer = setTimeout(() => {
          // IMPORTANT: Prevent video playback from affecting audio contexts
          // First, disconnect any audio tracks that might exist in the video
          try {
            // Ensure video is completely muted with no audio track interaction
            video.muted = true;
            video.volume = 0;
            
            // Set video attributes to prevent audio context usage
            video.setAttribute('disableRemotePlayback', 'true');
            video.setAttribute('x-webkit-airplay', 'deny');
            
            // Create a flag in the DOM to mark video as visuals-only
            if (!video.hasAttribute('data-visuals-only')) {
              video.setAttribute('data-visuals-only', 'true');
            }
            
            // Only set playback rate if we're going to play
            if (reverseOnEnd && lastPlaybackRate !== 0) {
              // Resume in the same direction
              video.playbackRate = lastPlaybackRate;
            }
          } catch (e) {
            console.error("Error configuring video:", e);
          }
          
          // Store current playing state
          const wasPlaying = isPlaying;
          
          // Use a completely separate try/catch that won't bubble up
          try {
            // Use a void promise to completely isolate any errors
            void video.play().then(() => {
              if (!wasPlaying) setIsPlaying(true);
            }).catch(() => {
              // Silently fail - don't let this affect audio playback at all
              // We prioritize audio transport stability over video playback
            });
          } catch (e) {
            // Completely swallow any errors to prevent audio interruption
          }
        }, 50);
        
        return () => clearTimeout(playTimer);
      } else if (!continuePlayback) {
        // Only pause video when mouse leaves if continuePlayback is false
        // This allows videos to keep playing when audio is playing
        video.pause();
        setIsPlaying(false);
        
        // Don't reset position - maintain current position for smoother experience
        // when hovering again
      }
    }
  }, [videoUrl, isHovering, reverseOnEnd, lastPlaybackRate, continuePlayback, isPlaying]);

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
              
              // Ensure video is completely isolated from audio contexts
              el.muted = true;
              el.volume = 0;
              el.setAttribute('disableRemotePlayback', 'true');
              el.setAttribute('x-webkit-airplay', 'deny');
              el.setAttribute('data-visuals-only', 'true');
              
              if (!videoRef.current.paused) {
                // Use a separate try/catch block for play() that won't affect audio
                try {
                  void el.play().catch(() => {});
                } catch (e) {}
              }
            }
          }}
          src={videoUrl}
          crossOrigin="anonymous"
          muted
          loop={true}
          playsInline
          autoPlay={autoPlay}
          data-visuals-only="true"
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
