
import { GripVertical } from "lucide-react";

export const DragHandle = () => {
  return (
    <button
      className="p-2 hover:bg-dreamaker-purple/10 rounded-full transition-colors cursor-grab active:cursor-grabbing"
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-4 w-4 text-dreamaker-purple" />
    </button>
  );
};
