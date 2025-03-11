
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { usePersonaDelete } from "@/components/persona/hooks/usePersonaDelete";
import { useUser } from "@/hooks/useUser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeletePersonaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId: string;
  onDelete: () => void;
}

export const DeletePersonaDialog = ({
  open,
  onOpenChange,
  personaId,
  onDelete,
}: DeletePersonaDialogProps) => {
  const { toast } = useToast();
  const session = useSession();
  const { user } = useUser(); // Add this hook to ensure we have the user
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleDeletePersona } = usePersonaDelete();

  const handleDeleteConfirm = async () => {
    try {
      // Check both session and user to ensure we're authenticated
      if (!session?.user?.id || !user?.id) {
        console.error("No session or user found:", { session, user });
        toast({
          title: "Error",
          description: "You must be logged in to delete a persona",
          variant: "destructive",
        });
        return;
      }

      const success = await handleDeletePersona(personaId);
      
      if (success) {
        onOpenChange(false);
        
        const pathSegments = window.location.pathname.split('/');
        const isOnArtistProfile = pathSegments[1] === 'artists';
        const artistId = isOnArtistProfile ? pathSegments[2] : null;
        
        // Invalidate all relevant queries
        if (isOnArtistProfile && artistId) {
          await queryClient.invalidateQueries({ 
            queryKey: ["artist-personas", artistId]
          });
          await queryClient.invalidateQueries({ 
            queryKey: ["artist-collaborations", artistId]
          });
          await queryClient.invalidateQueries({ 
            queryKey: ["artist-profile", artistId]
          });
        } else {
          await queryClient.invalidateQueries({ 
            queryKey: ["personas"]
          });
        }
        
        // Navigate to the appropriate page
        if (window.location.pathname.includes(`/personas/${personaId}`)) {
          if (isOnArtistProfile && artistId) {
            navigate(`/artists/${artistId}`);
          } else {
            navigate('/personas');
          }
        }
        
        onDelete?.();
        
        toast({
          title: "Success",
          description: "Persona deleted successfully",
        });
      }
    } catch (error: any) {
      console.error("Error deleting persona:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete persona",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-black/90 border-dreamaker-purple/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this persona?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the persona
            and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-white border-white/20 hover:bg-white/10">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
