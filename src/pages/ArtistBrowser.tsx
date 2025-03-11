
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/types/persona";
import { ArtistList } from "@/components/artist-profile/ArtistList";
import { FilterBar } from "@/components/dreamaker/FilterBar";
import { useToast } from "@/hooks/use-toast";
import { usePersonaDelete } from "@/components/persona/hooks/usePersonaDelete";
import { transformPersonaData } from "@/lib/utils/personaTransform";

export const ArtistBrowser = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [zoomLevel, setZoomLevel] = useState(() => {
    const saved = localStorage.getItem('defaultZoom');
    return saved ? parseInt(saved) : 75;
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleDeletePersona } = usePersonaDelete();

  const { data: personas = [], error, isLoading } = useQuery({
    queryKey: ["public-personas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(persona => transformPersonaData(persona)) as Persona[];
    },
  });

  useEffect(() => {
    const personasSubscription = supabase
      .channel('personas-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'personas'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["public-personas"] });
      })
      .subscribe();

    return () => {
      personasSubscription.unsubscribe();
    };
  }, [queryClient]);

  const filteredAndSortedPersonas = personas.filter(persona => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      persona.name?.toLowerCase().includes(searchLower) ||
      persona.description?.toLowerCase().includes(searchLower) ||
      persona.genre_specialties?.some(g => g.toLowerCase().includes(searchLower))
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return (a.name || "").localeCompare(b.name || "");
      case "popular":
        return (b.likes_count || 0) - (a.likes_count || 0);
      case "newest":
      default:
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
    }
  });

  const handleDelete = async (personaId: string) => {
    try {
      await handleDeletePersona(personaId);
      await queryClient.invalidateQueries({ queryKey: ["public-personas"] });
      
      toast({
        title: "Success",
        description: "Persona deleted successfully",
      });
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "Error",
        description: "Failed to delete persona",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["public-personas"] });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-black pt-[84px]">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-700/20 rounded-lg w-full max-w-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[200px] bg-gray-700/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black pt-[84px]">
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Personas</h2>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-[84px]">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Public Personas</h1>
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={() => {
              setSearchQuery("");
              setSortBy("newest");
            }}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            activeTab="personas"
          />
        </div>
        <ArtistList artists={filteredAndSortedPersonas} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ArtistBrowser;
