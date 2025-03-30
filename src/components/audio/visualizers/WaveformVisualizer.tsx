import { useRef, useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, SkipBack, SkipForward, Repeat, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Extend Window interface to include audioContext for cross-component access
declare global {
  interface Window {
    audioContext?: AudioContext;
    resetAudioState?: () => void;
  }
}

interface WaveformVisualizerProps {
  height?: number;
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  barWidth?: number;
  barGap?: number;
  interact?: boolean;
  hideScrollbar?: boolean;
  showTransportControls?: boolean;
  loopable?: boolean;
  onClose?: () => void;
  className?: string;
}

export const WaveformVisualizer = ({
  height = 80,
  waveColor = '#6366f1',
  progressColor = '#818cf8',
  cursorColor = '#818cf8',
  barWidth = 2,
  barGap = 1,
  interact = true,
  hideScrollbar = true,
  showTransportControls = true,
  loopable = false,
  onClose,
  className = ''
}: WaveformVisualizerProps) => {
  const { 
    globalAudioState, 
    seek, 
    play, 
    pause, 
    next, 
    previous, 
    setRepeatMode 
  } = useAudio();
  
  const { currentTrack, playbackState, playlist } = globalAudioState;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState(playlist.repeatMode === 'track');
  // Always show controls by default, but allow hover effect to enhance them
  // Always show controls with higher visibility
const [showControls, setShowControls] = useState(true);
  const [hoverActive, setHoverActive] = useState(false);
  
  // Toggle hover state for enhanced visibility on hover
  const handleMouseEnter = () => {
    if (showTransportControls) {
      setHoverActive(true);
    }
  };

  const handleMouseLeave = () => {
    if (showTransportControls) {
      setHoverActive(false);
    }
  };

  // Always keep controls visible, but toggle their emphasis
  useEffect(() => {
    // Controls should always be visible for better user experience
    setShowControls(showTransportControls);
  }, [showTransportControls]);

  // Handle toggle looping
  const handleToggleLoop = () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);
    setRepeatMode(newLoopState ? 'track' : 'none');
  };

  // Ensure AudioContext is resumed
  useEffect(() => {
    // This ensures the AudioContext is resumed after user interaction
    const resumeAudioContext = () => {
      // Create AudioContext if it doesn't exist
      if (!window.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          window.audioContext = new AudioContextClass();
          console.log('AudioContext created');
        }
      }
      
      // Resume if suspended
      if (window.audioContext && window.audioContext.state === 'suspended') {
        window.audioContext.resume().then(() => {
          console.log('AudioContext resumed successfully');
        });
      }
    };
    
    // Try to resume immediately (helps with existing contexts)
    resumeAudioContext();
    
    // Add listeners for user interaction
    document.addEventListener('click', resumeAudioContext);
    document.addEventListener('touchstart', resumeAudioContext);
    
    return () => {
      document.removeEventListener('click', resumeAudioContext);
      document.removeEventListener('touchstart', resumeAudioContext);
    };
  }, []);

  // Initialize WaveSurfer when component mounts or track changes
  useEffect(() => {
    if (!containerRef.current || !currentTrack) return;
    
    // Cleanup previous instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    
    // Reset states
    setIsReady(false);
    setError(null);
    
    try {
      // Create WaveSurfer instance
      const waveSurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor,
        progressColor,
        cursorColor,
        barWidth,
        barGap,
        height,
        normalize: true,
        fillParent: true,
        minPxPerSec: 50,
        backend: 'WebAudio',
        hideScrollbar
      });
      
      // Set up events
      waveSurfer.on('ready', () => {
        setIsReady(true);
        
        // Sync with current playback position
        if (playbackState.currentTime > 0) {
          const progress = playbackState.currentTime / playbackState.duration;
          waveSurfer.seekTo(progress);
        }
      });
      
      waveSurfer.on('error', (err) => {
        console.error('WaveSurfer error:', err);
        setError('Failed to load waveform');
      });
      
      // Handle user interaction with the waveform
      if (interact) {
        // Use click event instead of seek
        waveSurfer.on('click', (clickPosition: number) => {
          // clickPosition is already a relative position (0-1)
          
          // Calculate time from position
          const newTime = clickPosition * playbackState.duration;
          seek(newTime);
        });
      }
      
      // Load audio
      waveSurfer.load(currentTrack.audio_url);
      wavesurferRef.current = waveSurfer;
      
    } catch (err) {
      console.error('Failed to initialize WaveSurfer:', err);
      setError('Failed to initialize visualizer');
    }
    
    // Cleanup on unmount
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [currentTrack, height, waveColor, progressColor, cursorColor, barWidth, barGap, hideScrollbar, interact, playbackState.currentTime, playbackState.duration, seek]);
  
  // Update progress when current time changes
  useEffect(() => {
    if (!wavesurferRef.current || !isReady || !playbackState.duration) return;
    
    // Calculate progress and update waveform if they're out of sync
    const visualizerTime = wavesurferRef.current.getCurrentTime();
    const audioTime = playbackState.currentTime;
    
    // Only update if the difference is significant (>0.5 seconds) to avoid jitter
    if (Math.abs(visualizerTime - audioTime) > 0.5) {
      const progress = audioTime / playbackState.duration;
      wavesurferRef.current.seekTo(progress);
    }
  }, [playbackState.currentTime, playbackState.duration, isReady]);
  
  // Sync loop state with playlist state
  useEffect(() => {
    setIsLooping(playlist.repeatMode === 'track');
  }, [playlist.repeatMode]);

  return (
    <div 
      className={`relative w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-dreamaker-purple animate-pulse rounded-full" 
                 style={{ width: '50%' }}></div>
          </div>
        </div>
      )}
      
      {/* Transport Controls Overlay */}
      {showTransportControls && isReady && (
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 ${
            hoverActive ? 'opacity-100' : 'opacity-80'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={previous}
              className="text-white hover:text-dreamaker-purple transition-colors bg-black/40 rounded-full"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => playbackState.status === 'playing' ? pause() : play()}
              className="text-white hover:text-dreamaker-purple transition-colors bg-black/40 rounded-full"
            >
              {playbackState.status === 'playing' ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="text-white hover:text-dreamaker-purple transition-colors bg-black/40 rounded-full"
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            {loopable && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleLoop}
                className={`text-white hover:text-dreamaker-purple transition-colors bg-black/40 rounded-full ${isLooping ? 'text-dreamaker-purple' : ''}`}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            )}
          </div>

          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-1 right-1 text-gray-400 hover:text-white bg-black/40 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Looping Indicator */}
      {isLooping && loopable && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-dreamaker-purple/50 rounded-t-md z-10"></div>
      )}

      {/* Waveform Container */}
      <div ref={containerRef} className="w-full" />

      {/* Time and Controls Bottom Bar - Always visible */}
      {showTransportControls && isReady && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-2 py-1 text-xs text-gray-300 bg-black/50">
          <div>{formatTime(playbackState.currentTime)}</div>
          <div>{formatTime(playbackState.duration)}</div>
        </div>
      )}
    </div>
  );
};

// Helper function to format time (mm:ss)
const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
