
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { Track } from "@/types/track";
import { TrackItem } from "@/components/artist-profile/TrackItem";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash } from "lucide-react";

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track) => void;
  onTrackDelete: (trackId: string) => void;
  onTrackArtworkEdit: (track: Track) => void;
  onDragEnd: (event: any) => void;
}

export const TrackList = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTrackDelete,
  onTrackArtworkEdit,
  onDragEnd
}: TrackListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (tracks.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400 bg-black/20 rounded-lg">
        No tracks yet in this playlist
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={tracks.map(track => track.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {tracks.map(track => (
            <div key={track.id} className="group relative">
              <TrackItem 
                id={track.id} 
                track={track} 
                currentTrack={currentTrack} 
                isPlaying={isPlaying && currentTrack?.id === track.id} 
                onTrackPlay={onTrackPlay} 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 z-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={e => {
                    e.stopPropagation();
                    onTrackArtworkEdit(track);
                  }} 
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={e => {
                    e.stopPropagation();
                    onTrackDelete(track.id);
                  }} 
                  className="bg-black/50 hover:bg-red-600/70 text-white"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
