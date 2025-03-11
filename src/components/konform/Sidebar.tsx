import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar/SidebarContent";

interface SidebarProps {
  onSettingsClick: () => void;
  onViewChange?: (view: 'dashboard' | 'mixer' | 'drumpad' | 'keypad' | 'files' | 'effects' | 'daw' | 'lyrics') => void;
  currentView?: 'dashboard' | 'mixer' | 'drumpad' | 'keypad' | 'files' | 'effects' | 'daw' | 'lyrics';
}

export const Sidebar = ({ onSettingsClick, onViewChange, currentView = 'dashboard' }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlwaysVisible, setIsAlwaysVisible] = useState(true); // Changed to true by default

  if (isAlwaysVisible) {
    return (
      <div className="flex">
        <div className="w-[90px] bg-[#131415] border-r border-[#353F51]">
          <SidebarContent
            currentView={currentView}
            onViewChange={onViewChange}
            onSettingsClick={onSettingsClick}
          />
          <button 
            className="absolute bottom-4 left-[30px] w-8 h-8 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center"
            onClick={() => setIsAlwaysVisible(false)}
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button 
            className="w-10 h-10 rounded-full overflow-hidden hover:opacity-90 transition-opacity flex items-center justify-center"
            style={{
              background: `url('/lovable-uploads/7c40c35f-6869-4605-8ca1-37c9dd0d24d5.png') center/cover`
            }}
          >
            {isOpen ? <PanelLeftClose className="w-5 h-5 text-white" /> : <PanelLeft className="w-5 h-5 text-white" />}
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[90px] p-0 bg-[#131415] border-r border-[#353F51]">
          <SidebarContent
            currentView={currentView}
            onViewChange={onViewChange}
            onSettingsClick={onSettingsClick}
          />
          <button 
            className="absolute bottom-4 left-[30px] w-8 h-8 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center"
            onClick={() => {
              setIsAlwaysVisible(true);
              setIsOpen(false);
            }}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
};