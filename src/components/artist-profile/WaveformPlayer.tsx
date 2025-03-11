
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onTimeUpdate?: () => void;
  onLoad?: () => void;
  currentTime?: number;
  duration?: number;
  // Flag to indicate if we should disable audio in WaveSurfer
  disableAudio?: boolean;
}

export const WaveformPlayer = ({ 
  audioUrl, 
  isPlaying, 
  onPlayPause,
  onTimeUpdate,
  onLoad,
  currentTime,
  duration,
  disableAudio = true // Default to true to prevent double audio playback
}: WaveformPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;

    const initWavesurfer = async () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      try {
        const ws = WaveSurfer.create({
          container: waveformRef.current!,
          waveColor: '#6366f1',
          progressColor: '#00D1FF',
          cursorColor: '#00D1FF',
          barWidth: 2,
          barGap: 2,
          height: 64,
          normalize: true,
          fillParent: true,
          minPxPerSec: 50,
          backend: 'WebAudio',
          hideScrollbar: true,
          interact: true,
          // Disable audio output from WaveSurfer to prevent double playback
          media: disableAudio ? { volume: 0 } : undefined
        });

        wavesurfer.current = ws;

        ws.on('ready', () => {
          console.log('WaveSurfer is ready');
          setIsInitialized(true);
          if (onLoad) onLoad();
        });

        ws.on('error', (err) => {
          console.error('WaveSurfer error:', err);
        });

        ws.on('finish', () => {
          if (onPlayPause) onPlayPause();
        });

        // Fixed: Using 'seeking' instead of 'seek' as the event type
        ws.on('seeking', () => {
          if (isSyncingRef.current) return;
          
          isSyncingRef.current = true;
          if (onTimeUpdate) onTimeUpdate();
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 50);
        });

        ws.load(audioUrl);
      } catch (error) {
        console.error('Error initializing WaveSurfer:', error);
      }
    };

    initWavesurfer();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [audioUrl, onLoad, onPlayPause, onTimeUpdate]);

  useEffect(() => {
    if (!wavesurfer.current || !isInitialized) return;
    
    try {
      const isWavesurferPlaying = wavesurfer.current.isPlaying();
      if (isPlaying && !isWavesurferPlaying) {
        wavesurfer.current.play();
      } else if (!isPlaying && isWavesurferPlaying) {
        wavesurfer.current.pause();
      }
    } catch (error) {
      console.error('Error controlling WaveSurfer playback:', error);
    }
  }, [isPlaying, isInitialized]);

  useEffect(() => {
    if (!wavesurfer.current || !isInitialized || !currentTime || !duration || isSyncingRef.current) return;
    
    try {
      const targetPosition = currentTime / duration;
      const currentPosition = wavesurfer.current.getCurrentTime() / wavesurfer.current.getDuration();
      
      if (Math.abs(targetPosition - currentPosition) > 0.01) {
        isSyncingRef.current = true;
        wavesurfer.current.seekTo(targetPosition);
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 50);
      }
    } catch (error) {
      console.error('Error updating WaveSurfer position:', error);
    }
  }, [currentTime, duration, isInitialized]);

  return (
    <div className="flex flex-col gap-2">
      <div 
        ref={waveformRef} 
        className="flex-1 bg-black/20 rounded-lg overflow-hidden h-16"
        style={{ minHeight: '64px' }}
      />
    </div>
  );
};
