
import { useState } from "react";
import { Power, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="min-h-[600px] bg-black/40 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">DRUMBASE</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePluginActivation(!isPluginActive)}
            className={isPluginActive ? "text-konform-neon-blue" : "text-gray-400"}
          >
            <Power className="h-4 w-4" />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-konform-neon-blue/30">
              <DialogHeader>
                <DialogTitle className="text-white">Drum Plugin Settings</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-white">Plugin</Label>
                  <Select
                    value={selectedPlugin}
                    onValueChange={(value) => {
                      setSelectedPlugin(value);
                      setIsPluginActive(false);
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select drum plugin" />
                    </SelectTrigger>
                    <SelectContent>
                      {drumPlugins?.map((plugin) => (
                        <SelectItem key={plugin.id} value={plugin.id}>
                          {plugin.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 bg-black/60 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
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
