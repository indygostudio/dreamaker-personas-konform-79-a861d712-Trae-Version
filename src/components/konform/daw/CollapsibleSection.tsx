import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  sectionId: string;
  isCollapsed: boolean;
  onToggle: (sectionId: string) => void;
  children: ReactNode;
}

export const CollapsibleSection = ({
  title,
  sectionId,
  isCollapsed,
  onToggle,
  children
}: CollapsibleSectionProps) => {
  return (
    <Collapsible defaultOpen={false} onOpenChange={() => onToggle(sectionId)}>
      <Card className="p-6 bg-black/40 border-dreamaker-purple/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <CollapsibleTrigger>
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            )}
          </CollapsibleTrigger>
        </div>
        {children}
      </Card>
    </Collapsible>
  );
};