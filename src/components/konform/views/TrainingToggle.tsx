import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrainingModeStore } from "../store/trainingModeStore";
import { useToast } from "@/hooks/use-toast";

export const TrainingToggle = () => {
  const { toast } = useToast();
  const { isTrainingEnabled, setTrainingEnabled } = useTrainingModeStore();

  return (
    <Button
      variant="outline"
      size="sm"
      className={`bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full transition-all duration-300 ${isTrainingEnabled ? 'border-konform-neon-blue training-mode-enabled' : ''}`}
      onClick={() => {
        setTrainingEnabled(!isTrainingEnabled);
        toast({
          title: isTrainingEnabled ? "Training Mode Disabled" : "Training Mode Enabled",
          description: isTrainingEnabled ? "AI training features are now disabled" : "AI training features are now enabled",
        });
      }}
    >
      <Brain className="w-4 h-4 mr-2" />
      Training Mode
    </Button>
  );
};