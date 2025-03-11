import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmissionForm } from "./SubmissionForm";

interface SubmissionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SubmissionDialog = ({
  open,
  onOpenChange,
}: SubmissionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-konform-neon-blue hover:bg-konform-neon-orange text-black">
          Submit to Labels
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dreamaker-gray text-white">
        <DialogHeader>
          <DialogTitle>Submit to Record Labels</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share your work with our partner record labels
          </DialogDescription>
        </DialogHeader>
        <SubmissionForm
          onSuccess={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  );
};