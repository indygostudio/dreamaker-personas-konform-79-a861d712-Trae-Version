
import { Grid } from "@/components/ui/grid";
import { ArtistCard } from "@/components/dreamaker/ArtistCard";
import type { Persona } from "@/types/persona";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { PersonaCard } from "@/components/dreamaker/PersonaCard";

interface ArtistListProps {
  artists: Persona[];
  onDelete?: (id: string) => void;
}

export const ArtistList = ({ artists, onDelete }: ArtistListProps) => {
  const session = useSession();
  const isAdmin = session?.user?.email === 'indygorecording@gmail.com';
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);

  return (
    <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artists.map((artist) => (
        <PersonaCard
          key={artist.id}
          artist={artist}
          isCompact={false}
          isAdmin={isAdmin}
        />
      ))}
    </Grid>
  );
};
