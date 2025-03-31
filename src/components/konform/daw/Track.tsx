import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Volume2, VolumeX, Music2, Disc, Mic, UserRound } from "lucide-react";

export type TrackMode = 
  | 'ai-audio' 
  | 'ai-midi' 
  | 'real-audio' 
  | 'AI_ARTIST' 
  | 'AI_VOCALIST' 
  | 'AI_INSTRUMENTALIST' 
  | 'AI_MIXER' 
  | 'AI_INSTRUMENT' 
  | 'AI_EFFECT';

export interface Clip {
  id: string;
  startTime: number;
  duration: number;
  color: string;
}

export interface Track {
  id: number;
  name: string;
  mode: TrackMode;
  volume: number;
  pan?: number;
  isMuted: boolean;
  isSolo?: boolean;
  clips: Clip[];
  persona?: {
    name: string;
    avatarUrl?: string;
  };
}

interface TrackItemProps {
  track: Track;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  onModeChange: (id: number, mode: TrackMode) => void;
  onMuteToggle: (id: number) => void;
}

export const TrackItem = ({ track, onDelete, onDuplicate, onModeChange, onMuteToggle }: TrackItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-48 h-full bg-black/40 backdrop-blur-xl p-4 rounded-lg border border-konform-neon-blue/30"
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">{track.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className={`${track.isMuted ? 'text-red-500' : 'text-gray-400'} hover:text-konform-neon-orange`}
            onClick={() => onMuteToggle(track.id)}
          >
            {track.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
        <Slider
          orientation="vertical"
          value={[track.volume]}
          onValueChange={([value]) => {
            // Handle volume change
          }}
          max={100}
          step={1}
          className="h-32"
        />
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-konform-neon-blue hover:text-konform-neon-orange"
            onClick={() => onDuplicate(track.id)}
          >
            <Disc className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-konform-neon-orange hover:text-konform-neon-blue"
            onClick={() => onDelete(track.id)}
          >
            <Music2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};