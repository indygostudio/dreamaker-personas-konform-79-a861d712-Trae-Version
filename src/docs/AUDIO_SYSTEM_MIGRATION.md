# Unified Audio System Migration Guide

## Overview

This document outlines the new centralized audio system and provides step-by-step instructions for migrating from the current fragmented implementation to the new unified architecture.

## Key Benefits

The new unified audio system provides several advantages:

- **Consistent Audio Experience**: Single audio engine across all contexts
- **Enhanced Visualization Options**: Multiple visualization modes (waveform, spectrum, artwork)
- **Improved Performance**: Shared audio resources minimize memory usage
- **Better Mobile Experience**: Optimized for mobile with responsive interfaces
- **Advanced Features**: EQ, playback speed control, and visualization options
- **Accessibility Improvements**: Full keyboard navigation and screen reader support
- **Buffer Management**: Visual indicators for loading and streaming states
- **Simplified API**: Consistent interface for all audio interactions

## Architecture

The unified audio system follows a centralized architecture:

```
┌─────────────────────────────────────┐
│            AudioProvider            │
│                                     │
│   ┌─────────────────────────────┐   │
│   │        AudioContext         │   │
│   │                             │   │
│   │  ┌─────────┐   ┌─────────┐  │   │
│   │  │ WebAudio│   │  Player │  │   │
│   │  │   API   │◄──┤  State  │  │   │
│   │  └─────────┘   └─────────┘  │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │     GlobalAudioPlayer       │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
            ▲               ▲
            │               │
┌───────────┘               └───────────┐
│                                       │
│                                       │
┌─────────────────┐         ┌──────────────────┐
│ UnifiedMusicPlayer│         │ Visualization    │
│ (Drop-in Replace) │         │ Components       │
└─────────────────┘         └──────────────────┘
```

## Migration Steps

### Step 1: Add the Provider

Wrap your app with the `AudioProvider` to enable global audio state:

```tsx
// In App.tsx or main layout component
import { AudioProvider } from '@/components/providers/AudioProvider';

export default function App() {
  return (
    <AudioProvider>
      {/* Your existing app content */}
    </AudioProvider>
  );
}
```

### Step 2: Choose a Migration Strategy

#### Option A: Direct Replacement (Fastest)

Replace existing `MusicPlayer` components with the drop-in `UnifiedMusicPlayer`:

```tsx
// Before
import { MusicPlayer } from "@/components/persona/profile/MusicPlayer";

// After
import { UnifiedMusicPlayer as MusicPlayer } from "@/components/audio/UnifiedMusicPlayer";
```

This provides immediate compatibility with minimal code changes.

#### Option B: Gradual Migration (Recommended)

1. Start using the `useAudioPlayer` hook in components that need audio functionality:

```tsx
// Before
import { useState } from 'react';

const MyComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // ...
}

// After
import { useAudioPlayer } from '@/hooks/use-audio-player';

const MyComponent = () => {
  const { isPlaying, setIsPlaying, handlePlayTrack } = useAudioPlayer();
  // ...
}
```

2. Refactor components to use the new audio API:

```tsx
// Before
const handlePlay = () => {
  audioRef.current.play();
  setIsPlaying(true);
};

// After
const handlePlay = () => {
  handlePlayTrack(track);
  // setIsPlaying managed automatically
};
```

#### Option C: New Components (Full Redesign)

For new features or major redesigns, use the full capabilities of the new system:

```tsx
import { useAudio } from '@/contexts/AudioContext';
import { AudioVisualizerContainer } from '@/components/audio/visualizers/AudioVisualizerContainer';

const NewAudioFeature = () => {
  const { 
    globalAudioState, 
    play, 
    pause, 
    setVisualizationMode 
  } = useAudio();
  
  // Access to all advanced features
  // ...
  
  return (
    <div>
      <AudioVisualizerContainer height={160} showControls={true} />
      {/* Custom UI using advanced audio features */}
    </div>
  );
};
```

### Step 3: Update Audio Interactions

Replace direct audio element manipulation with the unified API:

| Old Way | New Way |
|---------|---------|
| `audioRef.current.play()` | `play(track)` or `handlePlayTrack(track)` |
| `audioRef.current.pause()` | `pause()` or `setIsPlaying(false)` |
| `audioRef.current.currentTime = time` | `seek(time)` |
| Manual playlist management | `setPlaylist(tracks, currentIndex)` |

### Step 4: Enhanced Features Integration

Add new capabilities that weren't available before:

```tsx
// Visualization switching
const { setVisualizationMode } = useAudio();
setVisualizationMode('spectrum'); // Options: 'waveform', 'spectrum', 'artwork', 'minimal'

// Playback rate control
const { setPlaybackRate } = useAudio();
setPlaybackRate(1.5); // Values from 0.5 to 2.0

// Audio quality control (if multiple sources available)
const { setQuality } = useAudio();
setQuality('high'); // Options: 'low', 'medium', 'high', 'lossless'
```

## Component References

### Core Components

- **AudioProvider**: Top-level provider component
- **GlobalAudioPlayer**: Persistent audio player that appears when audio is playing
- **UnifiedMusicPlayer**: Drop-in replacement for existing MusicPlayer components

### Visualization Components

- **WaveformVisualizer**: Displays audio as a waveform
- **SpectrumVisualizer**: Displays audio frequency spectrum
- **AudioVisualizerContainer**: Container that manages different visualization modes

### Hooks

- **useAudio**: Primary hook for direct audio control
- **useAudioPlayer**: Compatibility hook that matches existing API patterns

## Examples

### Basic Usage

```tsx
import { useAudioPlayer } from '@/hooks/use-audio-player';

const AudioButton = ({ track }) => {
  const { handlePlayTrack, isPlaying, currentTrack } = useAudioPlayer();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  
  return (
    <button 
      onClick={() => handlePlayTrack(track)}
      className="play-button"
    >
      {isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
    </button>
  );
};
```

### Advanced Usage

```tsx
import { useAudio } from '@/contexts/AudioContext';
import { WaveformVisualizer } from '@/components/audio/visualizers/WaveformVisualizer';

const EnhancedTrackPlayer = ({ track }) => {
  const { 
    play, 
    pause, 
    seek, 
    globalAudioState,
    setVisualizationMode
  } = useAudio();
  
  const { 
    playbackState, 
    currentTrack 
  } = globalAudioState;
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlaying = playbackState.status === 'playing' && isCurrentTrack;
  
  return (
    <div className="track-player">
      <h3>{track.title}</h3>
      
      <WaveformVisualizer 
        height={80} 
        barWidth={3}
        className="my-3" 
      />
      
      <div className="controls">
        <button onClick={() => isPlaying ? pause() : play(track)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button onClick={() => setVisualizationMode('spectrum')}>
          Show Spectrum
        </button>
      </div>
    </div>
  );
};
```

## Troubleshooting

### Common Issues

1. **Multiple audio sources playing simultaneously**
   - Make sure all audio is routed through the unified system
   - Verify that old audio references are removed

2. **Visualizations not appearing**
   - Check that the audio URL is accessible
   - Ensure the container has a defined height

3. **Performance issues on mobile**
   - Switch to 'minimal' visualization mode on low-powered devices
   - Use the AudioVisualizerContainer which handles responsiveness

### Getting Help

If you encounter issues during migration, please consult the codebase documentation or reach out to the development team.

## Next Steps

- Review existing usages of audio components
- Start with the simplest components to migrate
- Test thoroughly on mobile devices
- Take advantage of new visualization options