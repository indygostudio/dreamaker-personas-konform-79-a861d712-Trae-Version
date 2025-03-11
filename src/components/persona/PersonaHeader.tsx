import { Button } from "@/components/ui/button";
import { PlusIcon, CheckSquareIcon } from "lucide-react";

interface PersonaHeaderProps {
  onCreatePersona: () => void;
  onToggleSelectionMode: () => void;
  onSelectAll?: () => void;
  selectionMode: boolean;
}

export const PersonaHeader = ({
  onCreatePersona,
  onToggleSelectionMode,
  onSelectAll,
  selectionMode,
}: PersonaHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold font-notable">Personas</h1>
      <div className="flex gap-2">
        {selectionMode && (
          <Button variant="outline" onClick={onSelectAll}>
            <CheckSquareIcon className="mr-2 h-4 w-4" />
            Select All
          </Button>
        )}
        <Button variant="outline" onClick={onToggleSelectionMode}>
          {selectionMode ? "Cancel Selection" : "Select Multiple"}
        </Button>
        <Button onClick={onCreatePersona}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Persona
        </Button>
      </div>
    </div>
  );
};