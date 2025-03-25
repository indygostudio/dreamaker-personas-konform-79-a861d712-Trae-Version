
import { TrainingToggle } from "./TrainingToggle";
import { PluginLoader } from "./PluginLoader";

export const DrumbaseView = () => {
  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg p-4">
      <div className="flex flex-col h-full">
        <PluginLoader 
          title="Drum Engine" 
          queryKey="drum-plugins" 
          filterFn={(plugin) => plugin.isInstrument && plugin.supportsMidi}
        />
        
        <div className="flex justify-end mt-auto pt-4">
          <TrainingToggle />
        </div>
      </div>
    </div>
  );
};
