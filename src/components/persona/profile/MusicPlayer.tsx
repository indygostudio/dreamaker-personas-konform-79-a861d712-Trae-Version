
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat 
} from "lucide-react";
import type { Track } from "@/types/track";
import WaveSurfer from 'wavesurfer.js';

interface MusicPlayerProps {
  currentTrack: Track;
  tracks: Track[];
  isPlaying: boolean;
  isShuffled: boolean;
  isLooping: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsShuffled: (isShuffled: boolean) => void;
  setIsLooping: (isLooping: boolean) => void;
  onTrackSelect: (track: Track) => void;
}

export const MusicPlayer = ({
  currentTrack,
  tracks,
  isPlaying,
  isShuffled,
  isLooping,
  setIsPlaying,
  setIsShuffled,
  setIsLooping,
  onTrackSelect
}: MusicPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const prevTrackRef = useRef<Track | null>(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#6366f1',
        progressColor: '#818cf8',
        cursorColor: '#818cf8',
        barWidth: 2,
        barGap: 2,
        height: 40,
        normalize: true,
        fillParent: true,
        minPxPerSec: 50,
        backend: 'WebAudio',
        hideScrollbar: true
      });

      ws.on('ready', () => {
        setDuration(ws.getDuration());
      });

      ws.on('audioprocess', () => {
        setCurrentTime(ws.getCurrentTime());
        setProgress((ws.getCurrentTime() / ws.getDuration()) * 100);
      });

      ws.on('finish', () => {
        if (isLooping) {
          ws.play(0);
        } else {
          playNextTrack();
        }
      });

      wavesurfer.current = ws;
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, []);

  // Load current track and check if we need to start from beginning
  useEffect(() => {
    if (wavesurfer.current && currentTrack) {
      // Check if we're loading a different track than before
      const isNewTrack = prevTrackRef.current?.id !== currentTrack.id;
      prevTrackRef.current = currentTrack;

      wavesurfer.current.load(currentTrack.audio_url);
      wavesurfer.current.on('ready', () => {
        // If it's a new track, always start from the beginning
        if (isNewTrack) {
          wavesurfer.current?.seekTo(0);
        }
        
        if (isPlaying) {
          wavesurfer.current?.play();
        }
      });
    }
  }, [currentTrack]);

  // Handle play/pause
  useEffect(() => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.pause();
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playNextTrack = () => {
    if (tracks.length <= 1) return;

    let nextTrackIndex;
    if (isShuffled) {
      // Random track that's not the current one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks[randomIndex].id === currentTrack.id && tracks.length > 1);
      nextTrackIndex = randomIndex;
    } else {
      // Next track in sequence
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      nextTrackIndex = (currentIndex + 1) % tracks.length;
    }

    onTrackSelect(tracks[nextTrackIndex]);
    setIsPlaying(true);
  };

  const playPreviousTrack = () => {
    if (tracks.length <= 1) return;

    if (wavesurfer.current && wavesurfer.current.getCurrentTime() > 3) {
      // If more than 3 seconds into the song, restart current track
      wavesurfer.current.seekTo(0);
      return;
    }

    let prevTrackIndex;
    if (isShuffled) {
      // Random track that's not the current one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks[randomIndex].id === currentTrack.id && tracks.length > 1);
      prevTrackIndex = randomIndex;
    } else {
      // Previous track in sequence
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      prevTrackIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }

    onTrackSelect(tracks[prevTrackIndex]);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 border-t border-white/10 z-50">
      <div className="max-w-7xl mx-auto flex flex-col">
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
              onClick={toggleShuffle}
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
              onClick={togglePlay}
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
              onClick={toggleLoop}
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
          <div 
            ref={waveformRef} 
            className="w-full bg-gray-800 rounded-lg overflow-hidden h-[40px]"
          />
        </div>
      </div>
    </div>
  );
};
