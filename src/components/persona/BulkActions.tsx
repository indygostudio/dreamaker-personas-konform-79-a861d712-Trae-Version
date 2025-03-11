import { Button } from "@/components/ui/button";
import { HandshakeIcon, Trash2Icon } from "lucide-react";
import type { Persona } from "@/pages/Personas";
import { useState } from "react";
import { CollaborationDialog } from "./CollaborationDialog";

interface BulkActionsProps {
  selectedPersonas: Persona[];
  onDelete: () => void;
}

export const BulkActions = ({ selectedPersonas, onDelete }: BulkActionsProps) => {
  const [collaborationOpen, setCollaborationOpen] = useState(false);

  if (selectedPersonas.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg flex items-center gap-4 z-50 backdrop-blur-md bg-dreamaker-gray/80 border border-dreamaker-purple/20 shadow-lg animate-fade-up">
        <span className="text-sm text-white/80">
          {selectedPersonas.length} selected
        </span>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setCollaborationOpen(true)}
          disabled={selectedPersonas.length < 2}
        >
          <HandshakeIcon className="h-4 w-4 mr-1" />
          Collab
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2Icon className="h-4 w-4 mr-1" />
          Delete Selected
        </Button>
      </div>

      <CollaborationDialog
        open={collaborationOpen}
        onOpenChange={setCollaborationOpen}
        personas={selectedPersonas}
      />
    </>
  );
};