
import { Copy, Upload, Download, StarIcon, Trash2Icon, Plus, UserPlus2, ExternalLink } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { TransferOwnershipDialog } from "./dialogs/TransferOwnershipDialog";
import { DeletePersonaDialog } from "./dialogs/DeletePersonaDialog";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useSession } from "@supabase/auth-helpers-react";

interface PersonaContextMenuProps {
  children: React.ReactNode;
  onDuplicate: () => void;
  onExport: () => void;
  onImport: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  isFavorite: boolean;
  personaId: string;
  isCollab?: boolean;
}

export const PersonaContextMenu = ({
  children,
  onDuplicate,
  onExport,
  onImport,
  onToggleFavorite,
  onDelete,
  isFavorite,
  personaId,
  isCollab = false,
}: PersonaContextMenuProps) => {
  const { toast } = useToast();
  const session = useSession();
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { addPersona, setShowDropContainer } = useSelectedPersonasStore();

  const handleDuplicate = async () => {
    try {
      // First get the persona data
      const { data: persona, error: fetchError } = await supabase
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .single();

      if (fetchError) throw fetchError;

      // Create a new persona with the same data
      const { data: newPersona, error: createError } = await supabase
        .from("personas")
        .insert({
          ...persona,
          id: undefined, // Let Supabase generate a new ID
          name: `${persona.name} (Copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: session?.user?.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      toast({
        title: "Success",
        description: "Persona duplicated successfully",
      });

      onDuplicate();
    } catch (error) {
      console.error("Error duplicating persona:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate persona",
        variant: "destructive",
      });
    }
  };

  const handleAddToProject = async () => {
    try {
      const { data: persona, error } = await supabase
        .from("personas")
        .select("name, avatar_url, type")
        .eq("id", personaId)
        .single();

      if (error) throw error;

      setShowDropContainer(true);
      addPersona({
        name: persona.name,
        avatarUrl: persona.avatar_url,
        id: personaId,
        type: persona.type
      });
      document.dispatchEvent(new CustomEvent('collapseHeader'));

      toast({
        title: "Success",
        description: "Added persona to project",
      });
    } catch (error) {
      console.error("Error fetching persona:", error);
      toast({
        title: "Error",
        description: "Failed to add persona to project",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64 bg-dreamaker-gray border-dreamaker-purple/20">
          <ContextMenuItem 
            onClick={() => window.open(`/personas/${personaId}`, '_blank')}
            className="text-gray-300 hover:text-white focus:text-white hover:bg-dreamaker-purple/10 focus:bg-dreamaker-purple/10"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={handleAddToProject}
            className="text-gray-300 hover:text-white focus:text-white hover:bg-dreamaker-purple/10 focus:bg-dreamaker-purple/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Project
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={handleDuplicate} 
            className="text-gray-300 hover:text-white focus:text-white hover:bg-dreamaker-purple/10 focus:bg-dreamaker-purple/10"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={onExport} 
            className="text-gray-300 hover:text-white focus:text-white hover:bg-dreamaker-purple/10 focus:bg-dreamaker-purple/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={onImport} 
            className="text-gray-300 hover:text-white focus:text-white hover:bg-dreamaker-purple/10 focus:bg-dreamaker-purple/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </ContextMenuItem>
          <ContextMenuSeparator className="bg-dreamaker-purple/20" />
          <ContextMenuItem 
            onClick={onToggleFavorite} 
            className="text-gray-300 hover:text-white focus:text-white hover:bg-dreamaker-purple/10 focus:bg-dreamaker-purple/10"
          >
            <StarIcon className={`h-4 w-4 mr-2 ${isFavorite ? "fill-yellow-400" : ""}`} />
            {isFavorite ? "Unfavorite" : "Favorite"}
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => setShowTransferDialog(true)} 
            className="text-gray-300 hover:text-white focus:text-white hover:bg-dreamaker-purple/10 focus:bg-dreamaker-purple/10"
          >
            <UserMinus2 className="h-4 w-4 mr-2" />
            Transfer Ownership
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => setShowDeleteDialog(true)} 
            className="text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete Profile
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <TransferOwnershipDialog
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        personaId={personaId}
      />

      <DeletePersonaDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        personaId={personaId}
        onDelete={onDelete}
      />
      {showTransferDialog && (
        <TransferOwnershipDialog
          open={showTransferDialog}
          onOpenChange={setShowTransferDialog}
          personaId={personaId}
        />
      )}
    </>
  );
};
