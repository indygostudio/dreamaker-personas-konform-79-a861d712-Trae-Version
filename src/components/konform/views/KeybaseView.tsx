
import { useState, useEffect } from "react";
import { Power, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scanAudioDevices, scanMIDIDevices, type AudioDevice, type MIDIDevice } from "@/lib/audio/deviceManager";
import { scanPlugins, type Plugin, savePluginPreset, loadPluginPresets } from "@/lib/audio/pluginScanner";

export const KeybaseView = () => {
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [midiDevices, setMidiDevices] = useState<MIDIDevice[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>();
  const [selectedMidiDevice, setSelectedMidiDevice] = useState<string>();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<string>();
  const [isPluginActive, setIsPluginActive] = useState(false);
  const [bufferSize, setBufferSize] = useState("256");
  const [sampleRate, setSampleRate] = useState("44100");

  useEffect(() => {
    const loadDevicesAndPlugins = async () => {
      const audioDevs = await scanAudioDevices();
      const midiDevs = await scanMIDIDevices();
      const availablePlugins = await scanPlugins();
      setAudioDevices(audioDevs);
      setMidiDevices(midiDevs);
      setPlugins(availablePlugins);
    };

    loadDevicesAndPlugins();
  }, []);

  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPluginActive(!isPluginActive)}
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
                <DialogTitle className="text-white">Audio & MIDI Settings</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-white">Audio Device</Label>
                  <Select
                    value={selectedAudioDevice}
                    onValueChange={setSelectedAudioDevice}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select audio device" />
                    </SelectTrigger>
                    <SelectContent>
                      {audioDevices.map((device) => (
                        <SelectItem key={device.id} value={device.id || "default"}>
                          {device.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-white">MIDI Device</Label>
                  <Select
                    value={selectedMidiDevice}
                    onValueChange={setSelectedMidiDevice}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select MIDI device" />
                    </SelectTrigger>
                    <SelectContent>
                      {midiDevices.map((device) => (
                        <SelectItem key={device.id} value={device.id || "default"}>
                          {device.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-white">Plugin</Label>
                  <Select
                    value={selectedPlugin}
                    onValueChange={setSelectedPlugin}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select plugin" />
                    </SelectTrigger>
                    <SelectContent>
                      {plugins.map((plugin) => (
                        <SelectItem key={plugin.id} value={plugin.id || "default"}>
                          {plugin.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-white">Buffer Size</Label>
                  <Select value={bufferSize} onValueChange={setBufferSize}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select buffer size" />
                    </SelectTrigger>
                    <SelectContent>
                      {["128", "256", "512", "1024"].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} samples
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-white">Sample Rate</Label>
                  <Select value={sampleRate} onValueChange={setSampleRate}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select sample rate" />
                    </SelectTrigger>
                    <SelectContent>
                      {["44100", "48000", "88200", "96000"].map((rate) => (
                        <SelectItem key={rate} value={rate}>
                          {rate} Hz
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

      <div className="flex-1 grid grid-rows-[1fr_auto_auto] gap-4">
        {/* Library/Preset Management Section */}
        <div className="bg-black/60 rounded-lg p-4 min-h-[200px]">
          <div className="w-full h-full bg-black/40 rounded-lg border border-konform-neon-blue/30 p-4">
            <h3 className="text-white text-lg mb-4">Library</h3>
            {/* Add preset list here */}
          </div>
        </div>

        {/* Parameters Section */}
        <div className="bg-black/60 rounded-lg p-4 h-[200px]">
          <div className="w-full h-full bg-black/40 rounded-lg border border-konform-neon-blue/30 p-4">
            <h3 className="text-white text-lg mb-4">Parameters</h3>
            {/* Add parameter controls here */}
          </div>
        </div>

        {/* MIDI Keyboard Section */}
        <div className="bg-black/60 rounded-lg p-4 h-[150px]">
          <div className="w-full h-full bg-black/40 rounded-lg border border-konform-neon-blue/30 flex items-center justify-center">
            {/* Add MIDI keyboard component here */}
            <span className="text-gray-400">MIDI Keyboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
