import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId?: string;
}

export const CreateProjectDialog = ({ open, onOpenChange, personaId }: CreateProjectDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewProject = async () => {
    if (!personaId) return;
    
    try {
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

      const { data: session, error } = await supabase
        .from('collaboration_sessions')
        .insert({
          name: 'New Collaboration',
          personas: [personaId],
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      navigate("/konform");
      onOpenChange(false);

      toast({
        title: "Success",
        description: "New project created with AI Artist",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create new project",
        variant: "destructive",
      });
    }
  };

  const handleAddToProject = async () => {
    if (!personaId) return;
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to add to project",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Get the most recent collaboration session
      const { data: sessions, error: fetchError } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;
      
      if (!sessions || sessions.length === 0) {
        // If no session exists, create a new one
        return handleNewProject();
      }

      const currentSession = sessions[0];
      const updatedPersonas = [...(currentSession.personas || [])];
      
      // Only add if not already present
      if (!updatedPersonas.includes(personaId)) {
        updatedPersonas.push(personaId);
      }

      const { error: updateError } = await supabase
        .from('collaboration_sessions')
        .update({ personas: updatedPersonas })
        .eq('id', currentSession.id);

      if (updateError) throw updateError;

      navigate("/konform");
      onOpenChange(false);

      toast({
        title: "Success",
        description: "AI Artist added to current project",
      });
    } catch (error) {
      console.error("Error adding to project:", error);
      toast({
        title: "Error",
        description: "Failed to add AI Artist to project",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border border-dreamaker-purple/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Create with AI</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={handleNewProject}
            className="bg-dreamaker-purple hover:bg-dreamaker-purple-light text-white px-6 py-4 text-lg"
          >
            Create New Project
          </Button>
          <Button
            onClick={handleAddToProject}
            variant="outline"
            className="border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-white px-6 py-4 text-lg"
          >
            Add to Existing Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};