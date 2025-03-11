
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PersonaCard } from "@/components/PersonaCard";
import type { Persona } from "@/types/persona";
import { transformPersonaData } from "@/lib/utils/personaTransform";

export const PersonaSection = () => {
  const { data: personas, isLoading } = useQuery({
    queryKey: ["public-personas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_personas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Persona type
      return (data || []).map(persona => transformPersonaData(persona)) as Persona[];
    },
  });

  if (isLoading) {
    return <div className="text-white">Loading personas...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personas?.map((persona) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          onClick={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
};
