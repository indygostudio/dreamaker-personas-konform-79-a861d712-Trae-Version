import { useState } from "react";
import { VideoBackground } from "@/components/persona/VideoBackground";
import { useUser } from "@/hooks/useUser";
import type { Persona } from "@/types/persona";
import type { MediaPosition } from "@/types/media";
import { NavigationButton } from "./header/NavigationButton";
import { MessagingButton } from "./header/MessagingButton";
import { FollowButton } from "./header/FollowButton";
import { EditButton } from "./header/EditButton";
import { HeaderInfo } from "./header/HeaderInfo";
import { PositionContextMenu } from "./header/PositionContextMenu";
import { useAdminMode } from "@/contexts/AdminModeContext";

interface PersonaHeaderProps {
  persona: Persona;
  isHeaderExpanded: boolean;
  setIsHeaderExpanded: (expanded: boolean) => void;
  onEditClick: () => void;
  onHeaderHover: (isHovered: boolean) => void;
}

export const PersonaHeader = ({
  persona,
  isHeaderExpanded,
  setIsHeaderExpanded,
  onEditClick,
  onHeaderHover
}: PersonaHeaderProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [bannerPosition, setBannerPosition] = useState<MediaPosition>(
    persona.banner_position || { x: 50, y: 50 }
  );
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const { user } = useUser();
  const { isAdmin, isAdminMode } = useAdminMode();

  // Debug info for ownership and admin status
  console.log("=== Debug Info ===");
  console.log("Your user ID:", user?.id);
  console.log("Persona user ID:", persona.user_id);
  console.log("isAdmin:", isAdmin);
  console.log("isAdminMode:", isAdminMode);
  console.log("Edit button visible:", user?.id === persona.user_id || (isAdmin && isAdminMode));
  console.log("==================")

  const handleMouseEnter = () => {
    setIsHovering(true);
    onHeaderHover(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!isLongPressed) {
      onHeaderHover(false);
    }
  };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsLongPressed(true);
      setIsHeaderExpanded(true);
    }, 500);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleDoubleClick = () => {
    setIsLongPressed(false);
    setIsHeaderExpanded(false);
  };

  return (
    <PositionContextMenu
      personaId={persona.id}
      bannerPosition={bannerPosition}
      onPositionChange={setBannerPosition}
    >
      <div 
        className="relative mt-16"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div 
          className={`relative transition-all duration-300 ${isHeaderExpanded ? 'h-[300px]' : 'h-[80px]'}`}
          onDoubleClick={handleDoubleClick}
        >
          <VideoBackground
            videoUrl={persona.video_url || null}
            isHovering={isHovering}
            fallbackImage={persona.banner_url}
            position={bannerPosition}
            darkness={persona.banner_darkness}
            continuePlayback={true}
          />
          
          {/* Dynamic gradient overlay */}
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${isHeaderExpanded ? 'opacity-0' : 'opacity-100'}`}
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)'
            }}
          />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <NavigationButton />

            <div className="flex gap-2">
              <MessagingButton 
                recipientId={persona.user_id}
                recipientName={persona.name}
                isHeaderExpanded={isHeaderExpanded}
              />
              
              <FollowButton 
                personaId={persona.id}
                personaName={persona.name}
                personaUserId={persona.user_id}
                isHeaderExpanded={isHeaderExpanded}
              />
              
              {(user?.id === persona.user_id || (isAdmin && isAdminMode)) && (
                <EditButton 
                  onEditClick={onEditClick}
                  isHeaderExpanded={isHeaderExpanded}
                />
              )}
            </div>
          </div>

          <HeaderInfo 
            name={persona.name}
            description={persona.description}
            followersCount={persona.followers_count || 0}
            createdAt={persona.created_at}
            isHeaderExpanded={isHeaderExpanded}
          />
        </div>
      </div>
    </PositionContextMenu>
  );
};
