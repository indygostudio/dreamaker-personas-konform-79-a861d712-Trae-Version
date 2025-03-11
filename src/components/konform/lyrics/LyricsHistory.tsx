
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Clock, ArrowUpDown, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LyricsHistoryProps {
  history: {
    id: string;
    title?: string;
    content: string;
    prompt?: string;
    created_at?: string;
  }[];
  onSelectLyrics: (lyrics: any) => void;
}

export const LyricsHistory = ({ history, onSelectLyrics }: LyricsHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredHistory = history.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(searchLower)) ||
      (item.content && item.content.toLowerCase().includes(searchLower)) ||
      (item.prompt && item.prompt.toLowerCase().includes(searchLower))
    );
  }).sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('lyrics_generations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update UI without reloading
      toast({
        title: "Lyrics deleted",
        description: "The lyrics have been removed from your history",
      });
    } catch (error) {
      console.error('Error deleting lyrics:', error);
      toast({
        title: "Error deleting lyrics",
        description: error.message || "There was an error deleting the lyrics",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/30 border-gray-700 text-white"
          />
        </div>
        <Button variant="outline" onClick={toggleSortDirection} className="gap-2">
          <Clock className="h-4 w-4" />
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {filteredHistory.length > 0 ? (
          filteredHistory.map(item => (
            <Card 
              key={item.id} 
              className="bg-black/30 hover:bg-black/40 transition-colors border-gray-800 cursor-pointer"
              onClick={() => onSelectLyrics(item)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Music className="h-4 w-4 mr-2 text-konform-neon-blue" />
                      <h3 className="font-medium text-white">{item.title || "Untitled"}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                      {item.prompt || "No prompt available"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "Unknown date"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleDelete(item.id, e)}
                      className="h-8 px-2 text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>{searchQuery ? "No matching lyrics found" : "No lyrics history yet"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
