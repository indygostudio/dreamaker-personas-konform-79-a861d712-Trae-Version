
import { FilterBar } from "@/components/dreamaker/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PersonaDialog } from "@/components/PersonaDialog";

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
}: PersonaFilterSectionProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreatePersona = () => {
    setDialogOpen(true);
  };

  const handlePersonaCreated = () => {
    toast.success("Persona created successfully");
    // Refresh data if needed
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
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
      />

      <PersonaDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        persona={null}
        onSuccess={handlePersonaCreated}
      />
    </div>
  );
};
