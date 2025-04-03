
import React, { useState, useRef, useEffect } from "react";
import { Scene, SceneContainer } from "../../types/storyboardTypes";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize, Minimize, ExternalLink, Square } from "lucide-react";

interface VideoPreviewProps {
  story: SceneContainer;
  scenes: Scene[];
  volume: number;
  onVolumeChange: (value: number) => void;
  currentTime?: number;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  onStop?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  story, 
  scenes, 
  volume,
  onVolumeChange,
  currentTime: externalCurrentTime,
  isPlaying: externalIsPlaying,
  onPlayPause,
  onSeek,
  onStop
}) => {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [internalCurrentTime, setInternalCurrentTime] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use external or internal state based on what's provided
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const currentTime = externalCurrentTime !== undefined ? externalCurrentTime : internalCurrentTime;

  // Calculate total duration and time offsets for each scene
  const scenesWithOffsets = scenes.map((scene, index) => {
    const startTimeOffset = scenes
      .slice(0, index)
      .reduce((total, s) => total + s.durationInSeconds, 0);
    
    return {
      ...scene,
      startTimeOffset,
      endTimeOffset: startTimeOffset + scene.durationInSeconds
    };
  });

  useEffect(() => {
    // Set total duration
    const totalDuration = scenes.reduce(
      (total, scene) => total + scene.durationInSeconds, 0
    );
    setDuration(totalDuration);
    
    // Reset current time when scenes change
    if (externalCurrentTime === undefined) {
      setInternalCurrentTime(0);
    }
    setCurrentSceneIndex(0);
    if (externalIsPlaying === undefined) {
      setInternalIsPlaying(false);
    }
  }, [scenes, externalCurrentTime, externalIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // When currentTime changes (either internal or external), update the current scene
  useEffect(() => {
    const newSceneIndex = scenesWithOffsets.findIndex(
      scene => currentTime >= scene.startTimeOffset && currentTime < scene.endTimeOffset
    );
    
    if (newSceneIndex !== -1 && newSceneIndex !== currentSceneIndex) {
      setCurrentSceneIndex(newSceneIndex);
    }

    // When we reach the end, stop playback
    if (currentTime >= duration && duration > 0) {
      if (externalIsPlaying === undefined) {
        setInternalIsPlaying(false);
      } else if (onPlayPause && externalIsPlaying) {
        onPlayPause();
      }
    }
    
    // Sync audio position with current time
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 0.5) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime, scenesWithOffsets, currentSceneIndex, duration, externalIsPlaying, onPlayPause]);

  // Handle playback state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Audio playback error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Internal playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && externalCurrentTime === undefined) {
      interval = setInterval(() => {
        setInternalCurrentTime(prev => {
          const newTime = prev + 0.1;
          return newTime > duration ? 0 : newTime;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, externalCurrentTime]);

  // Handle communication with the preview window
  useEffect(() => {
    // Clean up if the preview window is closed
    const checkWindow = setInterval(() => {
      if (previewWindow && previewWindow.closed) {
        setPreviewWindow(null);
      }
    }, 1000);

    return () => {
      clearInterval(checkWindow);
      if (previewWindow && !previewWindow.closed) {
        previewWindow.close();
      }
    };
  }, [previewWindow]);

  const togglePlayback = () => {
    if (onPlayPause) {
      onPlayPause();
    } else {
      setInternalIsPlaying(!internalIsPlaying);
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    } else {
      setInternalIsPlaying(false);
      setInternalCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const toggleMute = () => {
    onVolumeChange(volume === 0 ? 50 : 0);
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    
    if (onSeek) {
      onSeek(newTime);
    } else {
      setInternalCurrentTime(newTime);
    }
    
    // Find the correct scene based on the new time
    const newSceneIndex = scenesWithOffsets.findIndex(
      scene => newTime >= scene.startTimeOffset && newTime < scene.endTimeOffset
    );
    
    if (newSceneIndex !== -1) {
      setCurrentSceneIndex(newSceneIndex);
    }
    
    // Update audio position
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const jumpToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextSceneTime = scenesWithOffsets[currentSceneIndex + 1].startTimeOffset;
      
      if (onSeek) {
        onSeek(nextSceneTime);
      } else {
        setInternalCurrentTime(nextSceneTime);
      }
      
      setCurrentSceneIndex(currentSceneIndex + 1);
      
      if (audioRef.current) {
        audioRef.current.currentTime = nextSceneTime;
      }
    }
  };

  const jumpToPreviousScene = () => {
    if (currentSceneIndex > 0) {
      const prevSceneTime = scenesWithOffsets[currentSceneIndex - 1].startTimeOffset;
      
      if (onSeek) {
        onSeek(prevSceneTime);
      } else {
        setInternalCurrentTime(prevSceneTime);
      }
      
      setCurrentSceneIndex(currentSceneIndex - 1);
      
      if (audioRef.current) {
        audioRef.current.currentTime = prevSceneTime;
      }
    } else {
      // If at first scene, go to beginning
      if (onSeek) {
        onSeek(0);
      } else {
        setInternalCurrentTime(0);
      }
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openInNewWindow = () => {
    // Get current scene data
    const currentScene = scenes[currentSceneIndex] || null;
    if (!currentScene) return;

    const mediaUrl = currentScene.videoUrl || currentScene.imageUrl;
    if (!mediaUrl) return;

    // Create a new window with the current scene
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (!newWindow) {
      alert('Please allow pop-ups for this site to use this feature.');
      return;
    }

    // Set up the new window content
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${story.title} - ${currentScene.description || 'Preview'}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #000;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              color: white;
              font-family: Arial, sans-serif;
            }
            img, video {
              max-width: 100%;
              max-height: 90vh;
              object-fit: contain;
            }
            .info {
              position: absolute;
              bottom: 10px;
              left: 10px;
              background: rgba(0,0,0,0.7);
              padding: 8px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          ${currentScene.videoUrl 
            ? `<video src="${currentScene.videoUrl}" controls autoplay loop></video>` 
            : `<img src="${currentScene.imageUrl}" alt="${currentScene.description || 'Preview'}"/>`
          }
          <div class="info">
            <strong>${story.title}</strong> - ${currentScene.description || 'Shot ' + (currentSceneIndex + 1)}
          </div>
        </body>
      </html>
    `);
    
    setPreviewWindow(newWindow);
  };

  // Get current scene to display
  const currentScene = scenes[currentSceneIndex] || null;

  return (
    <Card className={`bg-runway-glass border-runway-glass-border overflow-hidden ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      <CardContent className="p-4">
        <div 
          ref={containerRef}
          className={`${isExpanded ? 'aspect-video' : 'aspect-[16/9] max-h-[200px]'} bg-black rounded-md overflow-hidden mb-3 relative`}
        >
          {currentScene ? (
            currentScene.videoUrl ? (
              <video
                ref={videoRef}
                src={currentScene.videoUrl}
                className="w-full h-full object-contain"
                playsInline
                muted
              />
            ) : currentScene.imageUrl ? (
              <img
                src={currentScene.imageUrl}
                alt={currentScene.description}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-runway-card">
                <span className="text-gray-400">No media</span>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-runway-card">
              <span className="text-gray-400">No scenes available</span>
            </div>
          )}
          
          {/* Scene information overlay */}
          {currentScene && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Scene {currentSceneIndex + 1}: {currentScene.description}
            </div>
          )}

          {/* Button controls */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/70"
              onClick={openInNewWindow}
              title="Open in new window"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/70"
              onClick={toggleExpanded}
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? (
                <Minimize className="h-3.5 w-3.5" />
              ) : (
                <Maximize className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-runway-input"
            onClick={jumpToPreviousScene}
          >
            <SkipBack className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-runway-input"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-runway-input"
            onClick={handleStop}
          >
            <Square className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-runway-input"
            onClick={jumpToNextScene}
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-runway-input"
            onClick={toggleMute}
          >
            {volume === 0 ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </Button>
          
          <div className="flex-1 mx-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
            />
          </div>
          
          <div className="text-xs font-mono text-gray-300 min-w-[80px] text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">Vol:</span>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-24"
            onValueChange={(val) => onVolumeChange(val[0])}
          />
          <span className="text-xs text-gray-400 ml-2">{volume}%</span>
        </div>
        
        {/* Hidden audio element for the soundtrack */}
        {story.audioTrack && (
          <audio
            ref={audioRef}
            src={story.audioTrack}
            className="hidden"
            loop={false}
          />
        )}
      </CardContent>
    </Card>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default VideoPreview;
