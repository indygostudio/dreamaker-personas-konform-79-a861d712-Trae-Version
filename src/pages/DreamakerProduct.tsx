
import { useEffect, useState, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { NavigationTabs } from "@/components/artist-profile/NavigationTabs";
import { Tabs } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/use-subscription";
import { useUIStore } from "@/stores/uiStore";
import { useLocation } from "react-router-dom";
import { HeroBanner } from "@/components/dreamaker/sections/HeroBanner";
import { FilterBar } from "@/components/dreamaker/FilterBar";
import { DreamakerTabContent } from "@/components/dreamaker/DreamakerTabContent";
import { useDreamakerContent } from "@/hooks/useDreamakerContent";
import type { Banner } from "@/types/banner";

const prefetchTabData = () => {
  console.log('Prefetching tab data...');
};

export const DreamakerProduct = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profiles");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [tabZoomLevels, setTabZoomLevels] = useState<Record<string, number>>(() => {
    // Try to load saved tab zoom levels from localStorage
    const savedZoomLevels = localStorage.getItem('tabZoomLevels');
    if (savedZoomLevels) {
      try {
        return JSON.parse(savedZoomLevels);
      } catch (e) {
        console.error('Failed to parse saved zoom levels:', e);
      }
    }
    
    // Initialize with default zoom levels for each tab
    return {
      profiles: 75,
      personas: 75,
      collaborations: 75,
      media: 75
    };
  });
  
  // Get the current tab's zoom level
  const zoomLevel = tabZoomLevels[activeTab] || 75;
  
  // Function to update zoom level for the current tab only
  const setZoomLevel = (newZoomLevel: number) => {
    setTabZoomLevels(prev => ({
      ...prev,
      [activeTab]: newZoomLevel
    }));
  };
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const { tier: subscriptionTier } = useSubscription();

  const { 
    scrollPositions,
    isHeaderExpanded, 
    setHeaderExpanded,
    setDefaultWindowState
  } = useUIStore();

  // Process location state when component mounts
  useEffect(() => {
    if (location.state) {
      // Set active tab if provided in location state
      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
      
      // Set search query if provided in location state
      if (location.state.searchQuery) {
        setSearchQuery(location.state.searchQuery);
      }
      
      // Set sort by if provided in location state
      if (location.state.sortBy) {
        setSortBy(location.state.sortBy);
      }
      
      // Set selected type if provided in location state
      if (location.state.selectedType) {
        setSelectedType(location.state.selectedType);
      }
    }
  }, [location]);

  // Get filtered content from our custom hook
  const { filteredContent } = useDreamakerContent(
    activeTab,
    searchQuery,
    sortBy,
    selectedType,
    selectedGenre
  );

  // Update localStorage whenever tab zoom levels change
  useEffect(() => {
    // Store all tab zoom levels in localStorage
    localStorage.setItem('tabZoomLevels', JSON.stringify(tabZoomLevels));
  }, [tabZoomLevels]);

  const handleAudioPlay = (fileUrl: string) => {
    if (!fileUrl) {
      toast({
        title: "Error",
        description: "No audio file available",
        variant: "destructive"
      });
      return;
    }
    const audio = new Audio(fileUrl);
    audio.play().catch(error => {
      toast({
        title: "Error playing audio",
        description: error.message,
        variant: "destructive"
      });
    });
  };

  const saveCurrentStateAsDefault = () => {
    const currentState = {
      zoomLevel: zoomLevel, // Current tab's zoom level
      tabZoomLevels: tabZoomLevels, // All tabs' zoom levels
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
      description: `Your current view settings for the ${activeTab} tab will be applied next time`,
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-dreamaker-bg text-white pt-[84px]">
      <Suspense fallback={<div className="h-[42vh] bg-dreamaker-bg" />}>
        <HeroBanner 
          isHeaderExpanded={isHeaderExpanded}
          isHeaderHovered={isHeaderHovered}
          onHeaderDoubleClick={() => setHeaderExpanded(!isHeaderExpanded)}
          onHeaderHover={setIsHeaderHovered}
          currentBanner={currentBanner}
          activeTab={activeTab}
        />
      </Suspense>

      <div className="w-full px-6 max-w-[2400px] mx-auto">
        <Tabs 
          defaultValue="profiles" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="h-[calc(100vh-84px)] flex flex-col overflow-hidden"
        >
          <div className="flex-none">
            <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm">
              <NavigationTabs 
                profile={null} 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                onMouseEnter={prefetchTabData}
              />
            </div>
            
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
                onSaveDefault={saveCurrentStateAsDefault}
              />
            </div>
          </div>

          <DreamakerTabContent
            activeTab={activeTab}
            items={filteredContent}
            zoomLevel={zoomLevel}
            subscriptionTier={subscriptionTier}
            onAudioPlay={handleAudioPlay}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default DreamakerProduct;
