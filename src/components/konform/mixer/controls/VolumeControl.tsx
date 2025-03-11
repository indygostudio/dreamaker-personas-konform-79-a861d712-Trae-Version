import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-32 w-4">
        <Slider
          orientation="vertical"
          value={[volume]}
          onValueChange={([value]) => onVolumeChange(value)}
          max={100}
          step={1}
          className="h-full"
        />
      </div>
      <Volume2 className="w-4 h-4 mt-2 text-konform-neon-blue" />
    </div>
  );
};