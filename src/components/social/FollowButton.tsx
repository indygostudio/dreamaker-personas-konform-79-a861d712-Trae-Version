
import { Button } from "@/components/ui/button";
import { useFollows } from "@/hooks/useFollows";
import { useSession } from "@supabase/auth-helpers-react";

interface FollowButtonProps {
  targetUserId: string;
}

export function FollowButton({ targetUserId }: FollowButtonProps) {
  const session = useSession();
  const userId = session?.user?.id;
  
  const { following, followUser, unfollowUser, isLoading } = useFollows(userId || "");
  
  if (!userId) return null;
  
  const isFollowing = following?.some(f => f.following_id === targetUserId);

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
      disabled={isLoading || targetUserId === userId}
      onClick={() => {
        if (isFollowing) {
          unfollowUser(targetUserId);
        } else {
          followUser(targetUserId);
        }
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
