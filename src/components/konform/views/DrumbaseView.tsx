
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

  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg">
      <div className="flex justify-end p-4 border-b border-konform-neon-blue/20">
        <TrainingToggle />
      </div>
      <div className="p-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePluginActivation(!isPluginActive)}
            className={isPluginActive ? "text-konform-neon-blue" : "text-gray-400"}
          >
            <Power className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-black/60 rounded-lg p-4 min-h-[400px] flex items-center justify-center mt-4">
        {isPluginActive ? (
          <div className="w-full h-full bg-black/40 rounded-lg border border-konform-neon-blue/30">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Plugin Interface
            </div>
          </div>
        ) : (
          <div className="text-gray-400">
            {selectedPlugin ? 
              "Click the power button to activate plugin" :
              "Select a drum plugin from settings"
            }
          </div>
        )}
      </div>
    </div>
  );
};
