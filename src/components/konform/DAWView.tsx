
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MixerChannel } from "./daw/MixerChannel";
import { TransportControls } from "./TransportControls";
import { TimelineRegionComponent } from "./daw/TimelineRegion";
import type { DAWViewProps } from "./daw/types";
import type { Persona } from "@/types/persona";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import { TrackMode } from "./daw/Track";

export const DAWView = ({
  selectedPersona,
  onPersonaSelect,
  onPersonaDeselect,
  onPersonaUpdate,
}: DAWViewProps) => {
  const [channels, setChannels] = useState<Persona[]>([]);
  const [selectedChannelIndex, setSelectedChannelIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: personas } = useQuery({
    queryKey: ["personas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformPersonaData);
    }
  });

  const handleAddChannel = async (persona: Persona) => {
    try {
      const { data: state } = await supabase
        .from('persona_states')
        .select('*')
        .eq('persona_id', persona.id)
        .maybeSingle();

      setChannels(prev => [...prev, persona]);
      
      // Load saved state if it exists
      if (state) {
        onPersonaUpdate(persona, {
          volume: state.volume,
          is_muted: state.is_muted,
          track_mode: state.track_mode as "ai-audio" | "ai-midi" | "real-audio",
        });
      }

      toast({
        title: "Channel added",
        description: `Added ${persona.name} to the mix`,
      });
    } catch (error) {
      console.error("Error adding channel:", error);
      toast({
        title: "Error",
        description: "Failed to add channel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePersonaSelect = (index: number) => {
    setSelectedChannelIndex(index);
  };

  const handleUpdateChannelPersona = async (channelIndex: number, newPersona: Persona) => {
    try {
      const updatedChannels = [...channels];
      updatedChannels[channelIndex] = newPersona;
      setChannels(updatedChannels);
      setSelectedChannelIndex(null);

      toast({
        title: "Persona updated",
        description: `Updated channel ${channelIndex + 1} with ${newPersona.name}`,
      });
    } catch (error) {
      console.error("Error updating channel persona:", error);
      toast({
        title: "Error",
        description: "Failed to update channel persona. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-black/90">
      {/* Top Timeline */}
      <div className="h-12 border-b border-konform-neon-blue/20 bg-black/40 flex items-center px-4">
        <div className="text-sm text-gray-400">
          00:00:00
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Browser Panel */}
        <div className="w-64 border-r border-konform-neon-blue/20 bg-black/40 p-4">
          <h3 className="text-sm font-medium text-white mb-4">Browser</h3>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-2">
              {personas?.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handleAddChannel(persona)}
                  className="w-full p-2 flex items-center gap-2 rounded-lg bg-black/40 hover:bg-black/60 border border-konform-neon-blue/30 hover:border-konform-neon-blue/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-konform-neon-blue/20 flex items-center justify-center group-hover:bg-konform-neon-blue/30">
                    {persona.name[0]}
                  </div>
                  <span className="text-sm text-white">{persona.name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Arrangement View */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="min-h-full p-4">
              <div className="flex flex-row gap-4 min-w-max">
                {channels.map((persona, index) => (
                  <div key={`${persona.id}-${index}`} className="flex-none w-64">
                    {/* Track Header */}
                    <div className="mb-4">
                      <MixerChannel
                        id={persona.id}
                        index={index}
                        name={persona.name}
                        type={(persona.type as TrackMode) || 'ai-audio'}
                        volume={75}
                        isMuted={false}
                        persona={{
                          name: persona.name,
                          avatarUrl: persona.avatar_url
                        }}
                        onVolumeChange={() => {}}
                        onMuteToggle={() => {}}
                        onTypeChange={() => {}}
                        onGenerate={() => {}}
                        onPersonaSelect={() => handlePersonaSelect(index)}
                      />
                    </div>
                    
                    {/* Track Timeline */}
                    <div className="h-[calc(100vh-24rem)] bg-black/40 rounded-lg border border-konform-neon-blue/20 relative">
                      {/* Example region - you would generate these from actual track data */}
                      <TimelineRegionComponent
                        region={{
                          id: `region-${index}`,
                          startTime: 10,
                          duration: 30,
                          name: "Region 1",
                          color: "rgba(74, 222, 128, 0.5)"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Transport Controls */}
          <div className="border-t border-konform-neon-blue/20 bg-black/40">
            <TransportControls />
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="w-64 border-l border-konform-neon-blue/20 bg-black/40 p-4">
          <h3 className="text-sm font-medium text-white mb-4">Details</h3>
          {selectedPersona && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                <p>Type: {selectedPersona.type}</p>
                <p>Created: {new Date(selectedPersona.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
