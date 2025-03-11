
import { MouseEvent } from "react";
import { toast } from "sonner";

interface PersonaCardActionsProps {
  personaId: string;
  isPublic: boolean;
  onDuplicate: () => void;
  onExport: () => void;
  onImport: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export const PersonaCardActions = ({
  personaId,
  isPublic,
  onDuplicate,
  onExport,
  onImport,
  onDelete,
  onToggleFavorite
}: PersonaCardActionsProps) => {
  const handleClick = (e: MouseEvent) => {
    if (!isPublic) {
      e.preventDefault();
      e.stopPropagation();
      toast.info("This profile is private. Message for access.");
      return;
    }
  };

  return { handleClick };
};
