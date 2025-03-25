import { TrainingToggle } from "./TrainingToggle";
import { PluginLoader } from "./PluginLoader";

export const GuitarbaseView = () => {
  return (
    <div className="min-h-[600px] bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
      <div className="flex flex-col h-full">
        <PluginLoader 
          title="Guitar Engine" 
          queryKey="guitar-plugins" 
          filterFn={(plugin) => plugin.isInstrument && plugin.supportsMidi}
        />
        
        <div className="flex justify-end mt-auto pt-4">
          <TrainingToggle />
        </div>
      </div>
    </div>
  );
};