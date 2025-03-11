import { MessageCircle } from "lucide-react";
import { CollapsibleContent } from "@/components/ui/collapsible";

export const RecentNews = () => {
  return (
    <CollapsibleContent>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 bg-black/20 rounded-lg">
            <h3 className="text-white font-medium">Project Update {i}</h3>
            <p className="text-gray-400 text-sm mt-1">Latest changes and improvements to the project...</p>
            <div className="flex items-center gap-2 mt-2">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-400">3 comments</span>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleContent>
  );
};