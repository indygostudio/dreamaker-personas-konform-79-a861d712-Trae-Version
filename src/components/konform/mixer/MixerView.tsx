
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChannelStrip } from "./controls/ChannelStrip";
import { MixerHeader } from "./MixerHeader";
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
import { useToast } from "@/hooks/use-toast";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformPersonaData } from "@/lib/utils/personaTransform";

interface Channel {
  id: string;
  number: number;
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

const SortableChannel = ({ channel, isSelected, onSelect, onDelete, onDuplicate, viewMode }: SortableChannelProps) => {
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
      <ChannelStrip
        channelNumber={channel.number}
        collaborator={channel.collaborator}
        isSelected={isSelected}
        onSelect={(e) => onSelect(channel.id, e.shiftKey)}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        type={channel.type}
        viewMode={viewMode}
      />
    </div>
  );
};

export const MixerView = () => {
  const { mixerViewMode, setMixerViewMode } = useViewModeStore();
  const { selectedPersonas } = useSelectedPersonasStore();
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>(() => [
    {
      id: 'master',
      number: 0,
      type: 'master'
    },
    {
      id: 'bus-1',
      number: 1,
      type: 'bus'
    },
    {
      id: 'bus-2',
      number: 2,
      type: 'bus'
    },
    {
      id: 'default-audio',
      number: 1,
      type: 'audio'
    }
  ]);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());
  const [currentMixer, setCurrentMixer] = useState<Persona | null>(null);
  
  // Fetch mixer personas (AI_MIXER type)
  const { data: mixerPersonas = [] } = useQuery({
    queryKey: ['mixer-personas'],
    queryFn: async () => {
      const { data } = await supabase
        .from('personas')
        .select('*')
        .eq('type', 'AI_MIXER');
      
      return data ? data.map(transformPersonaData) : [];
    }
  });

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

  // Effect to load selected personas into mixer channels
  useEffect(() => {
    if (selectedPersonas.length > 0) {
      // Create a new channel for each selected persona that doesn't already have a channel
      const existingPersonaIds = channels
        .filter(c => c.collaborator)
        .map(c => c.collaborator?.id);
      
      const newPersonas = selectedPersonas.filter(p => 
        p.id && !existingPersonaIds.includes(p.id)
      );
      
      if (newPersonas.length > 0) {
        const newChannels = newPersonas.map(persona => ({
          id: `channel-${Date.now()}-${persona.id}`,
          number: channels.filter(c => c.type === 'audio').length + 1,
          type: 'audio' as const,
          collaborator: {
            id: persona.id || '',
            name: persona.name,
            avatar_url: persona.avatar_url || persona.avatarUrl,
            type: persona.type,
            user_id: ''
          }
        }));
        
        setChannels(prev => [...prev, ...newChannels]);
        
        toast({
          title: "Personas Added to Mixer",
          description: `${newPersonas.length} persona(s) have been added to the mixer channels.`
        });
      }
    }
  }, [selectedPersonas, channels, toast]);
  
  // Effect to set the current mixer if available
  useEffect(() => {
    if (mixerPersonas.length > 0 && !currentMixer) {
      setCurrentMixer(mixerPersonas[0]);
    }
  }, [mixerPersonas, currentMixer]);
  
  const handleMixerChange = (mixerId: string) => {
    const mixer = mixerPersonas.find(p => p.id === mixerId);
    if (mixer) {
      setCurrentMixer(mixer);
    }
  };
  
  const getCurrentMixerState = () => {
    // Return current mixer state for presets
    return {
      channels: channels.map(c => ({
        id: c.id,
        type: c.type,
        collaborator: c.collaborator ? c.collaborator.id : null
      }))
    };
  };
  
  const handleLoadPreset = (mixerState: any) => {
    // Load a mixer preset
    if (mixerState?.channels) {
      toast({
        title: "Mixer Preset Loaded",
        description: "The mixer preset has been loaded successfully."
      });
    }
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
      <div className="mb-4">
        <MixerHeader 
          currentMixer={currentMixer}
          mixerPersonas={mixerPersonas}
          onMixerChange={handleMixerChange}
          currentMixerState={getCurrentMixerState()}
          onLoadPreset={handleLoadPreset}
        />
      </div>
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
