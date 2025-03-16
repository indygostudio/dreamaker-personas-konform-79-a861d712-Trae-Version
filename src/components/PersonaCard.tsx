
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { CardContent, CardFooter } from "@/components/ui/card";
import type { Persona } from "@/types/persona";
import { PersonaAvatar } from "@/components/persona/card/PersonaAvatar";
import { PersonaContextMenu } from "@/components/persona/card/PersonaContextMenu";
import { PersonaBadge } from "@/components/persona/card/PersonaBadge";
import { PersonaStats } from "@/components/persona/card/PersonaStats";
import { VideoBackground } from "@/components/persona/VideoBackground";
import { usePersonaDelete } from "@/components/persona/hooks/usePersonaDelete";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle, Share2, StopCircle, Users, Star, Music, Mic2, Trash2, Volume2, VolumeX, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MusicPlayer } from "@/components/artist-profile/MusicPlayer";

interface PersonaCardProps {
  persona: Persona;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  variant?: 'default' | 'compact';
}

export function PersonaCard({
  persona,
  onClick,
  onEdit,
  onDelete,
  selectionMode = false,
  selected = false,
  onSelect,
  variant = 'default'
}: PersonaCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    handleDeletePersona
  } = usePersonaDelete();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    user
  } = useUser();
  const {
    toast
  } = useToast();
  const {
    addPersona,
    setShowDropContainer,
    wormholeAnimations
  } = useSelectedPersonasStore();
  const isInWormhole = wormholeAnimations.has(persona.name);

  useEffect(() => {
    if (persona.audio_preview_url) {
      audioRef.current = new Audio(persona.audio_preview_url);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", () => setIsPlaying(false));
        audioRef.current = null;
      }
    };
  }, [persona.audio_preview_url]);

  const handleAudioButtonMouseEnter = () => {
    if (!persona.audio_preview_url || !audioRef.current) return;
    
    audioRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });
    setIsPlaying(true);
  };

  const handleAudioButtonMouseLeave = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!persona.audio_preview_url || !audioRef.current) {
      toast({
        description: "This persona doesn't have an audio preview yet."
      });
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          description: "There was an error playing the audio preview.",
          variant: "destructive"
        });
      });
      setIsPlaying(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode && onSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSelect(!selected);
    } else if (onClick) {
      onClick();
    } else {
      navigate(`/personas/${persona.id}`);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: persona.name,
        text: persona.description || 'Check out this persona!',
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Link copied to clipboard"
      });
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to favorite personas",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.from('artist_favorites').upsert({
        user_id: user.id,
        artist_id: persona.id
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Added to favorites"
      });
      queryClient.invalidateQueries({
        queryKey: ['personas']
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add to favorites",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== persona.user_id) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete this persona",
        variant: "destructive"
      });
      return;
    }
    const success = await handleDeletePersona(persona.id);
    if (success) {
      await queryClient.invalidateQueries({
        queryKey: ["personas"]
      });
      if (onDelete) {
        onDelete();
      }
    }
  };

  const handleAddToProject = () => {
    setShowDropContainer(true);
    addPersona({
      avatarUrl: persona.avatar_url,
      name: persona.name,
      id: persona.id,
      type: persona.type
    });
    toast({
      title: "Success",
      description: `Added ${persona.name} to project`
    });
  };

  return <ContextMenu>
      <ContextMenuTrigger>
        <Card onClick={handleClick} className={`group relative overflow-hidden bg-dreamaker-gray backdrop-blur-md border border-dreamaker-purple/20 hover:border-dreamaker-purple/40 transition-all duration-300 cursor-pointer w-full h-[280px] flex flex-col shadow-lg hover:shadow-dreamaker-purple/20 ${isInWormhole ? 'brightness-75' : ''}`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <div className="absolute inset-0">
            <VideoBackground videoUrl={persona.video_url || null} isHovering={isHovering} fallbackImage={persona.banner_url} />
          </div>

          <div className={`relative z-10 ${variant === 'compact' ? 'p-3' : 'p-6'} flex-1`}>
            <div className="flex items-start justify-between mb-2">
              <PersonaAvatar avatarUrl={persona.avatar_url} name={persona.name} personaId={persona.id} type={persona.type} size={variant === 'compact' ? 'sm' : 'md'} />
              {variant === 'default' && <div className="flex gap-2">
                  {persona.audio_preview_url && (
                    <Button 
                      ref={audioButtonRef}
                      variant="ghost" 
                      size="icon" 
                      onClick={handleAudioToggle}
                      className="bg-black/40 hover:bg-black/60 text-white h-8 w-8"
                    >
                      {isPlaying ? <Volume2 className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={e => {
                e.stopPropagation();
                handleFavorite();
              }} className="bg-black/40 hover:bg-black/60 text-white h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={e => {
                e.stopPropagation();
                handleShare();
              }} className="bg-black/40 hover:bg-black/60 text-white h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <PersonaBadge type={persona.type} />
                </div>}
            </div>

            <div className="mt-auto">
              <h3 className={`${variant === 'compact' ? 'text-base' : 'text-lg'} font-semibold text-dreamaker-purple group-hover:text-dreamaker-purple/90 transition-colors line-clamp-1`}>
                {persona.name}
              </h3>
              <p className={`text-sm text-gray-300 ${variant === 'compact' ? 'line-clamp-1' : 'line-clamp-2'} mb-2 group-hover:text-white/90 transition-colors`}>
                {persona.description || "No description provided"}
              </p>
              
              <div className={`flex items-center ${variant === 'compact' ? 'gap-2 text-xs' : 'gap-4 text-sm'} text-gray-400`}>
                {persona.voice_type && <div className="flex items-center gap-1">
                    <Mic2 className="h-4 w-4 text-dreamaker-purple" />
                    <span>{persona.voice_type}</span>
                  </div>}
                {persona.genre_specialties && persona.genre_specialties.length > 0 && <div className="flex items-center gap-1">
                    <Music className="h-4 w-4 text-dreamaker-purple" />
                    <span>{persona.genre_specialties[0]}</span>
                  </div>}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-dreamaker-purple" />
                  <span>4.5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-dreamaker-purple" />
                  <span>{persona.followers_count || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {variant === 'default' && <div className="border-t border-dreamaker-purple/20 p-4 relative z-10 bg-[#0d0514]/[0.93]">
              <PersonaStats likesCount={persona.likes_count || 0} isCollab={persona.is_collab || false} genreSpecialties={persona.genre_specialties} voiceType={persona.voice_type} followersCount={persona.followers_count || 0} rating={4.5} onCollaborate={() => {
            toast({
              description: "Collaboration request sent"
            });
          }} onFavorite={handleFavorite} onShare={handleShare} />
            </div>}
          
          {isInWormhole && <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none transition-opacity duration-500"></div>}
          
          {/* Audio preview hover button that appears when hovering and the persona has an audio preview */}
          {persona.audio_preview_url && isHovering && !isPlaying && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAudioToggle}
              className="absolute top-20 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-black/60 text-white hover:bg-black/80 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-200 z-20"
            >
              <PlayCircle className="h-8 w-8 text-dreamaker-purple" />
            </Button>
          )}
          
          {/* Hidden music player for handling audio through the enhanced player */}
          {persona.audio_preview_url && (
            <div className="music-player-container">
              <MusicPlayer
                audioUrl={persona.audio_preview_url}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                trackTitle={`${persona.name} Preview`}
                artistName={persona.name}
              />
            </div>
          )}
        </Card>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="bg-black/80 backdrop-blur-md border border-dreamaker-purple/20">
        <ContextMenuItem onClick={handleAddToProject} className="hover:bg-dreamaker-purple/20 text-white cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add to Project
        </ContextMenuItem>
        <ContextMenuItem onClick={handleShare} className="hover:bg-dreamaker-purple/20 text-white cursor-pointer">
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </ContextMenuItem>
        {user?.id === persona.user_id && <ContextMenuItem onClick={() => handleDelete()} className="hover:bg-red-500/20 text-red-400 cursor-pointer">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Profile
          </ContextMenuItem>}
      </ContextMenuContent>

      <AlertDialog open={false} onOpenChange={() => {}}>
        <AlertDialogContent className="bg-dreamaker-gray border-dreamaker-purple/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure you want to delete this persona?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your persona and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContextMenu>;
}
