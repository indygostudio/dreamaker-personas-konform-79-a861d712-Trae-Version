
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeaderStore } from "./store/headerStore";
import { PresetManager } from "./drumpad/PresetManager";
import { PersonaSelector } from "./drumpad/PersonaSelector";
import { useState } from "react";
import { VideoBackground } from "@/components/persona/VideoBackground";
import { DrumPadContextMenu } from "./drumpad/DrumPadContextMenu";
import { PresetDisplay } from "./drumpad/PresetDisplay";

export const DrumPadView = () => {
  const { drumPadHeaderCollapsed, setDrumPadHeaderCollapsed } = useHeaderStore();
  const [currentPattern, setCurrentPattern] = useState<any[]>([]);
  const [currentPreset, setCurrentPreset] = useState({ name: '', patchNumber: 0 });
  const pads = Array(32).fill(null);
  const [hoveredPad, setHoveredPad] = useState<number | null>(null);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [copiedPad, setCopiedPad] = useState<any>(null);

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
        <PresetDisplay
          presetName={currentPreset.name}
          patchNumber={currentPreset.patchNumber}
          onSelectPreset={setCurrentPreset}
        />
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
        <div className="grid grid-cols-8 gap-8 max-w-[1800px] mx-auto">
          {pads.map((_, index) => (
            <DrumPadContextMenu
              key={index}
              onMidiLearnClick={() => console.log('MIDI Learn clicked for pad', index)}
              onCopyClick={() => {
                console.log('Copy clicked for pad', index);
                setCopiedPad(currentPattern[index]);
              }}
              onPasteClick={() => {
                if (copiedPad !== null) {
                  console.log('Paste clicked for pad', index);
                  const newPattern = [...currentPattern];
                  newPattern[index] = copiedPad;
                  setCurrentPattern(newPattern);
                }
              }}
              onClearClick={() => {
                console.log('Clear clicked for pad', index);
                const newPattern = [...currentPattern];
                newPattern[index] = null;
                setCurrentPattern(newPattern);
              }}
              onAssignClick={() => console.log('Assign clicked for pad', index)}
            >
              <button
                className={`aspect-square bg-black/40 backdrop-blur-sm border border-red-500/30 hover:border-red-500 p-16 rounded-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden ${activePad === index ? 'active' : ''}`}
                onClick={() => setActivePad(index)}
              >
                <div className={`absolute inset-0 bg-gradient-radial from-red-500/5 via-transparent to-transparent transition-opacity duration-200 ${activePad === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ '--tw-gradient-from': activePad === index ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.05)' } as any} />
                <div className={`absolute inset-0 rounded-lg transition-shadow duration-200 ${activePad === index ? 'shadow-[inset_0_0_35px_rgba(239,68,68,0.4)]' : 'shadow-[inset_0_0_15px_rgba(239,68,68,0.2)] group-hover:shadow-[inset_0_0_25px_rgba(239,68,68,0.3)]'}`} />
              </button>
            </DrumPadContextMenu>
          ))}
        </div>
      </div>
    </div>
  );
};
