import { Button } from "@/components/ui/button";
import { Edit, MessageCircle, UserPlus } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useState, useEffect } from "react";
import { useFollows } from "@/hooks/useFollows";
import { useSession } from "@supabase/auth-helpers-react";

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
  const session = useSession();
  const loggedInUserId = session?.user?.id;
  const { following, followUser, unfollowUser, isLoading } = useFollows(loggedInUserId || "");
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Check if current user is following the profile
  useEffect(() => {
    if (following && userId) {
      setIsFollowing(following.some(f => f.following_id === userId));
    }
  }, [following, userId]);
  
  const handleFollowClick = () => {
    if (!loggedInUserId) return;
    
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };
  
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
            onClick={handleFollowClick}
            disabled={isLoading || userId === loggedInUserId}
          >
            <UserPlus className="h-4 w-4" />
            {isHeaderExpanded && <span className="ml-2">{isFollowing ? 'Unfollow' : 'Follow'}</span>}
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
