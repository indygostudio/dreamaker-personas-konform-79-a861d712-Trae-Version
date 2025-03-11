
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaCollection, MediaType } from "@/types/media";
import { Persona } from "@/types/persona";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MediaCollectionCard } from "@/components/media/MediaCollectionCard";
import { MediaCollectionDialog } from "@/components/media/MediaCollectionDialog";
import { supabase } from "@/lib/supabase";

export const PersonaMediaSection = ({ persona }: { persona: Persona }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTab, setSelectedTab] = useState<MediaType>("audio");

  const { data: collections, isLoading, refetch } = useQuery({
    queryKey: ['persona-media', persona.id, selectedTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_collections')
        .select('*')
        .eq('user_id', persona.id)
        .eq('media_type', selectedTab);

      if (error) throw error;
      return data as MediaCollection[];
    },
  });

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
        <div>Loading...</div>
      ) : collections?.length === 0 ? (
        <div>No collections found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections?.map((collection) => (
            <MediaCollectionCard
              key={collection.id}
              collection={collection}
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
        defaultMediaType={selectedTab}
        personaId={persona.id}
      />
    </div>
  );
};
