
import { Card } from "@/components/ui/card";
import type { Persona } from "@/types/persona";
import { toast } from "sonner";
import { PersonaContextMenu } from "./PersonaContextMenu";
import { PersonaBanner } from "./PersonaBanner";
import { PersonaCardContent } from "./PersonaCardContent";
import { PersonaCardActions } from "./PersonaCardActions";

export interface PersonaCardProps {
  persona: Persona;
  onClick?: () => void;
  onSelect?: () => void;
  selected?: boolean;
}

export function PersonaCard({ persona, onClick, onSelect, selected }: PersonaCardProps) {
  const handleDuplicate = async () => {
    try {
      toast.loading("Duplicating persona...");
      // Clone the persona with the same data but a new ID
      // This will be handled by the PersonaContextMenu component
      toast.success("Persona duplicated");
    } catch (error) {
      console.error("Error duplicating persona:", error);
      toast.error("Failed to duplicate persona");
    }
  };

  const handleExport = () => {
    toast.success("Exporting persona");
  };

  const handleImport = () => {
    toast.success("Importing persona");
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting persona...");
      // Delete the persona
      // This will be handled by the PersonaContextMenu component
      toast.success("Persona deleted");
    } catch (error) {
      console.error("Error deleting persona:", error);
      toast.error("Failed to delete persona");
    }
  };

  const handleToggleFavorite = async () => {
    toast.success("Toggled favorite status");
  };

  const { handleClick } = PersonaCardActions({
    personaId: persona.id,
    isPublic: !!persona.is_public,
    onDuplicate: handleDuplicate,
    onExport: handleExport,
    onImport: handleImport,
    onDelete: handleDelete,
    onToggleFavorite: handleToggleFavorite
  });

  return (
    <PersonaContextMenu
      onDuplicate={handleDuplicate}
      onExport={handleExport}
      onImport={handleImport}
      onDelete={handleDelete}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={!!persona.is_favorite}
      personaId={persona.id}
      isCollab={!!persona.is_collab}
    >
      <Card
        className={`group relative overflow-hidden bg-black/60 border-dreamaker-purple/20 hover:border-dreamaker-purple/40 transition-all duration-300 cursor-pointer ${
          !persona.is_public ? 'opacity-75' : ''
        }`}
        onClick={(e) => {
          handleClick(e);
          if (onClick) onClick();
        }}
      >
        <PersonaBanner persona={persona} />
        <PersonaCardContent persona={persona} />
      </Card>
    </PersonaContextMenu>
  );
}
