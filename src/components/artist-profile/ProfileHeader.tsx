
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

  return (
    <div className="relative w-full" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <div className={`relative transition-all duration-300 ${isHeaderExpanded ? 'h-[300px]' : 'h-[80px]'}`} onDoubleClick={handleDoubleClick}>
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
            priority={true} // Prioritize loading for profile headers
          />
        </BannerContextMenu>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <NavigationButton />
        </div>
      </div>
      
      <ExpandToggle 
        isExpanded={isHeaderExpanded} 
        onToggle={() => setHeaderExpanded(!isHeaderExpanded)} 
        visible={true} 
      />
      
      <div className={`absolute bottom-0 w-full p-6 flex items-end justify-between`}>
        <div className="flex items-center gap-4">
          <AvatarSection 
            avatarUrl={persona.avatar_url} 
            name={persona.display_name || persona.username || "Artist"} 
            isOwner={isOwner} 
          />
          
          <ProfileInfo 
            name={persona.display_name || persona.username || "Artist"} 
            tagline={persona.bio || persona.user_bio}
            isExpanded={isHeaderExpanded}
            onDoubleClick={handleDoubleClick} 
          />
        </div>
        
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
    </div>
  );
};
