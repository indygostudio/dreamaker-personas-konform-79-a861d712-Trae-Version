
import { Button } from "@/components/ui/button";
import { Loader, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { PersonaAvatar } from "@/components/persona/card/PersonaAvatar";
import { useNavigate } from "react-router-dom";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { supabase } from "@/integrations/supabase/client";
import { PersonaType } from "@/types/persona";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

interface PersonaDropContainerProps {
  userId?: string;
  onRefetchCollaborations: () => void;
}

export const PersonaDropContainer = ({ 
  userId, 
  onRefetchCollaborations 
}: PersonaDropContainerProps) => {
  const navigate = useNavigate();
  const { selectedPersonas, clearSelection, addPersona, removePersona } = useSelectedPersonasStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for content - in a real app this would be tied to actual video/asset loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreateCollaboration = async () => {
    if (selectedPersonas.length === 0) {
      toast.error("Please select at least one persona to create a collaboration");
      return;
    }

    try {
      // Create new persona as a collaboration
      const { data: newPersona, error } = await supabase
        .from("personas")
        .insert({
          name: `Collaboration ${new Date().toLocaleDateString()}`,
          type: "AI_CHARACTER",
          description: `Collaboration between ${selectedPersonas.map(p => p.name).join(", ")}`,
          is_collab: true,
          included_personas: selectedPersonas.map(p => p.id),
          user_id: userId,
          is_public: false,
          avatar_url: selectedPersonas[0].avatarUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // Get latest collaboration session or create one if it doesn't exist
      const { data: existingSession } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingSession) {
        // Update existing collaboration session with all selected personas
        const updatedPersonas = [...(existingSession.personas || [])];
        
        // Add all selected persona IDs to the session if they don't already exist
        for (const persona of selectedPersonas) {
          if (persona.id && !updatedPersonas.includes(persona.id)) {
            updatedPersonas.push(persona.id);
          }
        }
        
        await supabase
          .from('collaboration_sessions')
          .update({ personas: updatedPersonas })
          .eq('id', existingSession.id);
      } else {
        // Create a new collaboration session
        await supabase
          .from('collaboration_sessions')
          .insert({
            user_id: userId,
            personas: selectedPersonas.map(p => p.id).filter(Boolean),
            name: `Session ${new Date().toLocaleDateString()}`
          });
      }

      clearSelection();
      onRefetchCollaborations();
      
      toast.success("Collaboration created successfully!");
      navigate("/konform?tab=project");
    } catch (error) {
      console.error("Error creating collaboration:", error);
      toast.error("Failed to create collaboration. Please try again.");
    }
  };

  const handleAddToProject = async () => {
    if (selectedPersonas.length === 0) {
      toast.error("Please select at least one persona to add to project");
      return;
    }
    
    try {
      // Get latest collaboration session or create one if it doesn't exist
      const { data: existingSession } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingSession) {
        // Update existing collaboration session with all selected personas
        const updatedPersonas = [...(existingSession.personas || [])];
        
        // Add all selected persona IDs to the session if they don't already exist
        for (const persona of selectedPersonas) {
          if (persona.id && !updatedPersonas.includes(persona.id)) {
            updatedPersonas.push(persona.id);
          }
        }
        
        await supabase
          .from('collaboration_sessions')
          .update({ personas: updatedPersonas })
          .eq('id', existingSession.id);
      } else {
        // Create a new collaboration session
        await supabase
          .from('collaboration_sessions')
          .insert({
            user_id: userId,
            personas: selectedPersonas.map(p => p.id).filter(Boolean),
            name: `Session ${new Date().toLocaleDateString()}`
          });
      }

      // Invalidate queries to refresh UI
      onRefetchCollaborations();
      
      navigate("/konform?tab=project");
      toast.success("Personas added to project successfully");
    } catch (error) {
      console.error("Error adding personas to project:", error);
      toast.error("Failed to add personas to project. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      addPersona(data);
      toast.success(`Added ${data.name} to project`);
    } catch (error) {
      console.error("Error handling drop:", error);
      toast.error("Could not add this persona to your project");
    }
  };

  // Group personas by type
  const groupedPersonas = selectedPersonas.reduce((acc, persona) => {
    const type = persona.type || 'AI_CHARACTER';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(persona);
    return acc;
  }, {} as Record<PersonaType | string, typeof selectedPersonas>);

  // Order of persona types display
  const typeDisplayOrder: PersonaType[] = [
    "AI_VOCALIST", 
    "AI_CHARACTER", 
    "AI_INSTRUMENTALIST", 
    "AI_MIXER", 
    "AI_WRITER", 
    "AI_EFFECT", 
    "AI_SOUND"
  ];

  // Get type label
  const getTypeLabel = (type: string): string => {
    return type.replace('AI_', '');
  };

  return (
    <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border-2 border-dashed border-dreamaker-purple/50 hover:border-dreamaker-purple/70 transition-colors mb-6">
      <div 
        className="p-6"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearSelection()}
              className="bg-red-500/10 hover:bg-red-500/20 border-red-500/50 text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateCollaboration}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Create Collaboration
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToProject}
              className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/50 text-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Project
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            {selectedPersonas.length} personas selected
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader className="h-12 w-12 animate-spin text-dreamaker-purple mb-4" />
            <p className="text-dreamaker-purple/80">Loading avatars...</p>
          </div>
        ) : selectedPersonas.length > 0 ? (
          <div className="w-full">
            <div className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide">
              {typeDisplayOrder.map(type => {
                const personas = groupedPersonas[type];
                if (!personas || personas.length === 0) return null;
                
                return (
                  <div key={type} className="flex-shrink-0 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xs uppercase tracking-wider text-dreamaker-purple/80">
                        {getTypeLabel(type)}
                      </h4>
                      <span className="text-xs text-gray-500">({personas.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {personas.map((persona) => (
                        <PersonaAvatar
                          key={persona.id}
                          avatarUrl={persona.avatarUrl}
                          name={persona.name}
                          personaId={persona.id}
                          type={persona.type}
                          size="sm"
                          showRemove
                          onRemove={() => removePersona(persona.name)}
                          isInDropZone
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-white">Drop Persona Here</h3>
            <p className="text-gray-400 mt-2">Drop the persona to add it to your project</p>
          </>
        )}
      </div>
    </div>
  );
};
