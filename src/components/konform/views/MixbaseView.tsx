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
      type
    };
    setChannels(prev => [...prev, newChannel]);
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

      <ScrollArea className="w-full h-[calc(100%-4rem)]" type="scroll" scrollHideDelay={0}>
        <div className="flex gap-8 p-2">
          <div className="flex-shrink-0 flex gap-4">
            {masterChannels.map(channel => (
              <ChannelStrip
                key={channel.id}
                channel={channel}
                onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                onPanChange={(value) => handlePanChange(channel.id, value)}
                onMute={() => handleMute(channel.id)}
                onSolo={() => handleSolo(channel.id)}
              />
            ))}
          </div>

          <div className="flex-shrink-0 flex gap-4">
            {busChannels.map(channel => (
              <ChannelStrip
                key={channel.id}
                channel={channel}
                onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                onPanChange={(value) => handlePanChange(channel.id, value)}
                onMute={() => handleMute(channel.id)}
                onSolo={() => handleSolo(channel.id)}
              />
            ))}
          </div>

          <div className="flex-shrink-0 flex gap-4">
            {audioChannels.map(channel => (
              <ChannelStrip
                key={channel.id}
                channel={channel}
                onVolumeChange={(value) => handleVolumeChange(channel.id, value)}
                onPanChange={(value) => handlePanChange(channel.id, value)}
                onMute={() => handleMute(channel.id)}
                onSolo={() => handleSolo(channel.id)}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};