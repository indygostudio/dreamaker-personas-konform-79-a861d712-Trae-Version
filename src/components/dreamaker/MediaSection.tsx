
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaCollectionCard } from "@/components/media/MediaCollectionCard";
import type { MediaCollection } from "@/types/media";

export const MediaSection = () => {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["public-media-collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_media_collections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match MediaCollection type
      return (data as any[]).map(item => ({
        ...item,
        banner_position: item.banner_position ? {
          x: Number(item.banner_position.x) || 50,
          y: Number(item.banner_position.y) || 50
        } : undefined
      })) as MediaCollection[];
    },
  });

  if (isLoading) {
    return <div className="text-white">Loading media collections...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections?.map((collection) => (
        <MediaCollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};
