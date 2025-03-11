import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KonformBanner } from "./KonformBanner";
import { useHeaderStore } from "./store/headerStore";
import { TrackItem, type Track, type TrackMode } from "./daw/Track";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MixerView = () => {
  const { mixerHeaderCollapsed, setMixerHeaderCollapsed } = useHeaderStore();
  const [tracks, setTracks] = useState<Track[]>([
    { 
      id: 1, 
      name: 'Track 1', 
      mode: 'ai-audio', 
      volume: 75, 
      isMuted: false,
      clips: []
    },
    { id: 2, name: 'Track 2', mode: 'ai-audio', volume: 75, isMuted: false, clips: [] },
    { id: 3, name: 'Track 3', mode: 'ai-audio', volume: 75, isMuted: false, clips: [] },
  ]);

  const handleModeChange = (trackId: number, mode: TrackMode) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, mode } : track
    ));
  };

  const handleMuteToggle = (trackId: number) => {
    setTracks(tracks.map(track =>
      track.id === trackId ? { ...track, isMuted: !track.isMuted } : track
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTracks(tracks => {
      const oldIndex = tracks.findIndex(t => t.id === active.id);
      const newIndex = tracks.findIndex(t => t.id === over.id);

      const newTracks = [...tracks];
      const [removed] = newTracks.splice(oldIndex, 1);
      newTracks.splice(newIndex, 0, removed);

      return newTracks;
    });
  };

  const handleDeleteTrack = (trackId: number) => {
    setTracks(tracks => tracks.filter(track => track.id !== trackId));
  };

  const handleDuplicateTrack = (trackId: number) => {
    const trackToDuplicate = tracks.find(track => track.id === trackId);
    if (!trackToDuplicate) return;

    const newTrack = {
      ...trackToDuplicate,
      id: Math.max(...tracks.map(t => t.id)) + 1,
      name: `${trackToDuplicate.name} (Copy)`,
      clips: []
    };

    setTracks([...tracks, newTrack]);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#131415] h-full">
      <KonformBanner 
        title="MIXER" 
        description="Mix and arrange your tracks with precision"
        isCollapsed={mixerHeaderCollapsed}
        onCollapsedChange={setMixerHeaderCollapsed}
      />
      <div className="p-6 h-[calc(100vh-8rem)]">
        <ScrollArea className="h-full">
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={tracks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {tracks.map((track) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  onDelete={handleDeleteTrack}
                  onDuplicate={handleDuplicateTrack}
                  onModeChange={handleModeChange}
                  onMuteToggle={handleMuteToggle}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </div>
    </div>
  );
};