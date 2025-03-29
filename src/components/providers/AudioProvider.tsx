import { ReactNode } from 'react';
import { AudioProvider as AudioContextProvider } from '@/contexts/AudioContext';
import { GlobalAudioPlayer } from '@/components/audio/GlobalAudioPlayer';

interface AudioProviderProps {
  children: ReactNode;
}

/**
 * AudioProvider component that provides audio playback functionality throughout the application
 * 
 * This provider:
 * 1. Wraps the application with AudioContext for global state management
 * 2. Renders the GlobalAudioPlayer component for playback controls
 * 3. Handles all audio interaction through a unified API
 */
export const AudioProvider = ({ children }: AudioProviderProps) => {
  return (
    <AudioContextProvider>
      {children}
      <GlobalAudioPlayer />
    </AudioContextProvider>
  );
};