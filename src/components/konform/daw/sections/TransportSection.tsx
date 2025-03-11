import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Square } from "lucide-react";

export const TransportSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center justify-center gap-4 p-4 border-t border-konform-neon-blue/20">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => console.log("Skip back")}
        className="text-konform-neon-blue hover:text-konform-neon-orange"
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPlaying(!isPlaying)}
        className="text-konform-neon-blue hover:text-konform-neon-orange"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPlaying(false)}
        className="text-konform-red hover:text-konform-neon-orange"
      >
        <Square className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("Skip forward")}
        className="text-konform-neon-blue hover:text-konform-neon-orange"
      >
        <SkipForward className="w-4 h-4" />
      </Button>
    </div>
  );
};