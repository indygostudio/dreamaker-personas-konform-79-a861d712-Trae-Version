
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface FollowButtonProps {
  personaId: string;
  personaName: string;
  personaUserId: string;
  isHeaderExpanded: boolean;
}

export const FollowButton = ({ 
  personaId, 
  personaName, 
  personaUserId,
  isHeaderExpanded 
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('persona_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('persona_id', personaId)
        .maybeSingle();
      
      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [user, personaId]);

  const handleFollowClick = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow personas",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('persona_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('persona_id', personaId);

        if (error) throw error;
        
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You've unfollowed ${personaName}`
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('persona_follows')
          .insert({
            follower_id: user.id,
            persona_id: personaId
          });

        if (error) throw error;
        
        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You're now following ${personaName}`
        });
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost"
      size={isHeaderExpanded ? "default" : "icon"}
      className="bg-black/20 hover:bg-black/40 text-white"
      onClick={handleFollowClick}
      disabled={isLoading || user?.id === personaUserId}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <HeartOff className="h-4 w-4" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
      {isHeaderExpanded && (
        <span className="ml-2">
          {isFollowing ? "Unfollow" : "Follow"}
        </span>
      )}
    </Button>
  );
};
