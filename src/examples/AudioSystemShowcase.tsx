import { useState } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { WaveformVisualizer } from "@/components/audio/visualizers/WaveformVisualizer";
import { SpectrumVisualizer } from "@/components/audio/visualizers/SpectrumVisualizer";
import { AudioVisualizerContainer } from "@/components/audio/visualizers/AudioVisualizerContainer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Settings
} from "lucide-react";

/**
 * AudioSystemShowcase - A demonstration of all features of the unified audio system
 * 
 * This example showcases:
 * - Different visualization modes
 * - Audio control capabilities
 * - Playlist management
 * - Advanced features like EQ and playback speed
 */
export const AudioSystemShowcase = () => {
  const [activeTab, setActiveTab] = useState("waveform");
  
  // Use both the core audio context and the compatibility hook
  const { 
    globalAudioState,
    setVisualizationMode,
    setPlaybackRate
  } = useAudio();
  
  const {
    currentTrack,
    isPlaying,
    isShuffled,
    isLooping,
    progress,
    volume,
    isMuted,
    handlePlayTrack,
    setIsPlaying,
    setIsShuffled,
    setIsLooping,
    setVolume,
    toggleMute,
    seek,
    next,
    previous
  } = useAudioPlayer();
  
  // Sample tracks for demonstration
  const sampleTracks = [
    {
      id: "track1",
      title: "Cosmic Horizons",
      artist: "Dreamaker AI",
      audio_url: "https://audio-samples.github.io/samples/mp3/blizzard_primed.mp3",
      album_artwork_url: "/lovable-uploads/7c4edcb9-c964-4db6-9f1a-3e689edff38f.png",
      duration: 180,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: true,
      order_index: 0,
      playlist_id: "demo-playlist"
    },
    {
      id: "track2",
      title: "Neural Symphony",
      artist: "AI Composer",
      audio_url: "https://audio-samples.github.io/samples/mp3/blizzard_magical_timed.mp3",
      album_artwork_url: "/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png",
      duration: 210,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: true,
      order_index: 1,
      playlist_id: "demo-playlist"
    }
  ];
  
  // Helper for formatting time
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Update visualization mode based on active tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVisualizationMode(value as any);
  };
  
  // Handle playback speed change
  const handlePlaybackRateChange = (value: number[]) => {
    setPlaybackRate(value[0]);
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-black/70 rounded-xl border border-dreamaker-purple/20">
      <h1 className="text-3xl font-bold text-white mb-6">Unified Audio System Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-black/40 border-dreamaker-purple/20">
          <CardHeader>
            <CardTitle>Current Track</CardTitle>
            <CardDescription>
              {currentTrack?.title || "No track selected"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={currentTrack?.album_artwork_url || "/placeholder.svg"} 
                  alt={currentTrack?.title || "No track"} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white">
                  {currentTrack?.title || "Select a track to play"}
                </h3>
                <p className="text-gray-400">
                  {currentTrack?.artist || "Artist"}
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => previous()}
                    disabled={!currentTrack}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={!currentTrack}
                  >
                    {isPlaying ? 
                      <Pause className="h-5 w-5" /> : 
                      <Play className="h-5 w-5" />
                    }
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => next()}
                    disabled={!currentTrack}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {currentTrack && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatTime(globalAudioState.playbackState.currentTime)}</span>
                  <span>{formatTime(globalAudioState.playbackState.duration)}</span>
                </div>
                
                <Slider
                  value={[progress]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={(value) => {
                    const time = (value[0] / 100) * globalAudioState.playbackState.duration;
                    seek(time);
                  }}
                  className="cursor-pointer"
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-dreamaker-purple/20">
          <CardHeader>
            <CardTitle>Sample Tracks</CardTitle>
            <CardDescription>
              Click on a track to play it
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              {sampleTracks.map((track) => (
                <div 
                  key={track.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-dreamaker-purple/10 transition-colors ${
                    currentTrack?.id === track.id ? 'bg-dreamaker-purple/20' : ''
                  }`}
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden">
                    <img 
                      src={track.album_artwork_url || "/placeholder.svg"} 
                      alt={track.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{track.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  </div>
                  
                  <span className="text-xs text-gray-400">{formatTime(track.duration)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${isShuffled ? 'text-dreamaker-purple' : 'text-gray-400'}`}
                  onClick={() => setIsShuffled(!isShuffled)}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${isLooping ? 'text-dreamaker-purple' : 'text-gray-400'}`}
                  onClick={() => setIsLooping(!isLooping)}
                >
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setVolume(value[0])}
                  className="w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold text-white mb-4">Visualization Modes</h2>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="waveform">Waveform</TabsTrigger>
          <TabsTrigger value="spectrum">Spectrum</TabsTrigger>
          <TabsTrigger value="artwork">Artwork</TabsTrigger>
          <TabsTrigger value="minimal">Minimal</TabsTrigger>
        </TabsList>
        
        <div className="bg-black/30 rounded-lg border border-dreamaker-purple/10 overflow-hidden">
          <AudioVisualizerContainer height={180} showControls={false} />
        </div>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Advanced Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-dreamaker-purple/20">
            <CardHeader>
              <CardTitle>Playback Speed</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">0.5x</span>
                <Slider
                  value={[globalAudioState.playbackState.playbackRate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={handlePlaybackRateChange}
                  className="flex-1"
                />
                <span className="text-sm text-gray-400">2.0x</span>
              </div>
              <p className="text-center text-sm text-dreamaker-purple mt-2">
                {globalAudioState.playbackState.playbackRate.toFixed(1)}x
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-dreamaker-purple/20">
            <CardHeader>
              <CardTitle>Audio Quality</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {['low', 'medium', 'high', 'lossless'].map((quality) => (
                  <Button
                    key={quality}
                    variant="outline"
                    size="sm"
                    className={`${
                      globalAudioState.quality === quality 
                        ? 'bg-dreamaker-purple/20 border-dreamaker-purple/50' 
                        : ''
                    }`}
                    onClick={() => {
                      // This would be implemented in a real app
                      console.log(`Setting quality to ${quality}`);
                    }}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>This demo showcases the new unified audio system.</p>
        <p>See the documentation for integration details.</p>
      </div>
    </div>
  );
};