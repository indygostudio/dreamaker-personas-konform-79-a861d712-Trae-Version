
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PlaylistSelectorProps {
  playlists: any[];
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string) => void;
  isOwner: boolean;
  refetchPlaylists: () => void;
  setCurrentTrack: (track: any | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const PlaylistSelector = ({
  playlists,
  selectedPlaylistId,
  setSelectedPlaylistId,
  isOwner,
  refetchPlaylists,
  setCurrentTrack,
  setIsPlaying
}: PlaylistSelectorProps) => {
  const handleDeletePlaylist = async () => {
    if (!selectedPlaylistId || !isOwner) return;
    
    // Confirm deletion with the user
    if (!window.confirm("Are you sure you want to delete this playlist? All tracks in it will be deleted too.")) {
      return;
    }
    
    try {
      // First delete all tracks in the playlist
      const { error: tracksError } = await supabase
        .from('tracks')
        .delete()
        .eq('playlist_id', selectedPlaylistId);
        
      if (tracksError) throw tracksError;
      
      // Then delete the playlist itself
      const { error: playlistError } = await supabase
        .from('playlists')
        .delete()
        .eq('id', selectedPlaylistId);
        
      if (playlistError) throw playlistError;
      
      toast.success("Playlist deleted successfully");
      
      // Refresh playlists and clear the selected playlist
      refetchPlaylists();
      setSelectedPlaylistId(null);
      setCurrentTrack(null);
      setIsPlaying(false);
    } catch (error: any) {
      console.error('Error deleting playlist:', error);
      toast.error("Failed to delete playlist: " + error.message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedPlaylistId || undefined} 
        onValueChange={(value) => setSelectedPlaylistId(value)}
      >
        <SelectTrigger className="w-[260px] bg-black/30 border-white/10">
          <SelectValue placeholder="Select a playlist" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/20">
          {playlists.map((playlist) => (
            <SelectItem 
              key={playlist.id} 
              value={playlist.id}
              className="text-white hover:bg-gray-800"
            >
              {playlist.name || 'Untitled Playlist'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isOwner && selectedPlaylistId && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              // Open playlist creator dialog
            }}
            className="text-green-500 hover:text-green-300 hover:bg-green-950/30"
            title="Create new playlist"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDeletePlaylist}
            className="text-red-500 hover:text-red-300 hover:bg-red-950/30"
            title="Delete playlist"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
