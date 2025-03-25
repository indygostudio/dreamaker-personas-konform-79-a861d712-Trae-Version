import { useState, useRef } from "react";
import { Power, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { scanPlugins, Plugin } from "@/lib/audio/pluginScanner";
import { nativeBridge } from "@/lib/audio/nativeBridge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Resizable } from "re-resizable";
import { cn } from "@/lib/utils";

interface PluginLoaderProps {
  title: string;
  queryKey: string;
  filterFn?: (plugin: Plugin) => boolean;
}

export const PluginLoader = ({ title, queryKey, filterFn }: PluginLoaderProps) => {
  const [selectedPlugin, setSelectedPlugin] = useState<string>();
  const [isPluginActive, setIsPluginActive] = useState(false);
  const [isPluginUIOpen, setIsPluginUIOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const resizableRef = useRef(null);

  const { data: plugins, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const allPlugins = await scanPlugins();
      return filterFn ? allPlugins.filter(filterFn) : allPlugins.filter(p => p.isInstrument && p.supportsMidi);
    }
  });

  const handlePluginActivation = async (active: boolean) => {
    if (!selectedPlugin || !plugins) return;
    
    const plugin = plugins.find(p => p.id === selectedPlugin);
    if (!plugin) return;

    if (active) {
      const loaded = await nativeBridge.loadPlugin(plugin.path, plugin.format);
      setIsPluginActive(loaded);
    } else {
      setIsPluginActive(false);
    }
  };

  const handlePluginChange = (value: string) => {
    setSelectedPlugin(value);
    setIsPluginActive(false);
  };

  const handleOpenPluginUI = () => {
    if (isPluginActive) {
      setIsPluginUIOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 w-48 h-16 flex items-center justify-center border border-cyan-500/20">
          <span className="font-mono text-cyan-500">{title}</span>
        </div>
        
        <div className="flex-1">
          <Select
            value={selectedPlugin}
            onValueChange={handlePluginChange}
            disabled={isPluginActive}
          >
            <SelectTrigger className="w-full bg-black/40 border-gray-700">
              <SelectValue placeholder="Select a plugin..." />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-gray-700">
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading plugins...</SelectItem>
              ) : !plugins?.length ? (
                <SelectItem value="none" disabled>No plugins found</SelectItem>
              ) : (
                plugins.map(plugin => (
                  <SelectItem key={plugin.id} value={plugin.id}>
                    {plugin.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-800/30">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePluginActivation(!isPluginActive)}
            className={isPluginActive ? "text-cyan-500" : "text-gray-400"}
          >
            <Power className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenPluginUI}
            disabled={!isPluginActive}
            className={isPluginActive ? "text-cyan-500" : "text-gray-400"}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Plugin UI Dialog */}
      <Dialog open={isPluginUIOpen} onOpenChange={setIsPluginUIOpen}>
        <DialogContent className={cn(
          "bg-[#1A1F2C] border-cyan-500/30 mx-auto draggable-dialog",
          isFullscreen ? "max-w-[95vw] max-h-[90vh]" : "max-w-4xl"
        )}>
          <DialogHeader>
            <DialogTitle className="text-white">
              {plugins?.find(p => p.id === selectedPlugin)?.name || "Plugin Interface"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                className="text-cyan-500 h-7 w-7"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs text-gray-400">{Math.round(zoomLevel * 100)}%</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
                className="text-cyan-500 h-7 w-7"
                disabled={zoomLevel >= 2}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-cyan-500 h-7 w-7 ml-2"
              >
                {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            </div>
          </DialogHeader>
          
          <Resizable
            ref={resizableRef}
            defaultSize={{
              width: "100%",
              height: 400,
            }}
            minHeight={200}
            maxHeight={isFullscreen ? "80vh" : 800}
            enable={{
              top: false,
              right: false,
              bottom: true,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            className="bg-black/40 rounded-lg border border-gray-800/50 overflow-hidden"
          >
            <div 
              className="flex items-center justify-center h-full w-full overflow-auto"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
            >
              <p className="text-cyan-500 text-center">
                Plugin UI would render here in a native implementation.
                <br />
                <span className="text-gray-400 text-sm">
                  (In a real implementation, this would be a native window or WebView showing the actual VST/AU interface)
                </span>
              </p>
            </div>
          </Resizable>
          
          <div className="flex justify-center mt-2">
            <div className="w-12 h-1 bg-gray-700 rounded-full cursor-ns-resize" title="Drag to resize" />
          </div>
          
          <DialogClose className="absolute right-4 top-4" />
        </DialogContent>
      </Dialog>
    </div>
  );
};