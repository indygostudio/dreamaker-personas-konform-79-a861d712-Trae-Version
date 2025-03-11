
import { useState } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "@/hooks/use-toast";
import type { Persona } from "@/types/persona";
import { ReactNode } from "react";

interface PersonaContextActionsProps {
  artist: Persona;
  children: ReactNode;
  onAddToProject: () => void;
}

export const PersonaContextActions = ({ 
  artist, 
  children,
  onAddToProject
}: PersonaContextActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const session = useSession();
  
  const isOwner = session?.user?.id === artist.user_id;
  const canDelete = isOwner;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: artist.name,
        text: artist.description || 'Check out this persona!',
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this persona",
      });
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', artist.id);

      if (error) throw error;

      toast({
        title: "Persona deleted",
        description: "The persona has been successfully deleted",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error deleting persona",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      
      <ContextMenuContent className="bg-black/80 backdrop-blur-md border border-dreamaker-purple/20">
        <ContextMenuItem 
          onClick={onAddToProject}
          className="hover:bg-dreamaker-purple/20 text-white cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Project
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleShare}
          className="hover:bg-dreamaker-purple/20 text-white cursor-pointer"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </ContextMenuItem>
        {canDelete && (
          <ContextMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="hover:bg-red-500/20 text-red-400 cursor-pointer"
          >
            <span className="h-4 w-4 mr-2">🗑️</span>
            Delete Profile
          </ContextMenuItem>
        )}
      </ContextMenuContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-dreamaker-gray border-dreamaker-purple/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure you want to delete this persona?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your persona and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
                setDeleteDialogOpen(false);
              }} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContextMenu>
  );
};
