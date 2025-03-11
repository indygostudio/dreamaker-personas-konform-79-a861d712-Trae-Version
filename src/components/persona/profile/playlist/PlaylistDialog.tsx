
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Save, Trash } from "lucide-react";

interface PlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  playlistName: string;
  albumTitle: string;
  albumArtworkPreview: string | null;
  onPlaylistNameChange: (value: string) => void;
  onAlbumTitleChange: (value: string) => void;
  onAlbumArtworkClick: () => void;
  onSave: () => void;
  onDelete?: () => void;
  mode: 'create' | 'edit';
}

export const PlaylistDialog = ({
  open,
  onOpenChange,
  title,
  playlistName,
  albumTitle,
  albumArtworkPreview,
  onPlaylistNameChange,
  onAlbumTitleChange,
  onAlbumArtworkClick,
  onSave,
  onDelete,
  mode
}: PlaylistDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="playlistName">Playlist Name</Label>
            <Input 
              id="playlistName" 
              value={playlistName} 
              onChange={e => onPlaylistNameChange(e.target.value)} 
              placeholder="My Playlist" 
              className="bg-gray-800 border-gray-700" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="albumTitle">Album Title</Label>
            <Input 
              id="albumTitle" 
              value={albumTitle} 
              onChange={e => onAlbumTitleChange(e.target.value)} 
              placeholder="My Album" 
              className="bg-gray-800 border-gray-700" 
            />
          </div>
          <div className="space-y-2">
            <Label>Album Artwork</Label>
            <div className="flex items-center gap-4">
              <div 
                className="w-24 h-24 bg-gray-800 flex items-center justify-center rounded cursor-pointer border border-gray-700" 
                onClick={onAlbumArtworkClick}
              >
                {albumArtworkPreview ? (
                  <img 
                    src={albumArtworkPreview} 
                    alt="Album Artwork" 
                    className="w-full h-full object-cover rounded" 
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onAlbumArtworkClick}
              >
                Choose Image
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          {mode === 'edit' && onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete Playlist
            </Button>
          )}
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              {mode === 'create' ? 'Create Playlist' : 'Save Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
