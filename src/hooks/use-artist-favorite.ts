
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const useArtistFavorite = (artistId: string, artistName: string) => {
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Query to check if the current user has favorited this artist
  const { data: isFavorited, refetch: refetchFavorite } = useQuery({
    queryKey: ['artist-favorite', artistId],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      
      const { data } = await supabase
        .from('artist_favorites')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('artist_id', artistId)
        .single();
      
      return !!data;
    },
    enabled: !!session?.user?.id,
  });

  // Mutation to toggle favorite status
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('Must be logged in to favorite');

      if (isFavorited) {
        await supabase
          .from('artist_favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('artist_id', artistId);
      } else {
        await supabase
          .from('artist_favorites')
          .insert({
            user_id: session.user.id,
            artist_id: artistId,
          });
      }
    },
    onSuccess: () => {
      refetchFavorite();
      toast({
        title: isFavorited ? "Artist removed from favorites" : "Artist added to favorites",
        description: isFavorited ? `${artistName} has been removed from your favorites` : `${artistName} has been added to your favorites`,
      });
    },
  });

  const handleToggleFavorite = () => {
    if (!session?.user?.id) {
      toast({
        title: "Login required",
        description: "Please login to favorite artists",
        variant: "destructive",
      });
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  return {
    isFavorited,
    isLoading: toggleFavoriteMutation.isPending,
    toggleFavorite: handleToggleFavorite
  };
};
