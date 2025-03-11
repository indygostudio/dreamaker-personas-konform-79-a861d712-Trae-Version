
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useZoomStore } from "@/stores/useZoomStore";

interface EditButtonProps {
  onEditClick: () => void;
  isHeaderExpanded: boolean;
}

export const EditButton = ({ 
  onEditClick, 
  isHeaderExpanded 
}: EditButtonProps) => {
  const zoomLevel = useZoomStore(state => state.zoomLevel);
  
  // Determine button size based on zoom level and header state
  const shouldShowText = isHeaderExpanded && zoomLevel > 60;

  return (
    <Button 
      variant="glass" 
      size={shouldShowText ? "default" : "icon"}
      onClick={onEditClick}
      className="glass-button"
    >
      <Edit className="h-4 w-4" />
      {shouldShowText && <span className="ml-2">Edit Profile</span>}
    </Button>
  );
};
