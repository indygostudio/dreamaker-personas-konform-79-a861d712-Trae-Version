
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { 
  Music2, 
  Mic, 
  UserRound,
  ChevronDown,
  ChevronUp,
  Disc,
  Wand2,
  Volume1,
  VolumeX,
  Volume2
} from "lucide-react";
import { TrackMode } from "./Track";

export interface MixerChannelProps {
  id: string;
  index: number;
  name: string;
  type: TrackMode;
  volume: number;
  isMuted: boolean;
  persona?: {
    name: string;
    avatarUrl?: string;
  };
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  onTypeChange: (type: TrackMode) => void;
  onGenerate: () => void;
  onPersonaSelect?: () => void;
}

export const MixerChannel = ({ 
  id,
  index,
  name,
  type,
  volume,
  isMuted,
  persona,
  onVolumeChange,
  onMuteToggle,
  onTypeChange,
  onGenerate
}: MixerChannelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const getTrackIcon = () => {
    switch (type) {
      case 'ai-audio':
        return <Music2 className="w-4 h-4 text-konform-neon-blue" />;
      case 'ai-midi':
        return <Disc className="w-4 h-4 text-konform-neon-orange" />;
      case 'real-audio':
        return <Mic className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group ${isDragging ? 'z-50' : 'z-0'}`}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-konform-neon-blue to-konform-neon-orange opacity-30 blur group-hover:opacity-50 transition-opacity rounded-lg" />
      <div className={`relative bg-black/40 backdrop-blur-xl p-4 rounded-lg border ${
        isDragging ? 'border-konform-neon-blue' : 'border-konform-neon-blue/30'
      }`}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          {/* Channel Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getTrackIcon()}
              <span className="text-sm font-medium text-white">{name}</span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="text-konform-neon-blue hover:text-konform-neon-orange">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            {/* Persona Avatar */}
            <div className="mb-4 flex justify-center">
              <Avatar className="h-16 w-16 ring-2 ring-konform-neon-blue/30">
                {persona?.avatarUrl ? (
                  <AvatarImage src={persona.avatarUrl} alt={persona.name} />
                ) : (
                  <AvatarFallback className="bg-black/60">
                    <UserRound className="h-8 w-8 text-konform-neon-blue" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Volume Slider */}
              <div className="flex flex-col items-center">
                <Slider
                  orientation="vertical"
                  value={[volume]}
                  onValueChange={([value]) => onVolumeChange(value)}
                  max={100}
                  step={1}
                  className="h-32"
                />
                <Volume2 className="w-4 h-4 mt-2 text-konform-neon-blue" />
              </div>

              {/* Channel Controls */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isMuted ? 'text-red-500' : 'text-gray-400'} hover:text-konform-neon-orange`}
                  onClick={onMuteToggle}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-konform-neon-orange hover:text-konform-neon-blue"
                  onClick={onGenerate}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
                {onPersonaSelect && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-konform-neon-blue hover:text-konform-neon-orange"
                    onClick={onPersonaSelect}
                  >
                    <UserRound className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
