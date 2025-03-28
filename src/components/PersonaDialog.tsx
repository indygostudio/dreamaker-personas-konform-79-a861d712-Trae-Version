
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PersonaForm } from "@/components/PersonaForm";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { Persona } from "@/types/persona";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import type { PersonaFormValues } from "@/components/PersonaForm";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

interface PersonaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: Persona | null;
  onSuccess: () => void;
}

export const PersonaDialog = ({
  open,
  onOpenChange,
  persona,
  onSuccess,
}: PersonaDialogProps) => {
  const location = useLocation();
  const artistId = location.pathname.split('/')[2];
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (values: PersonaFormValues) => {
    try {
      if (!user) {
        toast.error("You must be logged in to update a persona");
        return;
      }
      
      setIsSaving(true);

      const personaData = {
        name: values.name,
        type: values.type,
        description: values.description,
        style: values.style,
        avatar_url: values.avatar_url,
        video_url: values.video_url,
        age: values.age || null,
        artist_category: values.artist_category,
        banner_url: values.banner_url,
        voice_type: values.voice_type,
        vocal_style: values.vocal_style,
        banner_darkness: values.banner_darkness,
        is_public: values.is_public,
        user_id: user.id, // Use the authenticated user's ID
        artist_profile_id: artistId,
        audio_preview_url: values.audio_preview_url
      };

      if (persona?.id) {
        // Update existing persona
        const { error } = await supabase
          .from('personas')
          .update(personaData)
          .eq('id', persona.id);

        if (error) throw error;
        toast.success("Persona updated successfully");
      } else {
        // Create new persona
        const { data: newPersona, error } = await supabase
          .from('personas')
          .insert([personaData])
          .select()
          .single();

        if (error) throw error;

        // Update artist profile with new persona
        const { data: artistProfile, error: profileError } = await supabase
          .from('artist_profiles')
          .select('persona_ids, persona_count')
          .eq('id', artistId)
          .single();

        if (profileError) throw profileError;

        const { error: updateError } = await supabase
          .from('artist_profiles')
          .update({
            persona_ids: [...(artistProfile?.persona_ids || []), newPersona.id],
            persona_count: (artistProfile?.persona_count || 0) + 1
          })
          .eq('id', artistId);

        if (updateError) throw updateError;

        toast.success("Persona created successfully");
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save persona");
      console.error("Error saving persona:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-screen-lg w-[95vw] h-[90vh] overflow-hidden bg-black/95 border-dreamaker-purple/20">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={100} minSize={30} maxSize={100}>
            <ScrollArea className="h-full w-full p-6">
              <PersonaForm
                defaultValues={persona ? {
                  id: persona.id, // Add id when editing existing persona
                  name: persona.name || "",
                  type: persona.type || "AI_VOCALIST",
                  description: persona.description || "",
                  style: persona.style || "",
                  avatar_url: persona.avatar_url || "",
                  video_url: persona.video_url || "",
                  age: persona.age || "",
                  artist_category: persona.artist_category || "",
                  banner_url: persona.banner_url || "",
                  voice_type: persona.voice_type || "",
                  vocal_style: persona.vocal_style || "",
                  banner_darkness: persona.banner_darkness || 50,
                  is_public: persona.is_public || false,
                  audio_preview_url: persona.audio_preview_url || ""
                } : {
                  name: "",
                  type: "AI_VOCALIST",
                  description: "",
                  style: "",
                  avatar_url: "",
                  video_url: "",
                  age: "",
                  artist_category: "",
                  banner_url: "",
                  voice_type: "",
                  vocal_style: "",
                  banner_darkness: 50,
                  is_public: false,
                  audio_preview_url: ""
                }}
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
                isSubmitting={isSaving}
              />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  );
};
