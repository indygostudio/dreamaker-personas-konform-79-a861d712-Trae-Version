# Audio System Documentation

This document provides an overview of the current state of the audio system implementation, including what is fully implemented and what features are only partially implemented or placeholders for future development.

## Core Architecture

The audio system is built around a central `AudioContext` that provides unified audio playback functionality throughout the application. It uses:

- Web Audio API for advanced audio processing and visualization
- HTML5 Audio element for basic playback
- React Context API for state management and component access

## Fully Implemented Features

The following features are fully implemented and ready to use:

- **Basic Playback**: Play, pause, stop, and seek functionality
- **Track Management**: Load tracks, display track information
- **Transport Controls**: Next/previous track navigation
- **Volume Control**: Adjust volume, mute/unmute
- **Visualization**: Waveform and spectrum visualizers
- **UI Components**: Multiple player views (collapsed, expanded, minimized)
- **Playlist Management**: Track queueing, shuffle, and repeat modes

## Partially Implemented Features

These features have UI components and hooks but incomplete implementation:

- **Audio Quality Settings**: UI controls exist, but actual quality switching is not implemented
- **Equalizer**: Framework exists, but EQ bands are not connected to audio processing
- **Playback Speed**: Basic implementation, but not fully tested or optimized

## Usage Guidelines

### Using the Audio Player in Components

```jsx
import { useAudioPlayer } from '@/hooks/use-audio-player';

const MyComponent = () => {
  const { 
    currentTrack,
    isPlaying,
    handlePlayTrack,
    handlePlayPause,
    seek
  } = useAudioPlayer();
  
  // Use these methods to control playback
};
```

### Track Object Structure

```typescript
interface Track {
  id: string;
  title: string;
  artist?: string;
  audio_url: string;
  album_artwork_url?: string;
  duration: number;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  order_index: number;
  playlist_id?: string;
}
```

## Integration with Existing Components

The audio system provides backward compatibility with older components through the `useAudioPlayer` hook, which translates between the unified audio system and legacy component expectations.

The `MusicPlayer` component can continue to be used with its existing API, while the unified audio system functions underneath.

## Future Development

Planned features for future implementation:

1. Full EQ implementation with presets
2. Actual audio quality switching 
3. Audio effects processing (reverb, delay, etc.)
4. Better mobile support for visualizations
5. Offline playback capability

## Debugging

To assist with debugging, all main audio operations are logged to the console with the prefix '[DEBUG]'. When encountering issues, check the browser console for these messages to help identify the root cause.
