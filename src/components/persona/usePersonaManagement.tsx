import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Persona } from "@/components/dreamaker/types";
import { usePersonaFetch } from "./hooks/usePersonaFetch";
import { usePersonaDelete } from "./hooks/usePersonaDelete";
import { usePersonaSelection } from "./hooks/usePersonaSelection";

export const usePersonaManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const location = useLocation();
  
  // If we're on the create route, automatically open the dialog
  useEffect(() => {
    if (location.pathname === "/personas/create") {
      setDialogOpen(true);
      setSelectedPersona(null);
    }
  }, [location.pathname]);
  
  const { personas, isLoading, hasMore, fetchPersonas } = usePersonaFetch();
  const { handleDeletePersona, handleDeleteSelected } = usePersonaDelete();
  const {
    selectedPersonas,
    selectionMode,
    toggleSelectionMode,
    togglePersonaSelection,
    selectAllPersonas,
  } = usePersonaSelection();

  return {
    personas,
    isLoading,
    hasMore,
    dialogOpen,
    setDialogOpen,
    selectedPersona,
    setSelectedPersona,
    selectedPersonas,
    selectionMode,
    fetchPersonas,
    handleDeletePersona,
    handleDeleteSelected,
    toggleSelectionMode,
    togglePersonaSelection,
    selectAllPersonas,
  };
};