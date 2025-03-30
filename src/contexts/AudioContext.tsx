import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback
} from 'react';
import type { Track } from '@/types/track';

// Visualization modes
export type VisualizationMode = 'waveform' | 'spectrum' | 'minimal' | 'artwork';

// Audio quality settings
export type AudioQuality = 'low' | 'medium' | 'high' | 'lossless';

// Playback states
export type PlaybackState = 'playing' | 'paused' | 'loading' | 'error' | 'ended';

// Audio processors for effects
export interface AudioProcessors {
  gainNode?: GainNode;
  analyserNode?: AnalyserNode;
  equalizerNodes?: BiquadFilterNode[];
  compressorNode?: DynamicsCompressorNode;
}

// Global audio state
export interface GlobalAudioState {
  currentTrack: Track | null;
  playbackState: {
    status: PlaybackState;
    isBuffering: boolean;
    bufferProgress: number;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    playbackRate: number;
  };
  playlist: {
    tracks: Track[];
    currentIndex: number;
    isShuffled: boolean;
    repeatMode: 'none' | 'track' | 'playlist';
  };
  visualization: {
    mode: VisualizationMode;
    fftSize: number;
    showProgress: boolean;
  };
  quality: AudioQuality;
}

// Define the context shape
interface AudioContextType {
  // Audio state
  globalAudioState: GlobalAudioState;
  
  // Audio processing
  audioContext: AudioContext | null;
  audioElement: HTMLAudioElement | null;
  processors: AudioProcessors;
  
  // Control methods
  play: (track?: Track) => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  next: () => void;
  previous: () => void;
  
  // Settings and configuration
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (quality: AudioQuality) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  
  // Playlist management
  setPlaylist: (tracks: Track[], startIndex?: number, autoPlay?: boolean) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
  clearPlaylist: () => void;
  shufflePlaylist: (enable: boolean) => void;
  setRepeatMode: (mode: 'none' | 'track' | 'playlist') => void;
  
  // Waveform data access for visualization components
  getWaveformData: () => Float32Array | null;
  getFrequencyData: () => Uint8Array | null;
  
  // Utility methods
  formatTime: (time: number) => string;
  calculateProgress: () => number;
  isTrackActive: (trackId: string) => boolean;
}

// Create the context with initial undefined value
export const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Hook for using the audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Initial state
const initialAudioState: GlobalAudioState = {
  currentTrack: null,
  playbackState: {
    status: 'paused',
    isBuffering: false,
    bufferProgress: 0,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playbackRate: 1.0
  },
  playlist: {
    tracks: [],
    currentIndex: -1,
    isShuffled: false,
    repeatMode: 'none'
  },
  visualization: {
    mode: 'waveform',
    fftSize: 2048,
    showProgress: true
  },
  quality: 'high'
};

// Provider props
interface AudioProviderProps {
  children: ReactNode;
}

// Audio Provider component
export const AudioProvider = ({ children }: AudioProviderProps) => {
  // Main state
  const [state, setState] = useState<GlobalAudioState>(initialAudioState);
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const processorNodesRef = useRef<AudioProcessors>({});
  const analyserDataRef = useRef<{ frequency: Uint8Array | null, waveform: Float32Array | null }>({
    frequency: null,
    waveform: null
  });
  
  // Initialize audio system
  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = state.playbackState.volume;
    audioElementRef.current = audio;
    
    // Set up event listeners
    const setupAudioEvents = () => {
      if (!audio) return;
      
      // Time update
      audio.addEventListener('timeupdate', () => {
        setState(current => ({
          ...current,
          playbackState: {
            ...current.playbackState,
            currentTime: audio.currentTime
          }
        }));
      });
      
      // Duration change
      audio.addEventListener('durationchange', () => {
        setState(current => ({
          ...current,
          playbackState: {
            ...current.playbackState,
            duration: audio.duration
          }
        }));
      });
      
      // Play state changes
      audio.addEventListener('play', () => {
        setState(current => ({
          ...current,
          playbackState: {
            ...current.playbackState,
            status: 'playing'
          }
        }));
      });
      
      audio.addEventListener('pause', () => {
        setState(current => ({
          ...current,
          playbackState: {
            ...current.playbackState,
            status: 'paused'
          }
        }));
      });
      
      // Buffering
      audio.addEventListener('waiting', () => {
        setState(current => ({
          ...current,
          playbackState: {
            ...current.playbackState,
            isBuffering: true
          }
        }));
      });
      
      audio.addEventListener('canplay', () => {
        setState(current => ({
          ...current,
          playbackState: {
            ...current.playbackState,
            isBuffering: false
          }
        }));
      });
      
      // Track end
      audio.addEventListener('ended', handleTrackEnded);
      
      // Errors
      audio.addEventListener('error', () => {
        setState(current => ({
          ...current,
          playbackState: {
            ...current.playbackState,
            status: 'error'
          }
        }));
      });
      
      // Buffer progress
      audio.addEventListener('progress', () => {
        if (audio.buffered.length > 0 && audio.duration > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          const bufferProgress = bufferedEnd / audio.duration;
          
          setState(current => ({
            ...current,
            playbackState: {
              ...current.playbackState,
              bufferProgress
            }
          }));
        }
      });
    };
    
    setupAudioEvents();
    
    // Initialize Web Audio API (requires user interaction)
    const initWebAudio = () => {
      try {
        console.log('Initializing Web Audio API');
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContextClass();
        audioContextRef.current = context;
        
        // Log the initial state of the audio context
        console.log('AudioContext initial state:', context.state);
        
        // Attempt to resume the context immediately
        if (context.state === 'suspended') {
          console.log('Attempting to resume AudioContext');
          context.resume().then(() => {
            console.log('AudioContext resumed successfully');
          }).catch(err => {
            console.error('Failed to resume AudioContext:', err);
          });
        }
        
        // Create source from audio element
        if (audioElementRef.current) {
          console.log('Creating media element source');
          const source = context.createMediaElementSource(audioElementRef.current);
          
          // Create analyzer
          const analyser = context.createAnalyser();
          analyser.fftSize = state.visualization.fftSize;
          
          // Create gain node
          const gainNode = context.createGain();
          gainNode.gain.value = state.playbackState.volume;
          
          // Connect nodes
          source.connect(analyser);
          analyser.connect(gainNode);
          gainNode.connect(context.destination);
          
          // Store nodes
          processorNodesRef.current = {
            analyserNode: analyser,
            gainNode
          };
          
          // Create analyzer data arrays
          analyserDataRef.current = {
            frequency: new Uint8Array(analyser.frequencyBinCount),
            waveform: new Float32Array(analyser.frequencyBinCount)
          };
          
          // Start analyzer update loop
          updateAnalyzerData();
          console.log('Audio processing chain initialized successfully');
        } else {
          console.error('Audio element not available for source creation');
        }
      } catch (error) {
        console.error('Failed to initialize Web Audio API:', error);
      }
    };
    
    // Wait for user interaction to initialize Web Audio
    const handleUserInteraction = () => {
      if (!audioContextRef.current) {
        initWebAudio();
      }
      
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    // Cleanup on unmount
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        
        // Remove event listeners
        audioElementRef.current.removeEventListener('timeupdate', () => {});
        audioElementRef.current.removeEventListener('durationchange', () => {});
        audioElementRef.current.removeEventListener('play', () => {});
        audioElementRef.current.removeEventListener('pause', () => {});
        audioElementRef.current.removeEventListener('waiting', () => {});
        audioElementRef.current.removeEventListener('canplay', () => {});
        audioElementRef.current.removeEventListener('ended', handleTrackEnded);
        audioElementRef.current.removeEventListener('error', () => {});
        audioElementRef.current.removeEventListener('progress', () => {});
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);
  
  // Update analyzer data
  const updateAnalyzerData = useCallback(() => {
    const analyser = processorNodesRef.current.analyserNode;
    if (!analyser || !analyserDataRef.current.frequency || !analyserDataRef.current.waveform) return;
    
    const updateData = () => {
      if (analyser && analyserDataRef.current.frequency && analyserDataRef.current.waveform) {
        // Get frequency data
        analyser.getByteFrequencyData(analyserDataRef.current.frequency);
        
        // Get waveform data
        analyser.getFloatTimeDomainData(analyserDataRef.current.waveform);
      }
      
      requestAnimationFrame(updateData);
    };
    
    updateData();
  }, []);
  
  // Handle track ended
  const handleTrackEnded = useCallback(() => {
    const { repeatMode } = state.playlist;
    
    switch (repeatMode) {
      case 'track':
        // Repeat current track
        if (audioElementRef.current) {
          audioElementRef.current.currentTime = 0;
          audioElementRef.current.play().catch(console.error);
        }
        break;
        
      case 'playlist':
        // Move to next track, or loop back to first
        handleNext();
        break;
        
      case 'none':
      default:
        // Move to next if available
        if (state.playlist.currentIndex < state.playlist.tracks.length - 1) {
          handleNext();
        }
        break;
    }
  }, [state.playlist]);
  
  // Play method
  const play = useCallback(async (track?: Track) => {
    console.log('[DEBUG] AudioContext play method called', {
      trackProvided: !!track,
      trackDetails: track ? {
        id: track.id,
        title: track.title,
        url: track.audio_url,
        personaId: track.persona_id
      } : 'none',
      hasAudioElement: !!audioElementRef.current,
      audioContextState: audioContextRef.current?.state || 'none'
    });
    
    // Resume audio context if suspended
    if (audioContextRef.current?.state === 'suspended') {
      console.log('[DEBUG] Resuming suspended audio context');
      try {
        await audioContextRef.current.resume();
        console.log('[DEBUG] Audio context resumed successfully');
      } catch (err) {
        console.error('[DEBUG] Failed to resume audio context:', err);
      }
    }
    
    if (!audioElementRef.current) {
      console.error('[DEBUG] No audio element ref found, cannot play');
      return;
    }
    
    // If track provided, load and play it
    if (track) {
      console.log('[DEBUG] Setting up new track for playback');
      
      // Validate that the audio URL is accessible
      try {
        const response = await fetch(track.audio_url, { method: 'HEAD' });
        console.log('[DEBUG] Audio URL validation result:', {
          url: track.audio_url,
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        });
        
        if (!response.ok) {
          console.error('[DEBUG] Audio URL is not accessible:', response.status);
          return;
        }
      } catch (err) {
        console.error('[DEBUG] Error validating audio URL:', err);
      }
      
      setState(current => ({
        ...current,
        currentTrack: track,
        playbackState: {
          ...current.playbackState,
          status: 'loading',
          isBuffering: true,
          currentTime: 0
        }
      }));
      
      // Find track in playlist
      const trackIndex = state.playlist.tracks.findIndex(t => t.id === track.id);
      console.log('[DEBUG] Track index in playlist:', trackIndex);
      if (trackIndex !== -1) {
        setState(current => ({
          ...current,
          playlist: {
            ...current.playlist,
            currentIndex: trackIndex
          }
        }));
      }
      
      try {
        console.log('[DEBUG] Setting audio source and loading', {
          url: track.audio_url,
          audioElementReadyState: audioElementRef.current.readyState
        });
        
        audioElementRef.current.src = track.audio_url;
        
        // Add one-time event listeners for better debugging
        const onCanPlay = () => {
          console.log('[DEBUG] Audio canplay event fired');
          audioElementRef.current?.removeEventListener('canplay', onCanPlay);
        };
        
        const onLoadedData = () => {
          console.log('[DEBUG] Audio loadeddata event fired');
          audioElementRef.current?.removeEventListener('loadeddata', onLoadedData);
        };
        
        const onError = (e: Event) => {
          console.error('[DEBUG] Audio error during load:', audioElementRef.current?.error);
          audioElementRef.current?.removeEventListener('error', onError);
        };
        
        audioElementRef.current.addEventListener('canplay', onCanPlay);
        audioElementRef.current.addEventListener('loadeddata', onLoadedData);
        audioElementRef.current.addEventListener('error', onError);
        
        audioElementRef.current.load();
        console.log('[DEBUG] Audio load() called');
        
        console.log('[DEBUG] Attempting to play audio');
        const playPromise = audioElementRef.current.play();
        await playPromise;
        console.log('[DEBUG] Play successful');
      } catch (error) {
        console.error('[DEBUG] Failed to play track:', error);
        // Try one more time with a delay
        try {
          console.log('[DEBUG] Retrying playback after error');
          await new Promise(resolve => setTimeout(resolve, 500));
          await audioElementRef.current.play();
          console.log('[DEBUG] Retry successful');
        } catch (retryError) {
          console.error('[DEBUG] Retry also failed:', retryError);
          
          setState(current => ({
            ...current,
            playbackState: {
              ...current.playbackState,
              status: 'error'
            }
          }));
        }
      }
    }
    // Otherwise resume current track
    else if (state.currentTrack) {
      console.log('[DEBUG] Resuming existing track', {
        currentTrack: state.currentTrack?.title,
        audioElementPaused: audioElementRef.current.paused,
        audioElementReadyState: audioElementRef.current.readyState
      });
      
      try {
        const playPromise = audioElementRef.current.play();
        await playPromise;
        console.log('[DEBUG] Resume successful');
      } catch (error) {
        console.error('[DEBUG] Failed to resume playback:', error);
        
        // Check if this is an autoplay policy error
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          console.log('[DEBUG] Detected autoplay policy restriction, trying with user interaction');
          
          // We need user interaction - update the UI to show this
          setState(current => ({
            ...current,
            playbackState: {
              ...current.playbackState,
              status: 'paused'
            }
          }));
        }
      }
    }
  }, [state.currentTrack, state.playlist]);
  
  // Pause playback
  const pause = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  }, []);
  
  // Stop playback
  const stop = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
  }, []);
  
  // Seek to time
  const seek = useCallback((time: number) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = time;
    }
  }, []);
  
  // Play next track
  const handleNext = useCallback(() => {
    const { tracks, currentIndex, isShuffled } = state.playlist;
    
    if (!tracks.length) return;
    
    let nextIndex: number;
    
    if (isShuffled) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentIndex && tracks.length > 1);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    
    play(tracks[nextIndex]);
  }, [state.playlist, play]);
  
  // Play previous track
  const handlePrevious = useCallback(() => {
    const { tracks, currentIndex, isShuffled } = state.playlist;
    
    if (!tracks.length) return;
    
    // If current time > 3 seconds, restart current track
    if (audioElementRef.current && audioElementRef.current.currentTime > 3) {
      audioElementRef.current.currentTime = 0;
      return;
    }
    
    let prevIndex: number;
    
    if (isShuffled) {
      do {
        prevIndex = Math.floor(Math.random() * tracks.length);
      } while (prevIndex === currentIndex && tracks.length > 1);
    } else {
      prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }
    
    play(tracks[prevIndex]);
  }, [state.playlist, play]);
  
  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (volume < 0 || volume > 1) return;
    
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume;
    }
    
    if (processorNodesRef.current.gainNode) {
      processorNodesRef.current.gainNode.gain.value = volume;
    }
    
    setState(current => ({
      ...current,
      playbackState: {
        ...current.playbackState,
        volume,
        isMuted: volume === 0
      }
    }));
  }, []);
  
  // Set muted
  const setMuted = useCallback((muted: boolean) => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = muted;
    }
    
    setState(current => ({
      ...current,
      playbackState: {
        ...current.playbackState,
        isMuted: muted
      }
    }));
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setMuted(!state.playbackState.isMuted);
  }, [state.playbackState.isMuted, setMuted]);
  
  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    if (rate < 0.5 || rate > 2) return;
    
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = rate;
    }
    
    setState(current => ({
      ...current,
      playbackState: {
        ...current.playbackState,
        playbackRate: rate
      }
    }));
  }, []);
  
  // Set quality
  const setQuality = useCallback((quality: AudioQuality) => {
    setState(current => ({
      ...current,
      quality
    }));
  }, []);
  
  // Set visualization mode
  const setVisualizationMode = useCallback((mode: VisualizationMode) => {
    setState(current => ({
      ...current,
      visualization: {
        ...current.visualization,
        mode
      }
    }));
  }, []);
  
  // Set playlist
  const setPlaylist = useCallback((tracks: Track[], startIndex = 0, autoPlay = false) => {
    setState(current => ({
      ...current,
      playlist: {
        ...current.playlist,
        tracks,
        currentIndex: startIndex >= 0 && startIndex < tracks.length ? startIndex : 0
      }
    }));
    
    if (autoPlay && tracks.length > 0) {
      const trackToPlay = tracks[startIndex >= 0 && startIndex < tracks.length ? startIndex : 0];
      play(trackToPlay);
    }
  }, [play]);
  
  // Add to playlist
  const addToPlaylist = useCallback((track: Track) => {
    setState(current => ({
      ...current,
      playlist: {
        ...current.playlist,
        tracks: [...current.playlist.tracks, track]
      }
    }));
  }, []);
  
  // Remove from playlist
  const removeFromPlaylist = useCallback((trackId: string) => {
    setState(current => {
      const newTracks = current.playlist.tracks.filter(t => t.id !== trackId);
      let newIndex = current.playlist.currentIndex;
      
      // Adjust current index if needed
      if (current.currentTrack?.id === trackId) {
        newIndex = -1;
      } else if (newIndex >= newTracks.length) {
        newIndex = newTracks.length - 1;
      }
      
      return {
        ...current,
        playlist: {
          ...current.playlist,
          tracks: newTracks,
          currentIndex: newIndex
        },
        // Clear current track if it was removed
        currentTrack: current.currentTrack?.id === trackId ? null : current.currentTrack
      };
    });
  }, []);
  
  // Clear playlist
  const clearPlaylist = useCallback(() => {
    setState(current => ({
      ...current,
      playlist: {
        ...current.playlist,
        tracks: [],
        currentIndex: -1
      },
      currentTrack: null
    }));
    
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
  }, []);
  
  // Toggle shuffle
  const shufflePlaylist = useCallback((enable: boolean) => {
    setState(current => ({
      ...current,
      playlist: {
        ...current.playlist,
        isShuffled: enable
      }
    }));
  }, []);
  
  // Set repeat mode
  const setRepeatMode = useCallback((mode: 'none' | 'track' | 'playlist') => {
    setState(current => ({
      ...current,
      playlist: {
        ...current.playlist,
        repeatMode: mode
      }
    }));
  }, []);
  
  // Get waveform data
  const getWaveformData = useCallback((): Float32Array | null => {
    return analyserDataRef.current.waveform;
  }, []);
  
  // Get frequency data
  const getFrequencyData = useCallback((): Uint8Array | null => {
    return analyserDataRef.current.frequency;
  }, []);
  
  // Format time helper
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Calculate progress percentage
  const calculateProgress = useCallback((): number => {
    const { currentTime, duration } = state.playbackState;
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [state.playbackState]);
  
  // Check if track is active
  const isTrackActive = useCallback((trackId: string): boolean => {
    return state.currentTrack?.id === trackId;
  }, [state.currentTrack]);
  
  // Context value
  const value: AudioContextType = {
    globalAudioState: state,
    audioContext: audioContextRef.current,
    audioElement: audioElementRef.current,
    processors: processorNodesRef.current,
    play,
    pause,
    stop,
    seek,
    next: handleNext,
    previous: handlePrevious,
    setVolume,
    setMuted,
    toggleMute,
    setPlaybackRate,
    setQuality,
    setVisualizationMode,
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    shufflePlaylist,
    setRepeatMode,
    getWaveformData,
    getFrequencyData,
    formatTime,
    calculateProgress,
    isTrackActive
  };
  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
