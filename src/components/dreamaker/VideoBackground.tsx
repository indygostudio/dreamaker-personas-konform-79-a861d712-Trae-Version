
import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  videoUrl: string | null;
  isHovering?: boolean;
  continuePlayback?: boolean;
  fallbackImage?: string;
  reverseOnEnd?: boolean;
  position?: { x: number; y: number };
  darkness?: number;
  autoPlay?: boolean;
  priority?: boolean; // Added priority prop
}

export const VideoBackground = ({
  videoUrl,
  isHovering = false,
  continuePlayback = false,
  fallbackImage,
  reverseOnEnd = false,
  position = { x: 50, y: 50 },
  darkness = 0,
  autoPlay = false,
  priority = false, // Default to false
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const playAttemptedRef = useRef(false);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      
      // Start playing immediately if autoPlay is enabled
      if (autoPlay && !playAttemptedRef.current) {
        playAttemptedRef.current = true;
        video.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.log("Autoplay prevented by browser, waiting for user interaction");
            setIsPlaying(false);
          });
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [videoUrl, autoPlay]);

  // Handle video end behavior
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const handleEnded = () => {
      if (reverseOnEnd) {
        video.playbackRate = -1;
        video.currentTime = video.duration;
        video.play().catch(err => console.log("Reverse play error:", err));
        setIsReversed(true);
      } else {
        video.currentTime = 0;
        if (continuePlayback || autoPlay) {
          video.play().catch(err => console.log("Replay error:", err));
        }
      }
    };

    const handleTimeUpdate = () => {
      if (isReversed && video.currentTime <= 0.1) {
        video.playbackRate = 1;
        setIsReversed(false);
        if (!continuePlayback && !autoPlay) {
          video.pause();
          setIsPlaying(false);
        } else {
          video.play().catch(err => console.log("Forward play error:", err));
        }
      }
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoUrl, reverseOnEnd, continuePlayback, isReversed, autoPlay]);

  // Handle hover behavior
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || autoPlay) return; // Don't interfere with autoPlay

    if (isHovering) {
      // Use a slight delay to prevent rapid toggling
      const playTimer = setTimeout(() => {
        if (isReversed) {
          video.playbackRate = -1;
        } else {
          video.playbackRate = 1;
        }
        
        // Always ensure video is muted to prevent interfering with audio transport
        video.muted = true;
        
        // Store current playing state before attempting to play
        const wasPlaying = isPlaying;
        
        video.play()
          .then(() => {
            // Only update playing state if it wasn't already playing
            if (!wasPlaying) setIsPlaying(true);
          })
          .catch(err => {
            // Just log errors but don't show to users
            console.log("Video play error:", err);
            if (!wasPlaying) setIsPlaying(false);
          });
      }, 50);
      
      return () => clearTimeout(playTimer);
    } else if (!continuePlayback) {
      // Pause when mouse leaves if continuePlayback is false
      video.pause();
      setIsPlaying(false);
      
      // Don't reset to first frame - maintain position for next hover
    }
  }, [isHovering, videoUrl, autoPlay, isReversed, continuePlayback, isPlaying]);
  
  // Ensure video pauses when component unmounts
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
      }
    };
  }, []);

  if (!videoUrl && !fallbackImage) {
    return <div className="w-full h-full bg-black" />;
  }

  const positionStyle = position
    ? {
        objectPosition: `${position.x}% ${position.y}%`,
      }
    : {};

  const darknessFilter = darkness
    ? {
        filter: `brightness(${1 - darkness / 100})`,
      }
    : {};

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {videoUrl ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ ...positionStyle, ...darknessFilter }}
          preload={priority ? "auto" : "metadata"} // Use 'auto' for priority loading
          muted
          playsInline
          loop={true}
          autoPlay={autoPlay}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : fallbackImage ? (
        <img
          src={fallbackImage}
          alt="Background"
          className="w-full h-full object-cover"
          style={{ ...positionStyle, ...darknessFilter }}
          loading={priority ? "eager" : "lazy"} // Use 'eager' for priority loading of images
        />
      ) : null}
    </div>
  );
};
