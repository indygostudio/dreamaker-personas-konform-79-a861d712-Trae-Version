import { useState } from "react";
import type { Persona } from "@/components/dreamaker/types";

export const usePersonaDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  return {
    dialogOpen,
    setDialogOpen,
    selectedPersona,
    setSelectedPersona,
  };
};