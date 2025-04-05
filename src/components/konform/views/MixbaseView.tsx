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
  Settings2,
  FolderPlus,
  LayersIcon,
  Camera,
  SlidersHorizontal,
  Mic2,
  Wand2
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
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useKonformProject } from "@/hooks/useKonformProject";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChannelGroup } from "../mixer/ChannelGroup";
import type { Channel } from "@/types/konform";
import { MixerSnapshots } from "../mixer/MixerSnapshots";

export type ConsoleModeType = 'large' | 'small';
export type ConsoleViewType = 'normal' | 'narrow';
export type MeteringModeType = 'peak' | 'rms' | 'peakRMS' | 'lufs' | 'k12' | 'k14' | 'k20';

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
              <DropdownMenuContent 
                className="border-konform-neon-blue/30"
                style={{ 
                  backgroundColor: "#0F0F13", 
                  backdropFilter: "none",
                  WebkitBackdropFilter: "none",
                  opacity: "1"
                }}
              >
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
            <DropdownMenuContent 
              align="end" 
              className="border-konform-neon-blue/30 w-72"
              style={{ 
                backgroundColor: "#0F0F13", 
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                opacity: "1"
              }}
            >
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
  const { toast } = useToast();
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

  const handleAddChannel = (type: 'master' | 'bus' | 'audio' | 'instrument' | 'fx') => {
    // Default colors for different channel types
    const colors = {
      'master': '#FF5F1F',
      'bus': '#3B82F6',
      'audio': '#10B981',
      'instrument': '#EC4899',
      'fx': '#8B5CF6',
    };
    
    const newChannel: Channel = {
      id: `${type}-${Date.now()}`,
      number: channels.filter(c => c.type === type).length + 1,
      name: getDefaultNameForChannelType(type),
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type,
      color: colors[type],
      // For FX tracks, add default sends
      sends: type === 'fx' ? [] : undefined,
      // For instrument tracks, add default instrument
      instrument: type === 'instrument' ? {
        name: 'Instrument',
        type: 'synth'
      } : undefined,
      // For master tracks, set as main out
      outputs: type === 'master' ? ['Main'] : (type === 'fx' ? ['Main Out'] : undefined),
      automationMode: 'off'
    };
    
    setChannels(prev => [...prev, newChannel]);
  };

  // Helper function to generate default names based on channel type
  const getDefaultNameForChannelType = (type: string): string => {
    const count = channels.filter(c => c.type === type).length + 1;
    switch(type) {
      case 'master':
        return `Master ${count}`;
      case 'bus':
        return `Bus ${count}`;
      case 'audio':
        return `Audio ${count}`;
      case 'instrument':
        return `Instrument ${count}`;
      case 'fx':
        return `FX ${count}`;
      default:
        return `Track ${count}`;
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
  const { updateMixerState } = useKonformProject();

  // Save channel state when it changes
  useEffect(() => {
    updateMixerState(channels);
  }, [channels, updateMixerState]);

  // Load mixer state when component mounts
  useEffect(() => {
    const savedMixerState = localStorage.getItem('konform-mixer-state');
    if (savedMixerState) {
      try {
        const parsed = JSON.parse(savedMixerState);
        if (parsed.channels && Array.isArray(parsed.channels) && parsed.channels.length > 0) {
          setChannels(parsed.channels);
          toast({
            title: "Mixer State Loaded",
            description: "Previous mixer session restored"
          });
        }
      } catch (error) {
        console.error('Error loading mixer state:', error);
      }
    }
  }, []);

  const [channelGroups, setChannelGroups] = useState<Array<{
    id: string;
    name: string;
    color: string;
    channelIds: string[];
    isExpanded: boolean;
  }>>([]);

  const handleCreateGroup = () => {
    if (selectedChannels.length < 2) {
      toast({
        title: "Unable to create group",
        description: "Please select at least 2 channels to create a group.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedChannelObjects = channels.filter(c => selectedChannels.includes(c.id));
    const groupName = prompt("Enter a name for this channel group:", 
      `Group ${channelGroups.length + 1}`);
    
    if (!groupName) return;
    
    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      color: "#3B82F6",
      channelIds: [...selectedChannels],
      isExpanded: true
    };
    
    setChannelGroups(prev => [...prev, newGroup]);
    
    setChannels(prev => prev.map(channel => 
      selectedChannels.includes(channel.id) 
        ? { ...channel, isGrouped: true, groupId: newGroup.id }
        : channel
    ));
    
    setSelectedChannels([]);
  };

  const handleGroupVolumeChange = (groupId: string, value: number) => {
    const group = channelGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const relativeChange = value / 100;
    
    setChannels(prev => prev.map(channel => {
      if (group.channelIds.includes(channel.id)) {
        return { ...channel, volume: channel.volume * relativeChange };
      }
      return channel;
    }));
  };

  const handleGroupMute = (groupId: string) => {
    const group = channelGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const hasUnmuted = channels.some(channel => 
      group.channelIds.includes(channel.id) && !channel.isMuted
    );
    
    setChannels(prev => prev.map(channel => {
      if (group.channelIds.includes(channel.id)) {
        return { ...channel, isMuted: hasUnmuted };
      }
      return channel;
    }));
  };

  const handleGroupSolo = (groupId: string) => {
    const group = channelGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const hasUnsoloed = channels.some(channel => 
      group.channelIds.includes(channel.id) && !channel.isSolo
    );
    
    setChannels(prev => prev.map(channel => {
      if (group.channelIds.includes(channel.id)) {
        return { ...channel, isSolo: hasUnsoloed };
      }
      return channel;
    }));
  };

  const handleRenameGroup = (groupId: string, newName: string) => {
    setChannelGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, name: newName } : group
    ));
  };

  const handleToggleGroupExpand = (groupId: string) => {
    setChannelGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    ));
  };

  const handleGroupColorChange = (groupId: string, color: string) => {
    setChannelGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, color } : group
    ));
  };

  const handleMeterModeChange = (channelId: string, mode: MeteringModeType) => {
    if (!channelId) {
      setMeteringMode(mode);
      return;
    }

    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, meterMode: mode } : channel
      )
    );
  };

  const handleTogglePreFaderMetering = (channelId?: string) => {
    if (!channelId) {
      setPreFaderMetering(!preFaderMetering);
      return;
    }

    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId ? { ...channel, isPrefaderMetering: !channel.isPrefaderMetering } : channel
      )
    );
  };

  const handleRecallSnapshot = (channelStates: Partial<Channel>[]) => {
    setChannels(prev => {
      return prev.map(channel => {
        const snapshotState = channelStates.find(state => state.id === channel.id);
        if (snapshotState) {
          return { ...channel, ...snapshotState };
        }
        return channel;
      });
    });

    toast({
      title: "Snapshot Recalled",
      description: "Mixer settings have been restored from snapshot."
    });
  };

  // Handle send updates
  const handleUpdateSend = (channelId: string, sendIndex: number, updatedSend: any) => {
    setChannels(prev => prev.map(channel => {
      if (channel.id === channelId && channel.sends) {
        const newSends = [...channel.sends];
        newSends[sendIndex] = updatedSend;
        return { ...channel, sends: newSends };
      }
      return channel;
    }));
  };

  // Handle removing a send
  const handleRemoveSend = (channelId: string, sendIndex: number) => {
    setChannels(prev => prev.map(channel => {
      if (channel.id === channelId && channel.sends) {
        const newSends = [...channel.sends];
        newSends.splice(sendIndex, 1);
        return { ...channel, sends: newSends };
      }
      return channel;
    }));
  };

  // Handle adding a new send
  const handleAddSend = (channelId: string, newSend: any) => {
    setChannels(prev => prev.map(channel => {
      if (channel.id === channelId) {
        const currentSends = channel.sends || [];
        // Check if send to same target already exists
        if (currentSends.some(send => send.targetId === newSend.targetId)) {
          toast({
            title: "Send already exists",
            description: `Channel already has a send to ${newSend.target}`,
            variant: "destructive"
          });
          return channel;
        }
        return { ...channel, sends: [...currentSends, newSend] };
      }
      return channel;
    }));
  };

  // Get FX and bus channels for routing
  const fxChannels = channels.filter(c => c.type === 'fx');
  const masterAndBusChannels = channels.filter(c => c.type === 'master' || c.type === 'bus');

  // Add state for showing/hiding snapshots
  const [showSnapshots, setShowSnapshots] = useState(false);
  
  // Event listener for add channel from header
  useEffect(() => {
    const handleAddChannelEvent = (e: CustomEvent) => {
      handleAddChannel(e.detail as any);
    };
    
    window.addEventListener('add-channel', handleAddChannelEvent as EventListener);
    
    return () => {
      window.removeEventListener('add-channel', handleAddChannelEvent as EventListener);
    };
  }, []);
  
  // Event listener for snapshot recall from sidebar
  useEffect(() => {
    const handleRecallSnapshotEvent = (e: CustomEvent) => {
      if (e.detail?.channelStates) {
        handleRecallSnapshot(e.detail.channelStates);
      }
    };
    
    window.addEventListener('recall-snapshot', handleRecallSnapshotEvent as EventListener);
    
    return () => {
      window.removeEventListener('recall-snapshot', handleRecallSnapshotEvent as EventListener);
    };
  }, [channels]);

  return (
    <div className="h-full bg-black/80 rounded-lg p-1 flex flex-col max-w-[1440px] mx-auto" ref={containerRef}>
      {/* Project Header */}
      <ProjectHeader />
      
      {/* Top Toolbar and Add Channel Controls */}
      <div className="flex justify-between items-center bg-black/40 rounded-t-lg p-2 border-b border-konform-neon-blue/20">
        <div className="flex gap-2">
          <Button
            onClick={handleCreateGroup}
            disabled={selectedChannels.length < 2}
            className="bg-konform-neon-blue/20 hover:bg-konform-neon-blue/40"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Group Selected
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-konform-neon-orange hover:bg-konform-neon-orange/80">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Track
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="border-konform-neon-blue/20"
              style={{ 
                backgroundColor: "#0F0F13", 
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                opacity: "1"
              }}
            >
              <DropdownMenuItem onClick={() => handleAddChannel('master')}>
                <Music2 className="h-4 w-4 mr-2" />
                Master Track
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddChannel('bus')}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Bus Track
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddChannel('audio')}>
                <Mic2 className="h-4 w-4 mr-2" />
                Audio Track
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddChannel('instrument')}>
                <Piano className="h-4 w-4 mr-2" />
                Instrument Track
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddChannel('fx')}>
                <Wand2 className="h-4 w-4 mr-2" />
                FX Track
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-black/40 border-konform-neon-blue/30 h-8"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                View Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="border-konform-neon-blue/30"
              style={{ 
                backgroundColor: "#0F0F13", 
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                opacity: "1"
              }}
            >
              <DropdownMenuLabel>Metering</DropdownMenuLabel>
              <DropdownMenuRadioGroup 
                value={meteringMode} 
                onValueChange={(value) => handleMeterModeChange('', value as MeteringModeType)}
              >
                <DropdownMenuRadioItem value="peak">Peak</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rms">RMS</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="peakRMS">Peak + RMS</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="lufs">LUFS</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="k12">K-12</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="k14">K-14</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="k20">K-20</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={preFaderMetering}
                onCheckedChange={() => handleTogglePreFaderMetering()}
              >
                Pre-Fader Metering
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ScrollArea 
          className={`h-full w-full ${showScroll ? 'overflow-x-auto' : 'overflow-x-hidden'}`} 
          type="always" 
        >
          <div className="p-4" style={{ width: showScroll ? 'max-content' : '100%' }}>
            {/* Channel Groups */}
            {channelGroups.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-medium text-white/60 mb-2">Channel Groups</div>
                <div className="space-y-3">
                  {channelGroups.map(group => (
                    <ChannelGroup
                      key={group.id}
                      id={group.id}
                      name={group.name}
                      color={group.color}
                      channels={channels.filter(c => group.channelIds.includes(c.id))}
                      isExpanded={group.isExpanded}
                      onVolumeChange={(value) => handleGroupVolumeChange(group.id, value)}
                      onMute={() => handleGroupMute(group.id)}
                      onSolo={() => handleGroupSolo(group.id)}
                      onRename={(name) => handleRenameGroup(group.id, name)}
                      onToggleExpand={() => handleToggleGroupExpand(group.id)}
                      onColorChange={(color) => handleGroupColorChange(group.id, color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Channels in a single horizontal row */}
            <div className="text-sm font-medium text-white/60 mb-1">Mixer Channels</div>
            <div className="flex overflow-x-auto pb-2 h-[calc(100vh-240px)]">
              {/* Order channels by type: Master first, then buses, FX, instruments, audio */}
              {[
                ...masterChannels,
                ...busChannels,
                ...channels.filter(c => c.type === 'fx'),
                ...channels.filter(c => c.type === 'instrument'),
                ...audioChannels
              ].map(channel => (
                <div key={channel.id} className="mr-2 relative h-full">
                  {/* Optional type indicator badge */}
                  <div className="absolute top-0 left-0 z-10 px-1.5 py-0.5 text-[10px] rounded-br font-medium" 
                    style={{ 
                      backgroundColor: channel.type === 'master' ? 'rgba(255, 98, 0, 0.9)' : 
                                       channel.type === 'bus' ? 'rgba(0, 209, 255, 0.9)' :
                                       channel.type === 'fx' ? 'rgba(255, 0, 255, 0.9)' :
                                       channel.type === 'instrument' ? 'rgba(255, 255, 0, 0.9)' :
                                       'rgba(0, 255, 0, 0.9)',
                      color: channel.type === 'instrument' ? '#000' : '#fff'
                    }}
                  >
                    {channel.type.toUpperCase()}
                  </div>
                  <ChannelStrip
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
                    meteringMode={channel.meterMode || meteringMode}
                    preFaderMetering={channel.isPrefaderMetering ?? preFaderMetering}
                    onMeterModeChange={(mode) => handleMeterModeChange(channel.id, mode)}
                    onTogglePreFaderMetering={() => handleTogglePreFaderMetering(channel.id)}
                    sends={channel.sends || []}
                    onUpdateSend={(index, updates) => handleUpdateSend(channel.id, index, updates)}
                    onRemoveSend={(index) => handleRemoveSend(channel.id, index)}
                    onAddSend={(send) => handleAddSend(channel.id, send)}
                    fxChannels={fxChannels}
                    busChannels={masterAndBusChannels}
                    availableSendTargets={[
                      ...fxChannels.map(c => ({ id: c.id, name: c.name, type: 'fx' as const })),
                      ...masterAndBusChannels.map(c => ({ id: c.id, name: c.name, type: c.type === 'master' ? 'master' as const : 'bus' as const }))
                    ]}
                    consoleMode="large"
                    style={{ height: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};