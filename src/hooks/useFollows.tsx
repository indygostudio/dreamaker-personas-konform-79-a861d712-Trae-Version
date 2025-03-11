
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFollows(userId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followers } = useQuery({
    queryKey: ["followers", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_follows")
        .select("follower_id")
        .eq("following_id", userId);

      if (error) throw error;
      return data;
    },
  });

  const { data: following } = useQuery({
    queryKey: ["following", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", userId);

      if (error) throw error;
      return data;
    },
  });

  const followMutation = useMutation({
    mutationFn: async (followingId: string) => {
      const { error } = await supabase
        .from("user_follows")
        .insert({ follower_id: userId, following_id: followingId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      toast({
        title: "Success",
        description: "Successfully followed user",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (followingId: string) => {
      const { error } = await supabase
        .from("user_follows")
        .delete()
        .eq("follower_id", userId)
        .eq("following_id", followingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      toast({
        title: "Success",
        description: "Successfully unfollowed user",
      });
    },
  });

  return {
    followers,
    following,
    followUser: followMutation.mutate,
    unfollowUser: unfollowMutation.mutate,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  };
}
