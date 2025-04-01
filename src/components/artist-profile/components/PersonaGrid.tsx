
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonaCard } from "@/components/dreamaker/PersonaCard";
import type { Persona } from "@/types/persona";
import { memo, useMemo, useState, useEffect } from "react";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { PersonaControls } from "./PersonaControls";
import { motion, AnimatePresence } from "framer-motion";

interface PersonaGridProps {
  personas: Persona[];
  zoomLevel: number;
  onPersonaSelect: (persona: Persona) => void;
}

export const PersonaGrid = ({ personas, zoomLevel, onPersonaSelect }: PersonaGridProps) => {
  const navigate = useNavigate();
  const { addPersona, setShowDropContainer } = useSelectedPersonasStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPersonas, setFilteredPersonas] = useState(personas);
  
  const handleAddToProject = (artist: Persona) => {
    setShowDropContainer(true);
    addPersona({
      id: artist.id,
      name: artist.name,
      avatarUrl: artist.avatar_url,
      type: artist.type
    });
    toast({
      title: "Added to project",
      description: `${artist.name} has been added to your project`,
    });
  };

  const handleAuthRequired = () => {
    navigate('/auth');
  };

  const gridClasses = useMemo(() => {
    if (zoomLevel <= 20) return 'md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
    if (zoomLevel <= 40) return 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    if (zoomLevel <= 60) return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    if (zoomLevel <= 80) return 'md:grid-cols-2 lg:grid-cols-3';
    return 'md:grid-cols-1 lg:grid-cols-2';
  }, [zoomLevel]);

  useEffect(() => {
    let sorted = [...personas];
    
    // Apply search filter
    if (searchQuery) {
      sorted = sorted.filter(persona =>
        persona.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredPersonas(sorted);
  }, [personas, searchQuery, sortBy]);

  // Component for empty state message
  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
      <div>
        <p className="text-xl mb-2">No personas found</p>
        <p className="text-sm opacity-70">Try adjusting your filters or create a new persona</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <PersonaControls
        viewMode={viewMode}
        sortBy={sortBy}
        searchQuery={searchQuery}
        onViewModeChange={setViewMode}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
      />
      <ScrollArea className="h-full min-h-[calc(100vh-300px)] pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={viewMode === "grid" ? `grid grid-cols-1 ${gridClasses} gap-2 pt-2 pb-4` : "flex flex-col space-y-2 pb-4"}
          >
            {filteredPersonas.map((persona) => (
              <motion.div
                key={persona.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PersonaCard
                  artist={persona}
                  onAuthRequired={handleAuthRequired}
                  onAddToProject={handleAddToProject}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};
