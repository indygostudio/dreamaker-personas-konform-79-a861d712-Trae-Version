
import { TrainingToggle } from "./TrainingToggle";

export const VidbaseView = () => {
  return (
    <div className="min-h-[600px] bg-black/40 rounded-lg">
      <div className="flex justify-end p-4 border-b border-konform-neon-blue/20">
        <TrainingToggle />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">VIDBASE</h2>
        <p className="text-gray-400">Video syncing and editing interface will be displayed here.</p>
      </div>
    </div>
  );
};
