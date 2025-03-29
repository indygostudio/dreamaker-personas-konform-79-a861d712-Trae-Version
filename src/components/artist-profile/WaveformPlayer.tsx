
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';

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
  // Region selection props
  enableRegionSelection?: boolean;
  initialRegion?: { start: number; end: number };
  onRegionUpdate?: (region: { start: number; end: number }) => void;
  trimStartPercentage?: number;
  trimEndPercentage?: number;
}

export const WaveformPlayer = ({ 
  audioUrl, 
  isPlaying, 
  onPlayPause,
  onTimeUpdate,
  onLoad,
  currentTime,
  duration,
  disableAudio = true, // Default to true to prevent double audio playback
  enableRegionSelection = false,
  initialRegion,
  onRegionUpdate,
  trimStartPercentage,
  trimEndPercentage
}: WaveformPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const regionsPlugin = useRef<any>(null);
  const activeRegion = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;

    const initWavesurfer = async () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      try {
        // Initialize plugins array
        const plugins = [];
        
        // Add regions plugin if region selection is enabled
        if (enableRegionSelection) {
          regionsPlugin.current = RegionsPlugin.create();
          plugins.push(regionsPlugin.current);
        }
        
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
          // Use MediaElement backend to be more resilient to UI changes
          backend: disableAudio ? 'MediaElement' : 'WebAudio',
          hideScrollbar: true,
          // Limit interaction to prevent UI events from affecting the waveform
          interact: enableRegionSelection, // Only allow interaction if regions are enabled
          // We'll set volume after instance creation
          // Add plugins
          plugins: plugins
        });

        wavesurfer.current = ws;
        
        // Set volume after instance is created to ensure it doesn't affect audio transport
        if (disableAudio) {
          try {
            ws.setVolume(0);
            
            // Add attributes to prevent audio conflicts
            const mediaElement = ws.getMediaElement();
            if (mediaElement) {
              mediaElement.setAttribute('data-visuals-only', 'true');
              mediaElement.muted = true;
              mediaElement.volume = 0;
            }
          } catch (e) {
            console.error('Error configuring WaveSurfer volume:', e);
          }
        }

        ws.on('ready', () => {
          console.log('WaveSurfer is ready');
          setIsInitialized(true);
          
          // Double-check volume setting after ready
          if (disableAudio) {
            try {
              ws.setVolume(0);
            } catch (e) {}
          }
          
          // Create region if region selection is enabled
          if (enableRegionSelection && regionsPlugin.current) {
            // Clear any existing regions
            regionsPlugin.current.getRegions().forEach((region: any) => {
              region.remove();
            });
            
            // Calculate region start and end positions
            const wsRegion = {
              start: 0,
              end: ws.getDuration()
            };
            
            // If we have trim points as percentages, convert them to seconds
            if (trimStartPercentage !== undefined && trimEndPercentage !== undefined) {
              wsRegion.start = (trimStartPercentage / 100) * ws.getDuration();
              wsRegion.end = (trimEndPercentage / 100) * ws.getDuration();
            }
            // If we have an initial region, use that
            else if (initialRegion) {
              wsRegion.start = initialRegion.start;
              wsRegion.end = initialRegion.end;
            }
            
            // Create the region
            activeRegion.current = regionsPlugin.current.addRegion({
              ...wsRegion,
              color: 'rgba(0, 209, 255, 0.2)',
              drag: true,
              resize: true
            });
            
            // Set up region update event handlers
            activeRegion.current.on('update-end', () => {
              if (onRegionUpdate && activeRegion.current) {
                onRegionUpdate({
                  start: activeRegion.current.start,
                  end: activeRegion.current.end
                });
              }
            });
          }
          
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
      // Clean up regions first if they exist
      if (regionsPlugin.current) {
        regionsPlugin.current.getRegions().forEach((region: any) => {
          region.remove();
        });
        activeRegion.current = null;
      }
      
      // Then destroy wavesurfer
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
