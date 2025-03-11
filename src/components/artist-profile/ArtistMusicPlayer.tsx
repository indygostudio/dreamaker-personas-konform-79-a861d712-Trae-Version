
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

interface ArtistMusicPlayerProps {
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

export const ArtistMusicPlayer = ({
  currentTrack,
  tracks,
  isPlaying,
  isShuffled,
  isLooping,
  setIsPlaying,
  setIsShuffled,
  setIsLooping,
  onTrackSelect
}: ArtistMusicPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevTrackRef = useRef<Track | null>(null);
  
  // Monitor for track changes and reset position
  useEffect(() => {
    const isNewTrack = prevTrackRef.current?.id !== currentTrack.id;
    prevTrackRef.current = currentTrack;
    
    if (audioRef.current) {
      // If it's a new track, always start from the beginning
      if (isNewTrack) {
        audioRef.current.currentTime = 0;
      }
      
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNextTrack();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isLooping]);

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
  };

  const playPreviousTrack = () => {
    if (tracks.length <= 1) return;

    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If more than 3 seconds into the song, restart current track
      audioRef.current.currentTime = 0;
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
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(clickPosition * 100);
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

        <div 
          className="h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-dreamaker-purple"
            style={{ width: `${progress}%` }}
          />
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.audio_url}
          preload="metadata"
        />
      </div>
    </div>
  );
};
