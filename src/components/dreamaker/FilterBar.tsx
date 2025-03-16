
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SortAsc, Star, Heart, Clock, ZoomIn, ZoomOut, Music, Video, Image, Code, Box, Plug, Album, Save, Plus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUIStore } from "@/stores/uiStore";

export type MediaType = 'loop' | 'midi' | 'plugin' | 'patch' | 'album';
export type PersonaType = 'AI_CHARACTER' | 'AI_VOCALIST' | 'AI_INSTRUMENTALIST' | 'AI_EFFECT' | 'AI_SOUND' | 'AI_MIXER' | 'AI_WRITER';
export type PersonaSubtype = string | null;

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  zoomLevel: number;
  onZoomChange: (value: number) => void;
  activeTab: string;
  onTypeChange?: (type: string) => void;
  selectedType?: string;
  onSubtypeChange?: (subtype: string) => void;
  selectedSubtype?: string;
  onGenreChange?: (genre: string) => void;
  selectedGenre?: string;
  collapsedSections?: {
    recentCollaborations: boolean;
    header: boolean;
    about: boolean;
    musicSection: boolean;
    videoSection: boolean;
  };
  onSaveDefault?: () => void;
  onCreatePersona?: () => void;
}

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onClearFilters,
  zoomLevel,
  onZoomChange,
  activeTab,
  onTypeChange,
  selectedType = "all",
  onSubtypeChange,
  selectedSubtype,
  onGenreChange,
  selectedGenre = "all",
  collapsedSections,
  onSaveDefault,
  onCreatePersona,
}: FilterBarProps) => {
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const setDefaultStates = useUIStore((state) => state.setDefaultStates);
  const setDefaultWindowState = useUIStore((state) => state.setDefaultWindowState);
  
  useEffect(() => {
    const captureScrollPositions = () => {
      const positions: Record<string, number> = {};
      
      ['main-content', 'persona-list', 'collaboration-list', 'media-gallery'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          positions[id] = element.scrollTop;
        }
      });
      
      setScrollPositions(positions);
    };
    
    captureScrollPositions();
    
    const handleScroll = () => {
      captureScrollPositions();
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 20, 100);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 20, 20);
    onZoomChange(newZoom);
  };

  const handleMakeDefault = () => {
    const filterSettings = {
      sortBy,
      searchQuery,
      selectedType,
      selectedSubtype,
      selectedGenre,
    };

    const currentCollapsedSections = collapsedSections || {
      recentCollaborations: false,
      header: false,
      about: false,
      musicSection: false,
      videoSection: false,
    };
    
    const windowState = {
      zoomLevel,
      filterSettings,
      collapsedSections: currentCollapsedSections,
      scrollPositions
    };
    
    setDefaultWindowState(windowState);
    
    toast.success('All window states saved as default');
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "profiles":
        return "Search artist profiles...";
      case "personas":
        return "Search personas...";
      case "collaborations":
        return "Search collaborations...";
      case "media":
        return "Search media collections...";
      default:
        return "Search...";
    }
  };

  const getSubtypeOptions = (type: string) => {
    switch (type) {
      case "AI_INSTRUMENTALIST":
        return [
          { label: "All Instruments", value: "all" },
          { label: "Guitar", value: "Guitar" },
          { label: "Bass", value: "Bass" },
          { label: "Drums", value: "Drums" },
          { label: "Piano", value: "Piano" },
          { label: "Strings", value: "Strings" },
          { label: "Brass", value: "Brass" },
          { label: "Wind", value: "Wind" },
          { label: "Synth", value: "Synth" },
          { label: "Other", value: "Other" },
        ];
      case "AI_VOCALIST":
        return [
          { label: "All Styles", value: "all" },
          { label: "Pop", value: "Pop" },
          { label: "Rock", value: "Rock" },
          { label: "Jazz", value: "Jazz" },
          { label: "Classical", value: "Classical" },
          { label: "Hip Hop", value: "Hip Hop" },
          { label: "R&B", value: "R&B" },
        ];
      case "AI_CHARACTER":
        return [
          { label: "All Traits", value: "all" },
          { label: "Confident", value: "Confident" },
          { label: "Shy", value: "Shy" },
          { label: "Energetic", value: "Energetic" },
          { label: "Calm", value: "Calm" },
          { label: "Mysterious", value: "Mysterious" },
          { label: "Friendly", value: "Friendly" },
          { label: "Serious", value: "Serious" },
          { label: "Playful", value: "Playful" },
        ];
      case "AI_EFFECT":
        return [
          { label: "All Effects", value: "all" },
          { label: "Reverb", value: "Reverb" },
          { label: "Delay", value: "Delay" },
          { label: "Echo", value: "Echo" },
          { label: "Saturation", value: "Saturation" },
          { label: "Chorus", value: "Chorus" },
          { label: "Flanger", value: "Flanger" },
          { label: "Phaser", value: "Phaser" },
          { label: "Slicer", value: "Slicer" },
          { label: "Multi", value: "Multi" },
          { label: "EQ", value: "EQ" },
          { label: "Compressor", value: "Compressor" },
          { label: "Limiter", value: "Limiter" },
        ];
      case "AI_SOUND":
        return [
          { label: "All Sounds", value: "all" },
          { label: "Ambient", value: "Ambient" },
          { label: "Bass", value: "Bass" },
          { label: "Drums", value: "Drums" },
          { label: "SFX", value: "SFX" },
          { label: "Pads", value: "Pads" },
          { label: "Strings", value: "Strings" },
          { label: "Voice", value: "Voice" },
          { label: "Percussion", value: "Percussion" },
          { label: "Pianos", value: "Pianos" },
          { label: "ELPiano", value: "ELPiano" },
          { label: "Synth", value: "Synth" },
          { label: "Brass", value: "Brass" },
          { label: "Winds", value: "Winds" },
          { label: "Harp", value: "Harp" },
          { label: "Ethnic", value: "Ethnic" },
          { label: "Pluck", value: "Pluck" },
        ];
      default:
        return [];
    }
  };

  const renderTypeFilter = () => {
    if (activeTab === 'personas') {
      return (
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Persona Types</SelectLabel>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AI_CHARACTER">Character</SelectItem>
                <SelectItem value="AI_VOCALIST">Vocalist</SelectItem>
                <SelectItem value="AI_INSTRUMENTALIST">Instrumentalist</SelectItem>
                <SelectItem value="AI_EFFECT">Effect</SelectItem>
                <SelectItem value="AI_SOUND">Sound</SelectItem>
                <SelectItem value="AI_MIXER">Mixer</SelectItem>
                <SelectItem value="AI_WRITER">Writer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {selectedType && selectedType !== "all" && getSubtypeOptions(selectedType).length > 0 && (
            <Select value={selectedSubtype} onValueChange={onSubtypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select subtype" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    {selectedType === "AI_INSTRUMENTALIST" ? "Instruments" : 
                     selectedType === "AI_VOCALIST" ? "Vocal Styles" : 
                     selectedType === "AI_CHARACTER" ? "Character Traits" :
                     selectedType === "AI_EFFECT" ? "Effect Types" :
                     selectedType === "AI_SOUND" ? "Sound Types" : "Subtypes"}
                  </SelectLabel>
                  {getSubtypeOptions(selectedType).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      );
    }
    if (activeTab === 'media') {
      return (
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Media Types</SelectLabel>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="loop">Loops</SelectItem>
              <SelectItem value="midi">MIDI</SelectItem>
              <SelectItem value="plugin">Plugins</SelectItem>
              <SelectItem value="patch">Patches</SelectItem>
              <SelectItem value="album">Albums</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
    if (activeTab === 'profiles' || activeTab === 'collaborations') {
      return (
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Genres</SelectLabel>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="hip-hop">Hip Hop</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
    return null;
  };

  const renderSortButtons = () => {
    const commonButtons = [
      {
        value: "newest",
        icon: <Clock className="h-4 w-4 mr-2" />,
        label: "Newest"
      },
      {
        value: "popular",
        icon: <Star className="h-4 w-4 mr-2" />,
        label: "Popular"
      },
      {
        value: "alphabetical",
        icon: <SortAsc className="h-4 w-4 mr-2" />,
        label: "A-Z"
      }
    ];

    const tabSpecificButtons = {
      profiles: [
        ...commonButtons,
        {
          value: "favorite",
          icon: <Heart className="h-4 w-4 mr-2" />,
          label: "Favorite"
        }
      ],
      personas: [
        ...commonButtons,
        {
          value: "type",
          icon: <Music className="h-4 w-4 mr-2" />,
          label: "Type"
        }
      ],
      collaborations: [
        ...commonButtons,
        {
          value: "genre",
          icon: <Music className="h-4 w-4 mr-2" />,
          label: "Genre"
        }
      ],
      media: [
        ...commonButtons,
        {
          value: "type",
          icon: <Box className="h-4 w-4 mr-2" />,
          label: "Type"
        }
      ]
    };

    const buttons = tabSpecificButtons[activeTab as keyof typeof tabSpecificButtons] || commonButtons;

    return buttons.map((button) => (
      <Button
        key={button.value}
        variant="outline"
        size="sm"
        onClick={() => onSortChange(button.value)}
        className={sortBy === button.value ? "bg-dreamaker-purple/20" : ""}
      >
        {button.icon}
        {button.label}
      </Button>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-black/20 backdrop-blur-sm p-4 rounded-xl">
      <div className="flex-1 flex gap-4">
        <Input
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
        {renderTypeFilter()}
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        {renderSortButtons()}

        <div className="flex items-center gap-2 ml-4 border-l border-gray-600 pl-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 20}
            className="bg-dreamaker-purple/10 hover:bg-dreamaker-purple/20"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 100}
            className="bg-dreamaker-purple/10 hover:bg-dreamaker-purple/20"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSaveDefault}
            className="ml-2 bg-black/20 border-white/20 hover:bg-black/40 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Set Default
          </Button>
          
          {activeTab === "personas" && onCreatePersona && (
            <Button 
              onClick={onCreatePersona}
              variant="outline"
              className="ml-2 bg-black/20 text-white/80 border border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 transition-all duration-300 uppercase font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Persona
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
