
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export const Transport = () => {
  return (
    <div className="w-full h-full flex items-center gap-4 px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Play className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <span className="text-sm font-mono">00:00:00</span>
        <span className="text-sm font-mono text-konform-neon-blue">120 BPM</span>
        <span className="text-sm font-mono">4/4</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Volume2 className="h-4 w-4" />
        <Slider
          defaultValue={[100]}
          max={100}
          step={1}
          className="w-32"
        />
      </div>
    </div>
  );
};
