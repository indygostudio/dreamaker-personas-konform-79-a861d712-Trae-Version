
import { useState, useEffect } from "react";
import { scanAudioDevices, scanMIDIDevices, type AudioDevice, type MIDIDevice } from "@/lib/audio/deviceManager";
import { scanPlugins, type Plugin } from "@/lib/audio/pluginScanner";
import { PianoKeyboard } from "./PianoKeyboard";

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

  const handleNoteOn = (note: number) => {
    console.log('Note On:', note);
    // Add MIDI note handling logic here
  };

  const handleNoteOff = (note: number) => {
    console.log('Note Off:', note);
    // Add MIDI note handling logic here
  };

  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex-1 grid grid-rows-[1fr_auto_auto] gap-4">
        <div className="bg-black/60 rounded-lg p-4 min-h-[200px]">
          <div className="w-full h-full bg-black/40 rounded-lg border border-konform-neon-blue/30 p-4" />
        </div>

        <div className="bg-black/60 rounded-lg p-4 h-[200px]">
          <div className="w-full h-full bg-black/40 rounded-lg border border-konform-neon-blue/30 p-4" />
        </div>

        <div className="bg-black/60 rounded-lg p-4 h-[150px]">
          <div className="w-full h-full bg-black/40 rounded-lg border border-konform-neon-blue/30 overflow-hidden">
            <PianoKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
          </div>
        </div>
      </div>
    </div>
  );
};
