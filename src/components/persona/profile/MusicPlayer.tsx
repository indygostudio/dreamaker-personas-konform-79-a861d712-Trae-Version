import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  X
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
  onClose?: () => void; // New prop for closing the player
  trimStart?: number; // Start time in seconds for trimmed playback
  trimEnd?: number; // End time in seconds for trimmed playback
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
  onTrackSelect,
  onClose
}: MusicPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const prevTrackRef = useRef<Track | null>(null);
  const playAttemptTimeoutRef = useRef<number | null>(null);

  // Initialize WaveSurfer with error handling
  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      try {
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
          setHasError(false); // Reset error state on successful load
        });

        ws.on('audioprocess', () => {
          if (ws) {
            setCurrentTime(ws.getCurrentTime());
            const calculatedProgress = (ws.getCurrentTime() / ws.getDuration()) * 100;
            if (!isNaN(calculatedProgress)) {
              setProgress(calculatedProgress);
            }
          }
        });

        ws.on('finish', () => {
          if (isLooping) {
            try {
              ws.play(0);
            } catch (err) {
              console.error('Error looping track:', err);
              setTimeout(() => {
                try { ws.play(0); } catch (e) {} // One more try after timeout
              }, 300);
            }
          } else {
            playNextTrack();
          }
        });

        // Handle errors gracefully
        ws.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          setHasError(true);
          
          // Try to recover playback
          if (isPlaying) {
            setTimeout(() => {
              try {
                ws.play();
              } catch (e) {
                console.error('Failed to recover playback:', e);
              }
            }, 500);
          }
        });

        wavesurfer.current = ws;
      } catch (err) {
        console.error('Failed to initialize WaveSurfer:', err);
        setHasError(true);
      }
    }

    return () => {
      // Cleanup
      if (playAttemptTimeoutRef.current) {
        clearTimeout(playAttemptTimeoutRef.current);
      }
      
      if (wavesurfer.current) {
        try {
          wavesurfer.current.pause();
          wavesurfer.current.destroy();
        } catch (err) {
          console.error('Error during wavesurfer cleanup:', err);
        }
        wavesurfer.current = null;
      }
    };
  }, []);

  // Load current track with robust error handling
  useEffect(() => {
    if (!wavesurfer.current || !currentTrack?.audio_url) return;
    
    try {
      // Check if we're loading a different track
      const isNewTrack = prevTrackRef.current?.id !== currentTrack.id;
      prevTrackRef.current = currentTrack;

      // Set up error recovery
      const readyTimeout = setTimeout(() => {
        console.warn('WaveSurfer ready event timed out - attempting recovery');
        if (wavesurfer.current && isPlaying) {
          try {
            wavesurfer.current.seekTo(0);
            wavesurfer.current.play();
          } catch (e) {
            console.error('Recovery playback failed:', e);
            setHasError(true);
          }
        }
      }, 5000); // 5 second timeout
      
      // Handler for when track is ready
      const readyHandler = () => {
        clearTimeout(readyTimeout);
        if (!wavesurfer.current) return;
        
        try {
          // If new track, start from beginning
          if (isNewTrack) {
            wavesurfer.current.seekTo(0);
          }
          
          if (isPlaying) {
            wavesurfer.current.play();
          }
          
          setHasError(false);
        } catch (e) {
          console.error('Error in ready handler:', e);
          setHasError(true);
        }
      };
      
      // Clean up before setting new handler
      const currentWs = wavesurfer.current;
      currentWs.once('ready', readyHandler);
      
      // Load the track
      try {
        setHasError(false);
        currentWs.load(currentTrack.audio_url);
      } catch (err) {
        console.error('Error loading audio:', err);
        clearTimeout(readyTimeout);
        setHasError(true);
        
        // If wavesurfer fails, try recreating it
        if (waveformRef.current && currentWs) {
          try {
            currentWs.destroy();
            wavesurfer.current = null;
            
            // Force a re-render to trigger initialization
            setProgress(0);
            setCurrentTime(0);
            setDuration(0);
          } catch (e) {
            console.error('Error destroying wavesurfer:', e);
          }
        }
      }
      
      return () => {
        clearTimeout(readyTimeout);
      };
    } catch (err) {
      console.error('Critical error in track loading:', err);
      setHasError(true);
    }
  }, [currentTrack, isPlaying]);

  // Handle play/pause with robust error handling
  useEffect(() => {
    if (!wavesurfer.current) return;
    
    // Clear any pending play attempts
    if (playAttemptTimeoutRef.current) {
      clearTimeout(playAttemptTimeoutRef.current);
      playAttemptTimeoutRef.current = null;
    }
    
    try {
      if (isPlaying) {
        // Attempt to play with retry mechanism
        const playWithRetry = async (attempts = 3) => {
          try {
            // Check if wavesurfer is ready
            let isReady = false;
            try {
              const duration = wavesurfer.current?.getDuration();
              isReady = !isNaN(duration) && duration > 0;
            } catch (e) {
              isReady = false;
            }
            
            if (wavesurfer.current && isReady) {
              wavesurfer.current.play();
              setHasError(false);
            } else if (attempts > 0) {
              // If not ready, wait and retry
              console.log(`Wavesurfer not ready, retrying in 500ms... (${attempts} attempts left)`);
              playAttemptTimeoutRef.current = window.setTimeout(() => {
                playWithRetry(attempts - 1);
              }, 500);
            } else {
              // Last resort: reload the track
              console.log('Playback failed after retries, reloading track...');
              if (currentTrack?.audio_url && wavesurfer.current) {
                try {
                  wavesurfer.current.load(currentTrack.audio_url);
                  // The 'ready' event handler will handle playback
                } catch (loadErr) {
                  console.error('Failed to reload track:', loadErr);
                  setHasError(true);
                }
              }
            }
          } catch (err) {
            console.error('Error during play attempt:', err);
            if (attempts > 0) {
              playAttemptTimeoutRef.current = window.setTimeout(() => {
                playWithRetry(attempts - 1);
              }, 500);
            } else {
              setHasError(true);
            }
          }
        };
        
        playWithRetry();
      } else {
        // Pause is usually more reliable
        try {
          wavesurfer.current.pause();
        } catch (err) {
          console.error('Error pausing audio:', err);
        }
      }
    } catch (err) {
      console.error('Critical error in play/pause handling:', err);
      setHasError(true);
    }
  }, [isPlaying, currentTrack]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playNextTrack = () => {
    if (!tracks || tracks.length <= 1) return;

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
    if (!tracks || tracks.length <= 1) return;

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
      <div className="max-w-7xl mx-auto flex flex-col relative">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsPlaying(false);
              onClose();
            }}
            className="absolute top-0 right-0 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {hasError && (
          <div className="bg-red-900/50 text-red-200 text-xs px-3 py-1 rounded mb-2 flex items-center justify-between">
            <span>There was an issue playing this track. Please try again or select another track.</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                // Try to reload the track
                if (currentTrack && wavesurfer.current) {
                  try {
                    wavesurfer.current.load(currentTrack.audio_url);
                    setHasError(false);
                  } catch (e) {}
                }
              }}
              className="text-xs text-red-200 hover:text-white"
            >
              Retry
            </Button>
          </div>
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
