
import { useState } from "react";
import { useDAWState } from "@/hooks/use-daw-state";
import { Repeat, SkipBack, Play, Pause, Square, SkipForward } from "lucide-react";

export const TransportControls = () => {
  const { 
    isPlaying, 
    setPlaying 
  } = useDAWState();

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
  };

  const handleStop = () => {
    setPlaying(false);
  };

  return (
    <div className="mt-4 flex items-center justify-center space-x-6 border-t border-konform-neon-blue/20 pt-4">
      <button 
        className="w-10 h-10 rounded-full bg-black/40 text-konform-neon-blue hover:text-konform-neon-orange transition-colors flex items-center justify-center backdrop-blur-xl border border-konform-neon-blue/30 hover:border-konform-neon-orange/50"
      >
        <Repeat className="w-5 h-5" />
      </button>
      
      <button 
        className="w-10 h-10 rounded-full bg-black/40 text-konform-neon-blue hover:text-konform-neon-orange transition-colors flex items-center justify-center backdrop-blur-xl border border-konform-neon-blue/30 hover:border-konform-neon-orange/50"
      >
        <SkipBack className="w-5 h-5" />
      </button>
      
      <button 
        onClick={handlePlayPause}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-konform-neon-blue to-konform-neon-orange text-black hover:from-konform-neon-orange hover:to-konform-neon-blue transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-konform-neon-blue/50"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>
      
      <button 
        onClick={handleStop}
        className="w-10 h-10 rounded-full bg-black/40 text-konform-red hover:text-konform-neon-orange transition-colors flex items-center justify-center backdrop-blur-xl border border-konform-red/30 hover:border-konform-neon-orange/50"
      >
        <Square className="w-5 h-5" />
      </button>
      
      <button 
        className="w-10 h-10 rounded-full bg-black/40 text-konform-neon-blue hover:text-konform-neon-orange transition-colors flex items-center justify-center backdrop-blur-xl border border-konform-neon-blue/30 hover:border-konform-neon-orange/50"
      >
        <SkipForward className="w-5 h-5" />
      </button>
    </div>
  );
};
