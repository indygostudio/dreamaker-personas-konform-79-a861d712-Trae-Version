
import { useState } from "react";
import { PersonaCard } from "@/components/dreamaker/PersonaCard";
import type { Persona } from "@/types/persona";
import { useNavigate } from "react-router-dom";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { toast } from "@/hooks/use-toast";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/persona/card/dialogs/DeleteConfirmationDialog";

interface PersonaSectionProps {
  persona: Persona;
  onEdit: () => void;
  onDelete: () => void;
}

export const PersonaSection = ({ persona, onEdit, onDelete }: PersonaSectionProps) => {
  const navigate = useNavigate();
  const { addPersona, setShowDropContainer } = useSelectedPersonasStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleAuthRequired = () => {
    navigate('/auth');
  };

  const handleAddToProject = (artist: Persona) => {
    setShowDropContainer(true);
    addPersona({
      id: artist.id,
      name: artist.name,
      avatarUrl: artist.avatar_url,
      type: artist.type
    });
    toast({
      title: "Added to project",
      description: `${artist.name} has been added to your project`,
    });
  };

  return (
    <div className="space-y-4">
      <ContextMenu>
        <ContextMenuTrigger>
          <PersonaCard
            artist={persona}
            isCompact={false}
            isAdmin={true}
            onAuthRequired={handleAuthRequired}
            onAddToProject={handleAddToProject}
          />
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-black/80 backdrop-blur-md border border-dreamaker-purple/20">
          <ContextMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="hover:bg-red-500/20 text-red-400 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Profile
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        personaId={persona.id}
        onDelete={onDelete}
      />
    </div>
  );
};
