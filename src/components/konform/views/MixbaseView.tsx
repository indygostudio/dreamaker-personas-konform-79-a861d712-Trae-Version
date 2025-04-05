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
  Headphones,
  PlusCircle,
  Download,
  History,
  Save as SaveIcon,
  FolderHeart,
  FileText,
  MoreHorizontal,
  Clock,
  Edit,
  Disc,
  Music2,
  Link,
  Settings2
} from "lucide-react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/dropdown-menu";
import { useKonformProject } from "@/hooks/useKonformProject";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

type ConsoleModeType = "large" | "small";
type ConsoleViewType = "normal" | "narrow";
type MeteringModeType = "peak" | "peakRMS" | "preFader";

// Project Header component
const ProjectHeader = () => {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isEditing, setIsEditing] = useState(false);
  const { currentProject, recentProjects, saveProject, exportProject } = useKonformProject();
  
  useEffect(() => {
    if (currentProject?.name) {
      setProjectName(currentProject.name);
    }
  }, [currentProject]);
  
  const handleSave = async () => {
    try {
      if (currentProject) {
        await saveProject.mutateAsync({ name: projectName });
        toast({
          title: "Project Saved",
          description: `Project "${projectName}" has been saved successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the project.",
        variant: "destructive"
      });
    }
    setIsEditing(false);
  };
  
  const handleExport = async () => {
    try {
      await exportProject();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export the project.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="bg-black/60 border-b border-konform-neon-blue/20 p-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-black/20 border border-konform-neon-blue/20 rounded px-2 py-1 text-white max-w-[200px]"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-white/80 hover:text-white h-7 w-7 p-0"
              >
                <SaveIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium">{projectName}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-white/50 hover:text-white h-7 w-7 p-0"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          
          <Separator orientation="vertical" className="h-6 bg-konform-neon-blue/20" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-white/80 hover:text-white h-8 px-3"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white h-8 px-3">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-konform-neon-blue/30">
                <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Export Project
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Save as Template
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <FolderHeart className="h-4 w-4 mr-2" />
                  Pin to Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Recent Projects History */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white h-8 px-3">
                <History className="h-4 w-4 mr-2" />
                Recent
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-konform-neon-blue/30 w-72">
              <h4 className="px-2 py-1.5 text-xs text-gray-400 font-medium">Recent Projects</h4>
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.slice(0, 5).map((project) => (
                  <DropdownMenuItem key={project.id} className="cursor-pointer">
                    <div className="flex items-center gap-2 w-full">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <div className="flex-1 truncate">
                        <span className="text-sm">{project.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(project.last_opened_at).toLocaleDateString()}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-3 text-sm text-gray-500 text-center">No recent projects</div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center justify-center w-full">
                  <span className="text-sm text-white/80">View All Projects</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Avatar className="h-8 w-8 border border-konform-neon-blue/30">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-black/50 text-konform-neon-blue text-xs">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

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

  const handleAddChannel = (type: 'bus' | 'audio') => {
    const newChannel: Channel = {
      id: `${type}-${Date.now()}`,
      number: channels.filter(c => c.type === type).length + 1,
      name: `${type === 'bus' ? 'Bus' : 'Track'} ${channels.filter(c => c.type === type).length + 1}`,
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type,
      instrument: type === 'audio' ? {
        name: 'VST Instrument',
        type: 'synth'
      } : undefined
    };
    setChannels(prev => [...prev, newChannel]);
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

  const handleAssignPersona = (channelId: string, persona: any) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { 
          ...channel, 
          persona: persona.id ? {
            id: persona.id,
            name: persona.name,
            type: persona.type,
            avatarUrl: persona.avatar_url
          } : undefined 
        } : channel
      )
    );
  };

  const masterChannels = channels.filter(c => c.type === 'master');
  const busChannels = channels.filter(c => c.type === 'bus');
  const audioChannels = channels.filter(c => c.type === 'audio');

  const totalChannels = channels.length;
  const showScroll = totalChannels > 8;

  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [consoleMode, setConsoleMode] = useState<ConsoleModeType>("small");
  const [consoleView, setConsoleView] = useState<ConsoleViewType>("narrow");
  const [showNavPanel, setShowNavPanel] = useState(true);
  const [activeNavPanel, setActiveNavPanel] = useState<string>("channels");
  const [isDetached, setIsDetached] = useState(false);
  const [channelWidth, setChannelWidth] = useState(90);
  const [meteringMode, setMeteringMode] = useState<MeteringModeType>("peak");
  const [preFaderMetering, setPreFaderMetering] = useState(false);
  const [showMetronome, setShowMetronome] = useState(false);
  const [metronomeVolume, setMetronomeVolume] = useState(75);
  const [soloChannels, setSoloChannels] = useState<string[]>([]);
  const [globalSoloOn, setGlobalSoloOn] = useState(false);
  const [copiedChannelSettings, setCopiedChannelSettings] = useState<Partial<Channel> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver(containerRef);

  return (
    <div className="h-full bg-black/80 rounded-lg p-1 flex flex-col max-w-[1440px] mx-auto" ref={containerRef}>
      {/* Project Header */}
      <ProjectHeader />
      
      {/* Top Toolbar and Add Channel Controls */}
      <div className="flex justify-between items-center bg-black/40 rounded-t-lg p-2 border-b border-konform-neon-blue/20">
        <div className="flex gap-4">
          <Button
            onClick={() => handleAddChannel('bus')}
            className="bg-konform-neon-blue hover:bg-konform-neon-blue/80"
          >
            Add Bus
          </Button>
          <Button
            onClick={() => handleAddChannel('audio')}
            className="bg-konform-neon-orange hover:bg-konform-neon-orange/80"
          >
            Add Track
          </Button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ScrollArea 
          className={`h-full w-full ${showScroll ? 'overflow-x-auto' : 'overflow-x-hidden'}`} 
          type="always" 
        >
          <div className="flex gap-4 p-2" style={{ width: showScroll ? 'max-content' : '100%' }}>
            <div className="flex gap-4 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10 relative overflow-y-auto max-h-[70vh]">
              <div className="text-sm font-medium text-white/60 absolute -top-6 left-2">Master</div>
              {masterChannels.map(channel => (
                <ChannelStrip
                  key={channel.id}
                  channel={channel}
                  onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                  onPanChange={(value) => handlePanChange(channel.id, value)}
                  onMute={() => handleMute(channel.id)}
                  onSolo={() => handleSolo(channel.id)}
                  onDuplicate={() => handleDuplicateChannel(channel.id)}
                  onDelete={() => handleDeleteChannel(channel.id)}
                  onRename={(newName) => handleRenameChannel(channel.id, newName)}
                  onColorChange={(color) => handleColorChange(channel.id, color)}
                  onAssignPersona={(persona) => handleAssignPersona(channel.id, persona)}
                />
              ))}
            </div>

            <div className="flex gap-4 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10 relative overflow-y-auto max-h-[70vh]">
              <div className="text-sm font-medium text-white/60 absolute -top-6 left-2">Bus Tracks</div>
              {busChannels.map(channel => (
                <ChannelStrip
                  key={channel.id}
                  channel={channel}
                  onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                  onPanChange={(value) => handlePanChange(channel.id, value)}
                  onMute={() => handleMute(channel.id)}
                  onSolo={() => handleSolo(channel.id)}
                  onDuplicate={() => handleDuplicateChannel(channel.id)}
                  onDelete={() => handleDeleteChannel(channel.id)}
                  onRename={(newName) => handleRenameChannel(channel.id, newName)}
                  onColorChange={(color) => handleColorChange(channel.id, color)}
                  onAssignPersona={(persona) => handleAssignPersona(channel.id, persona)}
                />
              ))}
            </div>

            <div className="flex gap-4 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10 relative overflow-y-auto max-h-[70vh]">
              <div className="text-sm font-medium text-white/60 absolute -top-6 left-2">Audio Tracks</div>
              {audioChannels.map(channel => (
                <ChannelStrip
                  key={channel.id}
                  channel={channel}
                  onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                  onPanChange={(value) => handlePanChange(channel.id, value)}
                  onMute={() => handleMute(channel.id)}
                  onSolo={() => handleSolo(channel.id)}
                  onDuplicate={() => handleDuplicateChannel(channel.id)}
                  onDelete={() => handleDeleteChannel(channel.id)}
                  onRename={(newName) => handleRenameChannel(channel.id, newName)}
                  onColorChange={(color) => handleColorChange(channel.id, color)}
                  onAssignPersona={(persona) => handleAssignPersona(channel.id, persona)}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};