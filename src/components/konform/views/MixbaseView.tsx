import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelStrip } from "./ChannelStrip";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CornerUpLeft, CornerUpRight, Maximize2, Minimize2 } from "lucide-react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cn } from "@/lib/utils";

export type Channel = {
  id: string;
  number: number;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  type: 'master' | 'bus' | 'audio';
  color?: string;
  persona?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  instrument?: {
    name: string;
    type: string;
  };
};

type SectionState = {
  collapsed: boolean;
  height: number;
  width: number;
};

export const MixbaseView = () => {
  const [channels, setChannels] = useState<Channel[]>(() => [
    {
      id: 'master',
      number: 0,
      name: 'Master',
      volume: 80,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'master',
      color: '#FF5F1F'
    },
    {
      id: 'bus-1',
      number: 1,
      name: 'Bus 1',
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'bus',
      color: '#3B82F6'
    },
    {
      id: 'audio-1',
      number: 1,
      name: 'Track 1',
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'audio',
      color: '#FF5F1F',
      instrument: {
        name: 'VST Instrument',
        type: 'synth'
      }
    }
  ]);

  const [sectionStates, setSectionStates] = useState({
    master: { collapsed: false, height: 500, width: 200 } as SectionState,
    bus: { collapsed: false, height: 500, width: 500 } as SectionState,
    audio: { collapsed: false, height: 500, width: 500 } as SectionState,
  });

  const [channelWidth, setChannelWidth] = useState(120);
  const [isCompactView, setIsCompactView] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { width: containerWidth } = useResizeObserver(containerRef);

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
      color: type === 'bus' ? '#3B82F6' : '#FF5F1F',
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

  const toggleSectionCollapse = (section: 'master' | 'bus' | 'audio') => {
    setSectionStates(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        collapsed: !prev[section].collapsed
      }
    }));
  };
  
  const handleResize = (section: 'master' | 'bus' | 'audio', newWidth: number) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        width: Math.max(200, newWidth)
      }
    }));
  };
  
  const handleChannelWidthChange = (delta: number) => {
    setChannelWidth(prev => Math.max(80, Math.min(200, prev + delta)));
  };

  const toggleViewMode = () => {
    setIsCompactView(prev => !prev);
    setChannelWidth(isCompactView ? 120 : 80);
  };

  const masterChannels = channels.filter(c => c.type === 'master');
  const busChannels = channels.filter(c => c.type === 'bus');
  const audioChannels = channels.filter(c => c.type === 'audio');

  const totalChannels = channels.length;
  const showScroll = totalChannels > 8;

  return (
    <div className="h-full bg-black/40 rounded-lg p-4 flex flex-col max-w-[1440px] mx-auto" ref={containerRef}>
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          className="bg-black/20 border-konform-neon-blue/30 hover:bg-black/30"
        >
          {isCompactView ? <Maximize2 className="w-4 h-4 mr-1" /> : <Minimize2 className="w-4 h-4 mr-1" />}
          {isCompactView ? "Expand View" : "Compact View"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleChannelWidthChange(-10)}
          className="bg-black/20 border-konform-neon-blue/30 hover:bg-black/30"
          disabled={channelWidth <= 80}
        >
          <CornerUpLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleChannelWidthChange(10)}
          className="bg-black/20 border-konform-neon-blue/30 hover:bg-black/30"
          disabled={channelWidth >= 200}
        >
          <CornerUpRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <ScrollArea 
          className="h-full w-full overflow-x-auto overflow-y-auto"
          type="always"
        >
          <div className="flex flex-col gap-8 p-2">
            {/* Master Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center px-2 cursor-pointer" onClick={() => toggleSectionCollapse('master')}>
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6 mr-1">
                  {sectionStates.master.collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <h3 className="text-sm font-medium text-white/60">Master</h3>
                <div className="flex-1 h-px bg-konform-neon-orange/20 ml-4"></div>
              </div>
              
              {!sectionStates.master.collapsed && (
                <div 
                  className="flex gap-4 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10 relative overflow-y-auto"
                  style={{ maxHeight: isCompactView ? '50vh' : '70vh' }}
                >
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
                      style={{ width: `${channelWidth}px` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bus Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center px-2 cursor-pointer" onClick={() => toggleSectionCollapse('bus')}>
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6 mr-1">
                  {sectionStates.bus.collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <h3 className="text-sm font-medium text-white/60">Bus Tracks</h3>
                <div className="flex-1 h-px bg-konform-neon-blue/20 ml-4"></div>
              </div>
              
              {!sectionStates.bus.collapsed && (
                <div 
                  className="flex gap-4 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10 relative overflow-y-auto"
                  style={{ maxHeight: isCompactView ? '50vh' : '70vh' }}
                >
                  {busChannels.length === 0 ? (
                    <div className="w-full text-center text-sm text-white/40 py-4">
                      No bus tracks - Add one below
                    </div>
                  ) : (
                    busChannels.map(channel => (
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
                        style={{ width: `${channelWidth}px` }}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Audio Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center px-2 cursor-pointer" onClick={() => toggleSectionCollapse('audio')}>
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6 mr-1">
                  {sectionStates.audio.collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <h3 className="text-sm font-medium text-white/60">Audio Tracks</h3>
                <div className="flex-1 h-px bg-konform-neon-orange/20 ml-4"></div>
              </div>
              
              {!sectionStates.audio.collapsed && (
                <div 
                  className="flex gap-4 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10 relative overflow-y-auto"
                  style={{ maxHeight: isCompactView ? '50vh' : '70vh' }}
                >
                  {audioChannels.length === 0 ? (
                    <div className="w-full text-center text-sm text-white/40 py-4">
                      No audio tracks - Add one below
                    </div>
                  ) : (
                    audioChannels.map(channel => (
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
                        style={{ width: `${channelWidth}px` }}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="h-12 mt-4 bg-gradient-to-r from-konform-neon-blue/20 to-konform-neon-orange/20 rounded-lg border border-konform-neon-blue/10 flex items-center justify-end px-4 gap-4">
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
  );
};