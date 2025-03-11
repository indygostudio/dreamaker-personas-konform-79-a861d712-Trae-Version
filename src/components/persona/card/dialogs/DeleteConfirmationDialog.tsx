
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId: string;
  onDelete?: () => void;
}

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  personaId,
  onDelete,
}: DeleteConfirmationDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!personaId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', personaId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["personas"] });
      
      toast({
        title: "Success",
        description: "Persona deleted successfully",
      });
      
      if (onDelete) onDelete();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete persona",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-dreamaker-gray border-dreamaker-purple/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you sure you want to delete this persona?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete the persona
            and all associated data.
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
            }} 
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
