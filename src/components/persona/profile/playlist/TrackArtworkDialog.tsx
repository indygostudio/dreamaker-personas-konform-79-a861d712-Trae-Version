
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, Save } from "lucide-react";
import { Track } from "@/types/track";

interface TrackArtworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: Track | null;
  artworkPreview: string | null;
  onArtworkClick: () => void;
  onSave: () => void;
}

export const TrackArtworkDialog = ({
  open,
  onOpenChange,
  track,
  artworkPreview,
  onArtworkClick,
  onSave
}: TrackArtworkDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Track Artwork</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="trackArtwork">Update Artwork</Label>
            <div className="flex items-center gap-4">
              <div 
                className="w-32 h-32 bg-gray-800 flex items-center justify-center rounded cursor-pointer border border-gray-700" 
                onClick={onArtworkClick}
              >
                {artworkPreview ? (
                  <img 
                    src={artworkPreview} 
                    alt="Track Artwork" 
                    className="w-full h-full object-cover rounded" 
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-500" />
                )}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onArtworkClick}
              >
                Choose Image
              </Button>
            </div>
            {track && (
              <p className="text-sm text-gray-400 mt-2">
                For track: {track.title}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Artwork
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
