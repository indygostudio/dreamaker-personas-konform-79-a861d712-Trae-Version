
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PersonaCard } from "./PersonaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2 } from "lucide-react";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import { useToast } from "@/hooks/use-toast";

export const FeaturedSection = () => {
  const { toast } = useToast();
  
  const { data: featuredPersonas, isLoading, error } = useQuery({
    queryKey: ["featured-personas"],
    queryFn: async () => {
      console.log("Fetching featured personas...");
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("is_public", true)
        .eq("is_label_artist", true)
        .eq("type", "AI_VOCALIST")
        .limit(6);

      if (error) {
        console.error("Error fetching featured personas:", error);
        toast({
          title: "Error fetching personas",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Featured personas raw data:", data);
      const transformed = data?.map(transformPersonaData) || [];
      console.log("Transformed personas:", transformed);
      return transformed;
    },
  });

  if (error) {
    return (
      <div className="py-24 bg-gradient-to-b from-dreamaker-bg to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Music2 className="w-8 h-8 text-dreamaker-purple" />
            <h2 className="text-3xl font-bold">Featured Artists</h2>
          </div>
          <div className="text-red-500">
            Error loading featured artists. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-24 bg-gradient-to-b from-dreamaker-bg to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Music2 className="w-8 h-8 text-dreamaker-purple" />
            <h2 className="text-3xl font-bold">Featured Artists</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Add a check for empty featuredPersonas
  if (!featuredPersonas || featuredPersonas.length === 0) {
    return (
      <div className="py-24 bg-gradient-to-b from-dreamaker-bg to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Music2 className="w-8 h-8 text-dreamaker-purple" />
            <h2 className="text-3xl font-bold">Featured Artists</h2>
          </div>
          <p className="text-gray-400">No featured artists available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gradient-to-b from-dreamaker-bg to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <Music2 className="w-8 h-8 text-dreamaker-purple" />
          <h2 className="text-3xl font-bold">Featured Artists</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPersonas?.map((persona) => (
            <PersonaCard key={persona.id} artist={persona} />
          ))}
        </div>
      </div>
    </div>
  );
};
