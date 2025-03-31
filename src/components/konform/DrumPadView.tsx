
import { useHeaderStore } from "./store/headerStore";

export const DrumPadView = () => {
  const { drumPadHeaderCollapsed, setDrumPadHeaderCollapsed } = useHeaderStore();

  return (
    <div className="flex-1 overflow-y-auto bg-[#131415] flex flex-col">
      <div className="p-6 space-y-6 flex-1">
        {/* Empty container for future content */}
      </div>
    </div>
  );
};
