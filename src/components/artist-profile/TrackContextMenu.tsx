
import { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Pencil, FileText, Trash, Play, Image } from "lucide-react";

interface TrackContextMenuProps {
  children: ReactNode;
  onEditClick?: (e: React.MouseEvent) => void;
  onDeleteClick?: (e: React.MouseEvent) => void;
  onLyricsClick?: (e: React.MouseEvent) => void;
  onPlayClick?: (e: React.MouseEvent) => void;
  onArtworkClick?: (e: React.MouseEvent) => void;
}

export const TrackContextMenu = ({ 
  children, 
  onEditClick, 
  onDeleteClick, 
  onLyricsClick,
  onPlayClick,
  onArtworkClick
}: TrackContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-[#1A1F2C] border-dreamaker-purple/30">
        {onPlayClick && (
          <ContextMenuItem 
            onClick={onPlayClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <Play className="mr-2 h-4 w-4" />
            Play Track
          </ContextMenuItem>
        )}
        
        {onEditClick && (
          <ContextMenuItem 
            onClick={onEditClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Details
          </ContextMenuItem>
        )}
        
        {onArtworkClick && (
          <ContextMenuItem 
            onClick={onArtworkClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <Image className="mr-2 h-4 w-4" />
            Change Artwork
          </ContextMenuItem>
        )}
        
        {onLyricsClick && (
          <ContextMenuItem 
            onClick={onLyricsClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Edit Lyrics
          </ContextMenuItem>
        )}
        
        {onDeleteClick && (
          <ContextMenuItem 
            onClick={onDeleteClick}
            className="flex items-center cursor-pointer text-red-400 hover:text-red-300"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Track
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
