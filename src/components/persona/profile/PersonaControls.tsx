
import { Button } from "@/components/ui/button";
import { Edit, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PersonaControlsProps {
  isHeaderExpanded: boolean;
  onExpandToggle: () => void;
  onEditClick: () => void;
}

export const PersonaControls = ({
  isHeaderExpanded,
  onExpandToggle,
  onEditClick,
}: PersonaControlsProps) => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 left-0 right-0 px-8 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-black/20 hover:bg-black/40 text-white border-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpandToggle}
            className="text-white hover:text-dreamaker-purple hover:bg-white/10 border-white"
          >
            {isHeaderExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Expand
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onEditClick}
            className="bg-black/20 hover:bg-black/40 text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
