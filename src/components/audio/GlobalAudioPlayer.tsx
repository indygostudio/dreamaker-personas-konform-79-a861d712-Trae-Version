import { useState, useEffect } from 'react';
import { AudioVisualizerContainer } from './visualizers/AudioVisualizerContainer';
import { useAudio, VisualizationMode } from '@/contexts/AudioContext';
// This component provides the main audio player interface that appears at the bottom of the screen
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Settings,
  X,
  ChevronUp,
  ChevronDown,
  BarChart2,
  Waves,
  Music,
  Image
} from "lucide-react";

type TransportMode = 'collapsed' | 'expanded' | 'minimized';

export const GlobalAudioPlayer = () => {
  const {
    globalAudioState,
    play,
    pause,
    stop,
    seek,
    next,
    previous,
    setVolume,
    toggleMute,
    setRepeatMode,
    shufflePlaylist,
    formatTime,
    setVisualizationMode,
    calculateProgress
  } = useAudio();

  const [transportMode, setTransportMode] = useState<TransportMode>('collapsed');
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Destructure state
  const { currentTrack, playbackState, playlist, visualization } = globalAudioState;
  const { status, currentTime, duration, volume, isMuted } = playbackState;
  const { isShuffled, repeatMode } = playlist;
  const { mode: visualizationMode } = visualization;

  // Update progress when not dragging
  useEffect(() => {
    if (!isDraggingProgress) {
      setCurrentProgress(calculateProgress());
    }
  }, [calculateProgress, isDraggingProgress, currentTime, duration]);

  // Only hide the player if there's no current track
  if (!currentTrack) {
    return null;
  }

  // Close the player
  const handleClose = () => {
    stop();
  };

  // Toggle play/pause
  const handlePlayPause = () => {
    if (status === 'playing') {
      pause();
    } else {
      play();
    }
  };

  // Seek to position
  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
    setCurrentProgress(value[0]);
  };

  // Volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  // Toggle repeat mode cycle: none -> track -> playlist -> none
  const handleRepeatToggle = () => {
    switch (repeatMode) {
      case 'none':
        setRepeatMode('track');
        break;
      case 'track':
        setRepeatMode('playlist');
        break;
      case 'playlist':
        setRepeatMode('none');
        break;
    }
  };

  // Toggle shuffle
  const handleShuffleToggle = () => {
    shufflePlaylist(!isShuffled);
  };

  // Toggle visualization mode cycle
  const handleVisualizationToggle = () => {
    const modes: VisualizationMode[] = ['waveform', 'spectrum', 'artwork', 'minimal'];
    const currentIndex = modes.indexOf(visualizationMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizationMode(modes[nextIndex]);
  };

  // Cycle through transport modes
  const handleTransportModeToggle = () => {
    switch (transportMode) {
      case 'collapsed':
        setTransportMode('expanded');
        break;
      case 'expanded':
        setTransportMode('minimized');
        break;
      case 'minimized':
        setTransportMode('collapsed');
        break;
    }
  };

  // Get appropriate icon for visualization mode
  const getVisualizationIcon = () => {
    switch (visualizationMode) {
      case 'waveform':
        return <Waves className="h-4 w-4" />;
      case 'spectrum':
        return <BarChart2 className="h-4 w-4" />;
      case 'artwork':
        return <Image className="h-4 w-4" />;
      case 'minimal':
        return <Music className="h-4 w-4" />;
    }
  };

  // Get repeat button classes based on mode
  const getRepeatClasses = () => {
    return `${repeatMode !== 'none' ? 'text-dreamaker-purple' : 'text-gray-400'} hover:text-dreamaker-purple/80 transition-colors`;
  };

  // Render appropriate player based on transport mode
  const renderPlayer = () => {
    switch (transportMode) {
      case 'expanded':
        return renderExpandedPlayer();
      case 'minimized':
        return renderMinimizedPlayer();
      case 'collapsed':
      default:
        return renderCollapsedPlayer();
    }
  };

  // Minimized player (just controls)
  const renderMinimizedPlayer = () => (
    <div className="fixed bottom-0 right-0 z-50 mb-4 mr-4">
      <div className="bg-black/90 rounded-full p-2 border border-dreamaker-purple/30 shadow-lg flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white rounded-full"
          onClick={handlePlayPause}
        >
          {status === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white rounded-full"
          onClick={handleTransportModeToggle}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Standard player (collapsed)
  const renderCollapsedPlayer = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-md border-t border-dreamaker-purple/30 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
              <img 
                src={currentTrack.album_artwork_url || '/placeholder.svg'} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-medium text-white truncate">{currentTrack.title}</h3>
              <p className="text-xs text-gray-400 truncate">
                {currentTrack.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>
          
          {/* Main controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
              onClick={previous}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-dreamaker-purple/80 transition-colors"
              onClick={handlePlayPause}
            >
              {status === 'playing' ? 
                <Pause className="h-5 w-5" /> : 
                <Play className="h-5 w-5" />
              }
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
              onClick={next}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="flex-1 flex items-center gap-2 max-w-md">
            <span className="text-xs text-gray-400 min-w-[40px] text-right">
              {formatTime(currentTime)}
            </span>
            
            <div className="flex-1">
              <Slider
                value={[currentProgress]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                onValueCommit={() => setIsDraggingProgress(false)}
                onPointerDown={() => setIsDraggingProgress(true)}
                className="cursor-pointer"
              />
            </div>
            
            <span className="text-xs text-gray-400 min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
          
          {/* Additional controls */}
          <div className="flex items-center gap-1">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors h-8 w-8"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                onMouseEnter={() => setShowVolumeSlider(true)}
              >
                {isMuted ? 
                  <VolumeX className="h-4 w-4" /> : 
                  <Volume2 className="h-4 w-4" />
                }
              </Button>
              
              {showVolumeSlider && (
                <div 
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/90 rounded border border-dreamaker-purple/30 p-2 flex items-center"
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={`${isShuffled ? 'text-dreamaker-purple' : 'text-gray-400'} hover:text-dreamaker-purple/80 transition-colors h-8 w-8`}
              onClick={handleShuffleToggle}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={getRepeatClasses() + " h-8 w-8"}
              onClick={handleRepeatToggle}
            >
              <Repeat className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors h-8 w-8"
              onClick={handleVisualizationToggle}
            >
              {getVisualizationIcon()}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors h-8 w-8"
              onClick={handleTransportModeToggle}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Expanded player with visualization
  const renderExpandedPlayer = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-md border-t border-dreamaker-purple/30 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        {/* Visualization area */}
        <div className="mb-4 overflow-hidden">
          {/* Import is at the top */}
          <AudioVisualizerContainer height={180} />
        </div>
        
        {/* Controls - same as collapsed but with more space */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* Track info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                <img 
                  src={currentTrack.album_artwork_url || '/placeholder.svg'} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{currentTrack.title}</h3>
                <p className="text-xs text-gray-400">
                  {currentTrack.artist || 'Unknown Artist'}
                </p>
              </div>
            </div>
            
            {/* Main controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={`${isShuffled ? 'text-dreamaker-purple' : 'text-gray-400'} hover:text-dreamaker-purple/80 transition-colors`}
                onClick={handleShuffleToggle}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
                onClick={previous}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-dreamaker-purple/80 transition-colors h-12 w-12 rounded-full bg-dreamaker-purple/20"
                onClick={handlePlayPause}
              >
                {status === 'playing' ? 
                  <Pause className="h-6 w-6" /> : 
                  <Play className="h-6 w-6" />
                }
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
                onClick={next}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={getRepeatClasses()}
                onClick={handleRepeatToggle}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Additional controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
                  onClick={toggleMute}
                >
                  {isMuted ? 
                    <VolumeX className="h-4 w-4" /> : 
                    <Volume2 className="h-4 w-4" />
                  }
                </Button>
                
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
                onClick={handleVisualizationToggle}
              >
                {getVisualizationIcon()}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
                onClick={() => setTransportMode('collapsed')}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-dreamaker-purple/80 transition-colors"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 min-w-[40px] text-right">
              {formatTime(currentTime)}
            </span>
            
            <div className="flex-1">
              <Slider
                value={[currentProgress]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                onValueCommit={() => setIsDraggingProgress(false)}
                onPointerDown={() => setIsDraggingProgress(true)}
                className="cursor-pointer"
              />
            </div>
            
            <span className="text-xs text-gray-400 min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return renderPlayer();
};
