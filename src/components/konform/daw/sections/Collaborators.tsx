
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PersonaType } from "@/types/persona";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";

// No longer need PERSONA_TYPES constant since we're displaying creator info instead

export const Collaborators = ({ sessionId }: { sessionId: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { addPersona } = useSelectedPersonasStore();

  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['collaboration_session', sessionId],
    queryFn: async () => {
      const { data: sessionData, error: sessionError } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;

      if (sessionData?.personas?.length) {
        const { data: personasData, error: personasError } = await supabase
          .from('personas')
          .select('*')
          .in('id', sessionData.personas);

        if (personasError) throw personasError;
        
        return {
          ...sessionData,
          personas: personasData
        };
      }
      
      return sessionData;
    }
  });

  // No longer need handleRoleChange since we're displaying creator info instead of type dropdown

  const handlePersonaSelect = (persona: any) => {
    addPersona({
      id: persona.id,
      name: persona.name,
      avatarUrl: persona.avatar_url,
      type: persona.type
    });
    
    toast({
      title: "Persona Added",
      description: `${persona.name} has been added to available personas`,
    });
  };

  const handleClearCollaborators = async () => {
    try {
      // Clear personas, percentage splits, and any other related data
      const { error } = await supabase
        .from('collaboration_sessions')
        .update({ 
          personas: [],
          style_blend_settings: {
            ...session?.style_blend_settings,
            percentage_splits: {}
          },
          // Add any other fields that need to be cleared
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Invalidate all relevant queries
      await queryClient.invalidateQueries({
        queryKey: ['collaboration_session', sessionId]
      });
      await queryClient.invalidateQueries({
        queryKey: ['collaboration_session_splits', sessionId]
      });
      // Invalidate any other related queries

      // Clear local state if any
      // For example, if you're using a local state for selected personas:
      // setSelectedPersonas([]);

      toast({
        title: "Project Cleared",
        description: "All collaborators, percentage splits, and related data have been removed from the project.",
      });
    } catch (error) {
      console.error('Error clearing project data:', error);
      toast({
        title: "Error",
        description: "Failed to clear project data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddCollaborators = () => {
    if (user?.id) {
      navigate(`/artists/${user.id}`, {
        state: { activeTab: 'personas' }
      });
    } else {
      toast({
        title: "Error",
        description: "You must be logged in to add collaborators",
        variant: "destructive",
      });
    }
  };

  if (isLoadingSession) {
    return (
      <Card className="bg-black/40">
        <CardHeader className="space-y-1">
          <CardTitle className="text-md flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            Loading collaborators...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaborators
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCollaborators}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddCollaborators}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add More
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!session?.personas?.length ? (
          <div className="text-sm text-gray-400">
            No collaborators added yet
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-md" type="hover">
            <div className="flex gap-4 pb-4">
              {session.personas.map((persona: any) => (
                <div 
                  key={persona.id} 
                  className="flex items-center gap-4 p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors w-[300px] shrink-0 cursor-pointer"
                  onClick={() => handlePersonaSelect(persona)}
                >
                  <Avatar 
                    className="h-16 w-16 shrink-0"
                    onDoubleClick={() => navigate(`/personas/${persona.id}`)}
                  >
                    <AvatarImage src={persona.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-xl">{persona.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-lg font-medium mb-2 truncate">{persona.name}</p>
                    <div className="text-sm text-gray-300 flex items-center gap-1">
                      <span className="text-gray-400">Creator:</span> 
                      <span className="truncate">
                        {persona.creator_name || "Mike Bailey"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
