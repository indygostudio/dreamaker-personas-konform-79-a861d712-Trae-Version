
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Plus, UserPlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Track } from "../daw/Track";
import { MixerChannel } from "../daw/MixerChannel";
import { MasterVolume } from "../mixer/MasterVolume";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Persona } from "@/types/persona";

export const MixbaseView = () => {
  const { selectedPersonas } = useSelectedPersonasStore();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([{
    id: 1,
    name: 'Master',
    volume: 80,
    isMuted: false,
    isSolo: false,
    mode: 'master',
    clips: [],
  }, {
    id: 2,
    name: 'Bus 1',
    volume: 75,
    isMuted: false,
    isSolo: false,
    mode: 'bus',
    clips: [],
  }, {
    id: 3,
    name: 'Bus 2',
    volume: 75,
    isMuted: false,
    isSolo: false,
    mode: 'bus',
    clips: [],
  }, {
    id: 4,
    name: 'Track 1',
    volume: 75,
    isMuted: false,
    isSolo: false,
    mode: 'ai-audio',
    clips: [],
  }]);
  
  // Fetch available personas for channel strips
  const { data: availablePersonas = [], isLoading: isLoadingPersonas } = useQuery({
    queryKey: ['available_personas'],
    queryFn: async () => {
      const { data } = await supabase
        .from('personas')
        .select('*');
      
      return data ? data.map(transformPersonaData) : [];
    }
  });
  
  // Effect to load selected personas into mixer channels
  useEffect(() => {
    if (selectedPersonas.length > 0) {
      // Create a new track for each selected persona that doesn't already have a track
      const existingPersonaIds = tracks
        .filter(t => t.persona)
        .map(t => t.persona?.id);
      
      const newPersonas = selectedPersonas.filter(p => 
        p.id && !existingPersonaIds.includes(p.id)
      );
      
      if (newPersonas.length > 0) {
        const newTracks = newPersonas.map(persona => ({
          id: Math.max(...tracks.map(t => t.id)) + 1,
          name: persona.name,
          volume: 75,
          isMuted: false,
          isSolo: false,
          mode: 'ai-audio' as const,
          clips: [],
          persona: {
            id: persona.id,
            name: persona.name,
            avatarUrl: persona.avatar_url,
            type: persona.type
          }
        }));
        
        setTracks(prev => [...prev, ...newTracks]);
        
        toast({
          title: "Personas Added to Mixer",
          description: `${newPersonas.length} persona(s) have been added to the mixer channels.`
        });
      }
    }
  }, [selectedPersonas, tracks, toast]);

  const [masterVolume, setMasterVolume] = useState(80);
  const [viewMode, setViewMode] = useState<'large' | 'normal' | 'compact'>('normal');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleAddTrack = () => {
    const audioTracks = tracks.filter(t => t.mode === 'ai-audio');
    const newTrack: Track = {
      id: Math.max(...tracks.map(t => t.id)) + 1,
      name: `Track ${audioTracks.length + 1}`,
      volume: 75,
      isMuted: false,
      isSolo: false,
      mode: 'ai-audio',
      clips: [],
    };
    setTracks([...tracks, newTrack]);
  };

  const handleDeleteTrack = (trackId: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (track?.mode === 'master' || track?.mode === 'bus') return;
    setTracks(tracks => tracks.filter(track => track.id !== trackId));
  };

  const handleDuplicateTrack = (trackId: number) => {
    const trackToDuplicate = tracks.find(track => track.id === trackId);
    if (!trackToDuplicate || trackToDuplicate.mode === 'master' || trackToDuplicate.mode === 'bus') return;

    const newTrack = {
      ...trackToDuplicate,
      id: Math.max(...tracks.map(t => t.id)) + 1,
      name: `${trackToDuplicate.name} (Copy)`,
      isSolo: trackToDuplicate.isSolo || false,
      clips: []
    };

    setTracks([...tracks, newTrack]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTracks(tracks => {
      const oldIndex = tracks.findIndex(t => t.id === active.id);
      const newIndex = tracks.findIndex(t => t.id === over.id);
      
      const track = tracks[oldIndex];
      if (track.mode === 'master' || track.mode === 'bus') return tracks;

      const masterBusCount = tracks.filter(t => t.mode === 'master' || t.mode === 'bus').length;
      if (newIndex < masterBusCount) return tracks;

      const newTracks = [...tracks];
      const [removed] = newTracks.splice(oldIndex, 1);
      newTracks.splice(newIndex, 0, removed);

      return newTracks;
    });
  };

  // Separate tracks by type
  const masterTracks = tracks.filter(t => t.mode === 'master');
  const busTracks = tracks.filter(t => t.mode === 'bus');
  const audioTracks = tracks.filter(t => t.mode === 'ai-audio');

  // Render a mixer channel with the new UI based on the image
  const renderMixerChannel = (track: Track, index: number) => {
    // Calculate volume percentage for display (0-200%)
    const volumePercentage = Math.round((track.volume / 100) * 200);
    
    // Calculate dB value (simplified conversion for display)
    const dbValue = track.volume > 0 ? Math.round((track.volume - 75) / 25 * 12) : -48;
    const dbDisplay = dbValue > 0 ? `+${dbValue}` : dbValue;
    
    // State for persona dropdown
    const [showPersonasDropdown, setShowPersonasDropdown] = useState(false);
    
    // Filter personas based on track type
    const filteredPersonas = availablePersonas.filter(persona => 
      track.mode === 'master' 
        ? persona.type === 'AI_MIXER' || persona.type === 'AI_EFFECT'
        : !['AI_MIXER', 'AI_EFFECT'].includes(persona.type)
    );
    
    // Handle persona selection
    const handlePersonaSelect = (persona: Persona) => {
      setTracks(tracks.map(t => 
        t.id === track.id ? {
          ...t,
          name: persona.name,
          persona: {
            id: persona.id,
            name: persona.name,
            avatarUrl: persona.avatar_url || persona.avatarUrl,
            type: persona.type
          }
        } : t
      ));
      setShowPersonasDropdown(false);
      
      toast({
        title: "Persona Added to Channel",
        description: `${persona.name} has been added to channel ${track.id}.`
      });
    };
    
    // Handle double click on avatar area
    const handleAvatarDoubleClick = () => {
      if (track.persona) return;

      if (filteredPersonas.length === 0) {
        toast({
          title: track.mode === 'master' ? "No Mixer Personas Available" : "No Personas Available",
          description: track.mode === 'master' 
            ? "Please add a mixer persona from the collaborators section" 
            : "Please add personas from the collaborators section",
          variant: "destructive"
        });
      } else {
        setShowPersonasDropdown(true);
      }
    };
    
    return (
      <div key={track.id} className={`flex-shrink-0 ${viewMode === 'large' ? 'w-96' : viewMode === 'normal' ? 'w-64' : 'w-48'}`}>
        <div className="bg-[#2a9cb2] rounded-lg border border-gray-700 overflow-hidden flex flex-col h-full">
          {/* Presence Button */}
          <div className="bg-[#2a9cb2] p-1 border-b border-gray-700 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-8 border-gray-700 text-yellow-300 bg-[#1e3e45] hover:bg-[#1e3e45]/80"
            >
              Presence
            </Button>
          </div>
          
          {/* Master Label */}
          <div className="bg-[#1e3e45] p-1 border-b border-gray-700 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-8 border-gray-700 text-yellow-300 bg-[#1e3e45] hover:bg-[#1e3e45]/80 font-bold"
            >
              {track.mode === 'master' ? 'MASTER' : track.mode === 'bus' ? `BUS ${index}` : 'TRACK'}
            </Button>
          </div>
          
          {/* Persona Avatar */}
          <div className="bg-[#2a9cb2] p-2 border-b border-gray-700 flex justify-center">
            <DropdownMenu open={showPersonasDropdown} onOpenChange={setShowPersonasDropdown}>
              <DropdownMenuTrigger asChild>
                {track.persona ? (
                  <Avatar 
                    className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-yellow-300 transition-all"
                  >
                    <AvatarImage src={track.persona.avatarUrl} />
                    <AvatarFallback>{track.persona.name?.[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-12 w-12 rounded-full border-2 border-dashed border-yellow-300/20 hover:border-yellow-300/50"
                    onDoubleClick={handleAvatarDoubleClick}
                  >
                    <UserPlus2 className="h-6 w-6 text-yellow-300/50" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-[#1A1F2C] border border-yellow-300/20"
              >
                <DropdownMenuLabel>
                  {track.persona ? "Change Persona" : "Add Persona"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300/20 scrollbar-track-black/20">
                  {isLoadingPersonas ? (
                    <DropdownMenuItem disabled>
                      Loading personas...
                    </DropdownMenuItem>
                  ) : filteredPersonas.length === 0 ? (
                    <DropdownMenuItem disabled>
                      No personas available
                    </DropdownMenuItem>
                  ) : (
                    filteredPersonas.map(persona => (
                      <DropdownMenuItem 
                        key={persona.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-yellow-300/10 transition-colors"
                        onClick={() => handlePersonaSelect(persona)}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={persona.avatar_url} />
                          <AvatarFallback>{persona.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm">{persona.name}</span>
                          <span className="text-xs text-gray-400">
                            {persona.type.replace('AI_', '')}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Level Meter */}
          <div className="bg-black p-1 border-b border-gray-700 flex justify-center h-12">
            <div className="w-full bg-black relative h-full flex items-center justify-center">
              <div 
                className="absolute left-0 bottom-0 h-full bg-[#2a9cb2] transition-all duration-150" 
                style={{ width: '4px', height: `${track.volume}%` }}
              />
              <div className="z-10 w-full h-1 bg-[#2a9cb2]/30 absolute" style={{ top: '50%' }} />
            </div>
          </div>
          
          {/* Level and Percentage */}
          <div className="bg-[#2a9cb2] p-1 border-b border-gray-700 flex justify-between items-center">
            <div className="text-white text-xs font-medium">L5</div>
            <div className="text-white text-xs font-medium">{volumePercentage}%</div>
          </div>
          
          {/* Mute/Solo Buttons */}
          <div className="grid grid-cols-2 border-b border-gray-700">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-none h-10 text-sm font-bold ${track.isMuted ? 'bg-red-500 text-white' : 'bg-[#1e3e45] text-white'} hover:bg-red-500 hover:text-white border-gray-700`}
              onClick={() => {
                setTracks(tracks.map(t =>
                  t.id === track.id ? { ...t, isMuted: !t.isMuted } : t
                ));
              }}
            >
              M
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-none h-10 text-sm font-bold ${track.isSolo ? 'bg-[#2a9cb2] text-white' : 'bg-[#1e3e45] text-white'} hover:bg-[#2a9cb2] hover:text-white border-gray-700`}
              onClick={() => {
                setTracks(tracks.map(t =>
                  t.id === track.id ? { ...t, isSolo: !t.isSolo } : t
                ));
              }}
            >
              S
            </Button>
          </div>
          
          {/* Mute/Solo Status Indicators */}
          <div className="grid grid-cols-2 border-b border-gray-700">
            <div className={`flex items-center justify-center h-10 ${track.isMuted ? 'bg-red-500' : 'bg-[#1e3e45]'}`}>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                {track.isMuted && <div className="w-4 h-4 rounded-full bg-red-500" />}
              </div>
            </div>
            <div className={`flex items-center justify-center h-10 ${track.isSolo ? 'bg-[#2a9cb2]' : 'bg-[#1e3e45]'}`}>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                {track.isSolo && <div className="w-4 h-4 rounded-full bg-[#2a9cb2] border-2 border-white" />}
              </div>
            </div>
          </div>
          
          {/* dB Label */}
          <div className="bg-[#2a9cb2] p-1 border-b border-gray-700 flex justify-center">
            <div className="text-white text-sm font-medium">{dbDisplay}dB</div>
          </div>
          
          {/* Volume Meter */}
          <div className="flex-1 bg-[#1e3e45] p-2 flex">
            <div className="w-10 bg-black rounded-sm mr-2 relative">
              {/* Meter scale lines */}
              {[-72, -48, -36, -24, -12, -6, 0, 6, 10].map((level, i) => (
                <div 
                  key={i} 
                  className="absolute w-full h-px bg-gray-600" 
                  style={{ 
                    bottom: `${((level + 72) / 82) * 100}%`,
                    left: 0
                  }}
                />
              ))}
              
              {/* Level indicator */}
              <div 
                className={`absolute bottom-0 left-0 w-full transition-all duration-150 ${track.isMuted ? 'bg-red-500/50' : 'bg-[#2a9cb2]'}`}
                style={{ height: `${track.volume}%` }}
              />
              
              {/* Level markers */}
              <div className="absolute left-0 w-full flex flex-col justify-between h-full text-[8px] text-gray-400 pointer-events-none">
                <div className="text-right pr-1">10</div>
                <div className="text-right pr-1">6</div>
                <div className="text-right pr-1">0</div>
                <div className="text-right pr-1">-6</div>
                <div className="text-right pr-1">-12</div>
                <div className="text-right pr-1">-24</div>
                <div className="text-right pr-1">-36</div>
                <div className="text-right pr-1">-48</div>
                <div className="text-right pr-1">-72</div>
              </div>
            </div>
            
            {/* Volume Slider */}
            <div className="flex-1 flex flex-col items-center">
              <div className="h-full w-full flex justify-center">
                <Slider
                  orientation="vertical"
                  value={[track.volume]}
                  onValueChange={([value]) => {
                    setTracks(tracks.map(t =>
                      t.id === track.id ? { ...t, volume: value } : t
                    ));
                  }}
                  max={100}
                  step={1}
                  className="h-full"
                />
              </div>
            </div>
          </div>
          
          {/* Track Number and Controls */}
          <div className="bg-[#2a9cb2] p-1 border-t border-gray-700 flex justify-between items-center">
            <div className="text-white text-sm font-bold">{index}</div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:text-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </Button>
            </div>
          </div>
          
          {/* Track Name */}
          <div className="bg-[#2a9cb2] p-1 flex justify-center">
            <Button variant="ghost" className="text-xs text-white hover:text-yellow-300 font-medium">
              {track.name}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#131415]">
      <div className="p-4 border-b border-konform-neon-blue/20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'large' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('large')}
              className="text-konform-neon-blue"
            >
              Large
            </Button>
            <Button
              variant={viewMode === 'normal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('normal')}
              className="text-konform-neon-blue"
            >
              Normal
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('compact')}
              className="text-konform-neon-blue"
            >
              Compact
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 h-[calc(100vh-8rem)] flex">
        <ScrollArea className="flex-1 h-full">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex items-stretch space-x-4 min-h-[500px]">
              {/* Render all tracks in the new mixer channel UI */}
              {tracks.map((track, index) => renderMixerChannel(track, index))}
              
              <div className="flex-shrink-0 w-24 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleAddTrack}
                  className="w-12 h-12 rounded-full bg-black/60 border border-konform-neon-blue/30 hover:border-konform-neon-blue text-konform-neon-blue hover:text-konform-neon-orange transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </DndContext>
          <ScrollBar orientation="horizontal" className="bg-konform-neon-blue/20" />
        </ScrollArea>
        <MasterVolume volume={masterVolume} onVolumeChange={setMasterVolume} />
      </div>
      <div className="h-16 border-t border-konform-neon-blue/20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center space-x-4">
            {/* Transport controls */}
          </div>
          <div className="flex items-center space-x-4 text-konform-neon-blue">
            <span>120 BPM</span>
            <span>4/4</span>
            <span>C Maj</span>
          </div>
        </div>
      </div>
    </div>
  );
};
