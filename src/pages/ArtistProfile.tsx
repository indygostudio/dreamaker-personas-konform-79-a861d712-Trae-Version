import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/artist-profile/ProfileHeader";
import { ProfileTabs } from "@/components/artist-profile/ProfileTabs";
import { ArtistProfileDialog } from "@/components/artist-profile/ArtistProfileDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonaCard } from "@/components/PersonaCard";
import type { Persona } from "@/types/persona";
import type { Profile, BannerPosition } from "@/types/types";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useUIStore } from "@/stores/uiStore";
import { MusicPlayer } from "@/components/artist-profile/MusicPlayer";
import { useUser } from "@/hooks/useUser";

export const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { showDropContainer } = useSelectedPersonasStore();
  const { setHeaderExpanded } = useUIStore();
  const { user } = useUser();

  useEffect(() => {
    if (showDropContainer) {
      setHeaderExpanded(false);
    }
  }, [showDropContainer, setHeaderExpanded]);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["artist-profile", id],
    queryFn: async () => {
      if (!id) throw new Error("No artist ID provided");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        ...data,
        banner_position: (data.banner_position as { x: number; y: number }) || { x: 50, y: 50 },
        display_name: data.display_name || "Unnamed Artist",
        avatar_url: data.avatar_url || "/placeholder.svg",
      } as Profile;
    },
    enabled: !!id,
  });

  const handlePlayPause = () => {
    if (!profile?.audio_preview_url || !currentAudio) return;

    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Ensure audio state is preserved independently of UI interactions
  useEffect(() => {
    // This effect intentionally maintains audio state
    // regardless of header hover/expand/collapse events
    return () => {};
  }, [isPlaying]);

  useEffect(() => {
    if (profile?.audio_preview_url && !currentAudio) {
      const audio = new Audio(profile.audio_preview_url);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setCurrentAudio(audio);
    }
  }, [profile?.audio_preview_url, currentAudio]);

  const { data: personas } = useQuery({
    queryKey: ["artist-personas", id],
    queryFn: async () => {
      if (!id) throw new Error("No artist ID provided");

      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("artist_profile_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map(transformPersonaData);
    },
    enabled: !!id,
  });

  const { data: recentCollaborations } = useQuery({
    queryKey: ["artist-collaborations", id],
    queryFn: async () => {
      if (!id) throw new Error("No artist ID provided");

      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .or(`artist_profile_id.eq.${id},user_id.eq.${id}`)
        .eq("is_collab", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      
      return (data || []).map(transformPersonaData);
    },
    enabled: !!id,
  });

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    navigate('/konform', {
      state: { from: location }
    });
  };

  if (isLoadingProfile) {
    return <div className="pt-16">Loading...</div>;
  }

  if (!profile) {
    return <div className="pt-16">Artist not found</div>;
  }

  return (
    <div className="relative min-h-screen bg-black/95">
      <ProfileHeader 
        persona={profile} 
        id={id!}
        onEditClick={() => setDialogOpen(true)}
        isOwner={user?.id === profile.id}
      />

      <div className="w-full max-w-[2400px] mx-auto px-6 flex-1 flex flex-col gap-4 pb-24">
        <ProfileTabs
          selectedPersona={selectedPersona}
          personas={personas}
          onPersonaSelect={handlePersonaSelect}
          profile={profile}
        />
      </div>

      <ArtistProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={profile}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />

      {isPlaying && (
        <MusicPlayer
          audioUrl={profile?.audio_preview_url || null}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onTransportClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default ArtistProfile;
