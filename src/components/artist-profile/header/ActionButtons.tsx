
import { Button } from "@/components/ui/button";
import { Edit, MessageCircle, UserPlus } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

interface ActionButtonsProps {
  isOwner: boolean;
  onEditClick?: () => void;
  personaId: string;
  personaName: string;
  userId: string;
  currentUserId?: string;
}

export const ActionButtons = ({ 
  isOwner, 
  onEditClick,
  personaId,
  personaName,
  userId,
  currentUserId
}: ActionButtonsProps) => {
  const { isHeaderExpanded } = useUIStore();
  
  return (
    <>
      {!isOwner && (
        <>
          <Button 
            variant="glass" 
            size={isHeaderExpanded ? "default" : "icon"}
            className="glass-button"
          >
            <MessageCircle className="h-4 w-4" />
            {isHeaderExpanded && <span className="ml-2">Message</span>}
          </Button>
          
          <Button 
            variant="glass" 
            size={isHeaderExpanded ? "default" : "icon"}
            className="glass-button"
          >
            <UserPlus className="h-4 w-4" />
            {isHeaderExpanded && <span className="ml-2">Follow</span>}
          </Button>
        </>
      )}
      
      {isOwner && onEditClick && (
        <Button 
          variant="glass" 
          size={isHeaderExpanded ? "default" : "icon"}
          onClick={onEditClick}
          className="glass-button"
        >
          <Edit className="h-4 w-4" />
          {isHeaderExpanded && <span className="ml-2">Edit Profile</span>}
        </Button>
      )}
    </>
  );
};
