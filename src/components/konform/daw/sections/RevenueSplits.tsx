import { Progress } from "@/components/ui/progress";
import { CollapsibleContent } from "@/components/ui/collapsible";

export const RevenueSplits = () => {
  return (
    <CollapsibleContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Producer (You)</span>
            <span className="text-white">40%</span>
          </div>
          <Progress value={40} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Featured Artists</span>
            <span className="text-white">30%</span>
          </div>
          <Progress value={30} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Writers</span>
            <span className="text-white">20%</span>
          </div>
          <Progress value={20} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Label</span>
            <span className="text-white">10%</span>
          </div>
          <Progress value={10} className="h-2" />
        </div>
      </div>
    </CollapsibleContent>
  );
};