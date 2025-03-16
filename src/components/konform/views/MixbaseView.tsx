
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Track } from "../daw/Track";
import { MixerChannel } from "../daw/MixerChannel";
import { MasterVolume } from "../mixer/MasterVolume";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

export const MixbaseView = () => {
  const [tracks, setTracks] = useState<Track[]>([{
    id: 1,
    name: 'Master',
    volume: 80,
    isMuted: false,
    mode: 'master',
    clips: [],
  }, {
    id: 2,
    name: 'Bus 1',
    volume: 75,
    isMuted: false,
    mode: 'bus',
    clips: [],
  }, {
    id: 3,
    name: 'Bus 2',
    volume: 75,
    isMuted: false,
    mode: 'bus',
    clips: [],
  }, {
    id: 4,
    name: 'Track 1',
    volume: 75,
    isMuted: false,
    mode: 'ai-audio',
    clips: [],
  }]);

  const [masterVolume, setMasterVolume] = useState(80);
  const [viewMode, setViewMode] = useState<'large' | 'normal' | 'compact'>('normal');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleAddTrack = () => {
    const audioTracks = tracks.filter(t => t.mode === 'ai-audio');
    const newTrack: Track = {
      id: Math.max(...tracks.map(t => t.id)) + 1,
      name: `Track ${audioTracks.length + 1}`,
      volume: 75,
      isMuted: false,
      mode: 'ai-audio',
      clips: [],
    };
    setTracks([...tracks, newTrack]);
  };

  const handleDeleteTrack = (trackId: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (track?.mode === 'master' || track?.mode === 'bus') return;
    setTracks(tracks => tracks.filter(track => track.id !== trackId));
  };

  const handleDuplicateTrack = (trackId: number) => {
    const trackToDuplicate = tracks.find(track => track.id === trackId);
    if (!trackToDuplicate || trackToDuplicate.mode === 'master' || trackToDuplicate.mode === 'bus') return;

    const newTrack = {
      ...trackToDuplicate,
      id: Math.max(...tracks.map(t => t.id)) + 1,
      name: `${trackToDuplicate.name} (Copy)`,
      clips: []
    };

    setTracks([...tracks, newTrack]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTracks(tracks => {
      const oldIndex = tracks.findIndex(t => t.id === active.id);
      const newIndex = tracks.findIndex(t => t.id === over.id);
      
      const track = tracks[oldIndex];
      if (track.mode === 'master' || track.mode === 'bus') return tracks;

      const masterBusCount = tracks.filter(t => t.mode === 'master' || t.mode === 'bus').length;
      if (newIndex < masterBusCount) return tracks;

      const newTracks = [...tracks];
      const [removed] = newTracks.splice(oldIndex, 1);
      newTracks.splice(newIndex, 0, removed);

      return newTracks;
    });
  };

  // Separate tracks by type
  const masterTracks = tracks.filter(t => t.mode === 'master');
  const busTracks = tracks.filter(t => t.mode === 'bus');
  const audioTracks = tracks.filter(t => t.mode === 'ai-audio');

  // Render a mixer channel with the new UI based on the image
  const renderMixerChannel = (track: Track, index: number) => {
    return (
      <div key={track.id} className={`flex-shrink-0 ${viewMode === 'large' ? 'w-96' : viewMode === 'normal' ? 'w-64' : 'w-48'}`}>
        <div className="bg-black/80 rounded-lg border border-konform-neon-blue/30 overflow-hidden">
          {/* Channel Header */}
          <div className="p-2 border-b border-konform-neon-blue/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-konform-neon-blue text-xs">CH {index}</span>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-konform-neon-blue hover:text-konform-neon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/></svg>
              </Button>
            </div>
          </div>
          
          {/* Plugin Section */}
          <div className="p-2 border-b border-konform-neon-blue/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-konform-neon-blue">Plugin</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-konform-neon-blue hover:text-konform-neon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs h-8 border-konform-neon-blue/30 text-white bg-black/60 hover:bg-black/80 hover:text-konform-neon-blue">
              Add Plugin
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
          
          {/* Output Section */}
          <div className="p-2 border-b border-konform-neon-blue/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-konform-neon-blue">Output</span>
              <span className="text-xs text-konform-neon-orange">Φ</span>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs h-8 border-konform-neon-blue/30 text-white bg-black/60 hover:bg-black/80 hover:text-konform-neon-blue">
              Select...
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
          
          {/* Volume Slider */}
          <div className="p-2 flex flex-col items-center">
            <div className="w-full flex justify-between text-xs text-gray-400 mb-1">
              <span>+12</span>
            </div>
            <div className="h-48 w-full flex justify-center mb-2">
              <Slider
                orientation="vertical"
                value={[track.volume]}
                onValueChange={([value]) => {
                  setTracks(tracks.map(t =>
                    t.id === track.id ? { ...t, volume: value } : t
                  ));
                }}
                max={100}
                step={1}
                className="h-full"
              />
            </div>
            <div className="w-full flex justify-between text-xs text-gray-400 mb-1">
              <span>-48</span>
            </div>
            <div className="flex w-full justify-center space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className={`text-xs h-6 w-6 border-konform-neon-blue/30 ${track.isMuted ? 'bg-konform-neon-blue text-black' : 'bg-black/60'} hover:bg-konform-neon-blue hover:text-black`}
                onClick={() => {
                  setTracks(tracks.map(t =>
                    t.id === track.id ? { ...t, isMuted: !t.isMuted } : t
                  ));
                }}
              >
                M
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs h-6 w-6 border-konform-neon-blue/30 ${track.isSolo ? 'bg-konform-neon-orange text-black' : 'bg-black/60'} hover:bg-konform-neon-orange hover:text-black`}
                onClick={() => {
                  setTracks(tracks.map(t =>
                    t.id === track.id ? { ...t, isSolo: !t.isSolo } : t
                  ));
                }}
              >
                S
              </Button>
            </div>
            <div className="text-xs text-konform-neon-blue mt-2">
              0.0 dB
            </div>
          </div>
          
          {/* Track Name */}
          <div className="p-2 border-t border-konform-neon-blue/20 flex justify-center">
            <Button variant="ghost" className="text-xs text-white hover:text-konform-neon-blue">
              {track.name}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M12 19c-4.3 0-7.8-3.4-7.8-7.7 0-2 .8-3.8 2-5.1.5-.5 1.3-.5 1.8 0l.5.5c.3.3.3.8 0 1.1-.8.9-1.2 2-1.2 3.4 0 2.8 2.2 5 5 5s5-2.2 5-5c0-1.4-.4-2.6-1.2-3.4-.3-.3-.3-.8 0-1.1l.5-.5c.5-.5 1.3-.5 1.8 0 1.2 1.3 2 3.1 2 5.1-.3 4.3-3.8 7.7-8.2 7.7z"/><path d="M12 5v8"/></svg>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#131415]">
      <div className="p-4 border-b border-konform-neon-blue/20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'large' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('large')}
              className="text-konform-neon-blue"
            >
              Large
            </Button>
            <Button
              variant={viewMode === 'normal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('normal')}
              className="text-konform-neon-blue"
            >
              Normal
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('compact')}
              className="text-konform-neon-blue"
            >
              Compact
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 h-[calc(100vh-8rem)] flex">
        <ScrollArea className="flex-1 h-full">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex items-stretch space-x-4 min-h-[500px]">
              {/* Render all tracks in the new mixer channel UI */}
              {tracks.map((track, index) => renderMixerChannel(track, index))}
              
              <div className="flex-shrink-0 w-24 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleAddTrack}
                  className="w-12 h-12 rounded-full bg-black/60 border border-konform-neon-blue/30 hover:border-konform-neon-blue text-konform-neon-blue hover:text-konform-neon-orange transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </DndContext>
          <ScrollBar orientation="horizontal" className="bg-konform-neon-blue/20" />
        </ScrollArea>
        <MasterVolume volume={masterVolume} onVolumeChange={setMasterVolume} />
      </div>
      <div className="h-16 border-t border-konform-neon-blue/20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center space-x-4">
            {/* Transport controls */}
          </div>
          <div className="flex items-center space-x-4 text-konform-neon-blue">
            <span>120 BPM</span>
            <span>4/4</span>
            <span>C Maj</span>
          </div>
        </div>
      </div>
    </div>
  );
};
