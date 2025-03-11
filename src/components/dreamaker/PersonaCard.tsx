
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardContent, CardFooter } from "@/components/ui/card";
import type { Persona } from "@/types/persona";
import { useNavigate } from "react-router-dom";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { VideoBackground } from "./VideoBackground";
import { UserCardContent } from "./UserCardContent";
import { ArtistCardActions } from "./ArtistCardActions";
import { PersonaActions } from "./persona/PersonaActions";
import { PersonaContextActions } from "./persona/PersonaContextActions";
import { toast } from "@/hooks/use-toast";
import { PersonaBadge } from "@/components/persona/card/PersonaBadge";
import { Play, Volume2, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MusicPlayer } from "@/components/artist-profile/MusicPlayer";

interface PersonaCardProps {
  artist: Persona;
  isCompact?: boolean;
  isAdmin?: boolean;
  onAuthRequired?: () => void;
  onAddToProject?: (artist: Persona) => void;
}

export const PersonaCard = ({ 
  artist, 
  isCompact = false, 
  isAdmin = false, 
  onAuthRequired,
  onAddToProject
}: PersonaCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const navigate = useNavigate();
  const { wormholeAnimations, addPersona, setShowDropContainer } = useSelectedPersonasStore();

  const isInWormhole = wormholeAnimations.has(artist.name);

  const handleNavigateToProfile = () => {
    navigate(`/personas/${artist.id}`);
  };

  const handleAddToProject = (artist: Persona) => {
    if (onAddToProject) {
      onAddToProject(artist);
    } else {
      setShowDropContainer(true);
      
      // Add wormhole animation effect
      const wormholeContainer = document.createElement('div');
      wormholeContainer.className = 'fixed inset-0 z-50 flex items-center justify-center';
      
      const wormholeImage = document.createElement('img');
      wormholeImage.src = '/Videos/Wormhole.gif';
      wormholeImage.alt = 'Wormhole Animation';
      wormholeImage.className = 'w-full h-full object-cover absolute inset-0';
      wormholeImage.style.filter = 'hue-rotate(240deg) saturate(1.5)'; // Add blue filter
      
      const overlay = document.createElement('div');
      overlay.className = 'bg-black/50 absolute inset-0';
      
      const text = document.createElement('div');
      text.className = 'z-10 text-white text-2xl font-bold';
      text.textContent = 'Adding to Project...';
      
      wormholeContainer.appendChild(wormholeImage);
      wormholeContainer.appendChild(overlay);
      wormholeContainer.appendChild(text);
      
      document.body.appendChild(wormholeContainer);
      
      // Add persona to project
      addPersona({
        id: artist.id,
        name: artist.name,
        avatarUrl: artist.avatar_url,
        type: artist.type
      });
      
      // Remove wormhole effect after a delay
      setTimeout(() => {
        document.body.removeChild(wormholeContainer);
      }, 2000);
      
      toast({
        title: "Added to project",
        description: `${artist.name} has been added to your project`,
      });
    }
  };

  const handleAudioPreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!artist.audio_preview_url) {
      toast({
        title: "No audio preview",
        description: "This persona doesn't have an audio preview yet.",
      });
      return;
    }
    
    setIsPlayingAudio(!isPlayingAudio);
  };
  
  const handleTransportClose = () => {
    setIsPlayingAudio(false);
  };

  const getTypeColors = () => {
    switch (artist.type) {
      case "AI_VOCALIST":
        return {
          color: 'border-purple-500/20 group-hover:border-purple-500/60',
          bgColor: 'from-purple-900/40 to-black/40'
        };
      case "AI_MIXER":
        return {
          color: 'border-blue-500/20 group-hover:border-blue-500/60',
          bgColor: 'from-blue-900/40 to-black/40'
        };
      case "AI_WRITER":
        return {
          color: 'border-pink-500/20 group-hover:border-pink-500/60',
          bgColor: 'from-pink-900/40 to-black/40'
        };
      case "AI_INSTRUMENTALIST":
        return {
          color: 'border-amber-500/20 group-hover:border-amber-500/60',
          bgColor: 'from-amber-900/40 to-black/40'
        };
      default:
        return {
          color: 'border-dreamaker-purple/20 group-hover:border-dreamaker-purple/60',
          bgColor: 'from-dreamaker-purple/40 to-black/40'
        };
    }
  };

  const getVideoUrl = () => {
    if (isInWormhole) {
      return '/Videos/Wormhole.gif';
    }
    if (artist.is_collab) {
      return '/Videos/Gen-3 Alpha 1099031949, Clear AI silicon wom, imagepng (7), M 5.mp4';
    }
    return artist.video_url || '/Videos/PERSONAS_01.mp4';
  };

  const { color, bgColor } = getTypeColors();

  // Determine ranking badge based on likes count
  const getRankingBadge = () => {
    const likesCount = artist.likes_count || 0;
    
    if (likesCount >= 100) {
      return (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-amber-500/80 text-white px-2 py-1 rounded-full text-xs font-bold">
          <Crown className="h-3 w-3" />
          <span>Top</span>
        </div>
      );
    } else if (likesCount >= 50) {
      return (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-gray-100/80 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">
          <Star className="h-3 w-3" />
          <span>Popular</span>
        </div>
      );
    } else if (likesCount >= 10) {
      return (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-amber-700/80 text-white px-2 py-1 rounded-full text-xs font-bold">
          <Star className="h-3 w-3" />
          <span>Rising</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <PersonaContextActions 
      artist={artist}
      onAddToProject={() => handleAddToProject(artist)}
    >
      <Card 
        onClick={handleNavigateToProfile}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToProject(artist);
        }}
        className={`group overflow-hidden relative bg-black/80 backdrop-blur-md border ${color} transition-all duration-300 cursor-pointer w-full h-[280px] flex flex-col shadow-lg hover:shadow-lg transform hover:-translate-y-1 ${isInWormhole ? 'brightness-75' : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {getRankingBadge()}
        
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <VideoBackground 
            videoUrl={getVideoUrl()} 
            isHovering={isHovering} 
            continuePlayback={isInWormhole}
          />
          <div 
            className={`absolute inset-0 bg-gradient-to-b ${bgColor} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} 
            style={isInWormhole ? { filter: 'hue-rotate(240deg) saturate(1.5)' } : {}}
          />
        </div>
        
        <CardContent className="p-4 flex-1 relative z-10">
          <div className="flex justify-between items-start">
            <UserCardContent user={artist} />
            <PersonaBadge type={artist.type} />
          </div>
          
          <PersonaActions 
            artist={artist}
            onAddToProject={handleAddToProject}
            onAuthRequired={onAuthRequired}
            showIcons={false} // Hide unnecessary icons
          />
          
          {/* Audio Preview Button - Appears on hover */}
          {artist.audio_preview_url && isHovering && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAudioPreviewClick}
              className="absolute top-4 right-4 bg-black/60 text-white hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 z-20"
            >
              {isPlayingAudio ? (
                <Volume2 className="h-5 w-5 text-dreamaker-purple" />
              ) : (
                <Play className="h-5 w-5 text-dreamaker-purple" />
              )}
            </Button>
          )}
          
          {/* Favorites display */}
          {(artist.likes_count && artist.likes_count > 0) && (
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 text-gray-300">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-xs">{artist.likes_count}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-black/80 border-t border-dreamaker-purple/20 p-4 relative z-10">
          <ArtistCardActions 
            artistId={artist.id} 
            artistName={artist.name || ''} 
            artistBio={artist.description} 
          />
        </CardFooter>
        
        {isInWormhole && (
          <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none transition-opacity duration-500"></div>
        )}
        
        {/* Audio player with transport UI */}
        {artist.audio_preview_url && isPlayingAudio && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MusicPlayer
              audioUrl={artist.audio_preview_url}
              isPlaying={isPlayingAudio}
              onPlayPause={() => setIsPlayingAudio(!isPlayingAudio)}
              trackTitle={`${artist.name} Preview`}
              artistName={artist.name}
              onTransportClose={handleTransportClose}
            />
          </div>
        )}
      </Card>
    </PersonaContextActions>
  );
};
