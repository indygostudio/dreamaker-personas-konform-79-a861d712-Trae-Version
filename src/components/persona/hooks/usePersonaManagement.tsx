import { usePersonaDialog } from "./usePersonaDialog";
import { usePersonaRouting } from "./usePersonaRouting";
import { usePersonaFetch } from "./usePersonaFetch";
import { usePersonaDelete } from "./usePersonaDelete";
import { usePersonaSelection } from "./usePersonaSelection";
import type { Persona } from "@/types/persona";

export const usePersonaManagement = () => {
  const {
    dialogOpen,
    setDialogOpen,
    selectedPersona,
    setSelectedPersona
  } = usePersonaDialog();

  usePersonaRouting(setDialogOpen);
  
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
