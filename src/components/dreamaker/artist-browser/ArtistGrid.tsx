
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonaCard } from "@/components/dreamaker/PersonaCard";
import type { Persona } from "@/pages/Personas";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ArtistGridProps {
  artists: Persona[] | undefined;
  onAuthRequired: () => void;
  isLoading?: boolean;
}

export const ArtistGrid = ({ artists, onAuthRequired, isLoading }: ArtistGridProps) => {
  const navigate = useNavigate();

  // Check if current user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
      
      return roles?.some(role => role.role === "admin") || false;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[400px] bg-black/20 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const handleArtistClick = (artistId: string) => {
    navigate(`/artists/${artistId}`);
  };

  return (
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-6">
        {artists?.map((artist) => (
          <div 
            key={artist.id}
            onClick={() => handleArtistClick(artist.user_id)}
            className="cursor-pointer"
          >
            <PersonaCard
              key={artist.id}
              artist={artist}
              isCompact={false}
              onAuthRequired={onAuthRequired}
              isAdmin={isAdmin}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
