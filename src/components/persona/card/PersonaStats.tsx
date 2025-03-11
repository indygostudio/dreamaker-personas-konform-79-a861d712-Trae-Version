
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, PlusCircle } from "lucide-react";
import { useZoomStore } from "@/stores/useZoomStore";

interface PersonaStatsProps {
  likesCount: number;
  isCollab: boolean;
  genreSpecialties?: string[];
  voiceType?: string;
  followersCount: number;
  rating: number;
  onCollaborate: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
}

export function PersonaStats({
  likesCount,
  isCollab,
  genreSpecialties,
  voiceType,
  followersCount,
  rating,
  onCollaborate,
  onFavorite,
  onShare
}: PersonaStatsProps) {
  const zoomLevel = useZoomStore(state => state.zoomLevel);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set exact zoom level thresholds for button appearance
  // Buttons should be icon-only at the smallest zoom level (20), 
  // and start showing text when zoom level is 60 or higher
  const isIconOnly = zoomLevel <= 40 || windowWidth < 640;
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={onFavorite} 
        variant="outline" 
        size={isIconOnly ? "icon" : "sm"} 
        className="glass-button bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/50 text-pink-500 min-w-[32px]"
      >
        <Heart className="h-4 w-4" />
        {!isIconOnly && <span className="ml-2 hidden sm:inline">Favorite</span>}
      </Button>

      <Button 
        onClick={onCollaborate} 
        variant="outline" 
        size={isIconOnly ? "icon" : "sm"} 
        className="glass-button bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/50 text-emerald-500 min-w-[32px]"
      >
        <PlusCircle className="h-4 w-4" />
        {!isIconOnly && <span className="ml-2 hidden sm:inline mx-[7px]">Collab</span>}
      </Button>

      <Button 
        onClick={onShare} 
        variant="outline" 
        size={isIconOnly ? "icon" : "sm"} 
        className="glass-button bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/50 text-blue-500 min-w-[32px]"
      >
        <Share2 className="h-4 w-4" />
        {!isIconOnly && <span className="ml-2 hidden sm:inline">Share</span>}
      </Button>
    </div>
  );
}
