import { useState } from "react";
import { TrainingToggle } from "./TrainingToggle";
import { PluginLoader } from "./PluginLoader";

export const SupabaseView = () => {
  const [knobValues, setKnobValues] = useState(Array(8).fill(50));

  const handleKnobChange = (index: number, value: number) => {
    const newValues = [...knobValues];
    newValues[index] = value;
    setKnobValues(newValues);
  };

  return (
    <div className="min-h-[600px] bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
      <PluginLoader 
        title="Bass Engine" 
        queryKey="bass-plugins" 
        filterFn={(plugin) => plugin.isInstrument && plugin.supportsMidi}
      />
      
      <div className="flex items-start gap-4 my-6">
        <div className="flex-1 flex items-center justify-between gap-4 bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/30">
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

      <div className="flex-1 bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/30 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
            <h3 className="text-cyan-500 font-mono mb-2">Bass Parameters</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Cutoff</span>
                <span>{knobValues[0]}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Resonance</span>
                <span>{knobValues[1]}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Attack</span>
                <span>{knobValues[2]}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Release</span>
                <span>{knobValues[3]}%</span>
              </div>
            </div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
            <h3 className="text-cyan-500 font-mono mb-2">Effects</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Drive</span>
                <span>{knobValues[4]}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Mix</span>
                <span>{knobValues[5]}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Depth</span>
                <span>{knobValues[6]}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Rate</span>
                <span>{knobValues[7]}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-800/30">
        <TrainingToggle />
      </div>
    </div>
  );
};