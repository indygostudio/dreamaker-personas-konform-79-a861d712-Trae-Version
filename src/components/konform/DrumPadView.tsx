
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeaderStore } from "./store/headerStore";
import { PresetManager } from "./drumpad/PresetManager";
import { PersonaSelector } from "./drumpad/PersonaSelector";
import { useState } from "react";
import { VideoBackground } from "@/components/persona/VideoBackground";

export const DrumPadView = () => {
  const { drumPadHeaderCollapsed, setDrumPadHeaderCollapsed } = useHeaderStore();
  const [currentPattern, setCurrentPattern] = useState<any[]>([]);
  const pads = Array(24).fill(null);
  const [hoveredPad, setHoveredPad] = useState<number | null>(null);

  const handleLoadPreset = (pattern: any[]) => {
    setCurrentPattern(pattern);
    // Additional logic for applying the pattern to the drum pads
  };

  const handlePersonaSelect = (personaId: string) => {
    console.log("Selected persona:", personaId);
    // Additional logic for applying the persona's characteristics
  };

  const [showPersonaSelector, setShowPersonaSelector] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#131415] flex flex-col">
      <div className="p-6 space-y-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <PresetManager
            currentPattern={currentPattern}
            onLoadPreset={handleLoadPreset}
          />
          {showPersonaSelector ? (
            <PersonaSelector 
              onSelect={handlePersonaSelect}
              onClose={() => setShowPersonaSelector(false)}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-konform-neon-blue/10"
              onClick={() => setShowPersonaSelector(true)}
            >
              <UserRound className="h-4 w-4 text-konform-neon-blue" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-8 gap-4 max-w-[1200px] mx-auto">
          {pads.map((_, index) => (
            <button
              key={index}
              className="aspect-square bg-black/40 backdrop-blur-sm border-dreamaker-purple/20 hover:border-dreamaker-purple/90 p-6 rounded-lg transition-all duration-300 flex items-center justify-center group relative overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dreamaker-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
