import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Power, Mic, Copy, Trash2, UserPlus2, PlusSquare, ChevronDown, ToggleLeft, ToggleRight, ArrowDownLeft, ArrowUpRight, FolderPlus, Headphones, Speaker, Monitor, CornerUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Persona } from "@/types/persona";
import { GeminiSliderEffect } from "@/components/ui/gemini-slider-effect";

interface ChannelStripProps {
  channelNumber: number;
  isMaster?: boolean;
  collaborator?: Persona;
  isSelected?: boolean;
  className?: string;
  type?: 'audio' | 'bus' | 'master' | 'instrument';
  viewMode?: 'large' | 'normal' | 'compact';
  onSelect?: (e: React.MouseEvent) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  sends?: Array<{
    target: string;
    targetId: string;
    level: number;
    preFader: boolean;
  }>;
  onUpdateSend?: (sendIndex: number, updates: Partial<{
    target: string;
    targetId: string;
    level: number;
    preFader: boolean;
  }>) => void;
  onRemoveSend?: (sendIndex: number) => void;
  onAddSend?: (send: {
    target: string;
    targetId: string;
    level: number;
    preFader: boolean;
  }) => void;
  availableSendTargets?: Array<{
    id: string;
    name: string;
    type: 'bus' | 'fx' | 'master';
  }>;
}

interface AutomationState {
  read: boolean;
  write: boolean;
  touch: boolean;
  latch: boolean;
}

interface HardwareOutput {
  id: string;
  name: string;
  type: 'speakers' | 'headphones' | 'monitor';
  icon: React.ReactNode;
}

export const ChannelStrip = ({ 
  channelNumber, 
  isMaster = false,
  collaborator,
  isSelected = false,
  className = "",
  type = 'audio',
  viewMode = 'normal',
  onSelect,
  onDelete,
  onDuplicate,
  sends = [],
  onUpdateSend,
  onRemoveSend,
  onAddSend,
  availableSendTargets = []
}: ChannelStripProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSolo, setIsSolo] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [trackName, setTrackName] = useState(`Track ${channelNumber}`);
  const [showPersonasDropdown, setShowPersonasDropdown] = useState(false);
  const [currentCollaborator, setCurrentCollaborator] = useState<Persona | undefined>(collaborator);
  const [automation, setAutomation] = useState<AutomationState>({
    read: false,
    write: false,
    touch: false,
    latch: false
  });
  const [selectedOutput, setSelectedOutput] = useState<string>('default-speakers');
  const { selectedPersonas } = useSelectedPersonasStore();
  const { toast } = useToast();
  const [showSendsPanel, setShowSendsPanel] = useState(false);

  const { data: sessionPersonas, isLoading: isLoadingPersonas } = useQuery({
    queryKey: ['latest_collaboration_personas'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: session } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (session?.personas?.length) {
        const { data: personasData } = await supabase
          .from('personas')
          .select('*')
          .in('id', session.personas);
        
        return personasData ? personasData.map(transformPersonaData) : [];
      }
      return [];
    }
  });

  const filteredPersonas = (sessionPersonas || []).filter(persona => {
    if (isMaster) {
      // Master channels can receive AI_MASTERING or AI_MIXER
      return persona.type === 'AI_MASTERING' || persona.type === 'AI_MIXER' || persona.type === 'AI_AUDIO_ENGINEER';
    } else if (type === 'bus') {
      // Bus/Mix channels can receive AI_MIX and others
      return persona.type === 'AI_MIX' || persona.type === 'AI_MIXER' || persona.type === 'AI_PRODUCER' || persona.type === 'AI_AUDIO_ENGINEER';
    } else if (type === 'instrument') {
      // Instrument tracks get AI_INSTRUMENTALIST
      return persona.type === 'AI_INSTRUMENTALIST' || persona.type === 'AI_COMPOSER' || persona.type === 'AI_DJ' || persona.type === 'AI_ARRANGER';
    } else {
      // Audio tracks get everything else
      return !['AI_MASTERING', 'AI_MIXER', 'AI_MIX'].includes(persona.type);
    }
  });

  const toggleAutomation = (type: keyof AutomationState) => {
    setAutomation(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleDoubleClick = () => {
    if (collaborator) return;

    if (filteredPersonas.length === 0) {
      toast({
        title: isMaster ? "No Mixer Personas Available" : "No Personas Available",
        description: isMaster 
          ? "Please add a mixer persona from the collaborators section" 
          : "Please add personas from the collaborators section",
        variant: "destructive"
      });
    } else {
      setShowPersonasDropdown(true);
    }
  };

  const handleBounce = () => {
    toast({
      title: "Bouncing Track",
      description: "Track bounce will be available in a future update.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Track",
      description: "Track export will be available in a future update.",
    });
  };

  const handleAddToFolder = () => {
    toast({
      title: "Add to Folder",
      description: "Folder tracks will be available in a future update.",
    });
  };

  const handleDisable = () => {
    setIsDisabled(!isDisabled);
    toast({
      title: isDisabled ? "Track Enabled" : "Track Disabled",
      description: `${trackName} has been ${isDisabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const hardwareOutputs: HardwareOutput[] = [
    { id: 'default-speakers', name: 'System Speakers', type: 'speakers', icon: <Speaker className="h-4 w-4" /> },
    { id: 'studio-monitors', name: 'Studio Monitors', type: 'monitor', icon: <Monitor className="h-4 w-4" /> },
    { id: 'headphones-1', name: 'Headphones 1', type: 'headphones', icon: <Headphones className="h-4 w-4" /> },
    { id: 'headphones-2', name: 'Headphones 2', type: 'headphones', icon: <Headphones className="h-4 w-4" /> }
  ];

  const handleAddSend = () => {
    if (availableSendTargets.length === 0) {
      toast({
        title: "No Send Destinations",
        description: "Create a bus or FX track to send to.",
        variant: "destructive"
      });
      return;
    }
    
    const target = availableSendTargets[0];
    onAddSend?.({
      target: target.name,
      targetId: target.id,
      level: 0,
      preFader: false
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`flex flex-col items-center gap-1 py-1 px-2 bg-black/60 rounded-lg border transition-colors ${
            isSelected 
              ? 'border-konform-neon-orange' 
              : type === 'master'
                ? 'border-konform-neon-orange/20 hover:border-konform-neon-orange/40'
                : type === 'bus'
                  ? 'border-konform-neon-blue/20 hover:border-konform-neon-blue/40'
                  : 'border-konform-neon-blue/10 hover:border-konform-neon-blue/30'
          } ${className} ${isDisabled ? 'opacity-50' : ''} ${
            viewMode === 'large' ? 'w-48' :
            viewMode === 'normal' ? 'w-32' :
            'w-24'
          }`}
          onClick={onSelect}
        >
          <div className="w-full flex justify-between items-center px-2">
            <span className="text-xs text-konform-neon-blue">
              {isMaster ? "MASTER" : `CH ${channelNumber}`}
            </span>
            <div className="flex gap-1">
              {!isMaster && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:text-konform-neon-orange"
                    onClick={onDuplicate}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:text-red-500"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 w-6 p-0 ${isDisabled ? 'text-red-500' : 'text-konform-neon-blue'}`}
                onClick={handleDisable}
              >
                <Power className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-0.5 border-b border-konform-neon-blue/10 pb-0.5">
            <DropdownMenu open={showPersonasDropdown} onOpenChange={setShowPersonasDropdown}>
              <DropdownMenuTrigger asChild>
                {currentCollaborator ? (
                  <Avatar 
                    className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-konform-neon-blue/50 transition-all"
                  >
                    <AvatarImage src={currentCollaborator.avatar_url} />
                    <AvatarFallback>{currentCollaborator.name?.[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 w-9 rounded-full border-2 border-dashed border-konform-neon-blue/20 hover:border-konform-neon-blue/50"
                    onDoubleClick={handleDoubleClick}
                  >
                    <UserPlus2 className="h-4 w-4 text-konform-neon-blue/50" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="border border-konform-neon-blue/20"
                style={{ 
                  backgroundColor: "#1A1F2C", 
                  backdropFilter: "none",
                  WebkitBackdropFilter: "none",
                  opacity: "1"
                }}
              >
                <DropdownMenuLabel>
                  {currentCollaborator ? "Change Persona" : "Add Persona"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-konform-neon-blue/20 scrollbar-track-black/20">
                  {isLoadingPersonas ? (
                    <DropdownMenuItem disabled>
                      Loading personas...
                    </DropdownMenuItem>
                  ) : filteredPersonas.length === 0 ? (
                    <DropdownMenuItem disabled>
                      No personas available
                    </DropdownMenuItem>
                  ) : (
                    filteredPersonas.map(persona => (
                      <DropdownMenuItem 
                        key={persona.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-konform-neon-blue/10 transition-colors"
                        onClick={() => setCurrentCollaborator(persona)}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={persona.avatar_url} />
                          <AvatarFallback>{persona.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm">{persona.name}</span>
                          <span className="text-xs text-gray-400">
                            {persona.type.replace('AI_', '')}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!isMaster && (
            <div className="w-full border-b border-konform-neon-blue/10 pb-0 pt-0">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-konform-neon-blue">Sends</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 relative"
                  onClick={handleAddSend}
                >
                  <PlusSquare className="h-3 w-3 text-konform-neon-blue" />
                </Button>
              </div>
              
              {sends.length > 0 ? (
                <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-konform-neon-blue/20">
                  {sends.map((send, index) => (
                    <div key={index} className="flex items-center gap-1 px-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => onRemoveSend?.(index)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                      
                      <Select
                        value={send.targetId}
                        onValueChange={(value) => {
                          const target = availableSendTargets.find(t => t.id === value);
                          if (target) {
                            onUpdateSend?.(index, { 
                              targetId: value,
                              target: target.name 
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="h-6 text-xs flex-1 bg-black/20">
                          <SelectValue placeholder="Select target" />
                        </SelectTrigger>
                        <SelectContent 
                          className="border border-konform-neon-blue/20"
                          style={{ 
                            backgroundColor: "#1A1F2C", 
                            backdropFilter: "none",
                            WebkitBackdropFilter: "none",
                            opacity: "1"
                          }}
                        >
                          {availableSendTargets.map(target => (
                            <SelectItem key={target.id} value={target.id}>
                              {target.name} ({target.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-5 w-5 p-0 ${send.preFader ? 'text-konform-neon-orange' : 'text-konform-neon-blue/50'}`}
                        onClick={() => onUpdateSend?.(index, { preFader: !send.preFader })}
                        title={send.preFader ? "Pre-Fader" : "Post-Fader"}
                      >
                        <CornerUpRight className="h-3 w-3" />
                      </Button>
                      
                      <Slider
                        value={[send.level]}
                        max={100}
                        step={1}
                        className="h-6 w-16"
                        onValueChange={([value]) => onUpdateSend?.(index, { level: value })}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-center text-gray-500 py-1">
                  No sends
                </div>
              )}
            </div>
          )}

          {!isMaster && (
            <div className="w-full border-b border-konform-neon-blue/10 pb-0 pt-0">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-konform-neon-blue">Plugin</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 relative">
                  <PlusSquare className="h-3 w-3 text-konform-neon-blue" />
                </Button>
              </div>
              <div className="relative">
                <Select>
                  <SelectTrigger className="h-6 text-xs bg-black/20">
                    <SelectValue placeholder="Add Plugin" />
                  </SelectTrigger>
                  <SelectContent 
                    className="border border-konform-neon-blue/20"
                    style={{ 
                      backgroundColor: "#1A1F2C", 
                      backdropFilter: "none",
                      WebkitBackdropFilter: "none",
                      opacity: "1"
                    }}
                  >
                    <SelectItem value="comp">Compressor</SelectItem>
                    <SelectItem value="eq">EQ</SelectItem>
                    <SelectItem value="reverb">Reverb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="w-full border-b border-konform-neon-blue/10 pb-0 pt-0">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-konform-neon-blue">Output</span>
              <Volume2 className="h-3 w-3 text-konform-neon-blue" />
            </div>
            <Select>
              <SelectTrigger className="h-6 text-xs bg-black/20">
                <SelectValue placeholder="Select Output" defaultValue="master" />
              </SelectTrigger>
              <SelectContent 
                className="border border-konform-neon-blue/20"
                style={{ 
                  backgroundColor: "#1A1F2C", 
                  backdropFilter: "none",
                  WebkitBackdropFilter: "none",
                  opacity: "1"
                }}
              >
                {isMaster ? (
                  hardwareOutputs.map(output => (
                    <SelectItem key={output.id} value={output.id}>
                      <div className="flex items-center gap-2">
                        {output.icon}
                        <span>{output.name}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="aux1">Aux 1</SelectItem>
                    <SelectItem value="aux2">Aux 2</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[64px] w-full flex items-center gap-2">
            <div className="h-full flex-1 flex items-center gap-2">
              <div className="h-full flex flex-col justify-between text-xs text-gray-400 pr-1">
                <span>+12</span>
                <span>0</span>
                <span>-12</span>
                <span>-24</span>
                <span>-∞</span>
              </div>

              <div className="h-full w-2 bg-black/40 rounded-sm overflow-hidden">
                <div className="w-full h-full bg-black/20" />
              </div>

              <div className="flex-1 h-full flex justify-center items-center">
                <div className="h-full w-10 flex justify-center relative">
                  <style>
                    {`
                      [class*="Slider"] [role="slider"] {
                        height: 40px;
                        width: 24px;
                        border-radius: 1px;
                        background: linear-gradient(to bottom, #2d2d2d, #1d1d1d);
                        border: 1px solid #00D1FF;
                        box-shadow: 
                          0 2px 8px rgba(0,209,255,0.2),
                          inset 0 1px rgba(255,255,255,0.1);
                        transform: translateX(-50%);
                        position: relative;
                      }
                      [class*="Slider"] [role="slider"]::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 16px;
                        height: 2px;
                        background: #00D1FF;
                        box-shadow: 0 0 4px rgba(0,209,255,0.5);
                      }
                      [class*="Slider"] [role="slider"]::before {
                        content: '';
                        position: absolute;
                        top: 8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 12px;
                        height: 2px;
                        background: #00D1FF;
                        box-shadow: 0 0 4px rgba(0,209,255,0.5);
                        opacity: 0.5;
                      }
                    `}
                  </style>
                  <GeminiSliderEffect value={100} className="pointer-events-none" />
                  <Slider
                    defaultValue={[100]}
                    max={100}
                    step={1}
                    orientation="vertical"
                    className="h-full relative"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-0.5 pt-0.5">
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-5 text-xs bg-black/40 w-full transition-colors duration-150
                  ${isMuted 
                    ? 'border-[#00D1FF] bg-[#00D1FF]/20 text-[#00D1FF] hover:bg-[#00D1FF]/30' 
                    : 'border-konform-neon-blue/20 hover:bg-transparent hover:border-konform-neon-blue'
                  }`}
                onClick={() => setIsMuted(!isMuted)}
              >
                M
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-5 text-xs bg-black/40 w-full transition-colors duration-150
                  ${isSolo 
                    ? 'border-konform-neon-orange bg-konform-neon-orange/20 text-konform-neon-orange hover:bg-konform-neon-orange/30 hover:border-konform-neon-orange' 
                    : 'border-konform-neon-blue/20 hover:bg-transparent hover:border-konform-neon-blue'
                  }`}
                onClick={() => setIsSolo(!isSolo)}
              >
                S
              </Button>
            </div>
            
            <div className="flex items-center justify-center">
              <span className="text-xs text-konform-neon-blue">0.0 dB</span>
            </div>

            <Input
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="h-6 text-xs bg-black/20 border-konform-neon-blue/20 text-center"
              placeholder="Track Name"
            />
            
            <div className="flex items-center justify-center">
              <Mic className="h-3.5 w-3.5 text-konform-neon-blue opacity-50" />
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent 
        className="w-56 border border-konform-neon-blue/20"
        style={{ 
          backgroundColor: "#1A1F2C", 
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          opacity: "1"
        }}
      >
        <ContextMenuItem onClick={handleAddToFolder}>
          <FolderPlus className="h-4 w-4 mr-2" />
          Add to Folder Track
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate Channel
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={onDelete}
          className="text-red-500 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Channel
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleBounce}>
          <ArrowDownLeft className="h-4 w-4 mr-2" />
          Bounce
        </ContextMenuItem>
        <ContextMenuItem onClick={handleExport}>
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Export
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDisable}>
          <Power className="h-4 w-4 mr-2" />
          {isDisabled ? 'Enable' : 'Disable'}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => toggleAutomation('read')}>
          {automation.read ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
          Read Automation
        </ContextMenuItem>
        <ContextMenuItem onClick={() => toggleAutomation('write')}>
          {automation.write ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
          Write Automation
        </ContextMenuItem>
        <ContextMenuItem onClick={() => toggleAutomation('touch')}>
          {automation.touch ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
          Touch Automation
        </ContextMenuItem>
        <ContextMenuItem onClick={() => toggleAutomation('latch')}>
          {automation.latch ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
          Latch Automation
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
