
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
              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10">
                <SortableContext items={masterTracks.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                  {masterTracks.map((track) => (
                    <div key={track.id} className={`flex-shrink-0 ${viewMode === 'large' ? 'w-96' : viewMode === 'normal' ? 'w-64' : 'w-48'}`}>
                      <MixerChannel
                        id={track.id}
                        index={tracks.indexOf(track)}
                        name={track.name}
                        type={track.mode}
                        volume={track.volume}
                        isMuted={track.isMuted}
                        onVolumeChange={(value) => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, volume: value } : t
                          ));
                        }}
                        onMuteToggle={() => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, isMuted: !t.isMuted } : t
                          ));
                        }}
                        onTypeChange={(type) => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, mode: type } : t
                          ));
                        }}
                        onGenerate={() => {}}
                        onDelete={() => handleDeleteTrack(track.id)}
                        onDuplicate={() => handleDuplicateTrack(track.id)}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>

              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10">
                <SortableContext items={busTracks.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                  {busTracks.map((track) => (
                    <div key={track.id} className={`flex-shrink-0 ${viewMode === 'large' ? 'w-96' : viewMode === 'normal' ? 'w-64' : 'w-48'}`}>
                      <MixerChannel
                        id={track.id}
                        index={tracks.indexOf(track)}
                        name={track.name}
                        type={track.mode}
                        volume={track.volume}
                        isMuted={track.isMuted}
                        onVolumeChange={(value) => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, volume: value } : t
                          ));
                        }}
                        onMuteToggle={() => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, isMuted: !t.isMuted } : t
                          ));
                        }}
                        onTypeChange={(type) => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, mode: type } : t
                          ));
                        }}
                        onGenerate={() => {}}
                        onDelete={() => handleDeleteTrack(track.id)}
                        onDuplicate={() => handleDuplicateTrack(track.id)}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>

              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10">
                <SortableContext items={audioTracks.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                  {audioTracks.map((track) => (
                    <div key={track.id} className={`flex-shrink-0 ${viewMode === 'large' ? 'w-96' : viewMode === 'normal' ? 'w-64' : 'w-48'}`}>
                      <MixerChannel
                        id={track.id}
                        index={tracks.indexOf(track)}
                        name={track.name}
                        type={track.mode}
                        volume={track.volume}
                        isMuted={track.isMuted}
                        onVolumeChange={(value) => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, volume: value } : t
                          ));
                        }}
                        onMuteToggle={() => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, isMuted: !t.isMuted } : t
                          ));
                        }}
                        onTypeChange={(type) => {
                          setTracks(tracks.map(t =>
                            t.id === track.id ? { ...t, mode: type } : t
                          ));
                        }}
                        onGenerate={() => {}}
                        onDelete={() => handleDeleteTrack(track.id)}
                        onDuplicate={() => handleDuplicateTrack(track.id)}
                      />
                    </div>
                  ))}
                </SortableContext>
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
