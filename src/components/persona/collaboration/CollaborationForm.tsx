
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type { Persona } from "@/types/persona";

interface CollaborationFormProps {
  personas: Persona[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  totalBlendRatio: number;
}

export const CollaborationForm = ({
  personas,
  isSubmitting,
  onSubmit,
  onCancel,
  totalBlendRatio,
}: CollaborationFormProps) => {
  return (
    <DialogFooter className="sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Total: {totalBlendRatio.toFixed(1)}%
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || Math.abs(totalBlendRatio - 100) > 0.1}
        >
          {isSubmitting ? "Creating..." : "Create Collab"}
        </Button>
      </div>
    </DialogFooter>
  );
};
