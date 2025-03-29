import { useState, useEffect } from 'react';
import { useAudio, VisualizationMode } from '@/contexts/AudioContext';
import { WaveformVisualizer } from './WaveformVisualizer';
import { SpectrumVisualizer } from './SpectrumVisualizer';
import { Button } from '@/components/ui/button';
import { Music, Image, Waves, BarChart2 } from 'lucide-react';

interface AudioVisualizerContainerProps {
  height?: number;
  showControls?: boolean;
  className?: string;
}

export const AudioVisualizerContainer = ({
  height = 160,
  showControls = true,
  className = ''
}: AudioVisualizerContainerProps) => {
  const { globalAudioState, setVisualizationMode } = useAudio();
  const { currentTrack, visualization } = globalAudioState;
  const { mode } = visualization;
  
  const [containerHeight, setContainerHeight] = useState(height);
  
  // Adjust container height based on visualization mode
  useEffect(() => {
    switch (mode) {
      case 'waveform':
        setContainerHeight(height);
        break;
      case 'spectrum':
        setContainerHeight(height);
        break;
      case 'artwork':
        setContainerHeight(height * 1.5); // Artwork mode needs more height
        break;
      case 'minimal':
        setContainerHeight(height * 0.5); // Minimal mode needs less height
        break;
    }
  }, [mode, height]);
  
  // Render the appropriate visualizer based on mode
  const renderVisualizer = () => {
    if (!currentTrack) {
      return (
        <div className="flex items-center justify-center h-full bg-black/20 rounded-lg text-gray-400">
          No track selected
        </div>
      );
    }
    
    switch (mode) {
      case 'waveform':
        return (
          <WaveformVisualizer 
            height={containerHeight * 0.8}
            className="my-2"
          />
        );
        
      case 'spectrum':
        return (
          <SpectrumVisualizer 
            height={containerHeight * 0.8}
            className="my-2"
          />
        );
        
      case 'artwork':
        return (
          <div className="flex items-center justify-center h-full bg-black/30 rounded-lg p-4">
            <div className="relative aspect-square h-full max-h-full rounded-lg overflow-hidden shadow-lg">
              <img 
                src={currentTrack.album_artwork_url || '/placeholder.svg'} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                <div className="text-white">
                  <h3 className="text-sm font-medium">{currentTrack.title}</h3>
                  <p className="text-xs text-gray-300">{currentTrack.artist || 'Unknown Artist'}</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'minimal':
      default:
        return (
          <div className="flex items-center justify-between h-full bg-black/20 rounded-lg px-4">
            <div className="text-white">
              <h3 className="text-sm font-medium">{currentTrack.title}</h3>
              <p className="text-xs text-gray-400">{currentTrack.artist || 'Unknown Artist'}</p>
            </div>
            
            <div className="h-8 w-20 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-dreamaker-purple/70 to-dreamaker-purple/90 transition-all duration-300"
                style={{ 
                  width: `${(globalAudioState.playbackState.currentTime / globalAudioState.playbackState.duration) * 100}%` 
                }}
              />
            </div>
          </div>
        );
    }
  };
  
  // Visualization mode toggle buttons
  const renderControls = () => {
    if (!showControls) return null;
    
    return (
      <div className="flex justify-center mt-2 gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-2 text-xs ${mode === 'waveform' ? 'bg-dreamaker-purple/20 text-dreamaker-purple' : 'text-gray-400'}`}
          onClick={() => setVisualizationMode('waveform')}
        >
          <Waves className="h-3 w-3 mr-1" />
          Waveform
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-2 text-xs ${mode === 'spectrum' ? 'bg-dreamaker-purple/20 text-dreamaker-purple' : 'text-gray-400'}`}
          onClick={() => setVisualizationMode('spectrum')}
        >
          <BarChart2 className="h-3 w-3 mr-1" />
          Spectrum
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-2 text-xs ${mode === 'artwork' ? 'bg-dreamaker-purple/20 text-dreamaker-purple' : 'text-gray-400'}`}
          onClick={() => setVisualizationMode('artwork')}
        >
          <Image className="h-3 w-3 mr-1" />
          Artwork
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-2 text-xs ${mode === 'minimal' ? 'bg-dreamaker-purple/20 text-dreamaker-purple' : 'text-gray-400'}`}
          onClick={() => setVisualizationMode('minimal')}
        >
          <Music className="h-3 w-3 mr-1" />
          Minimal
        </Button>
      </div>
    );
  };
  
  return (
    <div className={`${className}`}>
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ height: `${containerHeight}px` }}
      >
        {renderVisualizer()}
      </div>
      {renderControls()}
    </div>
  );
};