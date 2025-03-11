import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import type { Persona } from "@/pages/Personas";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();
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
    
    // Calculate the sum of current ratios for other personas
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

  const mergeAvatars = async (avatarUrls: string[]): Promise<string> => {
    try {
      // Create a canvas to merge the images
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 400;
      canvas.height = 400;

      // Load all images
      const images = await Promise.all(
        avatarUrls.map(url => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
          });
        })
      );

      // Draw images with opacity based on blend ratios
      images.forEach((img, index) => {
        if (ctx) {
          ctx.globalAlpha = blendRatios[personas[index].id] / 100;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob(blob => resolve(blob!), 'image/png')
      );

      // Upload merged image to Supabase storage
      const filePath = `${crypto.randomUUID()}.png`;
      const { error: uploadError, data } = await supabase.storage
        .from('persona_avatars')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('persona_avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error merging avatars:', error);
      throw error;
    }
  };

  const handleCreateCollaboration = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a collaboration",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Sort personas by blend ratio to get the two most influential ones
      const sortedPersonas = [...personas].sort(
        (a, b) => blendRatios[b.id] - blendRatios[a.id]
      );

      // Get first name from the first persona and last name from the second persona
      const firstName = sortedPersonas[0].name.split(' ')[0];
      const lastName = sortedPersonas[1].name.split(' ').slice(-1)[0];
      const collabName = `${firstName} ${lastName}`;

      // Create a description that includes the blend ratios
      const description = `A collaboration between ${personas
        .map(p => `${p.name} (${Math.round(blendRatios[p.id])}%)`)
        .join(", ")}.`;

      // Merge avatars
      const avatarUrls = personas
        .filter(p => p.avatar_url)
        .map(p => p.avatar_url!);
      
      let mergedAvatarUrl = null;
      if (avatarUrls.length > 0) {
        mergedAvatarUrl = await mergeAvatars(avatarUrls);
      }

      // Insert the new collaborative persona
      const { error: insertError } = await supabase
        .from("personas")
        .insert({
          name: collabName,
          description,
          user_id: user.id,
          is_collab: true,
          parent_personas: personas.map(p => p.id),
          avatar_url: mergedAvatarUrl,
          // Inherit some properties from the dominant persona
          style: personas.find(p => p.id === Object.entries(blendRatios)
            .sort(([, a], [, b]) => b - a)[0][0])?.style,
          voice_type: personas.find(p => p.id === Object.entries(blendRatios)
            .sort(([, a], [, b]) => b - a)[0][0])?.voice_type,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Collaborative persona created successfully!",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating collaboration:", error);
      toast({
        title: "Error",
        description: "Failed to create collaborative persona",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="space-y-6 py-6">
          {personas.map((persona) => (
            <div key={persona.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{persona.name}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(blendRatios[persona.id] * 10) / 10}%
                </span>
              </div>
              <Slider
                value={[blendRatios[persona.id]]}
                onValueChange={(value) => handleBlendChange(persona.id, value)}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-dreamaker-purple"
              />
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Total: {Object.values(blendRatios).reduce((a, b) => a + b, 0).toFixed(1)}%
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollaboration}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Collaboration"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};