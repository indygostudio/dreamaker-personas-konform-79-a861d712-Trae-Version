
import { Button } from "@/components/ui/button";
import { useFollows } from "@/hooks/useFollows";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  targetUserId: string;
}

export function FollowButton({ targetUserId }: FollowButtonProps) {
  const session = useSession();
  const userId = session?.user?.id;
  const { toast } = useToast();
  
  const { following, followUser, unfollowUser, isLoading } = useFollows(userId || "");
  
  const isFollowing = following?.some(f => f.following_id === targetUserId);

  const handleFollowClick = () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "destructive"
      });
      return;
    }
    
    if (isFollowing) {
      unfollowUser(targetUserId);
    } else {
      followUser(targetUserId);
    }
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
      disabled={isLoading || targetUserId === userId}
      onClick={handleFollowClick}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
