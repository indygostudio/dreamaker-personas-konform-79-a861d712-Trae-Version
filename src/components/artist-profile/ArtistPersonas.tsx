
import type { Persona } from "@/types/persona";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import { useState, useEffect } from "react";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useUIStore } from "@/stores/uiStore";
import { PersonaFilterSection } from "./components/PersonaFilterSection";
import { PersonaDropContainer } from "./components/PersonaDropContainer";
import { PersonaGrid } from "./components/PersonaGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentCollaborations } from "./components/RecentCollaborations";
import { FavoriteCollaborations } from "./components/FavoriteCollaborations";
import { CollectionsTab } from "./components/CollectionsTab";
import { ProjectTab } from "./components/ProjectTab";
import { Star, Users, ChevronDown, ChevronUp, FolderOpen, Save } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ArtistPersonasProps {
  personas: Persona[];
  onPersonaSelect: (persona: Persona) => void;
}

interface TabItem {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
}

const SortableTab = ({ tab }: { tab: TabItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <TabsTrigger 
      ref={setNodeRef}
      value={tab.value}
      className="flex items-center gap-1 text-xs h-6"
      style={style}
      {...attributes}
      {...listeners}
    >
      {tab.icon}
      <span>{tab.label}</span>
    </TabsTrigger>
  );
};

export const ArtistPersonas = ({
  personas,
  onPersonaSelect
}: ArtistPersonasProps) => {
  const { id } = useParams<{ id: string }>();
  const { getDefaultStates, setDefaultStates } = useUIStore();
  
  // Get default states with safe fallbacks
  const defaultStates = getDefaultStates();
  
  // Safely access filter settings with defaults
  const filterSettings = defaultStates.filterSettings || { 
    sortBy: "newest", 
    searchQuery: "", 
    selectedType: "all", 
    selectedGenre: "all" 
  };
  
  // Safely access collapsed sections with defaults
  const collapsedSectionSettings = defaultStates.collapsedSections || { 
    recentCollaborations: false, 
    header: false, 
    about: false, 
    musicSection: false, 
    videoSection: false 
  };
  
  // Use default values with safe fallbacks - create new objects to avoid reference issues
  const [searchQuery, setSearchQuery] = useState(filterSettings.searchQuery || "");
  const [sortBy, setSortBy] = useState(filterSettings.sortBy || "newest");
  const [zoomLevel, setZoomLevel] = useState(defaultStates.zoomLevel || 60);
  const [selectedType, setSelectedType] = useState(filterSettings.selectedType || "all");
  const [isRecentCollabsOpen, setIsRecentCollabsOpen] = useState(!collapsedSectionSettings.recentCollaborations);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [favoritePersonas, setFavoritePersonas] = useState<Persona[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("recent");
  // Changed this to start in the collapsed state
  const [isTabsCollapsed, setIsTabsCollapsed] = useState(true);
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 'recent', value: 'recent', label: 'Collaborations', icon: <Users className="h-3 w-3" /> },
    { id: 'favorites', value: 'favorites', label: 'Favorites', icon: <Star className="h-3 w-3 text-yellow-400" /> },
    { id: 'projects', value: 'projects', label: 'Projects', icon: <FolderOpen className="h-3 w-3 text-purple-400" /> },
    { id: 'collections', value: 'collections', label: 'Collections', icon: <FolderOpen className="h-3 w-3 text-blue-400" /> },
  ]);
  const { toast } = useToast();
  
  const { showDropContainer } = useSelectedPersonasStore();
  
  // Create explicit, new copy of collapsed sections to avoid reference issues
  const collapsedSections = {
    recentCollaborations: !isRecentCollabsOpen,
    header: collapsedSectionSettings.header || false,
    about: collapsedSectionSettings.about || false,
    musicSection: collapsedSectionSettings.musicSection || false,
    videoSection: collapsedSectionSettings.videoSection || false
  };

  useEffect(() => {
    // Create a clean copy of filter settings to break circular references
    const updatedFilterSettings = {
      sortBy: sortBy || "newest",
      searchQuery: searchQuery || "",
      selectedType: selectedType || "all",
      selectedGenre: filterSettings.selectedGenre || "all"
    };
    
    // Pass shallow copies to avoid circular references
    setDefaultStates(
      zoomLevel, 
      { ...updatedFilterSettings }, 
      { ...collapsedSections }
    );
  }, [zoomLevel, sortBy, searchQuery, selectedType, isRecentCollabsOpen]);

  // Use separate useEffects to prevent circular dependency issues
  const {
    data: recentCollaborations = [],
    refetch: refetchCollaborations
  } = useQuery({
    queryKey: ["artist-collaborations", id],
    queryFn: async () => {
      if (!id) throw new Error("No artist ID provided");
      const {
        data,
        error
      } = await supabase.from("personas").select("*").or(`artist_profile_id.eq.${id},user_id.eq.${id}`).eq("is_collab", true).order("created_at", {
        ascending: false
      }).limit(10);
      if (error) throw error;
      return data ? data.map((item: any) => transformPersonaData(item)) : [];
    },
    enabled: !!id
  });
  
  // Fetch user's collections
  const {
    data: projectsData = [],
    refetch: refetchProjects
  } = useQuery({
    queryKey: ["user-projects", id],
    queryFn: async () => {
      if (!id) throw new Error("No artist ID provided");
      const {
        data,
        error
      } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  const {
    data: collectionsData = [],
    refetch: refetchCollections
  } = useQuery({
    queryKey: ["user-collections", id],
    queryFn: async () => {
      if (!id) throw new Error("No artist ID provided");
      const {
        data,
        error
      } = await supabase
        .from("media_collections")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  const {
    data: favorites = [],
    refetch: refetchFavorites
  } = useQuery({
    queryKey: ["favorite-personas", id],
    queryFn: async () => {
      if (!id) throw new Error("No artist ID provided");
      
      // We need to handle the case where persona_follows.user_id doesn't exist
      // Instead, we'll query follows using the ID as follower_id
      const {
        data: favoriteRelations,
        error: followError
      } = await supabase
        .from("persona_follows")
        .select("persona_id")
        .eq("follower_id", id)
        .eq("is_favorite", true);
        
      if (followError) throw followError;
      
      if (!favoriteRelations || favoriteRelations.length === 0) return [];
      
      const personaIds = favoriteRelations.map(f => f.persona_id);
      
      const {
        data: personaData,
        error: personaError
      } = await supabase
        .from("personas")
        .select("*")
        .in("id", personaIds);
        
      if (personaError) throw personaError;
      
      return personaData ? personaData.map((item: any) => transformPersonaData(item)) : [];
    },
    enabled: !!id
  });

  useEffect(() => {
    if (favorites) {
      setFavoritePersonas(favorites);
    }
  }, [favorites]);
  
  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  useEffect(() => {
    if (collectionsData) {
      setCollections(collectionsData);
    }
  }, [collectionsData]);

  // Load tabs order from localStorage on component mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('artist-profile-tabs-order');
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        // Reorder tabs based on saved order
        const newTabs = [...tabs];
        const orderedTabs: TabItem[] = [];
        
        // First add tabs in the saved order
        orderIds.forEach(id => {
          const tab = newTabs.find(t => t.id === id);
          if (tab) orderedTabs.push(tab);
        });
        
        // Then add any new tabs that weren't in the saved order
        newTabs.forEach(tab => {
          if (!orderIds.includes(tab.id)) orderedTabs.push(tab);
        });
        
        setTabs(orderedTabs);
      } catch (error) {
        console.error('Error loading saved tab order:', error);
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Save tabs order to localStorage
  const saveTabsOrder = () => {
    localStorage.setItem('artist-profile-tabs-order', JSON.stringify(tabs.map(tab => tab.id)));
    toast({
      title: "Tab order saved",
      description: "Your current tab arrangement will be applied next time",
      variant: "default"
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setSelectedType("all");
  };

  const toggleTabsCollapse = () => {
    setIsTabsCollapsed(!isTabsCollapsed);
  };

  // Apply filters
  const filteredPersonas = personas.filter(persona => {
    if (searchQuery) {
      return persona.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (persona.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    }
    return true;
  }).filter(persona => {
    if (selectedType === "all") return true;
    return persona.type === selectedType;
  });

  // Sort personas
  const sortedPersonas = [...filteredPersonas].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "newest":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "popular":
        return (b.followers_count || 0) - (a.followers_count || 0);
      default:
        return 0;
    }
  });

  return <div className="flex flex-col h-full">
      <div className="mb-4">
        <Collapsible open={!isTabsCollapsed} onOpenChange={open => setIsTabsCollapsed(!open)} className="bg-black/40 backdrop-blur-sm rounded-lg">
          <div className="p-3 flex items-center justify-between cursor-pointer border border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_10px_rgba(14,165,233,0.2)] transition-all duration-300 rounded-lg" onClick={toggleTabsCollapse}>
            <h3 className="font-medium text-sm">Pinned</h3>
            <CollapsibleTrigger asChild>
              <button className="p-1 rounded-full hover:bg-black/20">
                {isTabsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-3 pb-1 pt-2">
                <div className="flex justify-between items-center">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <TabsList className="bg-black/40 h-8">
                      <SortableContext 
                        items={tabs.map(tab => tab.id)}
                        strategy={horizontalListSortingStrategy}
                      >
                        {tabs.map((tab) => (
                          <SortableTab key={tab.id} tab={tab} />
                        ))}
                      </SortableContext>
                    </TabsList>
                  </DndContext>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full h-6 w-6 p-0"
                    onClick={saveTabsOrder}
                    title="Save current tab arrangement"
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="recent" className="px-3 pb-2 pt-1">
                <RecentCollaborations 
                  recentCollaborations={recentCollaborations} 
                  isOpen={true} 
                  onOpenChange={() => {}} 
                  onPersonaSelect={onPersonaSelect} 
                />
              </TabsContent>
              
              <TabsContent value="favorites" className="px-3 pb-2 pt-1">
                <FavoriteCollaborations 
                  favoritePersonas={favoritePersonas} 
                  isOpen={true} 
                  onOpenChange={() => {}} 
                  onPersonaSelect={onPersonaSelect} 
                />
              </TabsContent>

              <TabsContent value="projects" className="px-3 pb-2 pt-1">
                <ProjectTab
                  projects={projects}
                  isOpen={true}
                  onOpenChange={() => {}}
                />
              </TabsContent>
              
              <TabsContent value="collections" className="px-3 pb-2 pt-1">
                <CollectionsTab 
                  collections={collections} 
                  isOpen={true} 
                  onOpenChange={() => {}} 
                  onPersonaSelect={onPersonaSelect} 
                />
              </TabsContent>
            </Tabs>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex-none">
        <PersonaFilterSection 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          sortBy={sortBy} 
          onSortChange={setSortBy} 
          onClearFilters={handleClearFilters} 
          zoomLevel={zoomLevel} 
          onZoomChange={setZoomLevel} 
          selectedType={selectedType} 
          onTypeChange={setSelectedType} 
          collapsedSections={collapsedSections} 
        />

        {showDropContainer && <PersonaDropContainer 
          userId={id} 
          onRefetchCollaborations={() => {
            refetchCollaborations();
            refetchFavorites();
            refetchCollections();
          }} 
        />}
      </div>

      <PersonaGrid 
        personas={sortedPersonas} 
        zoomLevel={zoomLevel} 
        onPersonaSelect={onPersonaSelect} 
      />
    </div>;
};
