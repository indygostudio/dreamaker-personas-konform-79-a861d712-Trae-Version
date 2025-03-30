
import { Button } from "@/components/ui/button";
import { Play, Pause, GripVertical, Trash, Pencil, FileText, Image } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Track } from "@/types/track";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrackContextMenu } from "@/components/artist-profile/TrackContextMenu";

interface TrackItemProps {
  track: Track;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track) => void;
  id: string;
  onDeleteTrack?: (trackId: string) => void;
  onUpdateArtwork?: (trackId: string, artworkUrl: string) => void;
  onEditTrack?: (track: Track) => void;
  onEditLyrics?: (track: Track) => void;
  isOwner?: boolean;
}

export const TrackItem = ({ 
  track, 
  currentTrack, 
  isPlaying, 
  onTrackPlay, 
  id, 
  onDeleteTrack, 
  onUpdateArtwork,
  onEditTrack,
  onEditLyrics,
  isOwner = false 
}: TrackItemProps) => {
  const isCurrentTrack = currentTrack?.id === track.id;
  
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteTrack) {
      onDeleteTrack(track.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditTrack) {
      onEditTrack(track);
    } else {
      toast.info("Edit functionality coming soon");
    }
  };

  const handleLyricsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditLyrics) {
      onEditLyrics(track);
    } else {
      toast.info("Lyrics editor coming soon");
    }
  };

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateArtwork) {
      // For now, let's just show a toast. In a real implementation, you'd open a dialog
      toast.info("Artwork update dialog would open here");
    }
  };
  
  return (
    <TrackContextMenu
      onPlayClick={() => onTrackPlay(track)}
      onEditClick={isOwner ? handleEditClick : undefined}
      onLyricsClick={isOwner ? handleLyricsClick : undefined}
      onArtworkClick={isOwner ? handleArtworkClick : undefined}
      onDeleteClick={isOwner ? handleDeleteClick : undefined}
    >
      <div 
        ref={setNodeRef}
        style={style}
        className={`group flex items-center gap-4 bg-black/60 p-4 rounded-lg hover:bg-black/80 transition-colors cursor-pointer ${
          isCurrentTrack && isPlaying ? 'animate-pulse duration-2000' : ''
        } ${
          isCurrentTrack ? 'border-l-4 border-l-dreamaker-purple border border-dreamaker-purple/30 bg-gradient-to-r from-dreamaker-purple/10 to-black/60' : ''
        }`}
        onClick={() => onTrackPlay(track)}
      >
        <div 
          className="text-gray-500 flex items-center justify-center pr-2 cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onTrackPlay(track);
          }}
          className="text-white hover:text-dreamaker-purple transition-colors"
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white">{track.title}</div>
        </div>
        
        {isOwner && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-300 hover:bg-red-950/30"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
    </TrackContextMenu>
  );
};
