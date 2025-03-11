import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slider } from "@/components/ui/slider";
import { GripVertical, Volume2 } from "lucide-react";

interface TrackProps {
  id: string;
  index: number;
  volume: number;
  onVolumeChange: (value: number[], index: number) => void;
}

export const Track = ({ id, index, volume, onVolumeChange }: TrackProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group h-full w-24 flex-shrink-0 ${isDragging ? 'z-50' : 'z-0'}`}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-konform-neon-blue to-konform-neon-orange opacity-30 blur group-hover:opacity-50 transition-opacity rounded-lg" />
      <div className={`relative h-full bg-black/40 backdrop-blur-xl rounded-lg border ${
        isDragging ? 'border-konform-neon-blue' : 'border-konform-neon-blue/30'
      } p-4 select-none transition-colors flex flex-col`}>
        <div className="flex items-center justify-between mb-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-konform-neon-blue transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-sm text-konform-neon-blue font-medium">Track {index + 1}</span>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="rotate-180 h-full w-4 mx-auto">
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value, index)}
              max={100}
              step={1}
              orientation="vertical"
              className="[&_[role=slider]]:bg-konform-neon-blue [&_[role=slider]]:border-none [&_[role=slider]]:w-6 [&_[role=slider]]:h-3 [&_[role=slider]]:hover:bg-konform-neon-orange [&_[role=slider]]:transition-colors"
            />
          </div>

          <div className="h-1 w-full bg-konform-neon-blue/10 rounded-full overflow-hidden mt-4">
            <div 
              className="h-full bg-gradient-to-r from-konform-neon-blue to-konform-neon-orange rounded-full transition-all duration-150"
              style={{ width: `${volume}%` }}
            />
          </div>

          <div className="mt-4 pt-4 border-t border-konform-neon-blue/10">
            <Volume2 className="w-4 h-4 text-konform-neon-orange/70 mx-auto" />
            <div className="flex gap-0.5 mt-2 justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-gradient-to-t from-konform-neon-blue to-konform-neon-orange rounded-sm animate-neon-pulse"
                  style={{
                    height: `${Math.random() * 16 + 4}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};