import { Card } from "@/components/ui/card";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const RecordLabel = () => {
  return (
    <CollapsibleContent>
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/lovable-uploads/70852851-a2d2-4659-badc-968b9337a106.png" />
          <AvatarFallback>RL</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl text-white">Dreamaker Records</h3>
          <p className="text-gray-400">Electronic Music Division</p>
        </div>
      </div>
    </CollapsibleContent>
  );
};