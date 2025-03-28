import { ScrollArea } from "@/components/ui/scroll-area";
import type { Persona } from "@/types/persona";
import { Folder, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CollectionsTabProps {
  collections?: any[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPersonaSelect: (persona: Persona) => void;
}

export const CollectionsTab = ({
  collections = [],
  isOpen,
  onOpenChange,
  onPersonaSelect,
}: CollectionsTabProps) => {
  const handleRemoveFromCollection = async (e: React.MouseEvent, collectionId: string) => {
    e.stopPropagation();
    try {
      // This is a placeholder for actual collection removal logic
      // Will need to be implemented based on the actual data structure
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId);

      if (error) throw error;

      toast({
        title: "Removed from collection",
        description: "The item has been removed from your collection"
      });
    } catch (error: any) {
      toast({
        title: "Error removing from collection",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="overflow-auto">
      <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {collections && collections.length > 0 ? (
          collections.map((collection) => (
            <div 
              key={collection.id} 
              className="relative flex-shrink-0 w-[220px] h-[100px] group overflow-hidden rounded-lg border border-dreamaker-purple/20 hover:border-dreamaker-purple/40 transition-all duration-300 bg-black/30 cursor-pointer"
              onClick={() => {}}
            >
              <button
                onClick={(e) => handleRemoveFromCollection(e, collection.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-red-500/60 text-white/60 hover:text-white transition-colors z-10"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="flex h-full p-2">
                <div className="w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Folder className="h-8 w-8 text-blue-400/80" />
                </div>
                
                <div className="flex flex-col ml-2 flex-1">
                  <h4 className="text-xs font-semibold text-white mb-1 truncate">
                    {collection.name || "Untitled Collection"}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 text-[10px]">
                    {collection.description || `${collection.item_count || 0} items`}
                  </p>
                  <div className="mt-auto flex items-center gap-1">
                    <span className="text-[9px] text-gray-500">
                      {new Date(collection.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full py-4 text-gray-400 text-sm">
            No collections yet
          </div>
        )}
      </div>
    </div>
  );
};