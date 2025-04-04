
import { useState, useEffect, useRef, RefObject } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Repeat, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { WaveformPlayer } from './WaveformPlayer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnhancedMusicPlayerProps {
  audioUrl: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  trackTitle?: string;
  artistName?: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  isAudioReady?: boolean;
  closeTransport?: () => void;
  trimStart?: number; // Start time in seconds for trimmed playback
  trimEnd?: number; // End time in seconds for trimmed playback
}

export const EnhancedMusicPlayer = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  trackTitle = 'Unknown Track',
  artistName = 'Unknown Artist',
  audioRef,
  isAudioReady = false,
  closeTransport,
  trimStart,
  trimEnd
}: EnhancedMusicPlayerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [displayMode, setDisplayMode] = useState<'standard' | 'waveform'>('standard');
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  if (!audioUrl) {
    return null;
  }
  
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    
    const handleTimeUpdate = () => {
      if (!isDragging && audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    if (audioRef.current.readyState > 0) {
      setDuration(audioRef.current.duration);
      setCurrentTime(audioRef.current.currentTime);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [audioUrl, isDragging, audioRef]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.playbackRate = playbackSpeed;
  }, [volume, isMuted, audioRef, playbackSpeed]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          onPlayPause();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyR':
          setIsRepeat(!isRepeat);
          break;
        case 'ArrowLeft':
          if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
          }
          break;
        case 'ArrowRight':
          if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, isRepeat, duration]);

  // Handle track end
  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => {
      if (isRepeat && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        onPlayPause();
      }
    };

    audioRef.current.addEventListener('ended', handleEnded);
    return () => audioRef.current?.removeEventListener('ended', handleEnded);
  }, [isRepeat, onPlayPause, audioRef]);
  
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSeek = (newTime: number[]) => {
    if (!audioRef.current) return;
    
    const time = newTime[0];
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (isMuted && newVolume[0] > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === 'standard' ? 'waveform' : 'standard');
  };
  
  const handleClose = () => {
    if (closeTransport) {
      closeTransport();
      onPlayPause(); // Ensure isPlaying is set to false
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-md border-t border-dreamaker-purple/30 animate-slide-in-up shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
              <img 
                src="/placeholder.svg" 
                alt={trackTitle} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white truncate">{trackTitle}</h3>
              <p className="text-xs text-gray-400">{artistName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-300 hover:text-white"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-300 hover:text-white"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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
              className="h-8 w-8 text-gray-300 hover:text-white"
              onClick={() => setIsRepeat(!isRepeat)}
              title={isRepeat ? "Disable repeat" : "Enable repeat"}
            >
              <Repeat className={`h-4 w-4 ${isRepeat ? 'text-dreamaker-purple' : ''}`} />
            </Button>

            <Select
              value={playbackSpeed.toString()}
              onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
            >
              <SelectTrigger className="w-[85px] h-8 text-xs bg-transparent border-0 text-gray-300 hover:text-white">
                <FastForward className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <SelectItem key={speed} value={speed.toString()}>
                    {speed}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-300 hover:text-white ml-2"
              onClick={handleClose}
              title="Hide player and stop playback"
              aria-label="Close music player"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {displayMode === 'waveform' && audioUrl ? (
          <div className="mt-2">
            <WaveformPlayer 
              audioUrl={audioUrl}
              isPlaying={isPlaying} 
              onPlayPause={onPlayPause}
              currentTime={currentTime}
              duration={duration}
              disableAudio={true}
              initialRegion={trimStart !== undefined && trimEnd !== undefined ? { start: trimStart, end: trimEnd } : undefined}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400 min-w-12">{formatTime(currentTime)}</span>
            <div className="flex-1">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.01}
                onValueChange={handleSeek}
                onValueCommit={() => setIsDragging(false)}
                onPointerDown={() => setIsDragging(true)}
                className="cursor-pointer"
              />
            </div>
            <span className="text-xs text-gray-400 min-w-12">{formatTime(duration)}</span>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleDisplayMode}
          className="text-xs text-gray-400 hover:text-white self-center mt-1"
        >
          {displayMode === 'waveform' ? "Switch to Standard View" : "Switch to Waveform View"}
        </Button>
      </div>
    </div>
  );
};
