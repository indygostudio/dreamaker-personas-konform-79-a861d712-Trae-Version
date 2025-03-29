
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, X, HandshakeIcon, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PersonaType } from "@/types/persona";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const PERSONA_TYPES: PersonaType[] = [
  "AI_CHARACTER",
  "AI_VOCALIST",
  "AI_INSTRUMENTALIST",
  "AI_EFFECT",
  "AI_SOUND",
  "AI_MIXER",
  "AI_WRITER"
];

export const Collaborators = ({ sessionId }: { sessionId: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { addPersona } = useSelectedPersonasStore();
  const [collaborationDialogOpen, setCollaborationDialogOpen] = useState(false);
  const [blendRatios, setBlendRatios] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          .select('*, profiles(display_name)')
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

  // Removed handleRoleChange as we no longer need persona type selection

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
      // Clear both personas and percentage splits
      const { error } = await supabase
        .from('collaboration_sessions')
        .update({ 
          personas: [],
          style_blend_settings: {
            ...session?.style_blend_settings,
            percentage_splits: {}
          }
        })
        .eq('id', sessionId);

      if (error) throw error;

      await queryClient.invalidateQueries({
        queryKey: ['collaboration_session', sessionId]
      });
      
      // Also invalidate the percentage splits query
      await queryClient.invalidateQueries({
        queryKey: ['collaboration_session_splits', sessionId]
      });

      toast({
        title: "Collaborators Cleared",
        description: "All collaborators and percentage splits have been removed",
      });
    } catch (error) {
      console.error('Error clearing collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to clear collaborators",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCollaborator = async (personaId: string) => {
    try {
      if (!session?.personas) return;
      
      // Remove the persona from the session
      const updatedPersonas = session.personas.filter(p => p.id !== personaId);
      const { error } = await supabase
        .from('collaboration_sessions')
        .update({
          personas: updatedPersonas.map(p => p.id),
          style_blend_settings: {
            ...session.style_blend_settings,
            percentage_splits: Object.fromEntries(
              Object.entries(session.style_blend_settings?.percentage_splits || {})
                .filter(([key]) => key !== personaId)
            )
          }
        })
        .eq('id', sessionId);

      if (error) throw error;

      await queryClient.invalidateQueries({
        queryKey: ['collaboration_session', sessionId]
      });
      
      await queryClient.invalidateQueries({
        queryKey: ['collaboration_session_splits', sessionId]
      });

      toast({
        title: "Collaborator Removed",
        description: "The collaborator has been removed from the session",
      });
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
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

  const handleCreateCollaboration = () => {
    if (!session?.personas?.length) {
      toast({
        title: "No Collaborators",
        description: "Please add collaborators before creating a collaboration",
        variant: "destructive",
      });
      return;
    }

    // Initialize blend ratios with equal distribution
    const initialBlendRatios = session.personas.reduce((acc, persona) => {
      acc[persona.id] = 100 / session.personas.length;
      return acc;
    }, {} as Record<string, number>);
    
    setBlendRatios(initialBlendRatios);
    setCollaborationDialogOpen(true);
  };

  const handleBlendChange = (personaId: string, value: number[]) => {
    const newRatio = value[0];
    const oldRatio = blendRatios[personaId];
    
    const remainingRatio = 100 - newRatio;
    const otherPersonas = session?.personas?.filter(p => p.id !== personaId) || [];
    
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

  const handleSaveCollaboration = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a collaboration",
          variant: "destructive",
        });
        return;
      }

      if (!session?.personas?.length) return;

      // Sort personas by blend ratio to get the two most influential ones
      const sortedPersonas = [...session.personas].sort(
        (a, b) => blendRatios[b.id] - blendRatios[a.id]
      );

      // Get first name from the first persona and last name from the second persona
      const firstName = sortedPersonas[0].name.split(' ')[0];
      const lastName = sortedPersonas.length > 1 
        ? sortedPersonas[1].name.split(' ').slice(-1)[0]
        : sortedPersonas[0].name.split(' ').slice(-1)[0];
      const collabName = `${firstName} ${lastName}`;

      // Create a description that includes the blend ratios
      const description = `A collaboration between ${session.personas
        .map(p => `${p.name} (${Math.round(blendRatios[p.id])}%)`)
        .join(", ")}.`;

      // Insert the new collaborative persona
      const { error: insertError } = await supabase
        .from("personas")
        .insert({
          name: collabName,
          description,
          user_id: currentUser.id,
          is_collab: true,
          parent_personas: session.personas.map(p => p.id),
          // Inherit some properties from the dominant persona
          style: session.personas.find(p => p.id === Object.entries(blendRatios)
            .sort(([, a], [, b]) => b - a)[0][0])?.style,
          voice_type: session.personas.find(p => p.id === Object.entries(blendRatios)
            .sort(([, a], [, b]) => b - a)[0][0])?.voice_type,
          collaboration_settings: {
            member_blend_ratios: blendRatios,
            collaboration_type: "equal",
            primary_vocals: sortedPersonas[0].id
          }
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Collaborative persona created successfully!",
      });

      setCollaborationDialogOpen(false);
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
          <div className="flex flex-col">
            <CardTitle className="text-md flex items-center gap-2">
              <Users className="w-4 h-4" />
              Collaborators
            </CardTitle>
            <div
              className="mt-1 text-sm text-dreamaker-purple flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
              onClick={() => navigate('/dreamaker', {
                state: {
                  activeTab: 'collaborations',
                  fromKonform: true,
                  konformSessionId: sessionId
                }
              })}
            >
              <span>Current Session: {sessionId?.substring(0, 8)}...</span>
              <ChevronUp className="w-3 h-3 rotate-90" />
            </div>
          </div>
          
          {/* Collaboration Dialog */}
          <Dialog open={collaborationDialogOpen} onOpenChange={setCollaborationDialogOpen}>
            <DialogContent className="sm:max-w-[600px] bg-dreamaker-bg border-dreamaker-purple/20">
              <DialogHeader>
                <DialogTitle className="text-2xl">AI Artist Collaboration</DialogTitle>
                <DialogDescription>
                  Adjust the influence of each AI artist in this collaboration.
                  The total influence should equal 100%.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {session?.personas?.map((persona) => (
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
                    onClick={() => setCollaborationDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveCollaboration}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Collaboration"}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateCollaboration}
              className="text-gray-400 hover:text-white"
              disabled={!session?.personas?.length || session.personas.length < 2}
            >
              <HandshakeIcon className="w-4 h-4 mr-1" />
              Create Collaboration
            </Button>
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
                  className="flex items-center gap-4 p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors w-[300px] shrink-0 cursor-pointer relative group"
                  onClick={() => handlePersonaSelect(persona)}
                >
                  <Avatar 
                    className="h-16 w-16 shrink-0"
                    onDoubleClick={() => navigate(`/personas/${persona.id}`)}
                  >
                    <AvatarImage src={persona.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-xl">{persona.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div 
                    className="flex-1 min-w-0 cursor-pointer" 
                    onClick={() => handlePersonaSelect(persona)}
                  >
                    <p className="text-white text-lg font-medium mb-2 truncate">{persona.name}</p>
                    <div className="text-gray-400 text-sm">
                      {persona.artist_profile_name || 'Unknown Artist'}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCollaborator(persona.id);
                    }}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
