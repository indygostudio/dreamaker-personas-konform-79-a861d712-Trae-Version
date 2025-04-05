import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFollows(userId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get followers data
  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followers", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("user_follows")
        .select("follower_id")
        .eq("following_id", userId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });

  // Get following data
  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["following", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", userId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });

  // Get followers count query
  const { data: followersCount } = useQuery({
    queryKey: ["followers-count", userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId
  });

  // Get following count query
  const { data: followingCount } = useQuery({
    queryKey: ["following-count", userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId
  });

  // Check if one user follows another
  const checkIfFollowing = async (followerUserId: string, followingUserId: string) => {
    if (!followerUserId || !followingUserId) return false;
    
    const { data, error } = await supabase
      .from("user_follows")
      .select("*")
      .eq("follower_id", followerUserId)
      .eq("following_id", followingUserId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking follow status:", error);
      return false;
    }
    
    return !!data;
  };

  const followMutation = useMutation({
    mutationFn: async (followingId: string) => {
      // Check if userId is valid before attempting to follow
      if (!userId) {
        throw new Error("You must be logged in to follow users");
      }

      const { error } = await supabase
        .from("user_follows")
        .insert({ follower_id: userId, following_id: followingId });

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      queryClient.invalidateQueries({ queryKey: ["followers-count"] });
      queryClient.invalidateQueries({ queryKey: ["following-count"] });
      
      toast({
        title: "Success",
        description: "Successfully followed user",
      });
    },
    onError: (error) => {
      console.error("Follow error:", error);
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (followingId: string) => {
      // Check if userId is valid before attempting to unfollow
      if (!userId) {
        throw new Error("You must be logged in to unfollow users");
      }

      const { error } = await supabase
        .from("user_follows")
        .delete()
        .eq("follower_id", userId)
        .eq("following_id", followingId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      queryClient.invalidateQueries({ queryKey: ["followers-count"] });
      queryClient.invalidateQueries({ queryKey: ["following-count"] });
      
      toast({
        title: "Success",
        description: "Successfully unfollowed user",
      });
    },
    onError: (error) => {
      console.error("Unfollow error:", error);
      toast({
        title: "Error",
        description: "Failed to unfollow user. Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    followers,
    following,
    followersCount: followersCount || 0,
    followingCount: followingCount || 0,
    followUser: followMutation.mutate,
    unfollowUser: unfollowMutation.mutate,
    checkIfFollowing,
    isLoading: followMutation.isPending || unfollowMutation.isPending || isLoadingFollowers || isLoadingFollowing,
  };
}
