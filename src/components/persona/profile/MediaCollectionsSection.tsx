
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaCollectionCard } from "@/components/media/MediaCollectionCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MediaCollectionDialog } from "@/components/media/MediaCollectionDialog";
import { useNavigate } from "react-router-dom";
import type { MediaCollection } from "@/types/media";
import type { Persona } from "@/types/persona";

interface MediaCollectionsSectionProps {
  persona: Persona;
}

export const MediaCollectionsSection = ({ persona }: MediaCollectionsSectionProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const { data: collections, isLoading, refetch } = useQuery({
    queryKey: ['media-collections', persona.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_collections')
        .select('*')
        .eq('persona_id', persona.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as any[]).map(item => ({
        ...item,
        banner_position: item.banner_position ? {
          x: Number(item.banner_position.x) || 50,
          y: Number(item.banner_position.y) || 50
        } : undefined
      })) as MediaCollection[];
    },
  });

  const handleDoubleClick = (collectionId: string) => {
    navigate(`/media/${collectionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Media Collections</h2>
        <Button onClick={() => setIsCreating(true)} variant="secondary">
          <Plus className="w-4 h-4 mr-2" />
          Create Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading collections...</div>
      ) : collections?.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No collections yet. Create your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections?.map((collection) => (
            <MediaCollectionCard
              key={collection.id}
              collection={collection}
              onDoubleClick={() => handleDoubleClick(collection.id)}
            />
          ))}
        </div>
      )}

      <MediaCollectionDialog 
        open={isCreating}
        onOpenChange={setIsCreating}
        onSuccess={() => {
          setIsCreating(false);
          refetch();
        }}
        personaId={persona.id}
      />
    </div>
  );
};
