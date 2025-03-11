
import { useZoomStore } from "@/stores/useZoomStore";
import { CollaborateButton } from "./actions/CollaborateButton";
import { FavoriteButton } from "./actions/FavoriteButton";
import { ShareButton } from "./actions/ShareButton";
import { PlayButton } from "./actions/PlayButton";
import { useEffect, useState } from "react";

interface ArtistCardActionsProps {
  artistId: string;
  artistName: string;
  artistBio?: string | null;
}

export const ArtistCardActions = ({ artistId, artistName, artistBio }: ArtistCardActionsProps) => {
  const zoomLevel = useZoomStore(state => state.zoomLevel);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine if we should show text based on zoom level
  // For zoom levels 3, 4, and 5 (60+), switch to icon-only mode
  const isIconOnly = zoomLevel >= 60;
  
  return (
    <div className={`flex items-center ${isIconOnly ? 'justify-center' : 'justify-end'} gap-1 w-full overflow-hidden h-10 flex-nowrap`}>
      <PlayButton 
        artistId={artistId} 
        artistName={artistName} 
        isIconOnly={true} // Always icon-only for Play button
      />
      
      <CollaborateButton 
        artistId={artistId} 
        artistName={artistName} 
        isIconOnly={isIconOnly} 
      />
      
      <FavoriteButton 
        artistId={artistId} 
        artistName={artistName} 
        isIconOnly={isIconOnly} 
      />
      
      <ShareButton 
        artistName={artistName} 
        artistBio={artistBio} 
        isIconOnly={isIconOnly} 
      />
    </div>
  );
};
