import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonaCard } from "@/components/PersonaCard";
import type { Persona } from "@/components/dreamaker/types";

interface MixerSectionProps {
  personas: Persona[];
  onPersonaSelect: (persona: Persona) => void;
}

export const MixerSection = ({ personas, onPersonaSelect }: MixerSectionProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Mixer</h2>
        <Button variant="outline">Add Track</Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onEdit={() => {}}
              onDelete={() => {}}
              selectionMode={false}
              onSelect={() => onPersonaSelect(persona)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};