
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SelectedPersonasProps {
  onAddToProject: () => void;
  onCreateGroup: () => void;
}

export function SelectedPersonas({
  onAddToProject,
  onCreateGroup
}: SelectedPersonasProps) {
  const { 
    selectedPersonas, 
    showDropContainer, 
    addPersona,
    removePersona, 
    clearSelection, 
    setShowDropContainer 
  } = useSelectedPersonasStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && !selectedPersonas.some(p => p.name === data.name)) {
        addPersona(data);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleAddToProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First, create a story
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          title: 'New Collaboration',
          status: 'draft' // Changed from 'active' to 'draft' to match constraint
        })
        .select()
        .single();

      if (storyError) {
        console.error('Story creation error:', storyError);
        throw storyError;
      }

      // Then create a collaboration session
      const { data: session, error: sessionError } = await supabase
        .from('collaboration_sessions')
        .insert({
          user_id: user.id,
          name: 'New Collaboration',
          personas: selectedPersonas.map(p => p.id),
          status: 'active',
          version: 1,
          performance_metrics: {},
          output_settings: {},
          style_blend_settings: {},
          voice_blend_settings: {}
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        throw sessionError;
      }

      console.log('Created session:', session);

      // Create tracks for each persona
      for (const persona of selectedPersonas) {
        const { error: trackError } = await supabase
          .from('audio_tracks')
          .insert({
            title: persona.name,
            user_id: user.id,
            story_id: story.id,
            duration: 0,
            file_url: '',
            beat_positions: {},
            bpm: 120
          });

        if (trackError) {
          console.error('Track creation error:', trackError);
          throw trackError;
        }
      }

      toast({
        title: "Success",
        description: "Personas added to project successfully",
      });

      // Navigate to Konform with project tab active
      navigate('/konform', { 
        state: { activeTab: 'project', sessionId: session.id }
      });
      
      // Clear selection after successful addition
      clearSelection();

    } catch (error: any) {
      console.error('Error in handleAddToProject:', error);
      toast({
        title: "Error",
        description: "Failed to add personas to project",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div 
        className="border-2 border-dashed border-dreamaker-purple rounded-lg p-4 bg-black/40 backdrop-blur-sm transition-all duration-300" 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-200">
              {selectedPersonas.length > 0 ? `${selectedPersonas.length} personas selected` : "Drop personas here to add to project"}
            </h3>
            {selectedPersonas.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearSelection} 
                className="text-gray-400 hover:text-white h-8"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {selectedPersonas.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex-1 flex flex-wrap gap-2">
                {selectedPersonas.map((persona, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 bg-dreamaker-purple/20 rounded-full px-2 py-1 group hover:bg-dreamaker-purple/30 transition-colors"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={persona.avatarUrl} />
                      <AvatarFallback>{persona.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white">{persona.name}</span>
                    <button 
                      onClick={() => removePersona(persona.name)} 
                      className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button 
                  onClick={handleAddToProject} 
                  variant="default" 
                  size="sm" 
                  className="bg-dreamaker-purple hover:bg-dreamaker-purple/90 h-8"
                >
                  Add to Project
                </Button>
                {selectedPersonas.length >= 2 && (
                  <Button 
                    onClick={onCreateGroup} 
                    variant="outline" 
                    size="sm" 
                    className="border-dreamaker-purple text-dreamaker-purple hover:bg-dreamaker-purple/10 h-8"
                  >
                    Create Collab
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
