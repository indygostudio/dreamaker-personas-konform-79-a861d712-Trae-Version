import { Channel } from './MixbaseView';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserRound, 
  Music2, 
  Volume2, 
  Settings2, 
  MoreVertical, 
  Mic2, 
  Guitar, 
  Headphones, 
  Piano, 
  Wand2, 
  SlidersHorizontal,
  PlusCircle,
  Disc,
  Wrench,
  BookOpen,
  Palette,
  Folder,
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { PersonaType } from '@/types/persona';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Effect {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
}

// Map of persona types to icons for visual indication
const PERSONA_TYPE_ICONS: Record<PersonaType, React.ReactNode> = {
  AI_INSTRUMENTALIST: <Guitar className="h-5 w-5" />,
  AI_WRITER: <BookOpen className="h-5 w-5" />,
  AI_VOCALIST: <Mic2 className="h-5 w-5" />,
  AI_CHARACTER: <UserRound className="h-5 w-5" />,
  AI_MIXER: <SlidersHorizontal className="h-5 w-5" />,
  AI_EFFECT: <Wand2 className="h-5 w-5" />,
  AI_SOUND: <Volume2 className="h-5 w-5" />,
  AI_PRODUCER: <Headphones className="h-5 w-5" />,
  AI_COMPOSER: <Music2 className="h-5 w-5" />,
  AI_ARRANGER: <Folder className="h-5 w-5" />,
  AI_DJ: <Disc className="h-5 w-5" />,
  AI_VISUAL_ARTIST: <Palette className="h-5 w-5" />,
  AI_AUDIO_ENGINEER: <Wrench className="h-5 w-5" />,
  AI_MASTERING: <Settings2 className="h-5 w-5" />,
  AI_MIX: <SlidersHorizontal className="h-5 w-5" />
};

// Map channel types to compatible persona types
const CHANNEL_PERSONA_MAPPING: Record<string, PersonaType[]> = {
  'audio': ['AI_VOCALIST', 'AI_CHARACTER', 'AI_SOUND'],
  'instrument': ['AI_INSTRUMENTALIST', 'AI_COMPOSER', 'AI_DJ', 'AI_ARRANGER'],
  'bus': ['AI_PRODUCER', 'AI_MIXER', 'AI_AUDIO_ENGINEER', 'AI_MIX'],
  'fx': ['AI_EFFECT'],
  'master': ['AI_MIXER', 'AI_AUDIO_ENGINEER', 'AI_PRODUCER', 'AI_MASTERING'],
  'input': ['AI_VOCALIST', 'AI_CHARACTER', 'AI_SOUND', 'AI_INSTRUMENTALIST'],
  'aux': ['AI_EFFECT', 'AI_SOUND'],
  'vca': ['AI_PRODUCER']
};

// Persona data interface
interface Persona {
  id: string;
  name: string;
  type: PersonaType;
  avatar_url?: string;
  description?: string;
  user_id: string;
  creator_name?: string;
}

interface ChannelStripProps {
  channel: Channel;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
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
  meteringMode?: 'peak' | 'rms' | 'peakRMS' | 'lufs' | 'k12' | 'k14' | 'k20';
  preFaderMetering?: boolean;
  style?: React.CSSProperties;
  consoleMode?: 'large' | 'small';
  consoleView?: 'normal' | 'narrow';
  children?: React.ReactNode;
  onAssignPersona?: (persona: Persona) => void;
  onMeterModeChange?: (mode: 'peak' | 'rms' | 'peakRMS' | 'lufs' | 'k12' | 'k14' | 'k20') => void;
  onTogglePreFaderMetering?: () => void;
  onUpdateSend?: (index: number, send: any) => void;
  onRemoveSend?: (index: number) => void;
  onAddSend?: (send: any) => void;
  fxChannels?: any[];
  busChannels?: any[];
  sends?: Array<{
    target: string;
    targetId: string;
    level: number;
    preFader: boolean;
  }>;
  availableSendTargets?: Array<{
    id: string;
    name: string;
    type: 'bus' | 'fx' | 'master';
  }>;
}

export const ChannelStrip = ({
  channel,
  isSelected,
  onSelect,
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
  meteringMode = 'peak',
  preFaderMetering = false,
  style,
  consoleMode = 'small',
  consoleView = 'narrow',
  children,
  onAssignPersona,
  onMeterModeChange,
  onTogglePreFaderMetering,
  onUpdateSend,
  onRemoveSend,
  onAddSend,
  fxChannels,
  busChannels,
  sends,
  availableSendTargets
}: ChannelStripProps) => {
  const { toast } = useToast();
  const [effects] = useState<Effect[]>(() => [
    { id: '1', name: 'Channel EQ', type: 'eq', enabled: true },
    { id: '2', name: 'Compressor', type: 'dynamics', enabled: true },
    { id: '3', name: 'Tape Delay', type: 'delay', enabled: true },
    { id: '4', name: 'ChromaVerb', type: 'reverb', enabled: true }
  ]);

  const [meterValue, setMeterValue] = useState(0);
  const [peakValue, setPeakValue] = useState(0);
  const [rmsValue, setRmsValue] = useState(0);
  const meterRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get compatible persona types for this channel
  const compatiblePersonaTypes = CHANNEL_PERSONA_MAPPING[channel.type] || [];

  // Fetch available personas
  const { data: personas, isLoading: isLoadingPersonas } = useQuery({
    queryKey: ['available-personas', channel.type],
    queryFn: async () => {
      try {
        // Only fetch personas that are compatible with this channel type
        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .in('type', compatiblePersonaTypes);

        if (error) throw error;
        return data as Persona[];
      } catch (error) {
        console.error('Error fetching personas:', error);
        return [];
      }
    }
  });

  // Simulated meter animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Create random values for metering based on channel volume
      const volume = channel.isMuted ? 0 : channel.volume;
      const randomValue = Math.random() * volume;
      const peak = Math.min(randomValue * 1.2, 100); // Peak is slightly higher than average
      const rms = randomValue * 0.8; // RMS is slightly lower than average
      
      setMeterValue(randomValue);
      setPeakValue(peak);
      setRmsValue(rms);
    }, 100);
    return () => clearInterval(interval);
  }, [channel.volume, channel.isMuted]);

  // Handle persona assignment
  const handleAssignPersona = (persona: Persona) => {
    if (onAssignPersona) {
      onAssignPersona(persona);
      toast({
        title: "Persona Assigned",
        description: `${persona.name} has been assigned to ${channel.name}.`
      });
    }
  };
  
  // Get current persona display information
  const getPersonaDisplay = () => {
    if (!channel.persona) {
      return {
        initials: channel.type.substring(0, 2).toUpperCase(),
        icon: <PlusCircle className="h-5 w-5" />,
        tooltip: "Assign Persona"
      };
    }
    
    const personaType = channel.persona.type as PersonaType || 'AI_CHARACTER';
    return {
      initials: channel.persona.name.substring(0, 2).toUpperCase(),
      icon: PERSONA_TYPE_ICONS[personaType] || <UserRound className="h-5 w-5" />,
      tooltip: channel.persona.name
    };
  };
  
  const personaDisplay = getPersonaDisplay();
  
  return (
    <div 
      className={`group relative flex flex-col bg-black/20 border ${isSelected ? 'border-white/30' : 'border-transparent'} rounded-lg p-2 gap-2 hover:border-white/20 transition-colors duration-150`}
      style={{ 
        width: consoleView === 'narrow' ? '90px' : '120px',
        borderLeftColor: channel.color,
        borderLeftWidth: '2px',
        ...style 
      }}
      onClick={onSelect}
    >
      {/* Context Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 h-6 w-6">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {onRename && (
            <DropdownMenuItem 
              onClick={() => {
                const newName = prompt('Enter new name:', channel.name);
                if (newName) onRename(newName);
              }}
            >
              Rename
            </DropdownMenuItem>
          )}
          {onColorChange && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Color</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {[
                  { name: 'Red', value: '#EF4444' },
                  { name: 'Orange', value: '#F97316' },
                  { name: 'Yellow', value: '#EAB308' },
                  { name: 'Green', value: '#10B981' },
                  { name: 'Blue', value: '#3B82F6' },
                  { name: 'Purple', value: '#8B5CF6' },
                  { name: 'Pink', value: '#EC4899' }
                ].map(color => (
                  <DropdownMenuItem 
                    key={color.value} 
                    onClick={() => onColorChange(color.value)}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: color.value }} 
                    />
                    {color.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          {onDuplicate && <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>}
          {onDelete && <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>}
          {onToggleSoloSafe && (
            <DropdownMenuItem onClick={onToggleSoloSafe}>
              {channel.isSoloSafe ? 'Disable Solo Safe' : 'Enable Solo Safe'}
            </DropdownMenuItem>
          )}
          {(onCopySettings || onPasteSettings) && <DropdownMenuSeparator />}
          {onCopySettings && <DropdownMenuItem onClick={onCopySettings}>Copy Settings</DropdownMenuItem>}
          {onPasteSettings && <DropdownMenuItem onClick={onPasteSettings}>Paste Settings</DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Persona Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex justify-center p-0 h-auto relative group">
            <Avatar className={`h-10 w-10 ${!channel.persona ? 'border border-dashed border-white/30' : ''}`}>
              {channel.persona?.avatar_url ? (
                <AvatarImage src={channel.persona.avatar_url} alt={channel.persona.name} />
              ) : null}
              <AvatarFallback className={channel.persona ? 'bg-black/70' : 'bg-black/20'}>
                {channel.persona ? 
                  personaDisplay.icon : 
                  <PlusCircle className="h-5 w-5 text-white/50" />
                }
              </AvatarFallback>
            </Avatar>
            {channel.persona && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full h-3 w-3 border border-black"></div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {channel.persona ? (
            <>
              <div className="px-2 py-1.5 text-sm font-medium">{channel.persona.name}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  if (onAssignPersona) onAssignPersona({ ...channel.persona, id: '' });
                }}
              >
                Remove Persona
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <div className="px-2 py-1.5 text-sm font-medium">Assign Persona</div>
              <DropdownMenuSeparator />
              {isLoadingPersonas ? (
                <div className="px-2 py-1.5 text-xs text-gray-400">Loading personas...</div>
              ) : personas && personas.length > 0 ? (
                personas.map((persona) => (
                  <DropdownMenuItem 
                    key={persona.id}
                    onClick={() => handleAssignPersona(persona)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      {persona.avatar_url ? (
                        <AvatarImage src={persona.avatar_url} alt={persona.name} />
                      ) : (
                        <AvatarFallback className="bg-black/70 text-xs">
                          {PERSONA_TYPE_ICONS[persona.type] || persona.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{persona.name}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-xs text-gray-400">
                  No compatible personas found
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Create New Persona...
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Channel Type Indicator or Instrument */}
      {channel.type === 'instrument' && channel.instrument ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-green-500/20 text-green-500 hover:bg-green-500/30 text-xs"
        >
          <Piano className="h-3 w-3 mr-1" />
          {channel.instrument.name}
        </Button>
      ) : (
        <div 
          className="text-xs text-center py-1 rounded"
          style={{
            backgroundColor: `${channel.color}20`,
            color: channel.color
          }}
        >
          {channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}
        </div>
      )}

      {/* Send Controls */}
      {!channel.type?.includes('master') && (
        <div className="border-t border-konform-neon-blue/10 pt-2 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-konform-neon-blue/90">Sends</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-konform-neon-blue/70 hover:text-konform-neon-blue"
              onClick={() => {
                if (!availableSendTargets?.length) {
                  toast({
                    title: "No targets available",
                    description: "Create a bus or FX track first",
                    variant: "destructive"
                  });
                  return;
                }
                
                // Find first available target that's not already used
                const existingSendIds = (sends || []).map(s => s.targetId);
                const target = availableSendTargets.find(t => !existingSendIds.includes(t.id));
                
                if (!target) {
                  toast({
                    title: "All targets in use",
                    description: "Remove a send or create a new target",
                    variant: "destructive"
                  });
                  return;
                }
                
                onAddSend?.({
                  target: target.name,
                  targetId: target.id,
                  level: 0,
                  preFader: false
                });
              }}
            >
              <PlusCircle className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {!sends?.length && <div className="text-xs text-gray-400 mb-2 mt-1">No sends configured</div>}
          
          {sends?.map((send, index) => (
            <div key={index} className="flex items-center justify-between gap-2 mb-2">
              <div className="flex-1 text-xs">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-full px-2 justify-between text-xs">
                      <span className="truncate">{send.target}</span>
                      <SlidersHorizontal className="h-3 w-3 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuLabel>Send to</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableSendTargets?.map(target => (
                      <DropdownMenuItem
                        key={target.id}
                        onClick={() => {
                          onUpdateSend?.(index, { 
                            targetId: target.id,
                            target: target.name
                          });
                        }}
                      >
                        {target.name} ({target.type})
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={send.preFader}
                      onCheckedChange={(checked) => {
                        onUpdateSend?.(index, { preFader: checked });
                      }}
                    >
                      Pre-fader
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 hover:text-red-400"
                      onClick={() => onRemoveSend?.(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Remove send
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Slider
                className="w-20"
                defaultValue={[send.level]}
                value={[send.level]}
                step={1}
                max={100}
                onValueChange={([value]) => onUpdateSend?.(index, { level: value })}
              />
            </div>
          ))}
        </div>
      )}

      {/* Automation Mode */}
      {onAutoModeChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-xs ${
                channel.automationMode === 'write' ? 'bg-red-500/20 text-red-500' :
                channel.automationMode === 'touch' ? 'bg-yellow-500/20 text-yellow-500' :
                channel.automationMode === 'latch' ? 'bg-purple-500/20 text-purple-500' :
                channel.automationMode === 'read' ? 'bg-blue-500/20 text-blue-500' :
                'bg-gray-500/20 text-gray-500'
              }`}
            >
              {channel.automationMode === 'off' ? 'Auto: Off' : `Auto: ${channel.automationMode}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onAutoModeChange('off')}>Off</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAutoModeChange('read')}>Read</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAutoModeChange('touch')}>Touch</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAutoModeChange('write')}>Write</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAutoModeChange('latch')}>Latch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Volume Fader & Meter */}
      <div className="relative h-36 flex items-center justify-center gap-1 mt-auto">
        {/* Meter */}
        <div className="relative w-3 h-full bg-black/40 rounded overflow-hidden">
          {meteringMode === 'peak' && (
            <div
              ref={meterRef}
              className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-b transition-all duration-75"
              style={{
                height: `${meterValue}%`,
                opacity: 0.8
              }}
            />
          )}
          {meteringMode === 'rms' && (
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-green-300 to-green-400 rounded-b transition-all duration-150"
              style={{
                height: `${rmsValue}%`,
                opacity: 0.8
              }}
            />
          )}
          {meteringMode === 'peakRMS' && (
            <>
              {/* RMS Meter */}
              <div
                className="absolute bottom-0 w-1.5 left-0 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-bl transition-all duration-75"
                style={{
                  height: `${rmsValue}%`,
                  opacity: 0.8
                }}
              />
              {/* Peak Meter */}
              <div
                className="absolute bottom-0 w-1.5 right-0 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-br transition-all duration-75"
                style={{
                  height: `${peakValue}%`,
                  opacity: 0.8
                }}
              />
            </>
          )}
          {meteringMode === 'lufs' && (
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-blue-500 to-purple-500 rounded-b transition-all duration-200"
              style={{
                height: `${Math.min(rmsValue * 1.2, 100)}%`,
                opacity: 0.8
              }}
            />
          )}
          {meteringMode === 'k12' || meteringMode === 'k14' || meteringMode === 'k20' && (
            <div className="h-full w-full relative">
              {/* K-System meter with reference levels */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-500 rounded-b transition-all duration-75"
                style={{
                  height: `${Math.min(meterValue, meteringMode === 'k12' ? 80 : meteringMode === 'k14' ? 70 : 60)}%`,
                  opacity: 0.8
                }}
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-500 rounded-b transition-all duration-75"
                style={{
                  height: `${Math.min(Math.max(0, meterValue - (meteringMode === 'k12' ? 80 : meteringMode === 'k14' ? 70 : 60)), 15)}%`,
                  top: `${meteringMode === 'k12' ? 80 : meteringMode === 'k14' ? 70 : 60}%`,
                  opacity: 0.8
                }}
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-red-500 rounded-b transition-all duration-75"
                style={{
                  height: `${Math.max(0, meterValue - (meteringMode === 'k12' ? 95 : meteringMode === 'k14' ? 85 : 75))}%`,
                  top: `${meteringMode === 'k12' ? 95 : meteringMode === 'k14' ? 85 : 75}%`,
                  opacity: 0.8
                }}
              />
              
              {/* Reference lines for K-System calibration */}
              <div className="absolute w-full h-[1px] bg-white/30" style={{ bottom: `${meteringMode === 'k12' ? 80 : meteringMode === 'k14' ? 70 : 60}%` }}></div>
              <div className="absolute w-full h-[1px] bg-white/30" style={{ bottom: `${meteringMode === 'k12' ? 95 : meteringMode === 'k14' ? 85 : 75}%` }}></div>
            </div>
          )}
          
          {/* Meter scale markers */}
          <div className="absolute right-0 h-full w-full pointer-events-none">
            <div className="absolute top-[10%] right-0 w-2 h-[1px] bg-white/20"></div>
            <div className="absolute top-[25%] right-0 w-2 h-[1px] bg-white/20"></div>
            <div className="absolute top-[50%] right-0 w-2 h-[1px] bg-white/20"></div>
            <div className="absolute top-[75%] right-0 w-2 h-[1px] bg-white/20"></div>
            <div className="absolute top-[90%] right-0 w-2 h-[1px] bg-white/20"></div>
          </div>
        </div>

        {/* Add a dropdown to change meter mode */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute -right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-20 hover:opacity-100 transition-opacity"
            >
              <Settings2 className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Meter Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onMeterModeChange?.('peak')}>
              {meteringMode === 'peak' && '✓'} Peak
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMeterModeChange?.('rms')}>
              {meteringMode === 'rms' && '✓'} RMS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMeterModeChange?.('peakRMS')}>
              {meteringMode === 'peakRMS' && '✓'} Peak + RMS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMeterModeChange?.('lufs')}>
              {meteringMode === 'lufs' && '✓'} LUFS
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>K-System Metering</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onMeterModeChange?.('k12')}>
              {meteringMode === 'k12' && '✓'} K-12
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMeterModeChange?.('k14')}>
              {meteringMode === 'k14' && '✓'} K-14
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMeterModeChange?.('k20')}>
              {meteringMode === 'k20' && '✓'} K-20
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem 
              checked={preFaderMetering} 
              onCheckedChange={() => onTogglePreFaderMetering?.()}
            >
              Pre-Fader Metering
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Fader */}
        <Slider
          orientation="vertical"
          value={[channel.volume]}
          onValueChange={([value]) => onVolumeChange(value)}
          min={0}
          max={100}
          step={1}
          className="h-full"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between gap-1">
        <Button
          size="sm"
          variant={channel.isMuted ? "destructive" : "outline"}
          onClick={onMute}
          className="flex-1 h-7 text-xs p-0"
        >
          M
        </Button>
        <Button
          size="sm"
          variant={channel.isSolo ? "secondary" : "outline"}
          onClick={onSolo}
          className={`flex-1 h-7 text-xs p-0 ${channel.isSoloSafe ? 'border-yellow-500 text-yellow-500' : ''}`}
        >
          S
        </Button>
      </div>

      {/* Track Label */}
      <div 
        className="text-xs text-center p-1 rounded truncate"
        style={{
          backgroundColor: `${channel.color}20`,
          color: 'white'
        }}
      >
        {channel.name}
      </div>

      {/* Custom children (like metronome for master) */}
      {children}
    </div>
  );
};