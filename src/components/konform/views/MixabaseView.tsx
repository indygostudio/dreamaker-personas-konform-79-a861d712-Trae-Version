import { MixerView } from "../mixer/MixerView";

import { TrainingToggle } from "./TrainingToggle";

export const MixabaseView = () => {
  return (
    <div className="h-full bg-black/40 rounded-lg">
      <div className="flex justify-end p-4 border-b border-konform-neon-blue/20">
        <TrainingToggle />
      </div>
      <div className="h-full bg-black/20 p-2">
        <MixerView />
      </div>
    </div>
  );
};