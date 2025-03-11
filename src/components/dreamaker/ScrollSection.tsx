import { PersonaCard } from "./PersonaCard";
import type { Persona } from "./types";

interface ScrollSectionProps {
  title: string;
  personas: Persona[] | undefined;
  onAuthRequired?: () => void;
}

export const ScrollSection = ({ title, personas, onAuthRequired }: ScrollSectionProps) => {
  return (
    <div className="mt-12 bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/10">
      <h2 className="text-2xl font-bold text-white mb-6 font-syne flex items-center gap-2">
        <span>{title}</span>
        <span className="text-sm font-normal text-emerald-500/60">
          {personas?.length || 0} artists
        </span>
      </h2>
      <div className="overflow-x-auto pb-6 -mx-6 px-6 scrollbar-none">
        <div className="flex gap-6 min-w-full">
          {personas?.map(persona => (
            <PersonaCard 
              key={persona.id} 
              artist={persona} 
              isCompact 
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      </div>
    </div>
  );
};