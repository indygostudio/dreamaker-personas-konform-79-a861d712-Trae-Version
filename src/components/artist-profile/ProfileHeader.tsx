
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useUIStore } from '@/stores/uiStore';
import { AvatarSection } from './header/AvatarSection';
import { ProfileInfo } from './header/ProfileInfo';
import { ActionButtons } from './header/ActionButtons';
import { ExpandToggle } from './header/ExpandToggle';
import { NavigationButton } from '@/components/persona/profile/header/NavigationButton';
import { VideoBackground } from '@/components/persona/VideoBackground';
import { HeaderSkeleton } from './header/HeaderSkeleton';
import { BannerContextMenu } from './header/BannerContextMenu';
import type { BannerPosition } from '@/types/types';
import { BioText } from './header/BioText';

interface ProfileHeaderProps {
  persona?: any;
  isOwner?: boolean;
  onEditClick?: () => void;
  id?: string;
}

export const ProfileHeader = ({
  persona,
  isOwner = false,
  onEditClick,
  id
}: ProfileHeaderProps) => {
  const { user } = useUser();
  const { isHeaderExpanded, setHeaderExpanded } = useUIStore();
  const [isHovering, setIsHovering] = useState(false);
  const [bannerPosition, setBannerPosition] = useState<BannerPosition>({
    x: 50,
    y: 50
  });
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (persona?.banner_position) {
      setBannerPosition(persona.banner_position);
    }
    if (persona?.banner_url) {
      setBannerUrl(persona.banner_url);
      console.log('Setting banner URL in ProfileHeader:', persona.banner_url);
    }
  }, [persona?.banner_position, persona?.banner_url]);

  if (!persona) {
    return <HeaderSkeleton />;
  }

  const handleDoubleClick = () => {
    setHeaderExpanded(!isHeaderExpanded);
  };

  const handleBannerChange = (newUrl: string) => {
    setBannerUrl(newUrl);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Handle hover state for video playback
  useEffect(() => {
    // Ensure hover state is properly managed for video playback
    if (persona?.video_url) {
      setIsHovering(true);
    }
  }, [persona?.video_url]);

  // Reset hover state when component unmounts
  useEffect(() => {
    return () => {
      setIsHovering(false);
    };
  }, []);

  return (
    <div className="w-full mt-16">
      <div 
        className={`relative transition-all duration-300 ${isHeaderExpanded ? 'h-[300px]' : 'h-[80px]'}`} 
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <BannerContextMenu 
          personaId={id || ''}
          bannerUrl={bannerUrl}
          onBannerChange={handleBannerChange}
          bannerPosition={bannerPosition}
        >
          <VideoBackground 
            videoUrl={persona.video_url || null} 
            isHovering={isHovering} 
            fallbackImage={bannerUrl || persona.banner_url} 
            position={bannerPosition} 
            darkness={persona.banner_darkness}
            priority={true}
            continuePlayback={true}
          />
        </BannerContextMenu>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50 select-none">
          <NavigationButton />
          
          <div className="flex gap-2">
            <ActionButtons 
              isOwner={isOwner} 
              personaId={persona.id} 
              personaName={persona.display_name || persona.username || "Artist"} 
              userId={persona.id} 
              currentUserId={user?.id} 
              onEditClick={onEditClick}
            />
          </div>
        </div>
        
        <div className={`absolute transition-all duration-300 ${
          isHeaderExpanded 
            ? 'bottom-4 left-4 max-w-2xl' 
            : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full'
        } z-20`}>
          <div className="flex items-center gap-4">
            {isHeaderExpanded && (
              <AvatarSection 
                avatarUrl={persona.avatar_url} 
                name={persona.display_name || persona.username || "Artist"} 
                isOwner={isOwner} 
                className="select-none"
              />
            )}
            
            <div className={`${!isHeaderExpanded ? 'w-full' : ''}`}>
              <h1 className="text-4xl font-bold text-white mb-2 select-none">
                {persona.display_name || persona.username || "Artist"}
              </h1>
              
              {isHeaderExpanded && persona.bio && (
                <BioText text={persona.bio || persona.user_bio} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ExpandToggle 
        isExpanded={isHeaderExpanded} 
        onToggle={() => setHeaderExpanded(!isHeaderExpanded)} 
        visible={true} 
      />
    </div>
  );
};
