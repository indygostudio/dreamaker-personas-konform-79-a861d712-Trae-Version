
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Persona } from "@/types/persona";
import { useViewModeStore } from '@/stores/viewModeStore';
import { MasterVolume } from "./MasterVolume";

export interface Channel {
  id: string;
  number: number;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  collaborator?: Persona;
  type: 'audio' | 'bus' | 'master';
}

interface SortableChannelProps {
  channel: Channel;
  isSelected: boolean;
  onSelect: (id: string, multiSelect: boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  viewMode?: 'large' | 'normal' | 'compact';
}

export const SortableChannel = ({ channel, isSelected, onSelect, onDelete, onDuplicate, viewMode }: SortableChannelProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: channel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`flex-shrink-0 ${viewMode === 'large' ? 'w-96' : viewMode === 'normal' ? 'w-64' : 'w-48'}`}>
        <div className="bg-black/80 rounded-lg border border-konform-neon-blue/30 overflow-hidden">
          {/* Channel Header */}
          <div className="p-2 border-b border-konform-neon-blue/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-konform-neon-blue text-xs">CH {channel.number}</span>
              <span className="text-white text-xs">{channel.name}</span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white"
                onClick={onDuplicate}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white"
                onClick={onDelete}
                disabled={channel.type === 'master' || channel.type === 'bus'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </Button>
            </div>
          </div>
          
          {/* Plugin Section */}
          <div className="p-2 border-b border-konform-neon-blue/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-konform-neon-blue">Plugin</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-konform-neon-blue hover:text-konform-neon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs h-8 border-konform-neon-blue/30 text-white bg-black/60 hover:bg-black/80 hover:text-konform-neon-blue">
              Add Plugin
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
          
          {/* Output Section */}
          <div className="p-2 border-b border-konform-neon-blue/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-konform-neon-blue">Output</span>
              <span className="text-xs text-konform-neon-orange">Φ</span>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs h-8 border-konform-neon-blue/30 text-white bg-black/60 hover:bg-black/80 hover:text-konform-neon-blue">
              Select...
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
          
          {/* Volume Slider */}
          <div className="p-2 flex flex-col items-center">
            <div className="w-full flex justify-between text-xs text-gray-400 mb-1">
              <span>+12</span>
            </div>
            <div className="h-48 w-full flex justify-center mb-2">
              <Slider
                orientation="vertical"
                value={[channel.volume]}
                onValueChange={([value]) => {
                  setChannels(prev => prev.map(c => 
                    c.id === channel.id ? { ...c, volume: value } : c
                  ));
                }}
                max={100}
                step={1}
                className="h-full"
              />
            </div>
            <div className="w-full flex justify-between text-xs text-gray-400 mb-1">
              <span>-48</span>
            </div>
            <div className="flex w-full justify-center space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className={`text-xs h-6 w-6 border-konform-neon-blue/30 ${channel.isMuted ? 'bg-konform-neon-blue text-black' : 'bg-black/60'} hover:bg-konform-neon-blue hover:text-black`}
                onClick={() => {
                  setChannels(prev => prev.map(c => 
                    c.id === channel.id ? { ...c, isMuted: !c.isMuted } : c
                  ));
                }}
              >
                M
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs h-6 w-6 border-konform-neon-blue/30 ${channel.isSolo ? 'bg-konform-neon-orange text-black' : 'bg-black/60'} hover:bg-konform-neon-orange hover:text-black`}
                onClick={() => {
                  setChannels(prev => prev.map(c => 
                    c.id === channel.id ? { ...c, isSolo: !c.isSolo } : c
                  ));
                }}
              >
                S
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MixerView = () => {
  const { mixerViewMode, setMixerViewMode } = useViewModeStore();
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
      id: 'bus-2',
      number: 2,
      name: 'Bus 2',
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

  const handleAddChannel = () => {
    setChannels(prev => [
      ...prev,
      {
        id: `channel-${Date.now()}`,
        number: prev.filter(c => c.type === 'audio').length + 1,
        type: 'audio'
      }
    ]);
  };

  const handleDuplicateChannel = (index: number) => {
    const channelToDuplicate = channels[index];
    if (channelToDuplicate.type === 'master' || channelToDuplicate.type === 'bus') return;
    
    setChannels(prev => [
      ...prev.slice(0, index + 1),
      {
        id: `channel-${Date.now()}`,
        number: prev.filter(c => c.type === 'audio').length + 1,
        type: 'audio',
        collaborator: channelToDuplicate.collaborator
      },
      ...prev.slice(index + 1)
    ]);
  };

  const handleDeleteChannel = (index: number) => {
    const channelId = channels[index].id;
    if (channels[index].type === 'master' || channels[index].type === 'bus') return;
    
    setChannels(prev => prev.filter((_, i) => i !== index));
    setSelectedChannels(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(channelId);
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

      // Don't allow dragging master or bus channels
      if (prev[oldIndex].type !== 'audio') return prev;

      // Don't allow moving audio channels before master/bus channels
      const masterBusCount = prev.filter(c => c.type === 'master' || c.type === 'bus').length;
      if (newIndex < masterBusCount) return prev;

      const newChannels = [...prev];
      const [removed] = newChannels.splice(oldIndex, 1);
      newChannels.splice(newIndex, 0, removed);

      return newChannels;
    });
  };

  // Separate channels by type
  const masterChannels = channels.filter(c => c.type === 'master');
  const busChannels = channels.filter(c => c.type === 'bus');
  const audioChannels = channels.filter(c => c.type === 'audio');

  return (
    <div className="h-[calc(100vh-200px)] bg-black/40 rounded-lg p-4 flex flex-col">
      <div className="mt-auto border-t border-konform-neon-blue/10 pt-4">
        <ScrollArea className="w-full" type="scroll" scrollHideDelay={0}>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 p-2 relative min-w-max">
              {/* View Mode Buttons - Moved to left side */}
              <div className="flex items-center justify-between mb-4">
                {/* Removing the view mode buttons from here as they've been moved to the left side */}
                <div className="flex items-center gap-2">
                  {/* Empty div to maintain layout structure */}
                </div>
              </div>
              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-orange/5 to-transparent p-4 rounded-lg border border-konform-neon-orange/10">
                <SortableContext 
                  items={masterChannels.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {masterChannels.map((channel, index) => (
                    <SortableChannel
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannels.has(channel.id)}
                      onSelect={handleSelect}
                      onDelete={() => handleDeleteChannel(index)}
                      onDuplicate={() => handleDuplicateChannel(index)}
                      viewMode={mixerViewMode}
                    />
                  ))}
                </SortableContext>
              </div>

              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10">
                <SortableContext 
                  items={busChannels.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {busChannels.map((channel, index) => (
                    <SortableChannel
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannels.has(channel.id)}
                      onSelect={handleSelect}
                      onDelete={() => handleDeleteChannel(index)}
                      onDuplicate={() => handleDuplicateChannel(index)}
                      viewMode={mixerViewMode}
                    />
                  ))}
                </SortableContext>
              </div>

              <div className="flex items-end gap-2 bg-gradient-to-b from-konform-neon-blue/5 to-transparent p-4 rounded-lg border border-konform-neon-blue/10">
                <SortableContext 
                  items={audioChannels.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {audioChannels.map((channel, index) => (
                    <SortableChannel
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannels.has(channel.id)}
                      onSelect={handleSelect}
                      onDelete={() => handleDeleteChannel(index)}
                      onDuplicate={() => handleDuplicateChannel(index)}
                      viewMode={mixerViewMode}
                    />
                  ))}
                </SortableContext>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddChannel}
                  className="h-12 w-12 rounded-full bg-black/60 border border-konform-neon-blue/30 hover:border-konform-neon-blue text-konform-neon-blue hover:text-konform-neon-orange transition-colors"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </DndContext>
        </ScrollArea>
      </div>
    </div>
  );
};
