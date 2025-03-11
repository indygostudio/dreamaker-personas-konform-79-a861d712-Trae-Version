
import { Music, FileText } from "lucide-react";
import type { Track } from "@/types/track";

interface TrackContentProps {
  track: Track;
  isActive: boolean;
  onLyricsClick?: (e: React.MouseEvent) => void;
}

export const TrackContent: React.FC<TrackContentProps> = ({ track, isActive, onLyricsClick }) => {
  return (
    <div className="flex-1 flex justify-between items-center">
      <div className="flex-1">
        <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
          {track.title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mt-0.5">
          <Music className="h-3 w-3 inline mr-1" />
          {track.artist || "Unknown Artist"}
          
          {track.mixer && (
            <span className="ml-2">• Mixed by {track.mixer}</span>
          )}
          
          {track.duration && (
            <span className="ml-2">• {track.duration}</span>
          )}
        </div>
      </div>
      
      {onLyricsClick && (
        <div 
          className="ml-4 p-1.5 rounded hover:bg-gray-700 transition-colors cursor-pointer"
          onClick={onLyricsClick}
        >
          <FileText className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
