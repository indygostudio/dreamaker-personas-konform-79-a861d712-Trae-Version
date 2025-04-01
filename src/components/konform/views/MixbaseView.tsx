import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelStrip } from "./ChannelStrip";
import { Button } from "@/components/ui/button";

export type Channel = {
  id: string;
  number: number;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  type: 'master' | 'bus' | 'audio';
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
      type: 'master'
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

  const masterChannels = channels.filter(c => c.type === 'master');
  const busChannels = channels.filter(c => c.type === 'bus');
  const audioChannels = channels.filter(c => c.type === 'audio');

  return (
    <div className="h-full bg-black/40 rounded-lg p-4">
      <div className="flex gap-4 mb-4">
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

      <div className="w-full h-[calc(100%-4rem)]">
        <ScrollArea className="h-full w-full overflow-x-auto" type="always" orientation="horizontal">
          <div className="flex gap-4 p-2 min-w-max">
            <div className="flex gap-4 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10 relative">
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
                />
              ))}
            </div>

            <div className="flex gap-4 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10 relative">
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
                />
              ))}
            </div>

            <div className="flex gap-4 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10 relative">
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
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};