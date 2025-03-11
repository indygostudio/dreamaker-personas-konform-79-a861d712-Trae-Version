
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, UserPlus, Plus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Persona } from "@/types/persona";

interface PersonaActionsProps {
  artist: Persona;
  onAddToProject: (artist: Persona) => void;
  onAuthRequired?: () => void;
  showIcons?: boolean;
}

export const PersonaActions = ({ 
  artist, 
  onAddToProject,
  onAuthRequired,
  showIcons = true
}: PersonaActionsProps) => {
  const session = useSession();

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      await navigator.share({
        title: artist.name,
        text: artist.description || 'Check out this persona!',
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this persona",
      });
    }
  };

  const handleFavorite = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!session) {
      onAuthRequired?.();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('artist_favorites')
        .upsert({ 
          user_id: session.user.id,
          artist_id: artist.id 
        });

      if (error) throw error;

      toast({
        title: "Persona favorited",
        description: "This persona has been added to your favorites",
      });
    } catch (error: any) {
      toast({
        title: "Error favoriting persona",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCollaborate = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!session) {
      onAuthRequired?.();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .insert({
          from_user_id: session.user.id,
          to_artist_id: artist.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Collaboration request sent",
        description: "Your request has been sent to the artist",
      });
    } catch (error: any) {
      toast({
        title: "Error sending request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddToProject = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onAddToProject(artist);
  };

  return (
    <div className="absolute bottom-6 right-4 flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => handleAddToProject(e)}
        className="bg-black/40 hover:bg-black/60 text-white h-8 w-8 rounded-full"
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      {showIcons && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleCollaborate(e)}
            className="bg-black/40 hover:bg-black/60 text-white h-8 w-8 rounded-full"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleFavorite(e)}
            className="bg-black/40 hover:bg-black/60 text-white h-8 w-8 rounded-full"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleShare(e)}
            className="bg-black/40 hover:bg-black/60 text-white h-8 w-8 rounded-full"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
