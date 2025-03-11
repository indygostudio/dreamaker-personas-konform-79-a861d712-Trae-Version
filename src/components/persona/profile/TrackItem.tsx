
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import type { Track } from "@/types/track";

interface TrackItemProps {
  track: Track;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track) => void;
}

export const TrackItem = ({ track, currentTrack, isPlaying, onTrackPlay }: TrackItemProps) => {
  const isCurrentTrack = currentTrack?.id === track.id;
  
  return (
    <div className="flex items-center gap-4 bg-black/60 p-4 rounded-lg hover:bg-black/80 transition-colors">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onTrackPlay(track)}
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
    </div>
  );
};
