
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DAWView } from "../DAWView";
import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/types/persona";
import type { PersonaState } from "../daw/types";

export const TrackbaseView = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const handlePersonaSelect = async (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const handlePersonaDeselect = () => {
    setSelectedPersona(null);
  };

  const handlePersonaUpdate = async (persona: Persona, state: Partial<PersonaState>) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save changes",
          variant: "destructive",
        });
        return;
      }

      // Check if state exists for this persona
      const { data: existingState } = await supabase
        .from('persona_states')
        .select('*')
        .eq('persona_id', persona.id)
        .eq('user_id', user.id)
        .single();

      if (existingState) {
        // Update existing state
        const { error } = await supabase
          .from('persona_states')
          .update(state)
          .eq('id', existingState.id);

        if (error) throw error;
      } else {
        // Create new state
        const { error } = await supabase
          .from('persona_states')
          .insert([{
            persona_id: persona.id,
            user_id: user.id,
            ...state
          }]);

        if (error) throw error;
      }

      toast({
        title: "Changes Saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving persona state:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DAWView
      selectedPersona={selectedPersona}
      onPersonaSelect={handlePersonaSelect}
      onPersonaDeselect={handlePersonaDeselect}
      onPersonaUpdate={handlePersonaUpdate}
    />
  );
};
