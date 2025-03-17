
import { useState } from "react";
import { Power } from "lucide-react";
import { TrainingToggle } from "./TrainingToggle";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { scanPlugins } from "@/lib/audio/pluginScanner";
import { nativeBridge } from "@/lib/audio/nativeBridge";

export const DrumbaseView = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<string>();
  const [isPluginActive, setIsPluginActive] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [knobValues, setKnobValues] = useState(Array(8).fill(50));

  const { data: drumPlugins } = useQuery({
    queryKey: ['drum-plugins'],
    queryFn: async () => {
      const plugins = await scanPlugins();
      return plugins.filter(p => p.isInstrument && p.supportsMidi);
    }
  });

  const handlePluginActivation = async (active: boolean) => {
    if (!selectedPlugin || !drumPlugins) return;
    
    const plugin = drumPlugins.find(p => p.id === selectedPlugin);
    if (!plugin) return;

    if (active) {
      const loaded = await nativeBridge.loadPlugin(plugin.path, plugin.format);
      setIsPluginActive(loaded);
    } else {
      setIsPluginActive(false);
    }
  };

  const handleKnobChange = (index: number, value: number) => {
    const newValues = [...knobValues];
    newValues[index] = value;
    setKnobValues(newValues);
  };

  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg p-4">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-black/60 rounded-lg p-3 w-48 h-16 flex items-center justify-center">
          <span className="font-mono text-cyan-500">Chip Breeze</span>
        </div>
        <div className="flex-1 flex items-center justify-between gap-4">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full bg-black border border-gray-700 cursor-pointer"
                style={{
                  transform: `rotate(${(knobValues[i] / 100) * 270 - 135}deg)`,
                  transition: 'transform 0.1s'
                }}
                onClick={() => handleKnobChange(i, (knobValues[i] + 10) % 100)}
              />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
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

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePluginActivation(!isPluginActive)}
            className={isPluginActive ? "text-cyan-500" : "text-gray-400"}
          >
            <Power className="h-4 w-4" />
          </Button>
        </div>
        <TrainingToggle />
      </div>
    </div>
  );
};
