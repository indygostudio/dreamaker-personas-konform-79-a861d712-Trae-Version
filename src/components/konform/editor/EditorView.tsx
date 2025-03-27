import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TrackEditor } from "./TrackEditor";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Video,
  Film,
  Plus,
  Scissors,
  Save,
  Upload,
  Download,
  Layers,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from "lucide-react";

type MediaItem = {
  id: string;
  type: "video" | "audio";
  name: string;
  duration: number;
  source: string;
  thumbnail?: string;
  startTime: number;
  endTime: number;
  track: number;
};

type Track = {
  id: string;
  name: string;
  type: "video" | "audio";
  items: MediaItem[];
};

export const EditorView = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes in seconds
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([
    {
      id: "video1",
      type: "video",
      name: "Intro Sequence",
      duration: 30,
      source: "/Videos/KONFORM_01.mp4",
      thumbnail: "/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png",
      startTime: 0,
      endTime: 30,
      track: 0
    },
    {
      id: "audio1",
      type: "audio",
      name: "Main Theme",
      duration: 120,
      source: "/Audio/Demo/track1.mp3",
      startTime: 0,
      endTime: 120,
      track: 1
    },
    {
      id: "video2",
      type: "video",
      name: "Bridge Visual",
      duration: 45,
      source: "/Videos/DREAMAKER_01.mp4",
      thumbnail: "/lovable-uploads/6ceede82-7822-439b-89e9-302abd648d82.png",
      startTime: 30,
      endTime: 75,
      track: 0
    },
    {
      id: "audio2",
      type: "audio",
      name: "Vocals",
      duration: 90,
      source: "/Audio/Demo/vocals.mp3",
      startTime: 15,
      endTime: 105,
      track: 2
    }
  ]);
  
  const [tracks, setTracks] = useState<Track[]>([
    { id: "track1", name: "Video Track", type: "video", items: [] },
    { id: "track2", name: "Music Track", type: "audio", items: [] },
    { id: "track3", name: "Vocals Track", type: "audio", items: [] }
  ]);

  // Initialize tracks with media items
  useEffect(() => {
    const videoTrackItems = mediaLibrary.filter(item => item.type === "video" && item.track === 0);
    const musicTrackItems = mediaLibrary.filter(item => item.type === "audio" && item.track === 1);
    const vocalsTrackItems = mediaLibrary.filter(item => item.type === "audio" && item.track === 2);
    
    setTracks([
      { ...tracks[0], items: videoTrackItems },
      { ...tracks[1], items: musicTrackItems },
      { ...tracks[2], items: vocalsTrackItems }
    ]);
  }, [mediaLibrary]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const importMedia = () => {
    toast({
      title: "Import Media",
      description: "Media import functionality will be implemented here",
    });
  };

  const exportProject = () => {
    toast({
      title: "Export Project",
      description: "Project export functionality will be implemented here",
    });
  };

  const saveProject = () => {
    toast({
      title: "Project Saved",
      description: "Your project has been saved successfully",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-black/40 rounded-lg overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex justify-between items-center bg-black/60 p-3 border-b border-konform-neon-blue/20">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-black/40 border-white/20 hover:bg-black/60">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="bg-black/40 border-white/20 hover:bg-black/60">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="bg-black/40 border-white/20 hover:bg-black/60">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-black/40 border-white/20 hover:bg-black/60">
            <Scissors className="h-4 w-4 mr-2" />
            Split
          </Button>
          <Button variant="outline" size="sm" className="bg-black/40 border-white/20 hover:bg-black/60">
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Media Library Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="bg-black/30 p-4 border-r border-konform-neon-blue/20">
          <h3 className="text-lg font-semibold mb-4 text-white">Media Library</h3>
          <Tabs defaultValue="video">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="video" className="flex items-center">
                <Film className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center">
                <Music className="h-4 w-4 mr-2" />
                Music
              </TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="space-y-2">
              {mediaLibrary.filter(item => item.type === "video").map(item => (
                <div 
                  key={item.id} 
                  className="p-2 rounded bg-black/40 hover:bg-black/60 cursor-pointer flex items-center gap-2 border border-transparent hover:border-konform-neon-blue/30"
                  onClick={() => setSelectedMediaItem(item)}
                >
                  <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                    {item.thumbnail && <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">{formatTime(item.duration)}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2 bg-black/40 border-white/20 hover:bg-black/60" onClick={importMedia}>
                <Plus className="h-4 w-4 mr-2" />
                Import Video
              </Button>
            </TabsContent>
            <TabsContent value="audio" className="space-y-2">
              {mediaLibrary.filter(item => item.type === "audio").map(item => (
                <div 
                  key={item.id} 
                  className="p-2 rounded bg-black/40 hover:bg-black/60 cursor-pointer flex items-center gap-2 border border-transparent hover:border-konform-neon-blue/30"
                  onClick={() => setSelectedMediaItem(item)}
                >
                  <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                    <Music className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">{formatTime(item.duration)}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2 bg-black/40 border-white/20 hover:bg-black/60" onClick={importMedia}>
                <Plus className="h-4 w-4 mr-2" />
                Import Audio
              </Button>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle />

        {/* Timeline and Preview Panel */}
        <ResizablePanel defaultSize={75} className="flex flex-col">
          {/* Preview Area */}
          <div className="h-1/2 bg-black/50 p-4 border-b border-konform-neon-blue/20 flex flex-col">
            <div className="flex-1 bg-black rounded-lg flex items-center justify-center overflow-hidden relative">
              {selectedMediaItem && selectedMediaItem.type === "video" ? (
                <video 
                  src={selectedMediaItem.source} 
                  className="max-h-full max-w-full" 
                  controls={false}
                  muted={isMuted}
                />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <Film className="h-12 w-12 mb-2" />
                  <p>Preview will appear here</p>
                </div>
              )}
              
              {/* Overlay Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/70 rounded-full px-4 py-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <SkipForward className="h-5 w-5" />
                </Button>
                <div className="text-white text-sm mx-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Timeline Area */}
          <div className="h-1/2 bg-black/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Timeline</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-black/40 border-white/20 hover:bg-black/60" onClick={saveProject}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
                <Button variant="outline" size="sm" className="bg-black/40 border-white/20 hover:bg-black/60" onClick={exportProject}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Video
                </Button>
              </div>
            </div>
            
            {/* Timeline Ruler */}
            <div className="h-6 bg-black/40 mb-2 relative" onClick={handleTimelineClick}>
              {/* Time markers */}
              {Array.from({ length: Math.ceil(duration / 30) + 1 }).map((_, i) => (
                <div key={i} className="absolute h-full" style={{ left: `${(i * 30 / duration) * 100}%` }}>
                  <div className="absolute top-0 h-2 w-px bg-gray-500"></div>
                  <div className="absolute top-2 text-xs text-gray-400">{formatTime(i * 30)}</div>
                </div>
              ))}
              {/* Playhead */}
              <div 
                className="absolute top-0 h-full w-px bg-konform-neon-blue z-10" 
                style={{ left: `${(currentTime / duration) * 100}%` }}
              >
                <div className="w-3 h-3 bg-konform-neon-blue rounded-full -translate-x-1/2"></div>
              </div>
            </div>
            
            {/* Tracks */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {tracks.map((track, index) => (
                <div key={track.id} className="h-16 bg-black/40 rounded relative">
                  {/* Track Label */}
                  <div className="absolute left-0 top-0 bottom-0 w-24 bg-black/60 border-r border-konform-neon-blue/20 flex items-center justify-center z-10">
                    <div className="text-sm font-medium text-white">{track.name}</div>
                  </div>
                  
                  {/* Track Content */}
                  <div className="ml-24 h-full relative" onClick={handleTimelineClick}>
                    {/* Media Items */}
                    {track.items.map(item => (
                      <div 
                        key={item.id}
                        className={`absolute top-0 h-full rounded ${item.type === 'video' ? 'bg-purple-900/60' : 'bg-blue-900/60'} border border-konform-neon-blue/30 cursor-pointer`}
                        style={{ 
                          left: `${(item.startTime / duration) * 100}%`,
                          width: `${((item.endTime - item.startTime) / duration) * 100}%`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMediaItem(item);
                        }}
                      >
                        <div className="p-2 text-xs text-white truncate">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};