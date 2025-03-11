import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Track } from "./Track";

interface TrackListProps {
  trackIds: string[];
  volumes: number[];
  onVolumeChange: (value: number[], index: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export const TrackList = ({ trackIds, volumes, onVolumeChange, onDragEnd }: TrackListProps) => {
  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={trackIds} strategy={rectSortingStrategy}>
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4">
          {trackIds.map((id, index) => (
            <Track
              key={id}
              id={id}
              index={index}
              volume={volumes[index]}
              onVolumeChange={onVolumeChange}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};