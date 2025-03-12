
import { PersonaCard } from "@/components/PersonaCard";
import type { Persona } from "@/types/persona";

interface PersonaGridProps {
  personas: Persona[];
  zoomLevel: number;
  onEdit?: (persona: Persona) => void;
  onDelete?: (id: string) => void;
  calculateScale: () => string;
  getGridClass: () => string;
}

export function PersonaGrid({
  personas,
  zoomLevel,
  onEdit,
  onDelete,
  calculateScale,
  getGridClass,
}: PersonaGridProps) {
  return (
    <div className={`grid ${getGridClass()} p-4 min-h-[calc(100vh-280px)] w-full overflow-y-auto`}>
      {personas.map((persona) => (
        <div 
          key={persona.id} 
          className={`relative transition-all duration-300 ${calculateScale()}`}
          style={{ transformOrigin: 'center center' }}
        >
          <PersonaCard
            persona={persona}
            onEdit={() => onEdit?.(persona)}
            onDelete={() => onDelete?.(persona.id)}
            selectionMode={false}
          />
        </div>
      ))}
    </div>
  );
}
