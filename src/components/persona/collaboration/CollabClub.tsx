import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Star, Clock, Music, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollaborationRequest {
  id: string;
  from_user_id: string;
  to_artist_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  from_user?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
  to_artist?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface CollaborationSession {
  id: string;
  name: string;
  user_id: string;
  personas: string[];
  status: string;
  created_at: string;
  updated_at: string;
  performance_metrics?: any;
  style_blend_settings?: any;
  voice_blend_settings?: any;
  output_settings?: any;
  version?: number;
  royalty_splits?: Record<string, number>;
  collaborators?: {
    id: string;
    name: string;
    avatar_url?: string;
  }[];
}

export const CollabClub = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("opportunities");
  const userId = session?.user?.id;

  // Fetch collaboration requests
  const { data: collaborationRequests, refetch: refetchRequests } = useQuery({
    queryKey: ["collaboration-requests", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Fetch requests sent to me
      const { data: incomingRequests, error: incomingError } = await supabase
        .from("collaboration_requests")
        .select(`
          *,
          from_user:from_user_id(id, email, full_name, avatar_url)
        `)
        .eq("to_artist_id", userId)
        .eq("status", "pending");

      if (incomingError) throw incomingError;

      // Fetch requests I've sent
      const { data: outgoingRequests, error: outgoingError } = await supabase
        .from("collaboration_requests")
        .select(`
          *,
          to_artist:to_artist_id(id, name, avatar_url)
        `)
        .eq("from_user_id", userId)
        .not("status", "eq", "completed");

      if (outgoingError) throw outgoingError;

      return {
        incoming: incomingRequests || [],
        outgoing: outgoingRequests || []
      };
    },
    enabled: !!userId,
  });

  // Fetch active collaboration sessions
  const { data: collaborationSessions, refetch: refetchSessions } = useQuery({
    queryKey: ["collaboration-sessions", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("collaboration_sessions")
        .select(`
          *,
          collaborators:personas(id, name, avatar_url)
        `)
        .or(`user_id.eq.${userId},personas.cs.{${userId}}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Handle accepting a collaboration request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Update request status to accepted
      const { error: updateError } = await supabase
        .from("collaboration_requests")
        .update({ status: "accepted" })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // Get the request details
      const { data: request, error: requestError } = await supabase
        .from("collaboration_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (requestError) throw requestError;

      // Create or update a collaboration session
      const { data: existingSession } = await supabase
        .from("collaboration_sessions")
        .select("*")
        .or(
          `user_id.eq.${request.from_user_id},user_id.eq.${request.to_artist_id}`
        )
        .order("created_at", { ascending: false })
        .limit(1);

      if (existingSession && existingSession.length > 0) {
        // Update existing session
        const session = existingSession[0];
        const updatedPersonas = [...(session.personas || [])];
        
        // Add both users if they're not already in the session
        if (!updatedPersonas.includes(request.from_user_id)) {
          updatedPersonas.push(request.from_user_id);
        }
        if (!updatedPersonas.includes(request.to_artist_id)) {
          updatedPersonas.push(request.to_artist_id);
        }
        
        await supabase
          .from("collaboration_sessions")
          .update({ 
            personas: updatedPersonas,
            status: "active"
          })
          .eq("id", session.id);
      } else {
        // Create a new session
        await supabase
          .from("collaboration_sessions")
          .insert({
            user_id: request.to_artist_id,
            personas: [request.from_user_id, request.to_artist_id],
            name: `Collaboration ${new Date().toLocaleDateString()}`,
            status: "active",
            royalty_splits: {
              [request.from_user_id]: 50,
              [request.to_artist_id]: 50
            }
          });
      }

      toast({
        title: "Collaboration Request Accepted",
        description: "You've accepted the collaboration request."
      });

      refetchRequests();
      refetchSessions();
      setActiveTab("active");
    } catch (error) {
      console.error("Error accepting collaboration request:", error);
      toast({
        title: "Error",
        description: "Failed to accept collaboration request.",
        variant: "destructive"
      });
    }
  };

  // Handle declining a collaboration request
  const handleDeclineRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("collaboration_requests")
        .update({ status: "declined" })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Collaboration Request Declined",
        description: "You've declined the collaboration request."
      });

      refetchRequests();
    } catch (error) {
      console.error("Error declining collaboration request:", error);
      toast({
        title: "Error",
        description: "Failed to decline collaboration request.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Collab Club</h2>
        <Badge variant="outline" className="bg-dreamaker-purple/20 text-dreamaker-purple border-dreamaker-purple/50">
          <Star className="h-3 w-3 mr-1" /> Premium Feature
        </Badge>
      </div>
      
      <p className="text-muted-foreground">
        Connect with other artists, collaborate on projects, and share royalties.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="opportunities">
            <Users className="h-4 w-4 mr-2" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="active">
            <Music className="h-4 w-4 mr-2" />
            Active Collaborations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Incoming Requests</h3>
            {collaborationRequests?.incoming?.length === 0 && (
              <p className="text-muted-foreground">No incoming collaboration requests.</p>
            )}
            {collaborationRequests?.incoming?.map((request: CollaborationRequest) => (
              <Card key={request.id} className="p-4 bg-black/40 backdrop-blur-sm border-dreamaker-purple/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-dreamaker-purple/20 flex items-center justify-center">
                      {request.from_user?.avatar_url ? (
                        <img 
                          src={request.from_user.avatar_url} 
                          alt="User avatar" 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-dreamaker-purple" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{request.from_user?.full_name || request.from_user?.email}</p>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
                      Decline
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-dreamaker-purple hover:bg-dreamaker-purple/80"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-semibold">Outgoing Requests</h3>
            {collaborationRequests?.outgoing?.length === 0 && (
              <p className="text-muted-foreground">No outgoing collaboration requests.</p>
            )}
            {collaborationRequests?.outgoing?.map((request: CollaborationRequest) => (
              <Card key={request.id} className="p-4 bg-black/40 backdrop-blur-sm border-dreamaker-purple/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-dreamaker-purple/20 flex items-center justify-center">
                      {request.to_artist?.avatar_url ? (
                        <img 
                          src={request.to_artist.avatar_url} 
                          alt="Artist avatar" 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-dreamaker-purple" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{request.to_artist?.name}</p>
                      <div className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : request.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-muted-foreground ml-2">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {collaborationSessions?.length === 0 && (
            <p className="text-muted-foreground">No active collaborations.</p>
          )}
          {collaborationSessions?.map((session: CollaborationSession) => (
            <Card key={session.id} className="p-4 bg-black/40 backdrop-blur-sm border-dreamaker-purple/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{session.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Created {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${session.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}
                  >
                    {session.status?.charAt(0).toUpperCase() + session.status?.slice(1) || 'Active'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Collaborators</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.collaborators?.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1">
                        <div className="h-6 w-6 rounded-full bg-dreamaker-purple/20 flex items-center justify-center overflow-hidden">
                          {collaborator.avatar_url ? (
                            <img 
                              src={collaborator.avatar_url} 
                              alt="Collaborator avatar" 
                              className="h-6 w-6 object-cover"
                            />
                          ) : (
                            <Users className="h-3 w-3 text-dreamaker-purple" />
                          )}
                        </div>
                        <span className="text-sm">{collaborator.name}</span>
                        {session.royalty_splits && (
                          <Badge variant="outline" className="bg-dreamaker-purple/10 text-dreamaker-purple border-none">
                            <Percent className="h-3 w-3 mr-1" />
                            {session.royalty_splits[collaborator.id] || '50'}%
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:text-dreamaker-purple"
                    onClick={() => window.location.href = `/konform?session=${session.id}`}
                  >
                    Open Session
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};