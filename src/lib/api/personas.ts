
import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/types/persona";

export const deletePersona = async (id: string, userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Get persona details
  const { data: persona, error: personaError } = await supabase
    .from('personas')
    .select('user_id, artist_profile_id')
    .eq('id', id)
    .single();

  if (personaError) {
    console.error("Error fetching persona:", personaError);
    throw new Error("Failed to fetch persona details");
  }

  // Check if user owns the persona
  if (persona.user_id !== userId) {
    throw new Error("You don't have permission to delete this persona");
  }

  // Start a transaction by removing the persona from the artist_profile first
  if (persona.artist_profile_id) {
    const { data: profile, error: profileError } = await supabase
      .from('artist_profiles')
      .select('persona_ids, persona_count')
      .eq('id', persona.artist_profile_id)
      .single();

    if (profileError) {
      console.error("Error fetching artist profile:", profileError);
      throw new Error("Failed to update artist profile");
    }

    // Remove the persona ID from the array and decrement the count
    const updatedPersonaIds = (profile.persona_ids || []).filter((pid: string) => pid !== id);
    const { error: updateError } = await supabase
      .from('artist_profiles')
      .update({ 
        persona_ids: updatedPersonaIds,
        persona_count: Math.max(0, (profile.persona_count || 1) - 1)
      })
      .eq('id', persona.artist_profile_id);

    if (updateError) {
      console.error("Error updating artist profile:", updateError);
      throw new Error("Failed to update artist profile");
    }
  }

  // Delete the persona
  const { error: deleteError } = await supabase
    .from('personas')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (deleteError) {
    console.error("Error deleting persona:", deleteError);
    throw new Error("Failed to delete persona");
  }

  return true;
};

export const deleteMultiplePersonas = async (personas: Persona[], userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const personaIds = personas.map(p => p.id);
  
  const { error } = await supabase
    .from("personas")
    .delete()
    .in('id', personaIds)
    .eq('user_id', userId);

  if (error) {
    console.error("Error deleting personas:", error);
    throw new Error("Failed to delete selected personas");
  }

  return true;
};
