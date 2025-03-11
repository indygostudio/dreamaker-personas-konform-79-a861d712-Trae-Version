
import { Grid3x3, UserRound } from "lucide-react";
import { TransportControls } from "./TransportControls";
import { KonformBanner } from "./KonformBanner";
import { useHeaderStore } from "./store/headerStore";
import { PresetManager } from "./drumpad/PresetManager";
import { PersonaSelector } from "./drumpad/PersonaSelector";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const DrumPadView = () => {
  const { drumPadHeaderCollapsed, setDrumPadHeaderCollapsed } = useHeaderStore();
  const [currentPattern, setCurrentPattern] = useState<any[]>([]);
  const pads = Array(16).fill(null);

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
      <KonformBanner 
        title="DRUM MACHINE" 
        description="Create rhythms and patterns with AI-powered drum synthesis"
        isCollapsed={drumPadHeaderCollapsed}
        onCollapsedChange={setDrumPadHeaderCollapsed}
      />
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
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {pads.map((_, index) => (
            <button
              key={index}
              className="aspect-square bg-[#1A1A1A] rounded-lg border border-[#353F51] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center group"
            >
              <Grid3x3 className="w-8 h-8 text-[#00D1FF] opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-black/40 backdrop-blur-xl border-t border-konform-neon-blue/20">
        <TransportControls />
      </div>
    </div>
  );
};
