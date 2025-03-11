
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonaCard } from "@/components/dreamaker/PersonaCard";
import type { Persona } from "@/types/persona";
import { memo, useMemo } from "react";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface PersonaGridProps {
  personas: Persona[];
  zoomLevel: number;
  onPersonaSelect: (persona: Persona) => void;
}

export const PersonaGrid = ({ personas, zoomLevel, onPersonaSelect }: PersonaGridProps) => {
  const navigate = useNavigate();
  const { addPersona, setShowDropContainer } = useSelectedPersonasStore();
  
  const handleAddToProject = (artist: Persona) => {
    setShowDropContainer(true);
    addPersona({
      id: artist.id,
      name: artist.name,
      avatarUrl: artist.avatar_url,
      type: artist.type
    });
    toast({
      title: "Added to project",
      description: `${artist.name} has been added to your project`,
    });
  };

  const handleAuthRequired = () => {
    navigate('/auth');
  };

  const gridClasses = useMemo(() => {
    if (zoomLevel <= 20) return 'md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
    if (zoomLevel <= 40) return 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    if (zoomLevel <= 60) return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    if (zoomLevel <= 80) return 'md:grid-cols-2 lg:grid-cols-3';
    return 'md:grid-cols-1 lg:grid-cols-2';
  }, [zoomLevel]);

  // Early return for empty persona list
  if (personas.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
        <div>
          <p className="text-xl mb-2">No personas found</p>
          <p className="text-sm opacity-70">Try adjusting your filters or create a new persona</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full min-h-[calc(100vh-300px)]">
        <div className={`grid grid-cols-1 ${gridClasses} gap-4 pb-6`}>
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              artist={persona}
              onAuthRequired={handleAuthRequired}
              onAddToProject={handleAddToProject}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
