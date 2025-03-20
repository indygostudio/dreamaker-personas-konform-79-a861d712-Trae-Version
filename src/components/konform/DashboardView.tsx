import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RatingSystem } from "./RatingSystem";
import { Lock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionDialog } from "@/components/SubscriptionDialog";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ContributionDashboard } from "@/components/features/ContributionDashboard";

interface CollaboratingPersona {
  id: string;
  name: string;
  avatar_url?: string;
  type: string;
}

export const DashboardView = () => {
  const [userSubscription, setUserSubscription] = useState<string>('unsigned');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [collaboratingPersonas, setCollaboratingPersonas] = useState<CollaboratingPersona[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkSubscription();
    loadCurrentSession();
  }, []);

  const checkSubscription = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setUserSubscription(profile.subscription_tier);
    }
  };

  const loadCurrentSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: collaborationSession } = await supabase
      .from('collaboration_sessions')
      .select('id, personas')
      .eq('user_id', session.user.id)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (collaborationSession) {
      setCurrentSession(collaborationSession.id);
      loadCollaboratingPersonas(collaborationSession.personas);
    }
  };

  const loadCollaboratingPersonas = async (personaIds: string[]) => {
    if (!personaIds.length) return;

    const { data: personas } = await supabase
      .from('personas')
      .select('id, name, avatar_url, type')
      .in('id', personaIds);

    if (personas) {
      setCollaboratingPersonas(personas);
    }
  };

  const handleStartCollaboration = async () => {
    if (userSubscription === 'unsigned') {
      setShowUpgrade(true);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Create new collaboration session if none exists
    if (!currentSession) {
      const { data: newSession, error } = await supabase
        .from('collaboration_sessions')
        .insert({
          user_id: session.user.id,
          name: 'New Collaboration',
          personas: [],
          status: 'draft'
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create collaboration session",
          variant: "destructive",
        });
        return;
      }

      if (newSession) {
        setCurrentSession(newSession.id);
      }
    }

    // Navigate to DAW view
    navigate('/konform/daw');
  };

  const removePersona = async (personaId: string) => {
    if (!currentSession) return;

    const updatedPersonas = collaboratingPersonas.filter(p => p.id !== personaId);
    const { error } = await supabase
      .from('collaboration_sessions')
      .update({
        personas: updatedPersonas.map(p => p.id)
      })
      .eq('id', currentSession);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove persona from collaboration",
        variant: "destructive",
      });
      return;
    }

    setCollaboratingPersonas(updatedPersonas);
    toast({
      title: "Success",
      description: "Persona removed from collaboration",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        {/* Basic Features */}
        <div className="bg-black/40 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Basic Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Add your basic features here */}
          </div>
        </div>

        {/* Collaboration Section */}
        <div className="bg-black/40 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Current Collaboration</h2>
            <Button
              onClick={handleStartCollaboration}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple-light"
              disabled={userSubscription === 'unsigned'}
            >
              Start Collaboration
            </Button>
          </div>
          
          {collaboratingPersonas.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700 p-4">
              <div className="space-y-4">
                {collaboratingPersonas.map((persona) => (
                  <div 
                    key={persona.id}
                    className="flex items-center justify-between bg-black/20 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={persona.avatar_url} />
                        <AvatarFallback>{persona.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{persona.name}</p>
                        <p className="text-xs text-gray-400">{persona.type}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePersona(persona.id)}
                      className="hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Hivemind Contribution Dashboard */}
        <div className="bg-black/40 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Hivemind Contribution Dashboard</h2>
            {userSubscription === 'unsigned' && (
              <div className="flex items-center gap-2">
                <Lock className="text-dreamaker-purple" />
                <span className="text-sm text-gray-400">Contributor features locked</span>
              </div>
            )}
          </div>
          {userSubscription !== 'unsigned' ? (
            <ContributionDashboard />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Upgrade your subscription to participate in the Hivemind cooperative and earn royalties from your contributions.</p>
              <Button
                className="bg-dreamaker-purple hover:bg-dreamaker-purple-light"
                onClick={() => setShowUpgrade(true)}
              >
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
        
        {/* Pro Features */}
        <div className="bg-black/40 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Pro Features</h2>
            {userSubscription === 'unsigned' && (
              <div className="flex items-center gap-2">
                <Lock className="text-dreamaker-purple" />
                <span className="text-sm text-gray-400">Pro features locked</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleStartCollaboration}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple-light"
              disabled={userSubscription === 'unsigned'}
            >
              Access Pro Feature
            </Button>
          </div>
        </div>

        {/* Rating System */}
        <div className="bg-black/40 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Rate Your Experience</h2>
          <RatingSystem trackId="dashboard" />
        </div>
      </div>

      {/* Subscription Dialog */}
      <SubscriptionDialog 
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
      />
    </div>
  );
};