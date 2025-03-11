
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/types/persona";
import { BlendingControls } from "./BlendingControls";
import { AvatarMerger } from "./AvatarMerger";
import { CollaborationForm } from "./CollaborationForm";

interface CollaborationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personas: Persona[];
}

export const CollaborationDialog = ({
  open,
  onOpenChange,
  personas,
}: CollaborationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blendRatios, setBlendRatios] = useState<Record<string, number>>(() =>
    personas.reduce((acc, persona) => {
      acc[persona.id] = 100 / personas.length;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleBlendChange = (personaId: string, value: number[]) => {
    const newRatio = value[0];
    const oldRatio = blendRatios[personaId];
    const diff = newRatio - oldRatio;
    
    const remainingRatio = 100 - newRatio;
    const otherPersonas = personas.filter(p => p.id !== personaId);
    
    const currentSum = otherPersonas.reduce((sum, p) => sum + blendRatios[p.id], 0);
    
    const newRatios = { ...blendRatios };
    newRatios[personaId] = newRatio;
    
    if (currentSum > 0) {
      otherPersonas.forEach(p => {
        const proportion = blendRatios[p.id] / currentSum;
        newRatios[p.id] = Math.max(0, Math.min(100, remainingRatio * proportion));
      });
    } else {
      const equalShare = remainingRatio / otherPersonas.length;
      otherPersonas.forEach(p => {
        newRatios[p.id] = equalShare;
      });
    }
    
    setBlendRatios(newRatios);
  };

  const handleCreateCollaboration = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast("Authentication Required - Please sign in to create a collaboration");
        return;
      }

      const sortedPersonas = [...personas].sort(
        (a, b) => blendRatios[b.id] - blendRatios[a.id]
      );

      const firstName = sortedPersonas[0].name.split(' ')[0];
      const lastName = sortedPersonas[1].name.split(' ').slice(-1)[0];
      const collabName = `${firstName} ${lastName}`;

      const description = `A collaboration between ${personas
        .map(p => `${p.name} (${Math.round(blendRatios[p.id])}%)`)
        .join(", ")}.`;

      const { error: insertError } = await supabase
        .from("personas")
        .insert({
          name: collabName,
          description,
          user_id: user.id,
          is_collab: true,
          parent_personas: personas.map(p => p.id),
          style: sortedPersonas[0].style,
          voice_type: sortedPersonas[0].voice_type,
          collaboration_settings: {
            member_blend_ratios: blendRatios,
            collaboration_type: "equal",
            primary_vocals: sortedPersonas[0].id
          }
        });

      if (insertError) throw insertError;

      toast("Collaborative persona created successfully!");

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating collaboration:", error);
      toast("Failed to create collaborative persona");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBlendRatio = Object.values(blendRatios).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-dreamaker-bg border-dreamaker-purple/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI Artist Collaboration</DialogTitle>
          <DialogDescription>
            Adjust the influence of each AI artist in this collaboration.
            The total influence should equal 100%.
          </DialogDescription>
        </DialogHeader>

        <BlendingControls
          personas={personas}
          blendRatios={blendRatios}
          onBlendChange={handleBlendChange}
        />

        <AvatarMerger
          personas={personas}
          blendRatios={blendRatios}
          onMergedAvatar={(url) => console.log('Merged avatar URL:', url)}
        />

        <CollaborationForm
          personas={personas}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateCollaboration}
          onCancel={() => onOpenChange(false)}
          totalBlendRatio={totalBlendRatio}
        />
      </DialogContent>
    </Dialog>
  );
};
