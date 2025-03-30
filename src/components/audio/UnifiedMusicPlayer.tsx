import { useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import type { Track } from '@/types/track';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  X
} from 'lucide-react';
import { WaveformVisualizer } from './visualizers/WaveformVisualizer';

/**
 * UnifiedMusicPlayer - A drop-in replacement for the existing MusicPlayer
 * that uses the centralized audio system underneath.
 * 
 * This component maintains the same props interface as the original MusicPlayer
 * but leverages the unified audio architecture for improved performance and consistency.
 */
interface UnifiedMusicPlayerProps {
  currentTrack: Track;
  tracks: Track[];
  isPlaying: boolean;
  isShuffled: boolean;
  isLooping: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsShuffled: (isShuffled: boolean) => void;
  setIsLooping: (isLooping: boolean) => void;
  onTrackSelect: (track: Track) => void;
  onClose?: () => void;
  trimStart?: number;
  trimEnd?: number;
}

export const UnifiedMusicPlayer = ({
  currentTrack,
  tracks,
  isPlaying,
  isShuffled,
  isLooping,
  setIsPlaying,
  setIsShuffled,
  setIsLooping,
  onTrackSelect,
  onClose,
  trimStart,
  trimEnd
}: UnifiedMusicPlayerProps) => {
  // Use our central audio player hook
  const {
    initializeTracks,
    handlePlayTrack,
    next: playNextTrack,
    previous: playPreviousTrack,
    progress,
    currentTime,
    duration,
    seek
  } = useAudioPlayer();
  
  // Set up tracks in the audio system when they change
  useEffect(() => {
    if (tracks.length > 0) {
      // Find the index of the current track
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      
      // Initialize with current tracks but don't auto-play
      initializeTracks(tracks, currentIndex >= 0 ? currentIndex : 0, false);
      
      // Apply trim points if specified
      if (trimStart !== undefined && trimEnd !== undefined) {
        // Note: In a real implementation, we'd need to handle trim points
        // This would require modifications to the AudioContext to support trim points
      }
    }
  }, [tracks, currentTrack, initializeTracks, trimStart, trimEnd]);
  
  // Sync play state with the audio system
  useEffect(() => {
    setIsPlaying(isPlaying);
  }, [isPlaying, setIsPlaying]);
  
  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle close with fade-out
  const handleClose = () => {
    // Stop playback
    setIsPlaying(false);
    
    // Call onClose if provided
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 border-t border-white/10 z-50">
      <div className="max-w-7xl mx-auto flex flex-col relative">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
              <img 
                src={currentTrack.album_artwork_url || '/placeholder.svg'} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm">
              <div className="text-white font-medium truncate max-w-[200px]">{currentTrack.title}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffled(!isShuffled)}
              className={`text-white hover:text-dreamaker-purple transition-colors ${isShuffled ? 'text-dreamaker-purple' : ''}`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={playPreviousTrack}
              className="text-white hover:text-dreamaker-purple transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-dreamaker-purple transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={playNextTrack}
              className="text-white hover:text-dreamaker-purple transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLooping(!isLooping)}
              className={`text-white hover:text-dreamaker-purple transition-colors ${isLooping ? 'text-dreamaker-purple' : ''}`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-gray-400 min-w-[100px] justify-end">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <WaveformVisualizer 
            height={40}
            className="w-full bg-gray-800 rounded-lg overflow-hidden h-[40px]"
            showTransportControls={true}
            loopable={true}
            onClose={onClose ? handleClose : undefined}
          />
        </div>
      </div>
    </div>
  );
};
