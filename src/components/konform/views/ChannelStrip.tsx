import { Channel } from './MixbaseView';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, Music2, Volume2, Settings2, MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Effect {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
}

interface ChannelStripProps {
  channel: Channel;
  onVolumeChange: (value: number) => void;
  onPanChange: (value: number) => void;
  onMute: () => void;
  onSolo: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => void;
}

export const ChannelStrip = ({
  channel,
  onVolumeChange,
  onPanChange,
  onMute,
  onSolo,
  onDuplicate,
  onDelete,
  onRename
}: ChannelStripProps) => {
  const [effects] = useState<Effect[]>(() => [
    { id: '1', name: 'Channel EQ', type: 'eq', enabled: true },
    { id: '2', name: 'Compressor', type: 'dynamics', enabled: true },
    { id: '3', name: 'Tape Delay', type: 'delay', enabled: true },
    { id: '4', name: 'ChromaVerb', type: 'reverb', enabled: true }
  ]);

  const [meterValue, setMeterValue] = useState(0);
  const meterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMeterValue(Math.random() * channel.volume);
    }, 100);
    return () => clearInterval(interval);
  }, [channel.volume]);

  return (
    <div className="group relative flex flex-col w-[120px] bg-black/20 rounded-lg p-2 gap-2">
      {/* Context Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {onRename && <DropdownMenuItem onClick={() => onRename(channel.name)}>Rename</DropdownMenuItem>}
          {onDuplicate && <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>}
          {onDelete && <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Persona Section */}
      <div className="flex justify-center mb-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            <UserRound className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* VST Instrument */}
      <Button variant="outline" size="sm" className="bg-green-500/20 text-green-500 hover:bg-green-500/30 mb-2">
        <Music2 className="h-4 w-4 mr-1" />
        VST
      </Button>

      {/* Hardware Output */}
      <div className="bg-zinc-800/50 rounded p-1 mb-2 text-center text-xs">
        Stereo Output
      </div>

      {/* Effects Chain */}
      <div className="space-y-1 mb-2">
        {effects.map(effect => (
          <Button
            key={effect.id}
            variant="outline"
            size="sm"
            className="w-full bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 justify-start text-xs"
          >
            <Settings2 className="h-3 w-3 mr-1" />
            {effect.name}
          </Button>
        ))}
      </div>

      {/* Bus Send */}
      <div className="flex flex-col gap-2 mb-2 relative before:absolute before:left-0 before:right-0 before:-top-2 before:h-[1px] before:bg-white/10 after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[1px] after:bg-white/10">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-500 flex-grow text-xs">
            Bus 1
          </Button>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 border border-blue-500/30" />
            <input
              type="range"
              min="0"
              max="100"
              value="50"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const rotation = value * 3.6; // Convert 0-100 to 0-360 degrees
                e.target.parentElement?.querySelector('.knob-indicator')?.style.setProperty('transform', `translate(-50%, -50%) rotate(${rotation}deg)`);
              }}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div className="knob-indicator absolute w-1 h-1 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="bg-purple-500/20 text-purple-500 flex-grow text-xs">
            Bus 2
          </Button>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 border border-purple-500/30" />
            <input
              type="range"
              min="0"
              max="100"
              value="50"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const rotation = value * 3.6; // Convert 0-100 to 0-360 degrees
                e.target.parentElement?.querySelector('.knob-indicator')?.style.setProperty('transform', `translate(-50%, -50%) rotate(${rotation}deg)`);
              }}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div className="knob-indicator absolute w-1 h-1 bg-purple-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center" />
          </div>
        </div>
      </div>

      {/* Pan Control */}
      <div className="relative w-full h-6 mb-2">
        <div className="absolute inset-0 rounded-full bg-zinc-800/50">
          <input
            type="range"
            min="-50"
            max="50"
            value={channel.pan}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onPanChange(value);
              const rotation = (value + 50) * 1.8; // Convert -50 to 50 to 0-180 degrees
              e.target.parentElement?.querySelector('.pan-indicator')?.style.setProperty('transform', `translate(-50%, -50%) rotate(${rotation}deg)`);
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          <div className="pan-indicator absolute w-1 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center" />
        </div>
      </div>

      {/* Volume Fader & Meter */}
      <div className="relative h-48 flex items-center justify-center gap-2 mb-2">
        <div
          ref={meterRef}
          className="w-2 bg-gradient-to-t from-green-500 to-red-500 rounded"
          style={{
            height: `${meterValue}%`,
            opacity: 0.5
          }}
        />
        <Slider
          orientation="vertical"
          value={[channel.volume]}
          onValueChange={([value]) => onVolumeChange(value)}
          min={0}
          max={100}
          step={1}
          className="h-full z-10"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between gap-1">
        <Button
          size="sm"
          variant={channel.isMuted ? "destructive" : "outline"}
          onClick={onMute}
          className="flex-1 h-8"
        >
          M
        </Button>
        <Button
          size="sm"
          variant={channel.isSolo ? "secondary" : "outline"}
          onClick={onSolo}
          className="flex-1 h-8"
        >
          S
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
        >
          T
        </Button>
      </div>

      {/* Track Label */}
      <div className="text-sm text-center text-white truncate p-1 rounded bg-gradient-to-r from-green-500/20 to-blue-500/20">
        {channel.name}
      </div>
    </div>
  );
};