
import React, { useState, useEffect, useRef } from 'react';

interface MjVideoPlayerProps {
  url: string;
  className?: string;
}

export const MjVideoPlayer: React.FC<MjVideoPlayerProps> = ({ url, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Determine if the URL is a video or audio
  const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);
  const isAudio = url?.match(/\.(mp3|wav|m4a)$/i);
  
  useEffect(() => {
    // Reset player state when URL changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [url]);
  
  const handlePlay = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.play();
    } else if (isAudio && audioRef.current) {
      audioRef.current.play();
    }
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    } else if (isAudio && audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };
  
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement | HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };
  
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement | HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = newTime;
    } else if (isAudio && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // If no URL is provided, show a placeholder
  if (!url) {
    return (
      <div className={`w-full h-0 pt-[56.25%] relative rounded-lg overflow-hidden bg-black/30 ${className}`}>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
          No media available
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full rounded-lg overflow-hidden bg-black/20 ${className}`}>
      {isVideo ? (
        <div className="relative">
          <video
            ref={videoRef}
            src={url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="w-full rounded-lg"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="text-white hover:text-gray-300"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <span className="text-xs text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-grow h-1"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <audio
            ref={audioRef}
            src={url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            controls
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
