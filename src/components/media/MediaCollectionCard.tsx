
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MediaCollection } from "@/types/media";
import { useZoomStore } from "@/stores/useZoomStore";

interface MediaCollectionCardProps {
  collection: MediaCollection;
  onPlay?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDoubleClick?: () => void;
}

export const MediaCollectionCard = ({
  collection,
  onPlay,
  onEdit,
  onDelete,
  onDoubleClick
}: MediaCollectionCardProps) => {
  const zoomLevel = useZoomStore(state => state.zoomLevel);
  
  // Adjust font size based on zoom level
  const getTitleSize = () => {
    if (zoomLevel <= 40) return 'text-sm';
    if (zoomLevel <= 70) return 'text-base';
    return 'text-lg';
  };
  
  const getDescSize = () => {
    if (zoomLevel <= 40) return 'text-xs line-clamp-1';
    if (zoomLevel <= 70) return 'text-xs line-clamp-2';
    return 'text-sm';
  };
  
  // Adjust button size based on zoom level
  const getButtonSize = () => {
    if (zoomLevel <= 40) return 'size="icon" className="w-7 h-7"';
    if (zoomLevel <= 70) return 'size="icon"';
    return 'size="icon"';
  };
  
  return (
    <Card 
      className="overflow-hidden glass-panel bg-black/40 border-dreamaker-purple/20 cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      <div className="relative aspect-video">
        <img
          src={collection.cover_image_url || collection.banner_url || '/placeholder.svg'}
          alt={collection.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {onPlay && (
          <Button
            variant="glass"
            size={zoomLevel <= 40 ? "sm" : "icon"}
            className="absolute bottom-2 right-2 text-white glass-button hover:text-dreamaker-purple"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
          >
            <Play className={zoomLevel <= 40 ? "h-4 w-4" : "h-6 w-6"} />
          </Button>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className={`${getTitleSize()} font-semibold text-white`}>{collection.title}</h3>
            <p className={`${getDescSize()} text-gray-400`}>{collection.description}</p>
          </div>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="glass" 
                  size={zoomLevel <= 40 ? "sm" : "icon"}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-button"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }} 
                    className="text-red-500"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};
