
import { ChevronDown, ChevronUp } from 'lucide-react';
interface ExpandToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
  visible?: boolean;
}
export const ExpandToggle = ({
  isExpanded,
  onToggle,
  visible = true
}: ExpandToggleProps) => {
  if (!visible) return null;
  
  return (
    <button 
      className="absolute left-1/2 transform -translate-x-1/2 bottom-4 bg-black/40 p-1 rounded-full hover:bg-black/60 transition-colors z-10"
      onClick={(e) => {
        // Prevent event propagation to avoid interfering with audio playback
        e.stopPropagation();
        onToggle();
      }}
    >
      {isExpanded ? (
        <ChevronUp className="h-4 w-4 text-white" />
      ) : (
        <ChevronDown className="h-4 w-4 text-white" />
      )}
    </button>
  );
};
