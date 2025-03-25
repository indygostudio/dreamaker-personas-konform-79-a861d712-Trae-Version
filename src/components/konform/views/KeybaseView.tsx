
import { TrainingToggle } from "./TrainingToggle";
import { PluginLoader } from "./PluginLoader";
import { PianoKeyboard } from "./PianoKeyboard";

export const KeybaseView = () => {
  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg p-4">
      <PluginLoader 
        title="Keyboard Engine" 
        queryKey="keyboard-plugins" 
        filterFn={(plugin) => plugin.isInstrument && plugin.supportsMidi}
      />
      
      <div className="mt-6 h-48 bg-black/60 rounded-lg overflow-hidden border border-gray-800/30">
        <PianoKeyboard 
          onNoteOn={(note) => console.log('Note On:', note)} 
          onNoteOff={(note) => console.log('Note Off:', note)} 
        />
      </div>

      <div className="flex justify-end mt-4">
        <TrainingToggle />
      </div>
    </div>
  );
};
