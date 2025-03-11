
import { useState } from "react";
import type { Persona } from "@/types/persona";

export const usePersonaSelection = () => {
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPersonas([]);
  };

  const togglePersonaSelection = (persona: Persona, selected: boolean) => {
    if (selected) {
      setSelectedPersonas([...selectedPersonas, persona]);
    } else {
      setSelectedPersonas(selectedPersonas.filter((p) => p.id !== persona.id));
    }
  };

  const selectAllPersonas = (personas: Persona[]) => {
    if (selectedPersonas.length === personas.length) {
      setSelectedPersonas([]);
    } else {
      setSelectedPersonas([...personas]);
    }
  };

  return {
    selectedPersonas,
    selectionMode,
    toggleSelectionMode,
    togglePersonaSelection,
    selectAllPersonas,
  };
};
