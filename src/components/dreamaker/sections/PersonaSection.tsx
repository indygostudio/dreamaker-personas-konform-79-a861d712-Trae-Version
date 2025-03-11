import { Persona } from "@/types/persona";

interface PersonaSectionProps {
  title: string;
  personas: Persona[];
  onPersonaClick: (persona: Persona) => void;
}

export const PersonaSection = ({ title, personas, onPersonaClick }: PersonaSectionProps) => {
  return (
    <div className="py-20">
      <h2 className="text-4xl font-bold mb-12 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="bg-dreamaker-gray rounded-xl p-6 cursor-pointer hover:bg-opacity-80 transition-all"
            onClick={() => onPersonaClick(persona)}
          >
            <img
              src={persona.avatar_url || "/placeholder.svg"}
              alt={persona.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{persona.name}</h3>
            <p className="text-gray-400">{persona.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};