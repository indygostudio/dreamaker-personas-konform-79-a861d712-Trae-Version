
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Persona } from "@/types/persona";
import { Users } from "lucide-react";

interface RecentCollaborationsProps {
  recentCollaborations: Persona[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPersonaSelect: (persona: Persona) => void;
}

export const RecentCollaborations = ({
  recentCollaborations,
  isOpen,
  onOpenChange,
  onPersonaSelect
}: RecentCollaborationsProps) => {
  return (
    <div className="overflow-auto">
      <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {recentCollaborations && recentCollaborations.length > 0 ? (
          recentCollaborations.map((persona) => (
            <div 
              key={persona.id} 
              className="relative flex-shrink-0 w-[220px] h-[100px] group overflow-hidden rounded-lg border border-dreamaker-purple/20 hover:border-dreamaker-purple/40 transition-all duration-300 bg-black/30 cursor-pointer"
              onClick={() => onPersonaSelect(persona)}
            >
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
            No recent collaborations
          </div>
        )}
      </div>
    </div>
  );
};
