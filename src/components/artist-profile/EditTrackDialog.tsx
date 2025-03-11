
import { useState, useEffect } from "react";
import { Track } from "@/types/track";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface EditTrackDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  track: Track;
  onTrackUpdated: (updatedTrack: Track) => void;
}

export const EditTrackDialog = ({ isOpen, onOpenChange, track, onTrackUpdated }: EditTrackDialogProps) => {
  const [trackData, setTrackData] = useState({
    title: track.title,
    writers: track.writers?.join(", ") || "",
    collaborators: track.collaborators?.join(", ") || "",
    mixer: track.mixer || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form data when the track or dialog open state changes
  useEffect(() => {
    if (isOpen) {
      setTrackData({
        title: track.title,
        writers: track.writers?.join(", ") || "",
        collaborators: track.collaborators?.join(", ") || "",
        mixer: track.mixer || ""
      });
    }
  }, [isOpen, track]);

  const handleCancelEdit = () => {
    setTrackData({
      title: track.title,
      writers: track.writers?.join(", ") || "",
      collaborators: track.collaborators?.join(", ") || "",
      mixer: track.mixer || ""
    });
    onOpenChange(false);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSubmitting(true);
      
      const updatedTrackData = {
        title: trackData.title,
        writers: trackData.writers ? trackData.writers.split(",").map(w => w.trim()).filter(Boolean) : [],
        collaborators: trackData.collaborators ? trackData.collaborators.split(",").map(c => c.trim()).filter(Boolean) : [],
        mixer: trackData.mixer.trim() || null
      };
      
      console.log("Updating track with data:", updatedTrackData);
      
      const { error } = await supabase
        .from('tracks')
        .update(updatedTrackData)
        .eq('id', track.id);
      
      if (error) {
        console.error("Error updating track:", error);
        throw error;
      }
      
      // Create an updated track object with the new data
      const updatedTrack: Track = {
        ...track,
        title: updatedTrackData.title,
        writers: updatedTrackData.writers,
        collaborators: updatedTrackData.collaborators,
        mixer: updatedTrackData.mixer
      };
      
      onTrackUpdated(updatedTrack);
      toast.success("Track information updated successfully");
      
      // Close the dialog after successful update
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating track:", error);
      toast.error("Failed to update track information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrackData({
      ...trackData,
      [name]: value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border-dreamaker-purple/30 max-w-md mx-auto draggable-dialog">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Track Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div>
            <label htmlFor="title" className="text-sm text-gray-300 mb-1 block">Title</label>
            <Input
              id="title"
              name="title"
              value={trackData.title}
              onChange={handleInputChange}
              className="bg-gray-800 border-dreamaker-purple/30 text-white"
              placeholder="Track Title"
            />
          </div>
          
          <div>
            <label htmlFor="writers" className="text-sm text-gray-300 mb-1 block">Writers (comma separated)</label>
            <Input
              id="writers"
              name="writers"
              value={trackData.writers}
              onChange={handleInputChange}
              className="bg-gray-800 border-dreamaker-purple/30 text-white"
              placeholder="Writers (comma separated)"
            />
          </div>
          
          <div>
            <label htmlFor="collaborators" className="text-sm text-gray-300 mb-1 block">Collaborators (comma separated)</label>
            <Input
              id="collaborators"
              name="collaborators"
              value={trackData.collaborators}
              onChange={handleInputChange}
              className="bg-gray-800 border-dreamaker-purple/30 text-white"
              placeholder="Collaborators (comma separated)"
            />
          </div>
          
          <div>
            <label htmlFor="mixer" className="text-sm text-gray-300 mb-1 block">Mixer</label>
            <Input
              id="mixer"
              name="mixer"
              value={trackData.mixer}
              onChange={handleInputChange}
              className="bg-gray-800 border-dreamaker-purple/30 text-white"
              placeholder="Mixer"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancelEdit} className="bg-transparent" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
