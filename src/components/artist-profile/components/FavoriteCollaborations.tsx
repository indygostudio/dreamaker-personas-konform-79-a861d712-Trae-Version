
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, X } from "lucide-react";
import type { Persona } from "@/types/persona";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface FavoriteCollaborationsProps {
  favoritePersonas?: Persona[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPersonaSelect: (persona: Persona) => void;
}

export const FavoriteCollaborations = ({
  favoritePersonas,
  isOpen,
  onOpenChange,
  onPersonaSelect,
}: FavoriteCollaborationsProps) => {
  const handleRemoveFavorite = async (e: React.MouseEvent, personaId: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from("persona_follows")
        .update({ is_favorite: false })
        .eq("persona_id", personaId);

      if (error) throw error;

      toast({
        title: "Favorite removed",
        description: "The persona has been removed from your favorites"
      });
    } catch (error: any) {
      toast({
        title: "Error removing favorite",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="overflow-auto">
      <ScrollArea className="w-full" type="scroll">
        <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {favoritePersonas && favoritePersonas.length > 0 ? (
            favoritePersonas.map((persona) => (
              <div 
                key={persona.id} 
                className="relative flex-shrink-0 w-[220px] h-[100px] group overflow-hidden rounded-lg border border-dreamaker-purple/20 hover:border-dreamaker-purple/40 transition-all duration-300 bg-black/30 cursor-pointer"
                onClick={() => onPersonaSelect(persona)}
              >
                <button
                  onClick={(e) => handleRemoveFavorite(e, persona.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-red-500/60 text-white/60 hover:text-white transition-colors z-10"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="flex h-full p-2">
                  <div className="w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={persona.avatar_url}
                      alt={persona.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col ml-2 flex-1">
                    <h4 className="text-xs font-semibold text-white mb-1 truncate">
                      {persona.name}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 text-[10px]">
                      {persona.description}
                    </p>
                    <div className="mt-auto flex items-center gap-1">
                      <span className="text-[9px] text-gray-500">
                        {new Date(persona.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full py-4 text-gray-400 text-sm">
              No favorites yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
