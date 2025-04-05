import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelStrip } from "./ChannelStrip";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Wrench, 
  Layers, 
  Settings, 
  SplitSquareVertical, 
  PanelLeft, 
  Mic as InputIcon, 
  Speaker as OutputIcon, 
  ExternalLink, 
  Piano, 
  ListMusic,
  MonitorSpeaker,
  Copy,
  BarChart,
  Ban,
  Headphones
} from "lucide-react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

export type Channel = {
  id: string;
  number: number;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  isSoloSafe?: boolean;
  type: 'master' | 'bus' | 'audio' | 'input' | 'fx' | 'instrument' | 'aux' | 'vca';
  color?: string;
  inputs?: string[];
  outputs?: string[];
  automationMode?: 'off' | 'read' | 'touch' | 'write' | 'latch';
  persona?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  instrument?: {
    name: string;
    type: string;
  };
  isSelected?: boolean;
};

type SectionState = {
  collapsed: boolean;
  height: number;
  width: number;
};

type ConsoleModeType = "large" | "small";
type ConsoleViewType = "normal" | "narrow";
type MeteringModeType = "peak" | "peakRMS" | "preFader";

export const MixbaseView = () => {
  const [channels, setChannels] = useState<Channel[]>(() => [
    {
      id: 'master',
      number: 0,
      name: 'Main Out',
      volume: 80,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'master',
      color: '#FF5F1F',
      outputs: ['Speakers'],
      automationMode: 'off'
    },
    {
      id: 'input-1',
      number: 1,
      name: 'Input 1',
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'input',
      color: '#10B981',
      inputs: ['Mic 1'],
      outputs: ['Main Out'],
      automationMode: 'off'
    },
    {
      id: 'bus-1',
      number: 1,
      name: 'Drum Bus',
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'bus',
      color: '#3B82F6',
      outputs: ['Main Out'],
      automationMode: 'off'
    },
    {
      id: 'fx-1',
      number: 1,
      name: 'Reverb',
      volume: 65,
      pan: 0,
      isMuted: false,
      isSolo: false,
      isSoloSafe: true,
      type: 'fx',
      color: '#8B5CF6',
      outputs: ['Main Out'],
      automationMode: 'off'
    },
    {
      id: 'audio-1',
      number: 1,
      name: 'Kick',
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'audio',
      color: '#FF5F1F',
      outputs: ['Drum Bus'],
      automationMode: 'off'
    },
    {
      id: 'audio-2',
      number: 2,
      name: 'Snare',
      volume: 70,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'audio',
      color: '#FF5F1F',
      outputs: ['Drum Bus'],
      automationMode: 'off'
    },
    {
      id: 'instrument-1',
      number: 1,
      name: 'Bass Synth',
      volume: 70,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'instrument',
      color: '#EC4899',
      outputs: ['Main Out'],
      automationMode: 'off',
      instrument: {
        name: 'Mai Tai',
        type: 'synth'
      }
    }
  ]);

  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [consoleMode, setConsoleMode] = useState<ConsoleModeType>("large");
  const [consoleView, setConsoleView] = useState<ConsoleViewType>("normal");
  const [showNavPanel, setShowNavPanel] = useState(true);
  const [activeNavPanel, setActiveNavPanel] = useState<string>("channels");
  const [isDetached, setIsDetached] = useState(false);
  const [channelWidth, setChannelWidth] = useState(120);
  const [meteringMode, setMeteringMode] = useState<MeteringModeType>("peak");
  const [preFaderMetering, setPreFaderMetering] = useState(false);
  const [showMetronome, setShowMetronome] = useState(false);
  const [metronomeVolume, setMetronomeVolume] = useState(75);
  const [soloChannels, setSoloChannels] = useState<string[]>([]);
  const [globalSoloOn, setGlobalSoloOn] = useState(false);
  const [copiedChannelSettings, setCopiedChannelSettings] = useState<Partial<Channel> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver(containerRef);

  // Update solo state effects
  useEffect(() => {
    const soloedChannels = channels.filter(c => c.isSolo).map(c => c.id);
    setSoloChannels(soloedChannels);
    setGlobalSoloOn(soloedChannels.length > 0);
  }, [channels]);

  const handleVolumeChange = (channelId: string, value: number) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, volume: value } : channel
      )
    );
  };

  const handlePanChange = (channelId: string, value: number) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, pan: value } : channel
      )
    );
  };

  const handleMute = (channelId: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, isMuted: !channel.isMuted } : channel
      )
    );
  };

  const handleSolo = (channelId: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, isSolo: !channel.isSolo } : channel
      )
    );
  };

  const handleToggleSoloSafe = (channelId: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, isSoloSafe: !channel.isSoloSafe } : channel
      )
    );
  };

  const handleGlobalSoloOff = () => {
    setChannels(prev =>
      prev.map(channel =>
        channel.isSolo ? { ...channel, isSolo: false } : channel
      )
    );
  };

  const handleAddChannel = (type: 'bus' | 'audio' | 'fx' | 'input' | 'aux' | 'instrument') => {
    const newChannel: Channel = {
      id: `${type}-${Date.now()}`,
      number: channels.filter(c => c.type === type).length + 1,
      name: getDefaultChannelName(type, channels.filter(c => c.type === type).length + 1),
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type,
      color: getChannelColor(type),
      outputs: ['Main Out'],
      automationMode: 'off',
      instrument: type === 'instrument' ? {
        name: 'New Instrument',
        type: 'synth'
      } : undefined
    };
    setChannels(prev => [...prev, newChannel]);
  };

  const getDefaultChannelName = (type: string, number: number): string => {
    switch(type) {
      case 'bus': return `Bus ${number}`;
      case 'audio': return `Audio ${number}`;
      case 'fx': return `FX ${number}`;
      case 'input': return `Input ${number}`;
      case 'aux': return `Aux ${number}`;
      case 'instrument': return `Instrument ${number}`;
      default: return `Channel ${number}`;
    }
  };

  const getChannelColor = (type: string): string => {
    switch(type) {
      case 'master': return '#FF5F1F';
      case 'bus': return '#3B82F6';
      case 'audio': return '#FF5F1F';
      case 'fx': return '#8B5CF6';
      case 'input': return '#10B981';
      case 'aux': return '#F59E0B';
      case 'instrument': return '#EC4899';
      case 'vca': return '#6B7280';
      default: return '#FFFFFF';
    }
  };

  const handleDuplicateChannel = (channelId: string) => {
    const channelToDuplicate = channels.find(c => c.id === channelId);
    if (channelToDuplicate) {
      const newChannel = {
        ...channelToDuplicate,
        id: `${channelToDuplicate.type}-${Date.now()}`,
        name: `${channelToDuplicate.name} (Copy)`,
      };
      setChannels(prev => [...prev, newChannel]);
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId));
    setSelectedChannels(prev => prev.filter(id => id !== channelId));
  };

  const handleRenameChannel = (channelId: string, newName: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, name: newName } : channel
      )
    );
  };

  const handleColorChange = (channelId: string, color: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, color } : channel
      )
    );
  };

  const handleChannelSelect = (channelId: string, multiSelect: boolean = false) => {
    if (multiSelect) {
      // If holding shift, add or remove from selection
      setSelectedChannels(prev => 
        prev.includes(channelId) 
          ? prev.filter(id => id !== channelId) 
          : [...prev, channelId]
      );
    } else {
      // Regular click, select only this channel
      setSelectedChannels([channelId]);
    }
  };

  const handleAutoModeChange = (channelId: string, mode: 'off' | 'read' | 'touch' | 'write' | 'latch') => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, automationMode: mode } : channel
      )
    );
  };

  const handleOutputChange = (channelId: string, output: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, outputs: [output] } : channel
      )
    );
  };

  const handleCopyChannelSettings = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      const { id, number, name, isSelected, ...settings } = channel;
      setCopiedChannelSettings(settings);
    }
  };

  const handlePasteChannelSettings = (channelId: string) => {
    if (!copiedChannelSettings) return;
    
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { 
          ...channel, 
          ...copiedChannelSettings,
          // Keep original id, number, name, and selected state
          id: channel.id,
          number: channel.number,
          name: channel.name,
          isSelected: channel.isSelected
        } : channel
      )
    );
  };

  const toggleConsoleMode = () => {
    setConsoleMode(prev => prev === "large" ? "small" : "large");
  };

  const toggleConsoleView = () => {
    setConsoleView(prev => prev === "normal" ? "narrow" : "normal");
    // Adjust channel width for narrow mode
    setChannelWidth(prev => prev === 120 ? 80 : 120);
  };

  const toggleNavPanel = () => {
    setShowNavPanel(prev => !prev);
  };

  const toggleDetach = () => {
    setIsDetached(prev => !prev);
    // Logic for detaching would typically involve window management
    // This is just a placeholder for the UI toggle
  };

  // Filter channels for different sections
  const outputChannels = channels.filter(c => c.type === 'master');
  const inputChannels = channels.filter(c => c.type === 'input');
  const audioChannels = channels.filter(c => c.type === 'audio');
  const instrumentChannels = channels.filter(c => c.type === 'instrument');
  const busChannels = channels.filter(c => c.type === 'bus');
  const fxChannels = channels.filter(c => c.type === 'fx');
  const auxChannels = channels.filter(c => c.type === 'aux');

  // Group all non-output channels
  const allChannels = [
    ...inputChannels,
    ...audioChannels,
    ...instrumentChannels, 
    ...busChannels,
    ...fxChannels,
    ...auxChannels
  ].sort((a, b) => {
    // Custom sort logic to organize channels
    if (a.type === 'bus' && b.type !== 'bus') return 1;
    if (a.type !== 'bus' && b.type === 'bus') return -1;
    if (a.type === 'fx' && b.type !== 'fx') return 1;
    if (a.type !== 'fx' && b.type === 'fx') return -1;
    return 0;
  });

  return (
    <div className="h-full bg-black/80 rounded-lg p-1 flex flex-col max-w-[1440px] mx-auto" ref={containerRef}>
      {/* Main Toolbar */}
      <div className="flex justify-between items-center bg-black/40 rounded-t-lg p-2 border-b border-konform-neon-blue/20">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNavPanel}
            className="h-8 w-8 p-0"
            title="Toggle Navigation Panel"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 bg-konform-neon-blue/20" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleConsoleMode}
            className="h-8 w-8 p-0"
            title={consoleMode === "large" ? "Switch to Small Mode" : "Switch to Large Mode"}
          >
            {consoleMode === "large" ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleConsoleView}
            className="h-8 w-8 p-0" 
            title={consoleView === "normal" ? "Switch to Narrow View" : "Switch to Normal View"}
          >
            <SplitSquareVertical className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDetach}
            className="h-8 w-8 p-0"
            title={isDetached ? "Attach Console" : "Detach Console"}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 bg-konform-neon-blue/20" />
          
          <Button variant="outline" size="sm" className="bg-black/20 text-xs border-konform-neon-blue/30">
            Audio I/O Setup
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {globalSoloOn && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-konform-neon-orange/20 text-konform-neon-orange border-konform-neon-orange/30"
              onClick={handleGlobalSoloOff}
            >
              <Ban className="h-3 w-3 mr-1" />
              Global Solo Off
            </Button>
          )}
          
          {/* Metering Mode Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-black/20 border-konform-neon-blue/30">
                <BarChart className="h-3 w-3 mr-1" />
                Metering
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
              <DropdownMenuRadioGroup value={meteringMode} onValueChange={(value) => setMeteringMode(value as MeteringModeType)}>
                <DropdownMenuRadioItem value="peak" className="cursor-pointer">Peak</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="peakRMS" className="cursor-pointer">Peak/RMS</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem 
                checked={preFaderMetering}
                onCheckedChange={setPreFaderMetering}
                className="cursor-pointer"
              >
                Pre-Fader Metering
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" className="bg-black/20 border-konform-neon-blue/30 mr-2">
            <Wrench className="h-3 w-3 mr-1" />
            Console Options
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 min-h-0">
        {/* Navigation Panel */}
        {showNavPanel && (
          <div className="w-[60px] bg-black/40 border-r border-konform-neon-blue/20 flex flex-col items-center py-2">
            <Button
              variant={activeNavPanel === "channels" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNavPanel("channels")}
              className="h-10 w-10 p-0 mb-1"
              title="Channels"
            >
              <Layers className="h-5 w-5" />
            </Button>
            
            <Button
              variant={activeNavPanel === "inputs" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNavPanel("inputs")}
              className="h-10 w-10 p-0 mb-1"
              title="Inputs"
            >
              <InputIcon className="h-5 w-5" />
            </Button>
            
            <Button
              variant={activeNavPanel === "outputs" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNavPanel("outputs")}
              className="h-10 w-10 p-0 mb-1"
              title="Outputs"
            >
              <OutputIcon className="h-5 w-5" />
            </Button>
            
            <Button
              variant={activeNavPanel === "instruments" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNavPanel("instruments")}
              className="h-10 w-10 p-0 mb-1"
              title="Instruments"
            >
              <Piano className="h-5 w-5" />
            </Button>
            
            <Button
              variant={activeNavPanel === "external" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNavPanel("external")}
              className="h-10 w-10 p-0 mb-1"
              title="External Devices"
            >
              <ExternalLink className="h-5 w-5" />
            </Button>
            
            <Separator className="my-2 w-8 bg-konform-neon-blue/20" />
            
            <Button
              variant={activeNavPanel === "scenes" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNavPanel("scenes")}
              className="h-10 w-10 p-0 mb-1"
              title="Scenes"
            >
              <Layers className="h-5 w-5" />
            </Button>
            
            <Button
              variant={activeNavPanel === "groups" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveNavPanel("groups")}
              className="h-10 w-10 p-0 mb-1"
              title="Groups"
            >
              <ListMusic className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Main Console Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Channel display area */}
          <ScrollArea 
            className="h-full w-full overflow-x-auto"
            type="always"
          >
            <div className="flex flex-row p-1" style={{ minWidth: '100%' }}>
              {/* Main Channels Area */}
              <div className="flex flex-row gap-1">
                {allChannels.map(channel => (
                  <ChannelStrip
                    key={channel.id}
                    channel={channel}
                    isSelected={selectedChannels.includes(channel.id)}
                    onSelect={(e) => handleChannelSelect(channel.id, e.shiftKey)}
                    onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                    onPanChange={(value) => handlePanChange(channel.id, value)}
                    onMute={() => handleMute(channel.id)}
                    onSolo={() => handleSolo(channel.id)}
                    onDuplicate={() => handleDuplicateChannel(channel.id)}
                    onDelete={() => handleDeleteChannel(channel.id)}
                    onRename={(newName) => handleRenameChannel(channel.id, newName)}
                    onColorChange={(color) => handleColorChange(channel.id, color)}
                    onAutoModeChange={(mode) => handleAutoModeChange(channel.id, mode)}
                    onOutputChange={(output) => handleOutputChange(channel.id, output)}
                    onToggleSoloSafe={() => handleToggleSoloSafe(channel.id)}
                    onCopySettings={() => handleCopyChannelSettings(channel.id)}
                    onPasteSettings={() => handlePasteChannelSettings(channel.id)}
                    meteringMode={meteringMode}
                    preFaderMetering={preFaderMetering}
                    style={{ width: `${channelWidth}px` }}
                    consoleMode={consoleMode}
                    consoleView={consoleView}
                  />
                ))}
              </div>
              
              {/* Output Channels (always at the right) */}
              <div className="flex flex-row gap-1 border-l border-konform-neon-orange/20 pl-1">
                {outputChannels.map(channel => (
                  <ChannelStrip
                    key={channel.id}
                    channel={channel}
                    isSelected={selectedChannels.includes(channel.id)}
                    onSelect={(e) => handleChannelSelect(channel.id, e.shiftKey)}
                    onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                    onPanChange={(value) => handlePanChange(channel.id, value)}
                    onMute={() => handleMute(channel.id)}
                    onSolo={() => handleSolo(channel.id)}
                    onCopySettings={() => handleCopyChannelSettings(channel.id)}
                    onPasteSettings={() => handlePasteChannelSettings(channel.id)}
                    meteringMode={meteringMode}
                    preFaderMetering={preFaderMetering}
                    style={{ width: `${channelWidth}px` }}
                    consoleMode={consoleMode}
                    consoleView={consoleView}
                  >
                    {/* Metronome Controls for Master Output */}
                    {showMetronome && (
                      <div className="p-2 border-t border-konform-neon-blue/20 mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Headphones className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-xs text-gray-400">Metronome</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 w-5 p-0 text-xs" 
                            onClick={() => setShowMetronome(false)}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-konform-neon-orange/50"
                            style={{ width: `${metronomeVolume}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </ChannelStrip>
                ))}
              </div>
            </div>
          </ScrollArea>
          
          {/* Channel Controls Area */}
          <div className="h-12 bg-gradient-to-r from-konform-neon-blue/20 to-konform-neon-orange/20 rounded-b-lg border-t border-konform-neon-blue/10 flex items-center px-4 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-black/40 border-konform-neon-blue/30">
                  Add Channel
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
                <DropdownMenuItem onClick={() => handleAddChannel('audio')} className="cursor-pointer">
                  Audio Track
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChannel('instrument')} className="cursor-pointer">
                  Instrument Track
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAddChannel('bus')} className="cursor-pointer">
                  Bus Channel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChannel('fx')} className="cursor-pointer">
                  FX Channel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChannel('input')} className="cursor-pointer">
                  Input Channel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChannel('aux')} className="cursor-pointer">
                  Aux Channel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedChannels.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-black/20 border-konform-neon-blue/30"
                  onClick={() => {
                    const channelId = selectedChannels[0];
                    if (channelId) handleDuplicateChannel(channelId);
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                
                {/* Copy/Paste Settings Dropdown */}
                {selectedChannels.length === 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-black/20 border-konform-neon-blue/30">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
                      <DropdownMenuItem 
                        onClick={() => handleCopyChannelSettings(selectedChannels[0])}
                        className="cursor-pointer"
                      >
                        Copy Channel Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handlePasteChannelSettings(selectedChannels[0])}
                        className="cursor-pointer"
                        disabled={!copiedChannelSettings}
                      >
                        Paste Channel Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleToggleSoloSafe(selectedChannels[0])}
                        className="cursor-pointer"
                      >
                        {channels.find(c => c.id === selectedChannels[0])?.isSoloSafe 
                          ? "Disable Solo Safe" 
                          : "Enable Solo Safe"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-black/20 border-konform-neon-blue/30">
                      <MonitorSpeaker className="h-4 w-4 mr-1" />
                      Output
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
                    <DropdownMenuItem 
                      onClick={() => {
                        selectedChannels.forEach(id => handleOutputChange(id, 'Main Out'));
                      }}
                      className="cursor-pointer"
                    >
                      Main Out
                    </DropdownMenuItem>
                    {busChannels.map(bus => (
                      <DropdownMenuItem 
                        key={bus.id} 
                        onClick={() => {
                          selectedChannels.forEach(id => handleOutputChange(id, bus.name));
                        }}
                        className="cursor-pointer"
                      >
                        {bus.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {/* Show Metronome Button */}
            {!showMetronome && outputChannels.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto bg-black/20 border-konform-neon-blue/30"
                onClick={() => setShowMetronome(true)}
              >
                <Headphones className="h-4 w-4 mr-1" />
                Metronome
              </Button>
            )}
          </div>
        </div>
        
        {/* Secondary Panel Area - would be shown based on activeNavPanel */}
        {activeNavPanel !== "channels" && showNavPanel && (
          <div className="w-[240px] bg-black/40 border-l border-konform-neon-blue/20 p-2">
            <h3 className="text-sm font-medium text-white/60 mb-2">
              {activeNavPanel === "inputs" && "Inputs"}
              {activeNavPanel === "outputs" && "Outputs"}
              {activeNavPanel === "instruments" && "Instruments"}
              {activeNavPanel === "external" && "External Devices"}
              {activeNavPanel === "scenes" && "Scenes"}
              {activeNavPanel === "groups" && "Groups"}
            </h3>
            
            {/* Panel Content would go here */}
            <div className="text-xs text-white/40">
              Panel content for {activeNavPanel} would be displayed here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};