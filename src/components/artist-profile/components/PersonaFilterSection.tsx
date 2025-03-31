
import { FilterBar } from "@/components/dreamaker/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PersonaDialog } from "@/components/PersonaDialog";
import { useUIStore } from "@/stores/uiStore";

interface PersonaFilterSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  zoomLevel: number;
  onZoomChange: (value: number) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  collapsedSections: {
    recentCollaborations: boolean;
    header: boolean;
    about: boolean;
    musicSection: boolean;
    videoSection: boolean;
  };
  selectedGenre?: string;
}

export const PersonaFilterSection = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onClearFilters,
  zoomLevel,
  onZoomChange,
  selectedType,
  onTypeChange,
  collapsedSections,
  selectedGenre = "all",
}: PersonaFilterSectionProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { scrollPositions, setDefaultWindowState } = useUIStore();
  const { isHeaderExpanded } = useUIStore();

  const handleCreatePersona = () => {
    setDialogOpen(true);
  };

  const handlePersonaCreated = () => {
    toast.success("Persona created successfully");
    // Refresh data if needed
  };
  
  const saveCurrentStateAsDefault = () => {
    const currentState = {
      zoomLevel: zoomLevel,
      tabZoomLevels: {
        profiles: zoomLevel,
        personas: zoomLevel,
        collaborations: zoomLevel,
        media: zoomLevel
      },
      filterSettings: {
        sortBy,
        searchQuery,
        selectedType,
        selectedGenre
      },
      collapsedSections: {
        header: !isHeaderExpanded,
        recentCollaborations: collapsedSections.recentCollaborations,
        about: collapsedSections.about,
        musicSection: collapsedSections.musicSection,
        videoSection: collapsedSections.videoSection
      },
      scrollPositions: scrollPositions
    };
    
    setDefaultWindowState(currentState);
    
    toast.success("Default state saved", {
      description: "Your current view settings will be applied next time"
    });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex-1">
        <FilterBar
          sortBy={sortBy}
          onSortChange={onSortChange}
          onClearFilters={onClearFilters}
          zoomLevel={zoomLevel}
          onZoomChange={onZoomChange}
          activeTab="personas"
          onTypeChange={onTypeChange}
          selectedType={selectedType}
          collapsedSections={collapsedSections}
          onCreatePersona={handleCreatePersona}
          onSaveDefault={saveCurrentStateAsDefault}
        />
      </div>

      <PersonaDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        persona={null}
        onSuccess={handlePersonaCreated}
      />
    </div>
  );
};
