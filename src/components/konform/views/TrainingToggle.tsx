import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrainingModeStore } from "../store/trainingModeStore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CellularDivision } from "./CellularDivision";

export const TrainingToggle = () => {
  const { toast } = useToast();
  const { isTrainingEnabled, setTrainingEnabled } = useTrainingModeStore();
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      className={`relative bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full transition-all duration-300 ${isTrainingEnabled ? 'bg-red-600 border-red-600 training-mode-enabled' : ''}`}
      onClick={() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
        setTrainingEnabled(!isTrainingEnabled);
        toast({
          title: isTrainingEnabled ? "Training Mode Disabled" : "Training Mode Enabled",
          description: isTrainingEnabled ? "AI training features are now disabled" : "AI training features are now enabled",
        });
      }}
    >
      <Brain className="w-4 h-4 mr-2" />
      Training Mode
      <CellularDivision isAnimating={isAnimating} />
    </Button>
  );
};