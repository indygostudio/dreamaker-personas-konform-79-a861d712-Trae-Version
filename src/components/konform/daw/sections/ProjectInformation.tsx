import { Card } from "@/components/ui/card";
import { CollapsibleContent } from "@/components/ui/collapsible";

export const ProjectInformation = () => {
  return (
    <CollapsibleContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400">Project Name: <span className="text-white">Dreamaker Demo</span></p>
          <p className="text-gray-400">BPM: <span className="text-white">128</span></p>
          <p className="text-gray-400">Key: <span className="text-white">C Minor</span></p>
          <p className="text-gray-400">Created: <span className="text-white">2024-03-15</span></p>
        </div>
        <div>
          <p className="text-gray-400">Genre: <span className="text-white">Electronic</span></p>
          <p className="text-gray-400">Duration: <span className="text-white">3:45</span></p>
          <p className="text-gray-400">Status: <span className="text-green-500">In Progress</span></p>
        </div>
      </div>
    </CollapsibleContent>
  );
};