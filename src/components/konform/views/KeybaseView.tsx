
import { TrainingToggle } from "./TrainingToggle";

export const KeybaseView = () => {

  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg">
      <div className="flex justify-end p-4 border-b border-konform-neon-blue/20">
        <TrainingToggle />
      </div>
      <div className="p-6">
        {/* Empty panel for future functionality */}
      </div>
    </div>
  );
};
