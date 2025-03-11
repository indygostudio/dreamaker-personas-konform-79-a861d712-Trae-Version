
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { PersonaCard } from "@/components/PersonaCard";
import { X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Persona } from "@/types/persona";

interface AIArtistsProps {
  sessionId?: string;
  personas?: Persona[];
  onEdit?: (personaId: string) => void;
  onDelete?: (personaId: string) => Promise<void>;
}

export const AIArtists = ({ sessionId, personas = [], onEdit, onDelete }: AIArtistsProps) => {
  const { toast } = useToast();

  const { data: displayPersonas, refetch } = useQuery({
    queryKey: ['session-personas', sessionId],
    queryFn: async () => {
      if (!sessionId) return personas;

      const { data: session } = await supabase
        .from('collaboration_sessions')
        .select('personas')
        .eq('id', sessionId)
        .maybeSingle();

      if (!session?.personas?.length) return [];

      const { data: personasData } = await supabase
        .from('personas')
        .select('*')
        .in('id', session.personas)
        .in('type', ['AI_VOCALIST', 'AI_INSTRUMENTALIST', 'AI_MIXER', 'AI_EFFECT', 'AI_SOUND']);

      return personasData || [];
    },
    enabled: !!sessionId
  });

  const handleRemoveFromSession = async (personaId: string) => {
    if (!sessionId) return;

    try {
      const { data: session } = await supabase
        .from('collaboration_sessions')
        .select('personas')
        .eq('id', sessionId)
        .maybeSingle();

      if (!session) return;

      const updatedPersonas = session.personas.filter((id: string) => id !== personaId);

      const { error } = await supabase
        .from('collaboration_sessions')
        .update({ personas: updatedPersonas })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI Artist removed from the current project",
      });

      refetch();
    } catch (error) {
      console.error("Error removing persona from session:", error);
      toast({
        title: "Error",
        description: "Failed to remove AI Artist from the project",
        variant: "destructive",
      });
    }
  };

  const handleClearAllArtists = async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('collaboration_sessions')
        .update({ personas: [] })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All AI Artists have been removed from the project",
      });

      refetch();
    } catch (error) {
      console.error("Error clearing artists:", error);
      toast({
        title: "Error",
        description: "Failed to clear AI Artists from the project",
        variant: "destructive",
      });
    }
  };

  return (
    <CollapsibleContent>
      <div className="space-y-4">
        {sessionId && displayPersonas?.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAllArtists}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Artists
            </Button>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayPersonas?.map((persona) => (
            <div key={persona.id} className="relative group">
              <PersonaCard
                persona={persona}
                onEdit={() => onEdit?.(persona.id)}
                onDelete={() => sessionId ? handleRemoveFromSession(persona.id) : onDelete?.(persona.id)}
              />
              {sessionId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFromSession(persona.id)}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </CollapsibleContent>
  );
};
