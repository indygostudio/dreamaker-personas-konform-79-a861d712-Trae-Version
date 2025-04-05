import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronRight, FolderClosed, VolumeX, Volume2 } from "lucide-react";
import type { Channel } from "@/types/konform";

interface ChannelGroupProps {
  id: string;
  name: string;
  color?: string;
  channels: Channel[];
  isExpanded?: boolean;
  onVolumeChange: (value: number) => void;
  onMute: () => void;
  onSolo: () => void;
  onRename?: (name: string) => void;
  onToggleExpand: () => void;
  onColorChange?: (color: string) => void;
}

export const ChannelGroup = ({
  id,
  name,
  color = "#3B82F6",
  channels,
  isExpanded = true,
  onVolumeChange,
  onMute,
  onSolo,
  onRename,
  onToggleExpand,
  onColorChange
}: ChannelGroupProps) => {
  const [groupVolume, setGroupVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isSolo, setIsSolo] = useState(false);

  const handleVolumeChange = (value: number) => {
    setGroupVolume(value);
    onVolumeChange(value);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    onMute();
  };

  const handleSolo = () => {
    setIsSolo(!isSolo);
    onSolo();
  };

  const handleRename = () => {
    if (onRename) {
      const newName = prompt("Enter a new name for this group:", name);
      if (newName) onRename(newName);
    }
  };

  return (
    <div className="flex flex-col bg-black/40 rounded-lg border border-konform-neon-blue/20 overflow-hidden">
      {/* Group Header */}
      <div 
        className="flex items-center p-2 gap-2 cursor-pointer" 
        style={{ backgroundColor: `${color}20` }}
        onClick={onToggleExpand}
      >
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <FolderClosed className="h-4 w-4" style={{ color }} />
        <div 
          className="flex-1 font-medium text-sm truncate hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            handleRename();
          }}
        >
          {name}
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-6 w-6 p-0 ${isMuted ? 'text-red-500' : 'text-gray-400'}`}
            onClick={(e) => {
              e.stopPropagation();
              handleMute();
            }}
          >
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </Button>
          <div className="w-20">
            <Slider
              value={[groupVolume]}
              onValueChange={([value]) => {
                handleVolumeChange(value);
              }}
              max={100}
              step={1}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
      
      {/* Group Content */}
      {isExpanded && (
        <div className="p-2">
          <div className="text-xs text-gray-400 mb-2">
            {channels.length} channel{channels.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {channels.map(channel => (
              <div 
                key={channel.id} 
                className="text-xs py-1 px-2 rounded bg-black/20 truncate flex justify-between items-center"
              >
                <span>{channel.name}</span>
                <span className="text-gray-500">{channel.volume.toFixed(1)}dB</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 