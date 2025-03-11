
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const useArtistCollaboration = (artistId: string, artistName: string) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isCollabPending, setIsCollabPending] = useState(false);

  // Mutation to send collaboration request
  const sendCollabRequestMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('Must be logged in to collaborate');
      
      await supabase
        .from('collaboration_requests')
        .insert({
          from_user_id: session.user.id,
          to_artist_id: artistId,
          status: 'pending',
        });
    },
    onSuccess: () => {
      setIsCollabPending(true);
      toast({
        title: "Collaboration request sent",
        description: `Your collaboration request has been sent to ${artistName}`,
      });
    },
  });

  const handleSendCollabRequest = () => {
    if (!session?.user?.id) {
      toast({
        title: "Login required",
        description: "Please login to send collaboration requests",
        variant: "destructive",
      });
      return;
    }
    sendCollabRequestMutation.mutate();
  };

  return {
    isCollabPending,
    isLoading: sendCollabRequestMutation.isPending,
    sendCollabRequest: handleSendCollabRequest
  };
};
