import { useRef, useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import WaveSurfer from 'wavesurfer.js';

interface WaveformVisualizerProps {
  height?: number;
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  barWidth?: number;
  barGap?: number;
  interact?: boolean;
  hideScrollbar?: boolean;
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
  className = ''
}: WaveformVisualizerProps) => {
  const { globalAudioState, seek } = useAudio();
  const { currentTrack, playbackState } = globalAudioState;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  return (
    <div className={`relative w-full ${className}`}>
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
      
      <div ref={containerRef} className="w-full" />
    </div>
  );
};