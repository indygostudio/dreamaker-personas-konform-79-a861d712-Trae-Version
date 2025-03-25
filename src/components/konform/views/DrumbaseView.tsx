
import { useState } from "react";
import { TrainingToggle } from "./TrainingToggle";
import { PluginLoader } from "./PluginLoader";

export const DrumbaseView = () => {
  const [activePad, setActivePad] = useState<number | null>(null);
  const [knobValues, setKnobValues] = useState(Array(8).fill(50));

  const handleKnobChange = (index: number, value: number) => {
    const newValues = [...knobValues];
    newValues[index] = value;
    setKnobValues(newValues);
  };

  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg p-4">
      <PluginLoader 
        title="Drum Engine" 
        queryKey="drum-plugins" 
        filterFn={(plugin) => plugin.isInstrument && plugin.supportsMidi}
      />
      
      <div className="mt-6 bg-black/60 rounded-lg p-4 border border-gray-800/30">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-cyan-500 font-mono">Drum Pads</div>
          <div className="flex gap-2">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full bg-black/80 border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition-all duration-150"
                  style={{
                    transform: `rotate(${(knobValues[i] / 100) * 270 - 135}deg)`,
                    transition: 'transform 0.1s'
                  }}
                  onClick={() => handleKnobChange(i, (knobValues[i] + 10) % 100)}
                />
                <div className="w-1 h-1 rounded-full bg-cyan-500" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-8 gap-2">
          {Array(32).fill(null).map((_, index) => (
            <button
              key={index}
              className={`aspect-square bg-black/40 backdrop-blur-sm border ${activePad === index ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-gray-800'} rounded-lg transition-all duration-150 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]`}
              onClick={() => setActivePad(index)}
            >
              <div className={`w-full h-full flex items-center justify-center ${activePad === index ? 'bg-gradient-to-br from-cyan-500/20 to-transparent' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <TrainingToggle />
      </div>
    </div>
  );
};
