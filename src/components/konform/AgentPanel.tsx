import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";

interface AgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentPanel = ({ isOpen, onClose }: AgentPanelProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-full w-[300px] left-0 top-0 rounded-none bg-[#131415] border-r border-[#353F51]">
        <DrawerHeader className="flex justify-between items-center border-b border-[#353F51] p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-konform-neon-blue/20">
              <Bot className="h-4 w-4 text-konform-neon-blue" />
            </Avatar>
            <DrawerTitle className="text-white font-syncopate">AI Agent</DrawerTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>
        <div className="p-4">
          <div className="space-y-4">
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h3 className="text-konform-neon-blue font-medium mb-2">Assistant</h3>
              <p className="text-white/80 text-sm">
                I'm your AI music production assistant. I can help you with:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-white/60">
                <li>• Track arrangement</li>
                <li>• Sound design</li>
                <li>• Mixing suggestions</li>
                <li>• Plugin recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};