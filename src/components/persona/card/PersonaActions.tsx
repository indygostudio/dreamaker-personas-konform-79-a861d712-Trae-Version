
import { Button } from "@/components/ui/button";
import { Edit2Icon, Heart } from "lucide-react";

interface PersonaActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  personaId: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const PersonaActions = ({ 
  onEdit, 
  onDelete, 
  personaId, 
  isFavorite, 
  onToggleFavorite 
}: PersonaActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onEdit}
        className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors"
      >
        <Edit2Icon className="h-4 w-4 mr-1" />
        Collaborate
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onToggleFavorite}
        className={`bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors ${
          isFavorite ? 'text-red-500 hover:text-red-600' : ''
        }`}
      >
        <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? 'Favorited' : 'Favorite'}
      </Button>
    </div>
  );
};
