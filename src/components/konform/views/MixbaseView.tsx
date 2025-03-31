import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, SortableChannel } from "../mixer/MixerView";

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
    },
    {
      id: 'bus-1',
      number: 1,
      name: 'Bus 1',
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'bus'
    },
    {
      id: 'default-audio',
      number: 1,
      name: 'Track 1',
      volume: 75,
      pan: 0,
      isMuted: false,
      isSolo: false,
      type: 'audio'
    }
  ]);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleSelect = (id: string, multiSelect: boolean) => {
    setSelectedChannels(prev => {
      const newSelection = new Set(multiSelect ? prev : []);
      if (prev.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    setChannels(prev => {
      const oldIndex = prev.findIndex(channel => channel.id === active.id);
      const newIndex = prev.findIndex(channel => channel.id === over.id);

      if (prev[oldIndex].type !== 'audio') return prev;
      const masterBusCount = prev.filter(c => c.type === 'master' || c.type === 'bus').length;
      if (newIndex < masterBusCount) return prev;

      const newChannels = [...prev];
      const [removed] = newChannels.splice(oldIndex, 1);
      newChannels.splice(newIndex, 0, removed);

      return newChannels;
    });
  };

  const handleDeleteChannel = (channelId: string) => {
    if (channels.find(c => c.id === channelId)?.type === 'master' || channels.find(c => c.id === channelId)?.type === 'bus') return;
    
    setChannels(prev => prev.filter(c => c.id !== channelId));
    setSelectedChannels(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(channelId);
      return newSelection;
    });
  };

  const handleDuplicateChannel = (channelId: string) => {
    const channelToDuplicate = channels.find(c => c.id === channelId);
    if (!channelToDuplicate || channelToDuplicate.type === 'master' || channelToDuplicate.type === 'bus') return;
    
    const newChannel = {
      ...channelToDuplicate,
      id: `channel-${Date.now()}`,
      name: `${channelToDuplicate.name} (Copy)`,
    };

    setChannels(prev => [...prev, newChannel]);
  };

  const masterChannels = channels.filter(c => c.type === 'master');
  const busChannels = channels.filter(c => c.type === 'bus');
  const audioChannels = channels.filter(c => c.type === 'audio');

  return (
    <div className="h-full bg-black/40 rounded-lg p-4 flex flex-col">
      <div className="mt-auto border-t border-konform-neon-blue/10 pt-4">
        <ScrollArea className="w-full" type="scroll" scrollHideDelay={0}>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 p-2 relative min-w-max">
              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10">
                <SortableContext 
                  items={masterChannels.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {masterChannels.map((channel) => (
                    <SortableChannel
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannels.has(channel.id)}
                      onSelect={handleSelect}
                      onDelete={() => handleDeleteChannel(channel.id)}
                      onDuplicate={() => handleDuplicateChannel(channel.id)}
                      viewMode="compact"
                    />
                  ))}
                </SortableContext>
              </div>

              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10">
                <SortableContext 
                  items={busChannels.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {busChannels.map((channel) => (
                    <SortableChannel
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannels.has(channel.id)}
                      onSelect={handleSelect}
                      onDelete={() => handleDeleteChannel(channel.id)}
                      onDuplicate={() => handleDuplicateChannel(channel.id)}
                      viewMode="compact"
                    />
                  ))}
                </SortableContext>
              </div>

              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10">
                <SortableContext 
                  items={audioChannels.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {audioChannels.map((channel) => (
                    <SortableChannel
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannels.has(channel.id)}
                      onSelect={handleSelect}
                      onDelete={() => handleDeleteChannel(channel.id)}
                      onDuplicate={() => handleDuplicateChannel(channel.id)}
                      viewMode="compact"
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </ScrollArea>
      </div>
    </div>
  );
};