import { Channel } from './MixbaseView';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  UserRound, 
  Music2, 
  Volume2, 
  Settings2, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit, 
  Pause,
  Play,
  MonitorSpeaker, 
  Mic,
  Disc,
  Link,
  ChevronDown,
  Shield,
  Database
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface Effect {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
}

type MeteringModeType = "peak" | "peakRMS" | "preFader";

interface ChannelStripProps {
  channel: Channel;
  onVolumeChange: (value: number) => void;
  onPanChange: (value: number) => void;
  onMute: () => void;
  onSolo: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => void;
  onColorChange?: (color: string) => void;
  onAutoModeChange?: (mode: 'off' | 'read' | 'touch' | 'write' | 'latch') => void;
  onOutputChange?: (output: string) => void;
  onToggleSoloSafe?: () => void;
  onCopySettings?: () => void;
  onPasteSettings?: () => void;
  onSelect?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
  meteringMode?: MeteringModeType;
  preFaderMetering?: boolean;
  style?: React.CSSProperties;
  className?: string;
  consoleMode?: 'large' | 'small';
  consoleView?: 'normal' | 'narrow';
  children?: React.ReactNode;
}

export const ChannelStrip = ({
  channel,
  onVolumeChange,
  onPanChange,
  onMute,
  onSolo,
  onDuplicate,
  onDelete,
  onRename,
  onColorChange,
  onAutoModeChange,
  onOutputChange,
  onToggleSoloSafe,
  onCopySettings,
  onPasteSettings,
  onSelect,
  isSelected = false,
  meteringMode = 'peak',
  preFaderMetering = false,
  style,
  className,
  consoleMode = 'large',
  consoleView = 'normal',
  children
}: ChannelStripProps) => {
  const [effects] = useState<Effect[]>(() => [
    { id: '1', name: 'Channel EQ', type: 'eq', enabled: true },
    { id: '2', name: 'Compressor', type: 'dynamics', enabled: true },
    { id: '3', name: 'Tape Delay', type: 'delay', enabled: false },
    { id: '4', name: 'ChromaVerb', type: 'reverb', enabled: false }
  ]);

  const [meterValue, setMeterValue] = useState(0);
  const [rmsValue, setRmsValue] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(channel.name);
  const meterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get icon based on channel type
  const getChannelIcon = () => {
    switch(channel.type) {
      case 'master': return <MonitorSpeaker className="h-4 w-4" />;
      case 'audio': return <Disc className="h-4 w-4" />;
      case 'instrument': return <Music2 className="h-4 w-4" />;
      case 'bus': return <Link className="h-4 w-4" />;
      case 'input': return <Mic className="h-4 w-4" />;
      case 'fx': return <Settings2 className="h-4 w-4" />;
      default: return <UserRound className="h-4 w-4" />;
    }
  };

  // Animation for the audio meter
  useEffect(() => {
    const interval = setInterval(() => {
      // Use volume as max value, with some randomness
      const volumeLevel = channel.volume * (preFaderMetering ? 1 : (channel.isMuted ? 0 : 1));
      const peakValue = Math.random() * volumeLevel;
      
      // For Peak/RMS, generate a smoother, lower value for RMS
      const newRmsValue = Math.min(
        peakValue * 0.7, 
        rmsValue + (Math.random() * 5 - 2)
      );
      
      setMeterValue(peakValue);
      setRmsValue(Math.max(0, newRmsValue));
    }, 100);
    
    return () => clearInterval(interval);
  }, [channel.volume, channel.isMuted, preFaderMetering, rmsValue]);

  // Helper to handle name editing
  const handleNameChange = () => {
    if (onRename && nameValue !== channel.name) {
      onRename(nameValue);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Automatic name field update
  useEffect(() => {
    setNameValue(channel.name);
  }, [channel.name]);

  const isNarrowView = consoleView === 'narrow';
  const isSmallMode = consoleMode === 'small';

  return (
    <div 
      className={cn(
        'group relative flex flex-col bg-black/60 rounded-lg border-t-2 transition-colors',
        isSelected ? 'border-konform-neon-orange border-l-konform-neon-orange/50 border-r-konform-neon-orange/50 border-b-konform-neon-orange/50' : 
        'border-l-black/20 border-r-black/20 border-b-black/20 hover:border-gray-500/20',
        className
      )}
      style={{ 
        width: style?.width || '120px',
        borderTopColor: channel.color || '#00D1FF',
        ...style 
      }}
      onClick={onSelect}
    >
      {/* Solo Safe Indicator */}
      {channel.isSoloSafe && (
        <div className="absolute -right-1 -top-1 bg-yellow-500 rounded-full p-0.5 z-10 shadow-glow-yellow">
          <Shield className="h-3 w-3 text-black" />
        </div>
      )}
      
      {/* Context Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
          {onRename && <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer gap-2">
            <Edit className="h-3.5 w-3.5" /> Rename
          </DropdownMenuItem>}
          {onDuplicate && <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer gap-2">
            <Copy className="h-3.5 w-3.5" /> Duplicate
          </DropdownMenuItem>}
          {onDelete && channel.type !== 'master' && <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-2 text-red-500">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
            {isExpanded ? 'Collapse' : 'Expand'}
          </DropdownMenuItem>
          
          {onToggleSoloSafe && (
            <DropdownMenuItem onClick={onToggleSoloSafe} className="cursor-pointer gap-2">
              <Shield className="h-3.5 w-3.5" />
              {channel.isSoloSafe ? 'Disable Solo Safe' : 'Enable Solo Safe'}
            </DropdownMenuItem>
          )}
          
          {(onCopySettings || onPasteSettings) && (
            <>
              <DropdownMenuSeparator />
              {onCopySettings && (
                <DropdownMenuItem onClick={onCopySettings} className="cursor-pointer gap-2">
                  <Copy className="h-3.5 w-3.5" />
                  Copy Channel Settings
                </DropdownMenuItem>
              )}
              {onPasteSettings && (
                <DropdownMenuItem onClick={onPasteSettings} className="cursor-pointer gap-2">
                  <Database className="h-3.5 w-3.5" />
                  Paste Channel Settings
                </DropdownMenuItem>
              )}
            </>
          )}
          
          {onColorChange && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onColorChange('#00D1FF')} className="cursor-pointer">
                <div className="h-3 w-3 rounded-full bg-[#00D1FF] mr-2" />
                Blue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onColorChange('#FF5F1F')} className="cursor-pointer">
                <div className="h-3 w-3 rounded-full bg-[#FF5F1F] mr-2" />
                Orange
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onColorChange('#10B981')} className="cursor-pointer">
                <div className="h-3 w-3 rounded-full bg-[#10B981] mr-2" />
                Green
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onColorChange('#8B5CF6')} className="cursor-pointer">
                <div className="h-3 w-3 rounded-full bg-[#8B5CF6] mr-2" />
                Purple
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Input/Output Routing */}
      <div className="px-2 py-1 bg-black/40 rounded-t-md border-b border-konform-neon-blue/10 text-xs text-gray-400 flex flex-col">
        {/* Input Display */}
        {channel.inputs && channel.inputs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer hover:text-white">
                <span className="truncate">{channel.inputs[0]}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
              <DropdownMenuItem className="cursor-pointer">
                Mic 1
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Mic 2
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Line 1/2
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Output Display */}
        {channel.outputs && channel.outputs.length > 0 && onOutputChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer hover:text-white mt-1">
                <span className="truncate">{channel.outputs[0]}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
              <DropdownMenuItem onClick={() => onOutputChange('Main Out')} className="cursor-pointer">
                Main Out
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOutputChange('Drum Bus')} className="cursor-pointer">
                Drum Bus
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOutputChange('FX Bus')} className="cursor-pointer">
                FX Bus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Channel Type & Number */}
      <div className="flex justify-between items-center px-2 pt-1">
        <div className="flex items-center text-xs font-semibold text-gray-400">
          {getChannelIcon()}
          <span className="ml-1">
            {channel.type !== 'master' ? `${channel.number}` : ''}
          </span>
        </div>
        
        {/* Automation Mode Selector */}
        {onAutoModeChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-1 py-0 text-[10px] text-gray-400 hover:text-white">
                {channel.automationMode === 'off' ? 'Off' : 
                 channel.automationMode === 'read' ? 'Read' :
                 channel.automationMode === 'write' ? 'Write' :
                 channel.automationMode === 'touch' ? 'Touch' : 'Latch'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
              <DropdownMenuItem onClick={() => onAutoModeChange('off')} className="cursor-pointer">
                Off
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAutoModeChange('read')} className="cursor-pointer">
                Read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAutoModeChange('touch')} className="cursor-pointer">
                Touch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAutoModeChange('write')} className="cursor-pointer">
                Write
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAutoModeChange('latch')} className="cursor-pointer">
                Latch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Instrument/Plugin Section (if expanded) */}
      {isExpanded && !isNarrowView && consoleMode === 'large' && (
        <>
          {channel.instrument && (
            <div className="px-2 py-1">
              <Button variant="outline" size="sm" className="bg-green-500/20 text-green-500 hover:bg-green-500/30 w-full h-6 text-xs justify-start">
                <Music2 className="h-3 w-3 mr-1" />
                {channel.instrument.name}
              </Button>
            </div>
          )}

          {/* Effects Chain */}
          {effects.length > 0 && (
            <div className="px-2 pb-2 space-y-1">
              {effects.filter(e => e.enabled).map(effect => (
                <Button
                  key={effect.id}
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 justify-start text-xs h-6"
                >
                  <Settings2 className="h-3 w-3 mr-1" />
                  {effect.name}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pan Control */}
      <div className="px-3 pt-1">
        <div className="relative w-full h-5 mb-1">
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
            <div className="pan-indicator absolute w-1 h-1.5 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center" />
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 -mt-1 mb-1">
          <span>L</span>
          <span>R</span>
        </div>
      </div>

      {/* Volume Fader & Meter */}
      <div className="relative mx-auto h-52 flex items-center justify-center gap-1 mb-1">
        <div className="h-full flex flex-col justify-between text-[8px] text-gray-400 pr-0.5 pt-1 pb-8">
          <span>0</span>
          <span>-6</span>
          <span>-12</span>
          <span>-18</span>
          <span>-24</span>
          <span>-∞</span>
        </div>
        
        {/* Meters section */}
        <div className="h-full flex gap-0.5">
          {/* Peak meter */}
          <div
            ref={meterRef}
            className="w-2 bg-gradient-to-b from-red-500 via-yellow-500 to-green-500 rounded-sm"
            style={{
              height: `${meterValue}%`,
              opacity: 0.7
            }}
          />
          
          {/* RMS meter (only shown in peakRMS mode) */}
          {meteringMode === 'peakRMS' && (
            <div
              className="w-1 bg-white rounded-sm"
              style={{
                height: `${rmsValue}%`,
                opacity: 0.5
              }}
            />
          )}
        </div>
        
        <div className="h-full w-8 flex justify-center relative">
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
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between gap-1 px-2">
        <Button
          size="sm"
          variant={channel.isMuted ? "destructive" : "outline"}
          onClick={onMute}
          className="flex-1 h-7 text-xs"
        >
          M
        </Button>
        <Button
          size="sm"
          variant={channel.isSolo ? "secondary" : "outline"}
          onClick={onSolo}
          className="flex-1 h-7 text-xs"
        >
          S
        </Button>
      </div>

      {/* Volume Display */}
      <div className="text-center text-xs text-gray-400 my-1">
        {channel.volume === 0 ? '-∞' : channel.volume < 70 ? `-${Math.round((100 - channel.volume) / 2)}dB` : `+${Math.round((channel.volume - 70) / 3)}dB`}
      </div>

      {/* Track Label */}
      <div className="px-2 pb-2">
        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleNameChange(); }}>
            <Input
              ref={inputRef}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameChange}
              className="h-7 text-xs bg-black/20 border-konform-neon-blue/20"
              autoFocus
            />
          </form>
        ) : (
          <div 
            className="text-sm text-center text-white truncate p-1 rounded bg-black/30 hover:bg-black/40 cursor-pointer"
            onClick={() => onRename && setIsEditing(true)}
            style={{ backgroundColor: `${channel.color}20` }}
          >
            {channel.name}
          </div>
        )}
      </div>
      
      {/* Additional custom content */}
      {children}
    </div>
  );
};