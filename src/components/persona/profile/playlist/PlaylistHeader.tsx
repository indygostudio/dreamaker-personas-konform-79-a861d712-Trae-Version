
import { Button } from "@/components/ui/button";
import { ListMusic, Plus } from "lucide-react";

interface PlaylistHeaderProps {
  onCreatePlaylist: () => void;
}

export const PlaylistHeader = ({ onCreatePlaylist }: PlaylistHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-white">Audio Tracks</h2>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCreatePlaylist} 
        className="flex items-center gap-1 bg-black/40 border-gray-700 text-white"
      >
        <ListMusic className="h-4 w-4" />
        <Plus className="h-3 w-3" />
        New Playlist
      </Button>
    </div>
  );
};
