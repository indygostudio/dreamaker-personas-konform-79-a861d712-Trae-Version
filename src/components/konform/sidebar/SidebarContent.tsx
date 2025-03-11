import { Music2, FileAudio, Sliders, Settings, Grid3x3, Piano, Orbit, Dice1, CircleDot, LayoutDashboard, PenTool, Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AgentPanel } from "../AgentPanel";

interface SidebarContentProps {
  currentView?: 'dashboard' | 'mixer' | 'drumpad' | 'keypad' | 'files' | 'effects' | 'daw' | 'lyrics';
  onViewChange?: (view: 'dashboard' | 'mixer' | 'drumpad' | 'keypad' | 'files' | 'effects' | 'daw' | 'lyrics') => void;
  onSettingsClick: () => void;
}

export const SidebarContent = ({ currentView = 'dashboard', onViewChange, onSettingsClick }: SidebarContentProps) => {
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);

  useEffect(() => {
    // Set dashboard as default view when component mounts
    if (onViewChange && !currentView) {
      onViewChange('dashboard');
    }
  }, []);

  return (
    <div className="flex flex-col items-center py-4 space-y-6">
      <div className="flex flex-col space-y-6 items-center">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-[#00D1FF] opacity-60">Project</span>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => onViewChange?.('dashboard')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'dashboard' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onViewChange?.('daw')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'daw' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <Music2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onViewChange?.('lyrics')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'lyrics' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <PenTool className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onViewChange?.('files')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'files' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <FileAudio className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Separator className="w-8 bg-[#353F51]" />

        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-[#00D1FF] opacity-60">Tools</span>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => onViewChange?.('mixer')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'mixer' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <Sliders className="w-5 h-5" />
            </button>
            <button 
              onClick={onSettingsClick}
              className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAgentPanelOpen(true)}
              className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center"
            >
              <Bot className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Separator className="w-8 bg-[#353F51]" />

        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-[#00D1FF] opacity-60">Views</span>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => onViewChange?.('keypad')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'keypad' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <Piano className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onViewChange?.('drumpad')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'drumpad' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Separator className="w-8 bg-[#353F51]" />

        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-[#00D1FF] opacity-60">Effects</span>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => onViewChange?.('effects')}
              className={cn(
                "w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center",
                currentView === 'effects' && "bg-[#245A5A] text-[#1A1A1A]"
              )}
            >
              <Orbit className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center">
              <Dice1 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#00D1FF] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center">
              <CircleDot className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AgentPanel 
        isOpen={isAgentPanelOpen}
        onClose={() => setIsAgentPanelOpen(false)}
      />
    </div>
  );
};