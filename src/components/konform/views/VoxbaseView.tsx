
import { TrainingToggle } from "./TrainingToggle";

export const VoxbaseView = () => {
  return (
    <div className="min-h-[600px] bg-black/80 backdrop-blur-xl rounded-lg border border-konform-neon-blue/20 overflow-hidden">
      <div className="flex justify-end p-4 border-b border-konform-neon-blue/20">
        <TrainingToggle />
      </div>
      <div className="grid grid-cols-[1fr_300px] gap-4 h-full">
        <div className="p-6 space-y-6">
          {/* Empty main content */}
        </div>
        <div className="border-l border-konform-neon-blue/20 p-6 space-y-6">
          {/* Empty sidebar */}
        </div>
      </div>
    </div>
  );
};
