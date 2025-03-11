
import { Badge } from "@/components/ui/badge";
import { Heart, Users } from "lucide-react";
import type { Persona } from "@/types/persona";

interface PersonaCardContentProps {
  persona: Persona;
}

export const PersonaCardContent = ({ persona }: PersonaCardContentProps) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white mb-2">{persona.name}</h3>
      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
        {persona.description || "No description provided"}
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{persona.likes_count || 0}</span>
        </div>
        {persona.is_collab && (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Collab</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{persona.user_count || 0} users</span>
        </div>
      </div>

      {persona.genre_specialties && persona.genre_specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {persona.genre_specialties.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="bg-dreamaker-purple/10 text-dreamaker-purple text-xs"
            >
              {genre}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
