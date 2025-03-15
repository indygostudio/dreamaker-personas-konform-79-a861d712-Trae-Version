
import { useState } from "react";
import { GripVertical, Image, Scissors } from "lucide-react";
import type { Track } from "@/types/track";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrackContextMenu } from "./TrackContextMenu";
import { EditTrackDialog } from "./EditTrackDialog";
import { LyricsEditor } from "./LyricsEditor";
import { TrackContent } from "./TrackContent";
import { TrackLyrics } from "./TrackLyrics";
import { useTrackLyrics } from "./hooks/useTrackLyrics";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TrackItemProps {
  track: Track;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track) => void;
  id: string;
  onPlay?: () => void;
  onDeleteTrack?: (trackId: string) => void;
  onUpdateArtwork?: (trackId: string, artworkUrl: string) => void;
  isOwner?: boolean;
}

export const TrackItem = ({ 
  track, 
  currentTrack, 
  isPlaying, 
  onTrackPlay, 
  id, 
  onPlay,
  onDeleteTrack,
  onUpdateArtwork,
  isOwner = false
}: TrackItemProps) => {
  if (!track) return null;
  
  // Using useState with the track as initial value to maintain local state
  const [trackState, setTrackState] = useState<Track>(track);
  const isActive = currentTrack?.id === trackState.id;
  
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false);
  const [newArtworkUrl, setNewArtworkUrl] = useState(trackState.album_artwork_url || '');
  
  const {
    trackLyrics,
    showLyrics,
    isLyricsEditorOpen,
    setIsLyricsEditorOpen,
    handleLyricsClick,
    handleLyricsSaved
  } = useTrackLyrics(trackState, isActive, isPlaying);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Use onPlay if provided, otherwise fall back to onTrackPlay
  const handleClick = (e: React.MouseEvent) => {
    // Only process click if dialogs are closed
    if (!isEditDialogOpen && !isLyricsEditorOpen && !isArtworkDialogOpen) {
      if (onPlay) {
        onPlay();
      } else {
        onTrackPlay(trackState);
      }
    } else {
      // Prevent click propagation if dialogs are open
      e.stopPropagation();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteTrack) {
      onDeleteTrack(trackState.id);
    }
  };

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewArtworkUrl(trackState.album_artwork_url || '');
    setIsArtworkDialogOpen(true);
  };

  const handleArtworkSave = () => {
    if (onUpdateArtwork && newArtworkUrl) {
      onUpdateArtwork(trackState.id, newArtworkUrl);
      
      // Update local state immediately for better UX
      setTrackState({
        ...trackState,
        album_artwork_url: newArtworkUrl
      });
      
      setIsArtworkDialogOpen(false);
    }
  };

  const handleTrackUpdated = (updatedTrack: Track) => {
    // Update both the reference track and our local state
    Object.assign(track, updatedTrack);
    setTrackState({...updatedTrack});
  };

  return (
    <>
      <div className="mb-1">
        <TrackContextMenu 
          onEditClick={handleEditClick} 
          onDeleteClick={isOwner ? handleDeleteClick : undefined}
          onLyricsClick={handleLyricsClick}
          onPlayClick={() => onTrackPlay(trackState)}
          onArtworkClick={isOwner ? handleArtworkClick : undefined}
        >
          <div 
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-4 bg-black/60 p-4 rounded-lg hover:bg-black/80 transition-colors cursor-pointer ${
              isActive && isPlaying ? 'animate-pulse duration-2000' : ''
            } ${
              isActive ? 'border-l-4 border-l-dreamaker-purple border border-dreamaker-purple/30 bg-gradient-to-r from-dreamaker-purple/10 to-black/60' : ''
            }`}
            onClick={handleClick}
          >
            <div 
              className="text-gray-500 flex items-center justify-center pr-2 cursor-grab"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            
            <div 
              className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative group"
              onClick={(e) => isOwner && handleArtworkClick(e)}
            >
              <img 
                src={trackState.album_artwork_url || '/placeholder.svg'} 
                alt={trackState.title} 
                className="w-full h-full object-cover"
              />
              {isOwner && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Image className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <TrackContent 
              track={trackState} 
              isActive={isActive} 
              onLyricsClick={handleLyricsClick} 
            />
          </div>
        </TrackContextMenu>

        <TrackLyrics 
          showLyrics={showLyrics} 
          trackLyrics={trackLyrics} 
        />
      </div>

      <EditTrackDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        track={trackState}
        onTrackUpdated={handleTrackUpdated}
      />

      <LyricsEditor
        trackId={trackState.id}
        initialLyrics={trackLyrics}
        isOpen={isLyricsEditorOpen}
        onOpenChange={setIsLyricsEditorOpen}
        onLyricsSaved={handleLyricsSaved}
        trackAudioUrl={trackState.audio_url}
      />

      {/* Artwork Upload Dialog */}
      <Dialog open={isArtworkDialogOpen} onOpenChange={setIsArtworkDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] border-dreamaker-purple/30 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Update Track Artwork</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gray-800 rounded overflow-hidden">
                <img 
                  src={newArtworkUrl || '/placeholder.svg'} 
                  alt="Track Artwork Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="artwork-url" className="text-sm text-gray-300 mb-1 block">
                Artwork URL
              </label>
              <Input
                id="artwork-url"
                value={newArtworkUrl}
                onChange={(e) => setNewArtworkUrl(e.target.value)}
                placeholder="Enter image URL"
                className="bg-gray-800 border-dreamaker-purple/30 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter a URL for the track artwork image
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsArtworkDialogOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              onClick={handleArtworkSave} 
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
              disabled={!newArtworkUrl}
            >
              Save Artwork
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
