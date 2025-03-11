
import { PersonaCard } from "@/components/PersonaCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Persona } from "@/types/persona";

interface PersonaListProps {
  personas: Persona[];
  isLoading: boolean;
  selectionMode: boolean;
  selectedPersonas: Persona[];
  onEdit: (persona: Persona) => void;
  onDelete: (id: string) => void;
  onSelect: (persona: Persona, selected: boolean) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const PersonaListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-dreamaker-gray border border-dreamaker-purple/20 rounded-lg p-6 h-[280px]">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const PersonaList = ({
  personas,
  isLoading,
  selectionMode,
  selectedPersonas,
  onEdit,
  onDelete,
  onSelect,
  onLoadMore,
  hasMore,
}: PersonaListProps) => {
  if (isLoading && personas.length === 0) {
    return <PersonaListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onEdit={() => onEdit(persona)}
            onDelete={() => onDelete(persona.id)}
            selectionMode={selectionMode}
            selected={selectedPersonas.some((p) => p.id === persona.id)}
            onSelect={(selected) => onSelect(persona, selected)}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-dreamaker-purple/20 hover:bg-dreamaker-purple/30 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
