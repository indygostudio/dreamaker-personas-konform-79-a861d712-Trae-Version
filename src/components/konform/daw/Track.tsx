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
  isMuted: boolean;
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
      className="relative group h-full"
    >
      <div className="flex-1 flex flex-col">
      </div>
    </div>
  );
};