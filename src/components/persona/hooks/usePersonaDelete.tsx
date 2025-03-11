
import { useToast } from "@/components/ui/use-toast";
import type { Persona } from "@/types/persona";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePersonaDelete = () => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const handleDeletePersona = async (id: string) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be signed in to delete personas",
          variant: "destructive",
        });
        return false;
      }

      // Get the persona first to check the artist_profile_id
      const { data: persona, error: personaError } = await supabase
        .from('personas')
        .select('artist_profile_id')
        .eq('id', id)
        .single();

      if (personaError) {
        console.error("Error fetching persona:", personaError);
        throw personaError;
      }

      // Update the artist profile if there is one
      if (persona.artist_profile_id) {
        const { data: profile, error: profileError } = await supabase
          .from('artist_profiles')
          .select('persona_ids, id')
          .eq('id', persona.artist_profile_id)
          .single();

        if (!profileError && profile) {
          const updatedPersonaIds = (profile.persona_ids || []).filter((pid: string) => pid !== id);
          const { error: updateError } = await supabase
            .from('artist_profiles')
            .update({ 
              persona_ids: updatedPersonaIds,
              persona_count: Math.max(0, (profile.persona_ids?.length || 1) - 1)
            })
            .eq('id', profile.id);

          if (updateError) {
            console.error("Error updating artist profile:", updateError);
            throw updateError;
          }
        }
      }
      
      // Then delete the persona
      const { error: deleteError } = await supabase
        .from('personas')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error("Error in handleDeletePersona:", deleteError);
        throw deleteError;
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ 
        queryKey: ["personas"]
      });

      if (persona.artist_profile_id) {
        await queryClient.invalidateQueries({ 
          queryKey: ["artist-personas", persona.artist_profile_id]
        });
        await queryClient.invalidateQueries({ 
          queryKey: ["artist-profile", persona.artist_profile_id]
        });
      }
      
      toast({
        title: "Success",
        description: "Persona deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error in handleDeletePersona:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete persona",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteSelected = async (selectedPersonas: Persona[]) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be signed in to delete personas",
          variant: "destructive",
        });
        return false;
      }

      if (selectedPersonas.length === 0) {
        toast({
          title: "Error",
          description: "No personas selected for deletion",
          variant: "destructive",
        });
        return false;
      }

      const personaIds = selectedPersonas.map(p => p.id);

      // Delete all selected personas for this user
      const { error } = await supabase
        .from("personas")
        .delete()
        .in('id', personaIds)
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error in handleDeleteSelected:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete selected personas",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleDeletePersona,
    handleDeleteSelected,
  };
};
