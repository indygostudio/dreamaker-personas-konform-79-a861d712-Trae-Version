
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useZoomStore } from "@/stores/useZoomStore";

export const NavigationButton = () => {
  const navigate = useNavigate();
  const zoomLevel = useZoomStore(state => state.zoomLevel);
  
  // Use icon only button for smaller zoom levels
  const isIconOnly = zoomLevel <= 60;

  return (
    <Button 
      variant="glass" 
      size={isIconOnly ? "icon" : "default"}
      onClick={() => navigate(-1)}
      className="glass-button"
    >
      <ArrowLeft className={`${isIconOnly ? "h-4 w-4" : "h-4 w-4 mr-2"}`} />
      {!isIconOnly && "Back"}
    </Button>
  );
};
