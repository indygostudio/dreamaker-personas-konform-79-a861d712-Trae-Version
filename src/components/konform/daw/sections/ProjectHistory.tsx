import { CollapsibleContent } from "@/components/ui/collapsible";

export const ProjectHistory = () => {
  return (
    <CollapsibleContent>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-konform-neon-blue" />
            <div>
              <p className="text-white text-sm">Version {4-i}.0 Released</p>
              <p className="text-gray-400 text-xs">2 hours ago</p>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleContent>
  );
};