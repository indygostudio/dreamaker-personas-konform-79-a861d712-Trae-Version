
import { useState, useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilterBar } from "@/components/dreamaker/FilterBar";

interface DreamakerStateManagerProps {
  activeTab: string;
  isHeaderExpanded: boolean;
  onTabChange: (tab: string) => void;
}

export const DreamakerStateManager = ({ 
  activeTab,
  isHeaderExpanded,
  onTabChange
}: DreamakerStateManagerProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [zoomLevel, setZoomLevel] = useState(() => {
    const saved = localStorage.getItem('defaultZoom');
    return saved ? parseInt(saved) : 75;
  });
  
  const { 
    scrollPositions, 
    setDefaultWindowState 
  } = useUIStore();

  // Update localStorage whenever zoom level changes
  useEffect(() => {
    localStorage.setItem('defaultZoom', zoomLevel.toString());
  }, [zoomLevel]);

  const saveCurrentStateAsDefault = () => {
    const currentState = {
      zoomLevel: zoomLevel,
      filterSettings: {
        sortBy,
        searchQuery,
        selectedType,
        selectedGenre
      },
      collapsedSections: {
        header: !isHeaderExpanded,
        recentCollaborations: false,
        about: false,
        musicSection: false,
        videoSection: false
      },
      scrollPositions: scrollPositions
    };
    
    setDefaultWindowState(currentState);
    
    toast({
      title: "Default state saved",
      description: "Your current view settings will be applied next time",
      variant: "default"
    });
  };

  return (
    <div className="mt-6 flex justify-between items-center">
      <FilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={() => {
          setSearchQuery("");
          setSortBy("newest");
          setSelectedType("all");
          setSelectedGenre("all");
        }}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        activeTab={activeTab}
        onTypeChange={setSelectedType}
        selectedType={selectedType}
        onGenreChange={setSelectedGenre}
        selectedGenre={selectedGenre}
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-2 bg-black/20 border-white/20 hover:bg-black/40 text-white"
        onClick={saveCurrentStateAsDefault}
      >
        <Save className="w-4 h-4 mr-2" />
        Set Default
      </Button>
    </div>
  );
};
